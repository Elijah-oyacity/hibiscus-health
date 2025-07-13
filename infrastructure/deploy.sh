#!/bin/bash

# Deploy script for Hibiscus Health CDK Stack
# Make sure to replace YOUR_GITHUB_TOKEN with your actual GitHub personal access token

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Deploying Hibiscus Health CDK Stack${NC}"

# Check if virtual environment is activated
if [[ "$VIRTUAL_ENV" == "" ]]; then
    echo -e "${YELLOW}⚠️  Activating virtual environment...${NC}"
    source .venv/bin/activate
fi

# Check if GitHub token is provided
if [ -z "$GITHUB_TOKEN" ]; then
    echo -e "${RED}❌ Error: GITHUB_TOKEN environment variable is not set${NC}"
    echo -e "${YELLOW}Please set your GitHub token:${NC}"
    echo "export GITHUB_TOKEN=your_github_personal_access_token"
    echo ""
    echo -e "${YELLOW}Or run the deployment with:${NC}"
    echo "GITHUB_TOKEN=your_token ./deploy.sh"
    exit 1
fi

echo -e "${GREEN}✅ GitHub token found${NC}"

# Deploy the stack
echo -e "${GREEN}📦 Deploying CDK stack...${NC}"

cdk deploy HibiscusHealthStack-dev \
  --parameters GitHubAccessToken=$GITHUB_TOKEN \
  --parameters GoogleClientIdParam='1070066955715-230kpuc3gcumril53mpae1fkkrqjoptm.apps.googleusercontent.com' \
  --parameters GoogleClientSecretParam='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' \
  --parameters StripePublishableKeyParam='pk_test_51RESrhQ5AgnjVXhKNvBJZkPODhMM4CtkKTeSS8zIZeUuMSgjBR8ajmfNPxCLTsEBO9aAEJDbfTBCvDpbzoc1vqU000p2zPjLlX' \
  --parameters StripeSecretKeyParam='sk_test_51RESrhQ5AgnjVXhKWjQIAcCZK1Npx6T1rHeGv8uJxtw2E4PF8G2s9wTMIwHP52PRs23zeXBbn5krca5bExyYR2T600Ic9CYrRX' \
  --parameters StripeWebhookSecretParam='whsec_your_webhook_secret_here' \
  --parameters DatabaseURLParam='postgresql://postgres.lejerkpsmvmqyotdbjsr:WGDjhD9XUvqwXdNb@aws-0-eu-central-1.pooler.supabase.com:5432/postgres' \
  --require-approval never

if [ $? -eq 0 ]; then
    echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
    echo -e "${GREEN}📋 Next steps:${NC}"
    echo "1. Check your Amplify app in the AWS Console"
    echo "2. Update your Stripe webhook endpoint with the actual webhook secret"
    echo "3. Configure your domain in Amplify (optional)"
else
    echo -e "${RED}❌ Deployment failed!${NC}"
    exit 1
fi
