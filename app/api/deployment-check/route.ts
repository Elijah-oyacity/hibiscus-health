// File: app/api/deployment-check/route.ts
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

/**
 * API Route for checking server status and configuration
 * This provides valuable diagnostic information for debugging AWS Amplify deployments
 */
export async function GET() {
  const startTime = Date.now();
  
  try {
    // Check environment variables (don't expose sensitive values)
    const envCheck = {
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL: !!process.env.DATABASE_URL ? 'Set' : 'Missing',
      NEXTAUTH_URL: !!process.env.NEXTAUTH_URL ? 'Set' : 'Missing',
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET ? 'Set' : 'Missing',
      GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Missing',
      GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Missing',
      // Add Amplify-specific environment variables
      AWS_REGION: process.env.AWS_REGION || 'Not set',
      AMPLIFY_APP_ID: process.env.AMPLIFY_APP_ID || 'Not set',
      AMPLIFY_BRANCH: process.env.AMPLIFY_BRANCH || 'Not set',
      AMPLIFY_DEPLOYMENT_ID: process.env.AMPLIFY_DEPLOYMENT_ID || 'Not set',
    };

    // Test database connection
    let dbStatus = 'Unknown';
    let dbError = null;
    
    try {
      // Simple query to test connection
      await db.$queryRaw`SELECT 1`;
      dbStatus = 'Connected';
    } catch (error: any) {
      dbStatus = 'Error';
      dbError = {
        message: error.message,
        code: error.code,
      };
      console.error('Database connection check failed:', error);
    }

    // Get build/deployment info from Amplify environment
    const deploymentInfo = {
      timestamp: process.env.AMPLIFY_TIMESTAMP || 'Unknown',
      commitId: process.env.AMPLIFY_COMMIT_ID || 'Unknown',
      deploymentArtifacts: process.env.AMPLIFY_ARTIFACTS || 'Unknown',
      buildId: process.env.AWS_BUILD_ID || 'Unknown',
      deploymentUrl: process.env.AMPLIFY_URL || 'Unknown',
      currentBranch: process.env.AMPLIFY_BRANCH || 'Unknown',
      // Additional dev-specific info
      isDevBranch: (process.env.AMPLIFY_BRANCH === 'dev'),
      lastDeployAttempt: new Date().toISOString(),
      gitHeadRef: process.env.AWS_GIT_REFERENCE || 'Unknown',
    };

    const endTime = Date.now();
    
    return NextResponse.json({
      status: 'ok',
      serverTime: new Date().toISOString(),
      uptime: process.uptime(),
      environment: envCheck,
      database: {
        status: dbStatus,
        error: dbError,
        clientInitialized: !!db,
      },
      deployment: deploymentInfo,
      serverInfo: {
        nodejs: process.version,
        memoryUsage: process.memoryUsage(),
      },
      responseTimeMs: endTime - startTime,
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('Health check error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Server health check failed',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    }, { status: 500 });
  }
}
