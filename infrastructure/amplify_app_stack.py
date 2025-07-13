from aws_cdk import (
    aws_logs as logs,
    aws_secretsmanager as secretsmanager,
    aws_dynamodb as dynamodb,
    aws_lambda as lambda_,
    aws_apigateway as apigateway,
    aws_iam as iam,
    SecretValue,
    CfnParameter,
    CfnOutput,
    Stack,
    Fn,
    Duration,
    RemovalPolicy,
)
from aws_cdk.aws_amplify_alpha import (
    App,
    Domain,
    Platform,
    GitHubSourceCodeProvider,
    BasicAuth,
)
from aws_cdk.aws_codebuild import BuildSpec
from constructs import Construct
import secrets


class AmplifyAppStack(Stack):
    def __init__(self, scope: Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        environment = self.node.try_get_context("environment") or "dev"
        nextauth_secret = secrets.token_hex(128)

        # Required parameters
        github_token_param = CfnParameter(
            self,
            "GitHubAccessToken",
            type="String",
            description="The GitHub Access Token",
            no_echo=True,
        )

        google_client_id_param = CfnParameter(
            self,
            "GoogleClientIdParam",
            type="String",
            description="Google Client ID",
            no_echo=True,
        )

        google_client_secret_param = CfnParameter(
            self,
            "GoogleClientSecretParam",
            type="String",
            description="Google Client Secret",
            no_echo=True,
        )

        database_url_param = CfnParameter(
            self,
            "DatabaseURLParam",
            type="String",
            description="Database URL",
            no_echo=True,
        )

        stripe_secret_key_param = CfnParameter(
            self,
            "StripeSecretKeyParam",
            type="String",
            description="Stripe Secret Key",
            no_echo=True,
        )

        stripe_publishable_key_param = CfnParameter(
            self,
            "StripePublishableKeyParam",
            type="String",
            description="Stripe Publishable Key",
            no_echo=True,
        )

        stripe_webhook_secret_param = CfnParameter(
            self,
            "StripeWebhookSecretParam",
            type="String",
            description="Stripe Webhook Secret",
            no_echo=True,
        )

        # Create DynamoDB Tables
        users_table = dynamodb.Table(
            self,
            "UsersTable",
            table_name=f"hibiscus-users-{environment}",
            partition_key=dynamodb.Attribute(name="id", type=dynamodb.AttributeType.STRING),
            billing_mode=dynamodb.BillingMode.PAY_PER_REQUEST,
            removal_policy=RemovalPolicy.DESTROY,
        )

        # Add GSI for email lookup
        users_table.add_global_secondary_index(
            index_name="email-index",
            partition_key=dynamodb.Attribute(name="email", type=dynamodb.AttributeType.STRING),
            projection_type=dynamodb.ProjectionType.ALL,
        )

        # Add GSI for role lookup
        users_table.add_global_secondary_index(
            index_name="role-index",
            partition_key=dynamodb.Attribute(name="role", type=dynamodb.AttributeType.STRING),
            projection_type=dynamodb.ProjectionType.ALL,
        )

        products_table = dynamodb.Table(
            self,
            "ProductsTable",
            table_name=f"hibiscus-products-{environment}",
            partition_key=dynamodb.Attribute(name="id", type=dynamodb.AttributeType.STRING),
            billing_mode=dynamodb.BillingMode.PAY_PER_REQUEST,
            removal_policy=RemovalPolicy.DESTROY,
        )

        # Add GSI for slug lookup
        products_table.add_global_secondary_index(
            index_name="slug-index",
            partition_key=dynamodb.Attribute(name="slug", type=dynamodb.AttributeType.STRING),
            projection_type=dynamodb.ProjectionType.ALL,
        )

        # Add GSI for featured products
        products_table.add_global_secondary_index(
            index_name="featured-index",
            partition_key=dynamodb.Attribute(name="isFeatured", type=dynamodb.AttributeType.STRING),
            projection_type=dynamodb.ProjectionType.ALL,
        )

        orders_table = dynamodb.Table(
            self,
            "OrdersTable",
            table_name=f"hibiscus-orders-{environment}",
            partition_key=dynamodb.Attribute(name="id", type=dynamodb.AttributeType.STRING),
            billing_mode=dynamodb.BillingMode.PAY_PER_REQUEST,
            removal_policy=RemovalPolicy.DESTROY,
        )

        # Add GSI for user orders
        orders_table.add_global_secondary_index(
            index_name="userId-index",
            partition_key=dynamodb.Attribute(name="userId", type=dynamodb.AttributeType.STRING),
            sort_key=dynamodb.Attribute(name="createdAt", type=dynamodb.AttributeType.STRING),
            projection_type=dynamodb.ProjectionType.ALL,
        )

        order_items_table = dynamodb.Table(
            self,
            "OrderItemsTable",
            table_name=f"hibiscus-order-items-{environment}",
            partition_key=dynamodb.Attribute(name="id", type=dynamodb.AttributeType.STRING),
            billing_mode=dynamodb.BillingMode.PAY_PER_REQUEST,
            removal_policy=RemovalPolicy.DESTROY,
        )

        # Add GSI for order items
        order_items_table.add_global_secondary_index(
            index_name="orderId-index",
            partition_key=dynamodb.Attribute(name="orderId", type=dynamodb.AttributeType.STRING),
            projection_type=dynamodb.ProjectionType.ALL,
        )

        subscription_plans_table = dynamodb.Table(
            self,
            "SubscriptionPlansTable",
            table_name=f"hibiscus-subscription-plans-{environment}",
            partition_key=dynamodb.Attribute(name="id", type=dynamodb.AttributeType.STRING),
            billing_mode=dynamodb.BillingMode.PAY_PER_REQUEST,
            removal_policy=RemovalPolicy.DESTROY,
        )

        user_subscriptions_table = dynamodb.Table(
            self,
            "UserSubscriptionsTable",
            table_name=f"hibiscus-user-subscriptions-{environment}",
            partition_key=dynamodb.Attribute(name="id", type=dynamodb.AttributeType.STRING),
            billing_mode=dynamodb.BillingMode.PAY_PER_REQUEST,
            removal_policy=RemovalPolicy.DESTROY,
        )

        # Create Lambda functions
        common_lambda_props = {
            "runtime": lambda_.Runtime.PYTHON_3_9,
            "timeout": Duration.seconds(30),
            "memory_size": 256,
            "environment": {
                "ENVIRONMENT": environment,
                "DATABASE_URL": database_url_param.value_as_string,
            },
        }

        # Products Lambda functions
        get_products_function = lambda_.Function(
            self,
            "GetProductsFunction",
            code=lambda_.Code.from_asset("../lambda-functions/products"),
            handler="get_products.lambda_handler",
            **common_lambda_props,
        )

        create_product_function = lambda_.Function(
            self,
            "CreateProductFunction",
            code=lambda_.Code.from_asset("../lambda-functions/products"),
            handler="create_product.lambda_handler",
            **common_lambda_props,
        )

        # Subscriptions Lambda functions
        get_subscriptions_function = lambda_.Function(
            self,
            "GetSubscriptionsFunction",
            code=lambda_.Code.from_asset("../lambda-functions/subscriptions"),
            handler="get_subscriptions.lambda_handler",
            **common_lambda_props,
        )

        # Orders Lambda functions
        create_order_function = lambda_.Function(
            self,
            "CreateOrderFunction",
            code=lambda_.Code.from_asset("../lambda-functions/orders"),
            handler="create_order.lambda_handler",
            **common_lambda_props,
        )

        get_orders_function = lambda_.Function(
            self,
            "GetOrdersFunction",
            code=lambda_.Code.from_asset("../lambda-functions/orders"),
            handler="get_orders.lambda_handler",
            **common_lambda_props,
        )

        # Grant DynamoDB permissions to Lambda functions
        tables = [
            users_table,
            products_table,
            orders_table,
            order_items_table,
            subscription_plans_table,
            user_subscriptions_table,
        ]

        lambda_functions = [
            get_products_function,
            create_product_function,
            create_order_function,
            get_orders_function,
            get_subscriptions_function,
        ]

        for table in tables:
            for lambda_func in lambda_functions:
                table.grant_read_write_data(lambda_func)

        # Create API Gateway
        api = apigateway.RestApi(
            self,
            "HibiscusHealthAPI",
            rest_api_name=f"Hibiscus Health API - {environment}",
            description="API for Hibiscus Health e-commerce platform",
            default_cors_preflight_options=apigateway.CorsOptions(
                allow_origins=apigateway.Cors.ALL_ORIGINS,
                allow_methods=apigateway.Cors.ALL_METHODS,
                allow_headers=["Content-Type", "Authorization"],
            ),
        )

        # Create API resources
        products = api.root.add_resource("products")
        orders = api.root.add_resource("orders")
        users = api.root.add_resource("users")
        subscriptions = api.root.add_resource("subscriptions")

        # Add API Gateway integrations
        products.add_method(
            "GET",
            apigateway.LambdaIntegration(get_products_function),
            authorization_type=apigateway.AuthorizationType.NONE,
        )
        products.add_method("POST", apigateway.LambdaIntegration(create_product_function))

        orders.add_method("GET", apigateway.LambdaIntegration(get_orders_function))
        orders.add_method("POST", apigateway.LambdaIntegration(create_order_function))

        subscriptions.add_method(
            "GET",
            apigateway.LambdaIntegration(get_subscriptions_function),
            authorization_type=apigateway.AuthorizationType.NONE,
        )

        # Create Amplify app
        amplify_app = App(
            self,
            "HibiscusHealthFrontend",
            app_name="hibiscus-health-frontend",
            source_code_provider=GitHubSourceCodeProvider(
                oauth_token=SecretValue.unsafe_plain_text(github_token_param.value_as_string),
                owner="elijah-oyaxity",  # Update this to your GitHub username
                repository="hibiscus-health",   # Update this to your repository name
            ),
            build_spec=BuildSpec.from_object_to_yaml(
                {
                    "version": 1,
                    "frontend": {
                        "phases": {
                            "preBuild": {"commands": ["npm install"]},
                            "build": {
                                "commands": [
                                    "export NEXTAUTH_SECRET=\"$NEXTAUTH_SECRET\" && echo NEXTAUTH_SECRET=\"$NEXTAUTH_SECRET\" >> .env",
                                    "export NEXTAUTH_URL=\"$NEXTAUTH_URL\" && echo NEXTAUTH_URL=\"$NEXTAUTH_URL\" >> .env",
                                    "export GOOGLE_CLIENT_ID=\"$GOOGLE_CLIENT_ID\" && echo GOOGLE_CLIENT_ID=\"$GOOGLE_CLIENT_ID\" >> .env",
                                    "export GOOGLE_CLIENT_SECRET=\"$GOOGLE_CLIENT_SECRET\" && echo GOOGLE_CLIENT_SECRET=\"$GOOGLE_CLIENT_SECRET\" >> .env",
                                    "export STRIPE_SECRET_KEY=\"$STRIPE_SECRET_KEY\" && echo STRIPE_SECRET_KEY=\"$STRIPE_SECRET_KEY\" >> .env",
                                    "export NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=\"$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY\" && echo NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=\"$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY\" >> .env",
                                    "export STRIPE_WEBHOOK_SECRET=\"$STRIPE_WEBHOOK_SECRET\" && echo STRIPE_WEBHOOK_SECRET=\"$STRIPE_WEBHOOK_SECRET\" >> .env",
                                    "export API_GATEWAY_URL=\"$API_GATEWAY_URL\" && echo API_GATEWAY_URL=\"$API_GATEWAY_URL\" >> .env",
                                    "export DATABASE_URL=\"$DATABASE_URL\" && echo DATABASE_URL=\"$DATABASE_URL\" >> .env",
                                    "npm run build",
                                ]
                            },
                        },
                        "artifacts": {
                            "baseDirectory": ".next",
                            "files": ["**/*"],
                        },
                        "cache": {
                            "paths": [
                                ".next/cache/**/*",
                                "node_modules/**/*",
                            ]
                        },
                    }
                }
            ),
            environment_variables={
                "_CUSTOM_IMAGE": "amplify:al2023",
                "_LIVE_UPDATES": "[{\"pkg\":\"next-version\",\"type\":\"internal\",\"version\":\"15.2.4\"},{\"pkg\":\"node\",\"type\":\"nvm\",\"version\":\"18.0.0\"}]",
                "GOOGLE_CLIENT_ID": google_client_id_param.value_as_string,
                "GOOGLE_CLIENT_SECRET": google_client_secret_param.value_as_string,
                "NEXTAUTH_SECRET": nextauth_secret,
                "NEXTAUTH_URL": f"https://{environment}.your-domain.com",  # Update this
                "STRIPE_SECRET_KEY": stripe_secret_key_param.value_as_string,
                "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY": stripe_publishable_key_param.value_as_string,
                "STRIPE_WEBHOOK_SECRET": stripe_webhook_secret_param.value_as_string,
                "API_GATEWAY_URL": api.url,
                "DATABASE_URL": database_url_param.value_as_string,
            },
            platform=Platform.WEB_COMPUTE,
            basic_auth=BasicAuth.from_generated_password(f"{environment}@hibiscus-health.com"),
        )

        # Add branches based on environment
        if environment == "prod":
            main_branch = amplify_app.add_branch("main", auto_build=True)
        elif environment == "uat":
            uat_branch = amplify_app.add_branch("uat", auto_build=True)
        else:
            dev_branch = amplify_app.add_branch("dev", auto_build=True)

        # Create log group
        log_group = logs.LogGroup(
            self,
            "AmplifyLogGroup",
            log_group_name=f"/aws/amplify/{amplify_app.app_id}",
            retention=logs.RetentionDays.TWO_WEEKS,
        )

        log_group.grant_write(amplify_app)

        # Outputs
        self.amplify_default_domain = CfnOutput(
            self,
            "AmplifyDefaultDomain",
            value=amplify_app.default_domain,
            description="Amplify default domain",
        )

        self.api_gateway_url = CfnOutput(
            self,
            "ApiGatewayUrl",
            value=api.url,
            description="API Gateway URL for Hibiscus Health",
        )

        self.users_table_name = CfnOutput(
            self,
            "UsersTableName",
            value=users_table.table_name,
            description="Users DynamoDB table name",
        )

        self.products_table_name = CfnOutput(
            self,
            "ProductsTableName",
            value=products_table.table_name,
            description="Products DynamoDB table name",
        )

        self.orders_table_name = CfnOutput(
            self,
            "OrdersTableName",
            value=orders_table.table_name,
            description="Orders DynamoDB table name",
        )