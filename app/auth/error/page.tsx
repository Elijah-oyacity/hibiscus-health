'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, Home, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const errorMessages: Record<string, { title: string; description: string; action?: string }> = {
  Configuration: {
    title: 'OAuth Configuration Error',
    description: 'There was a problem with the OAuth provider configuration. Please check that the Google OAuth app is properly configured.',
    action: 'Check OAuth settings in Google Cloud Console'
  },
  AccessDenied: {
    title: 'Access Denied',
    description: 'You denied access to the application. Please try signing in again.',
  },
  Verification: {
    title: 'Verification Error',
    description: 'The verification token was invalid or has expired.',
  },
  OAuthSignin: {
    title: 'OAuth Sign-in Error',
    description: 'There was an error signing in with the OAuth provider. This is usually due to misconfigured redirect URIs or invalid client credentials.',
    action: 'Check Google OAuth redirect URIs'
  },
  OAuthCallback: {
    title: 'OAuth Callback Error',
    description: 'Error in handling the OAuth callback. Check the OAuth provider configuration.',
  },
  OAuthCreateAccount: {
    title: 'Account Creation Error',
    description: 'Could not create an account for this OAuth profile.',
  },
  EmailCreateAccount: {
    title: 'Email Account Creation Error',
    description: 'Could not create an account with this email.',
  },
  Callback: {
    title: 'Callback Error',
    description: 'There was an error in the OAuth callback process.',
  },
  OAuthAccountNotLinked: {
    title: 'Account Not Linked',
    description: 'This OAuth account is not linked to an existing user account.',
  },
  SessionRequired: {
    title: 'Session Required',
    description: 'You must be signed in to access this page.',
  },
  Default: {
    title: 'Authentication Error',
    description: 'An unexpected authentication error occurred.',
  },
};

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams?.get('error') || 'Default';
  
  const errorInfo = errorMessages[error] || errorMessages.Default;

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 text-destructive" />
          </div>
          <CardTitle className="text-xl">{errorInfo.title}</CardTitle>
          <CardDescription>{errorInfo.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Error Code:</strong> {error}
            </AlertDescription>
          </Alert>
          
          {errorInfo.action && (
            <Alert>
              <AlertDescription>
                <strong>Action Required:</strong> {errorInfo.action}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col gap-2">
            <Button asChild className="w-full">
              <Link href="/login">
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Again
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Link>
            </Button>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <Alert>
              <AlertDescription className="text-xs">
                <strong>Debug Info (Development Only):</strong><br />
                URL: {typeof window !== 'undefined' ? window.location.href : 'SSR'}<br />
                Error: {error}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
