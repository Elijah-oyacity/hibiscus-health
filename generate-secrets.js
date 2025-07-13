#!/usr/bin/env node

/**
 * Generate secrets and configuration for Amplify deployment
 */

const crypto = require('crypto');

console.log('🔐 Generating secrets for Amplify deployment...\n');

// Generate NEXTAUTH_SECRET
const nextAuthSecret = crypto.randomBytes(32).toString('base64');
console.log('NEXTAUTH_SECRET:');
console.log(nextAuthSecret);
console.log('');

// Generate a random string for webhook secret
const webhookSecret = crypto.randomBytes(32).toString('hex');
console.log('STRIPE_WEBHOOK_SECRET:');
console.log(`whsec_${webhookSecret}`);
console.log('');

// Display environment variable template
console.log('📋 Environment Variables Template for Amplify Console:');
console.log('==================================================');
console.log('NODE_ENV=production');
console.log('USE_DYNAMODB=true');
console.log('AWS_REGION=eu-west-1');
console.log(`NEXTAUTH_SECRET=${nextAuthSecret}`);
console.log('NEXTAUTH_URL=https://your-app-id.amplifyapp.com');
console.log('GOOGLE_CLIENT_ID=your_google_client_id');
console.log('GOOGLE_CLIENT_SECRET=your_google_client_secret');
console.log('STRIPE_SECRET_KEY=your_stripe_secret_key');
console.log('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key');
console.log(`STRIPE_WEBHOOK_SECRET=whsec_${webhookSecret}`);
console.log('DATABASE_URL=postgresql://placeholder');
console.log('DIRECT_URL=postgresql://placeholder');
console.log('');

console.log('📝 Instructions:');
console.log('1. Copy the NEXTAUTH_SECRET above');
console.log('2. Copy the STRIPE_WEBHOOK_SECRET above');
console.log('3. Go to AWS Amplify Console → Your App → Environment variables');
console.log('4. Add all the environment variables listed above');
console.log('5. Replace "your-app-id" with your actual Amplify app ID');
console.log('6. Add your actual Google OAuth and Stripe credentials');
console.log('');

console.log('🔍 To find your Amplify app ID:');
console.log('- Go to AWS Amplify Console');
console.log('- Click on your app');
console.log('- The app ID is in the URL: https://console.aws.amazon.com/amplify/home?region=eu-west-1#/d1ekq8dkatabr5');
console.log('- Your app ID is: d1ekq8dkatabr5');
console.log('');

console.log('✅ After setting environment variables:');
console.log('1. Push your code to trigger a new build');
console.log('2. Monitor the build in Amplify Console');
console.log('3. Test the deployment at: https://your-app-id.amplifyapp.com'); 