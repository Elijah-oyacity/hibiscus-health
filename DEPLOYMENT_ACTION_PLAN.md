# 🚀 Amplify Deployment Action Plan

## Current Issues Fixed

✅ **Updated `amplify.yml`** - Fixed environment variable setup and cache configuration
✅ **Updated `lib/db-adapter.ts`** - Improved DynamoDB detection logic
✅ **Generated secrets** - Created NEXTAUTH_SECRET and STRIPE_WEBHOOK_SECRET
✅ **Created deployment guide** - Complete troubleshooting documentation

## Immediate Actions Required

### 1. Configure Amplify Environment Variables

Go to **AWS Amplify Console** → **Your App** → **Environment variables** and add:

```
NODE_ENV=production
USE_DYNAMODB=true
AWS_REGION=eu-west-1
NEXTAUTH_SECRET=Y+/XkTsdycPbZdPKwd3mtKSwS/uVOM2JVyrcK2hWOJ0=
NEXTAUTH_URL=https://d1ekq8dkatabr5.amplifyapp.com
GOOGLE_CLIENT_ID=1070066955715-230kpuc3gcumril53mpae1fkkrqjoptm.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
STRIPE_SECRET_KEY=sk_test_51RESrhQ5AgnjVXhKWjQIAcCZK1Npx6T1rHeGv8uJxtw2E4PF8G2s9wTMIwHP52PRs23zeXBbn5krca5bExyYR2T600Ic9CYrRX
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51RESrhQ5AgnjVXhKNvBJZkPODhMM4CtkKTeSS8zIZeUuMSgjBR8ajmfNPxCLTsEBO9aAEJDbfTBCvDpbzoc1vqU000p2zPjLlX
STRIPE_WEBHOOK_SECRET=whsec_2e32694bade792ada58288ea81d6cdab109ebacb12186ae9bc121dc11cf8d021
DATABASE_URL=postgresql://placeholder
DIRECT_URL=postgresql://placeholder
```

### 2. Update Google OAuth Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Add these authorized origins:
   - `https://d1ekq8dkatabr5.amplifyapp.com`
   - `https://d1ekq8dkatabr5.amplifyapp.com/api/auth/callback/google`

### 3. Deploy Infrastructure (if not done)

```bash
cd infrastructure
export GITHUB_TOKEN=your_github_token
./deploy.sh
```

### 4. Push Changes to Trigger Build

```bash
git add .
git commit -m "Fix Amplify deployment configuration"
git push origin main
```

## Expected Results

After completing these steps, your build should show:

```
✅ Successfully retrieved Git provider SSH public keys
✅ Successfully cloned repository  
✅ Node version 18.18.0 installed
✅ Dependencies installed
✅ Prisma client generated
✅ Environment variables set
✅ Build completed successfully
✅ Artifacts deployed
```

## Testing Checklist

After deployment, test these endpoints:

1. **Health Check**: `https://d1ekq8dkatabr5.amplifyapp.com/api/deployment-check`
2. **Subscription Plans**: `https://d1ekq8dkatabr5.amplifyapp.com/api/subscription`
3. **Authentication**: Try logging in with Google OAuth
4. **Main App**: `https://d1ekq8dkatabr5.amplifyapp.com`

## Troubleshooting

### If Build Still Fails:
- Check that all environment variables are set correctly
- Verify DynamoDB tables exist in AWS Console
- Ensure Google OAuth domain is configured

### If Database Connection Fails:
- Verify `USE_DYNAMODB=true` is set
- Check AWS credentials and permissions
- Ensure DynamoDB tables are created

### If Authentication Fails:
- Verify `NEXTAUTH_URL` matches your domain
- Check Google OAuth configuration
- Ensure `NEXTAUTH_SECRET` is set

## Rollback Plan

If issues persist:
1. Set `USE_DYNAMODB=false` in Amplify environment variables
2. The app will fallback to using Prisma + PostgreSQL
3. Ensure your database URL is properly configured

## Next Steps

1. ✅ Complete the environment variable configuration
2. ✅ Deploy infrastructure (if needed)
3. ✅ Push code changes
4. 🔄 Monitor build progress
5. 🔄 Test all functionality
6. 🔄 Set up monitoring and alerts

## Files Modified

- `amplify.yml` - Fixed environment variable setup and cache configuration
- `lib/db-adapter.ts` - Improved DynamoDB detection logic
- `AMPLIFY_DEPLOYMENT_FIX.md` - Complete troubleshooting guide
- `generate-secrets.js` - Secret generation script
- `DEPLOYMENT_ACTION_PLAN.md` - This action plan

## Support

If you encounter any issues:
1. Check the build logs in Amplify Console
2. Review the troubleshooting guide in `AMPLIFY_DEPLOYMENT_FIX.md`
3. Test the deployment check endpoint for diagnostics 