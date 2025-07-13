# DynamoDB Production Deployment Guide

## Overview
This guide walks you through deploying the Hibiscus Health application with DynamoDB as the production database. The application uses a dual-database setup:
- **Development**: Prisma + Supabase (PostgreSQL)
- **Production**: DynamoDB + AWS SDK v3

## Prerequisites
- AWS CLI configured with appropriate permissions
- AWS CDK v2 installed
- GitHub Personal Access Token
- Node.js and npm/pnpm

## Step 1: Deploy AWS Infrastructure

1. Navigate to the infrastructure directory:
```bash
cd infrastructure
```

2. Activate the Python virtual environment:
```bash
source .venv/bin/activate
```

3. Deploy the CDK stack with your GitHub token:
```bash
export GITHUB_TOKEN=your_github_personal_access_token
./deploy.sh
```

This will create:
- DynamoDB tables: `hibiscus-users-dev`, `hibiscus-subscription-plans-dev`, etc.
- Amplify app connected to your GitHub repository
- Lambda functions for API endpoints
- IAM roles and permissions

## Step 2: Configure Amplify Environment Variables

In the AWS Amplify Console, add these environment variables:

### Required for DynamoDB Mode:
```
USE_DYNAMODB=true
AWS_REGION=us-east-1
```

### Authentication (keep existing):
```
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://your-amplify-domain.amplifyapp.com
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Stripe (keep existing):
```
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

### Database URLs (for compatibility):
```
DATABASE_URL=postgresql://placeholder
DIRECT_URL=postgresql://placeholder
```

## Step 3: Verify DynamoDB Tables

Check that these tables exist in your AWS DynamoDB console:
- `hibiscus-users-dev`
- `hibiscus-subscription-plans-dev`
- `hibiscus-user-subscriptions-dev`
- `hibiscus-orders-dev`

## Step 4: Deploy Application

1. Push your code to trigger Amplify deployment:
```bash
git add .
git commit -m "Deploy with DynamoDB integration"
git push origin main
```

2. Monitor the deployment in Amplify Console

## Step 5: Initialize Data (Optional)

If you need to seed data in DynamoDB, you can create a migration script or manually add subscription plans through the admin interface.

## Environment Configuration

### Development (.env)
```
USE_DYNAMODB=false
DATABASE_URL=postgresql://your_dev_database
DIRECT_URL=postgresql://your_dev_database
AWS_REGION=us-east-1
```

### Production (Amplify Environment Variables)
```
USE_DYNAMODB=true
AWS_REGION=us-east-1
```

## Database Switching Logic

The application automatically detects the environment:
- `USE_DYNAMODB=false` → Uses Prisma + PostgreSQL
- `USE_DYNAMODB=true` → Uses DynamoDB + AWS SDK

## Troubleshooting

### Common Issues:

1. **DynamoDB Access Denied**
   - Ensure Lambda execution role has DynamoDB permissions
   - Check table names match the environment

2. **Build Errors**
   - Verify all environment variables are set
   - Check AWS SDK imports are correct

3. **Authentication Issues**
   - Ensure NEXTAUTH_URL matches your Amplify domain
   - Verify Google OAuth credentials

### Logs and Monitoring:
- Check Amplify build logs for deployment issues
- Use CloudWatch for Lambda function logs
- Monitor DynamoDB metrics in AWS Console

## Rollback Plan

If issues occur, you can quickly rollback:

1. Set `USE_DYNAMODB=false` in Amplify environment variables
2. Redeploy the application
3. The app will fallback to using the original database setup

## Performance Considerations

- DynamoDB offers automatic scaling
- Monitor read/write capacity usage
- Consider using DynamoDB Accelerator (DAX) for caching if needed

## Security

- All DynamoDB operations use IAM roles
- No database credentials stored in environment variables
- Tables are created with encryption at rest

## Cost Optimization

- DynamoDB uses on-demand billing by default
- Monitor usage through AWS Cost Explorer
- Consider reserved capacity for predictable workloads

---

**Next Steps After Deployment:**
1. Test all application features in production
2. Monitor performance and costs
3. Set up CloudWatch alarms for critical metrics
4. Consider implementing backup strategies
