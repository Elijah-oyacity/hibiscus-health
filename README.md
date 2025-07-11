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
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Stripe account
- Google OAuth credentials

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Database
DATABASE_URL="postgresql://postgres:mN#BNxkwmyCfG6D@db.noxaiikfplwznbmibfxv.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres.noxaiikfplwznbmibfxv:mN#BNxkwmyCfG6D@aws-0-eu-west-2.pooler.supabase.com:5432/postgres"

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



   i have new superbase
which do you need, you can update the env

postgresql://postgres:mN#BNxkwmyCfG6D@db.noxaiikfplwznbmibfxv.supabase.co:5432/postgres

postgresql://postgres.noxaiikfplwznbmibfxv:mN#BNxkwmyCfG6D@aws-0-eu-west-2.pooler.supabase.com:6543/postgres

postgresql://postgres.noxaiikfplwznbmibfxv:mN#BNxkwmyCfG6D@aws-0-eu-west-2.pooler.supabase.com:5432/postgres

The error `Can't reach database server at db.noxaiikfplwznbmibfxv.supabase.co:5432` means your Supabase database is not reachable from your current environment. Here are the most common reasons and how to fix them:

---

### 1. **Supabase Project is Paused or Sleeping**
- Go to your [Supabase dashboard](https://app.supabase.com/).
- Make sure your project is **running** (not paused or sleeping). If it is, click "Resume project".

---

### 2. **Database Password or Connection String**
- Double-check your password and connection string in `.env`.
- You already escaped the `#` as `%23`, which is correct.

---

### 3. **Network/Firewall Issues**
- Some networks (corporate, school, VPN) block outgoing connections to non-standard ports like 5432.
- Try connecting from a different network or your phone's hotspot.

---

### 4. **Database is Still Provisioning**
- If you just created the Supabase project, it may take a few minutes for the database to be ready.

---

### 5. **Test Connection with psql**
If you have `psql` installed, try:
```sh
psql "postgresql://postgres:mN%23BNxkwmyCfG6D@db.noxaiikfplwznbmibfxv.supabase.co:5432/postgres"
```
If you get a connection error, the issue is with Supabase or your network.

---

## Next Steps

1. **Check your Supabase dashboard** for project status and database credentials.
2. **Try connecting with psql** (if available) to confirm it's not a Prisma-specific issue.
3. **Try from a different network** if possible.

If you confirm the project is running and the credentials are correct, but you still can't connect, let me know what you see in the Supabase dashboard (any warnings, errors, or status messages). I can help you troubleshoot further!

You are now using the Supabase pooler connection, which is the correct approach for Prisma on Supabase (since direct connections are often blocked or unavailable). Here’s what you should do next:

---

### 1. **Use `prisma db push` (not `migrate dev`)**
- The pooler does not support migrations with prepared statements, so you should use:
  ```sh
  npx prisma db push
  ```
- This will sync your schema to the database without using migrations.

---

### 2. **If you need seed data**
- You can add a `prisma/seed.ts` script and run:
  ```sh
  npx prisma db seed
  ```

---

### 3. **Start your app**
- Once `db push` completes, you can start your app as normal:
  ```sh
  npm run dev
  ```

---

### 4. **If you ever need to reset the schema**
- You can drop all tables from the Supabase SQL editor, then run `npx prisma db push` again.

---

**Summary:**  
- Use the pooler connection string for Prisma.
- Use `prisma db push` to sync your schema.
- Avoid `prisma migrate dev` or `migrate deploy` with the pooler.

If you see any errors or need to seed data, let me know!

## 1. Initial Setup Commands

```bash
# Create project structure
mkdir lambda-functions
cd lambda-functions
mkdir products orders users subscriptions shared
cd ..

# Create infrastructure directory
mkdir infrastructure
cd infrastructure

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip3 install -r requirements.txt
```

## 2. AWS Configuration

```bash
# Configure AWS SSO
aws configure sso --profile AdministratorAccess-676373376343

# Or if you need to configure SSO
aws configure sso
```

## 3. Bootstrap CDK (First time only)

```bash
cdk bootstrap aws://676373376343/eu-west-1 --profile AdministratorAccess-676373376343
```

## 4. Create Lambda Functions

```bash
# Create Lambda function files (use the code I provided earlier)
# Then install dependencies for Lambda
cd lambda-functions
pip install -r requirements.txt -t shared/
pip install -r requirements.txt -t products/
pip install -r requirements.txt -t orders/
cd ..
```

## 5. Synthesize and Build

```bash
# Synthesize CDK template
cdk synth --profile AdministratorAccess-676373376343 > amplify-app-stack-template.yaml

# Build SAM template (if using SAM)
sam build --template-file amplify-app-stack-template.yaml --profile AdministratorAccess-676373376343
```

## 6. Deploy the Stack

```bash
# Deploy with all parameters
cdk deploy --profile AdministratorAccess-676373376343 \
  --parameters GitHubAccessToken="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" \
  --parameters GoogleClientIdParam="1070066955715-230kpuc3gcumril53mpae1fkkrqjoptm.apps.googleusercontent.com" \
  --parameters GoogleClientSecretParam="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" \
  --parameters DatabaseURLParam="postgresql://postgres.lejerkpsmvmqyotdbjsr:WGDjhD9XUvqwXdNb@aws-0-eu-central-1.pooler.supabase.com:5432/postgres" \
  --parameters StripeSecretKeyParam="sk_test_51RESrhQ5AgnjVXhKWjQIAcCZK1Npx6T1rHeGv8uJxtw2E4PF8G2s9wTMIwHP52PRs23zeXBbn5krca5bExyYR2T600Ic9CYrRX" \
  --parameters StripePublishableKeyParam="pk_test_51RESrhQ5AgnjVXhKNvBJZkPODhMM4CtkKTeSS8zIZeUuMSgjBR8ajmfNPxCLTsEBO9aAEJDbfTBCvDpbzoc1vqU000p2zPjLlX" \
  --parameters StripeWebhookSecretParam="whsec_..."
```

## 7. Build Amplify App

```bash
# Build the Amplify app
aws amplify build
```

## 8. Verify Deployment

```bash
# Check stack status
aws cloudformation describe-stacks \
  --stack-name HibiscusHealthStack-dev \
  --profile AdministratorAccess-676373376343

# Get API Gateway URL
aws cloudformation describe-stacks \
  --stack-name HibiscusHealthStack-dev \
  --profile AdministratorAccess-676373376343 \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiGatewayUrl`].OutputValue' \
  --output text
```

## 9. Test the API

```bash
# Test the API Gateway endpoint
curl "https://YOUR_API_GATEWAY_URL/prod/products"
```

## 10. Update Your Next.js App

```bash
# Update your Next.js app to use the new API
# Add the API_GATEWAY_URL to your environment variables
```

## Complete Command Sequence

Here's the complete sequence you can run:

```bash
# 1. Setup
mkdir lambda-functions infrastructure
cd lambda-functions && mkdir products orders users subscriptions shared && cd ..
cd infrastructure

# 2. Virtual environment
python3 -m venv venv
source venv/bin/activate

# 3. Install dependencies
pip3 install aws-cdk-lib constructs aws-cdk.aws-amplify-alpha

# 4. AWS Configuration
aws configure sso --profile AdministratorAccess-676373376343

# 5. Bootstrap (first time only)
cdk bootstrap aws://676373376343/eu-west-1 --profile AdministratorAccess-676373376343

# 6. Create Lambda functions (use the code I provided earlier)
# Then install Lambda dependencies
cd ../lambda-functions
pip install boto3 PyJWT python-dateutil -t shared/
pip install boto3 PyJWT python-dateutil -t products/
pip install boto3 PyJWT python-dateutil -t orders/
cd ../infrastructure

# 7. Synthesize
cdk synth --profile AdministratorAccess-676373376343 > amplify-app-stack-template.yaml

# 8. Build (if using SAM)
sam build --template-file amplify-app-stack-template.yaml --profile AdministratorAccess-676373376343

# 9. Deploy
cdk deploy --profile AdministratorAccess-676373376343 \
  --parameters GitHubAccessToken="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" \
  --parameters GoogleClientIdParam="1070066955715-230kpuc3gcumril53mpae1fkkrqjoptm.apps.googleusercontent.com" \
  --parameters GoogleClientSecretParam="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" \
  --parameters DatabaseURLParam="postgresql://postgres.lejerkpsmvmqyotdbjsr:WGDjhD9XUvqwXdNb@aws-0-eu-central-1.pooler.supabase.com:5432/postgres" \
  --parameters StripeSecretKeyParam="sk_test_51RESrhQ5AgnjVXhKWjQIAcCZK1Npx6T1rHeGv8uJxtw2E4PF8G2s9wTMIwHP52PRs23zeXBbn5krca5bExyYR2T600Ic9CYrRX" \
  --parameters StripePublishableKeyParam="pk_test_51RESrhQ5AgnjVXhKNvBJZkPODhMM4CtkKTeSS8zIZeUuMSgjBR8ajmfNPxCLTsEBO9aAEJDbfTBCvDpbzoc1vqU000p2zPjLlX" \
  --parameters StripeWebhookSecretParam="whsec_..."

# 10. Build Amplify
aws amplify build

# 11. Verify
aws cloudformation describe-stacks \
  --stack-name HibiscusHealthStack-dev \
  --profile AdministratorAccess-676373376343
```

## Additional Commands for Different Environments

```bash
<code_block_to_apply_changes_from>
```

## Cleanup Commands

```bash
# Destroy stack
cdk destroy HibiscusHealthStack-dev --profile AdministratorAccess-676373376343

# Remove generated files
rm amplify-app-stack-template.yaml
rm -rf .aws-sam/
```


eval $(aws configure export-credentials --profile AdministratorAccess-676373376343 --format env) && cdk bootstrap aws://676373376343/eu-west-1

This follows the same pattern as your previous commands but adapted for the e-commerce stack with DynamoDB and Lambda functions.