# Hibiscus Health - Ecommerce Platform

A Next.js 15 ecommerce web application for selling hibiscus supplements, featuring subscription-based payments via Stripe and authentication using Google OAuth.

## Features

- **Authentication**: User login and registration using Google OAuth
- **Product Catalog**: Browse and search for hibiscus supplements
- **Shopping Cart**: Add products to cart and checkout
- **Subscription Management**: Subscribe to regular deliveries of products
- **Payment Processing**: Secure payments with Stripe
- **User Dashboard**: View orders, subscriptions, and account settings
- **Admin Dashboard**: Manage products, orders, customers, and view analytics

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Lucide React icons
- **Authentication**: Auth.js v5 (NextAuth) with Google OAuth
- **Database**: PostgreSQL with Prisma ORM
- **Payments**: Stripe
- **Deployment**: AWS CDK with Amplify, Lambda, and DynamoDB

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Stripe account
- Google OAuth credentials
- AWS account with CDK

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Database
DATABASE_URL="your-database-url"
DIRECT_URL="your-direct-database-url"

# Auth
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (Required)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Stripe
STRIPE_SECRET_KEY="your-stripe-secret-key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create an OAuth 2.0 Client ID
5. Add your domain to the authorized origins
6. Add `http://localhost:3000/api/auth/callback/google` to the authorized redirect URIs
7. Copy the Client ID and Client Secret to your `.env` file

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/hibiscus-health.git
   cd hibiscus-health
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   ```bash
   npx prisma migrate reset --force
   ```

4. Start the development server:
   ```
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## AWS Deployment

### Prerequisites

- AWS CLI configured
- AWS CDK installed
- Python 3.9+

### Initial Setup

```bash
# Create project structure
mkdir lambda-functions infrastructure
cd lambda-functions && mkdir products orders users subscriptions shared && cd ..
cd infrastructure

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip3 install aws-cdk-lib constructs aws-cdk.aws-amplify-alpha
```

### AWS Configuration

```bash
# Configure AWS SSO
aws configure sso --profile your-profile-name
```

### Bootstrap CDK (First time only)

```bash
cdk bootstrap aws://YOUR-ACCOUNT-ID/YOUR-REGION --profile your-profile-name
```

### Deploy Infrastructure

```bash
# Synthesize CDK template
cdk synth --profile your-profile-name > amplify-app-stack-template.yaml

# Deploy with parameters
cdk deploy --profile your-profile-name \
  --parameters GitHubAccessToken="your-github-token" \
  --parameters GoogleClientIdParam="your-google-client-id" \
  --parameters GoogleClientSecretParam="your-google-client-secret" \
  --parameters DatabaseURLParam="your-database-url" \
  --parameters StripeSecretKeyParam="your-stripe-secret-key" \
  --parameters StripePublishableKeyParam="your-stripe-publishable-key" \
  --parameters StripeWebhookSecretParam="your-stripe-webhook-secret"
```

### Verify Deployment

```bash
# Check stack status
aws cloudformation describe-stacks \
  --stack-name HibiscusHealthStack-dev \
  --profile your-profile-name

# Test API endpoints
curl "https://YOUR_API_GATEWAY_URL/prod/products"
```

## Project Structure

```
hibiscus-health/
├── app/                    # Next.js app directory
├── components/             # React components
├── infrastructure/         # AWS CDK infrastructure
│   ├── app.py            # CDK app entry point
│   ├── amplify_app_stack.py # Main stack definition
│   └── requirements.txt   # Python dependencies
├── lambda-functions/      # AWS Lambda functions
│   ├── products/         # Product-related functions
│   ├── orders/           # Order-related functions
│   └── shared/           # Shared utilities
├── prisma/               # Database schema and migrations
└── public/               # Static assets
```

## API Endpoints

- `GET /products` - Get all products
- `POST /products` - Create a new product
- `GET /orders` - Get all orders
- `POST /orders` - Create a new order

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.