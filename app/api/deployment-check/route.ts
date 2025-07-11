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
