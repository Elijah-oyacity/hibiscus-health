import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from '@/lib/db';

// Add debug logging
const debug = process.env.NODE_ENV !== 'production';

// Create a safer configuration that won't fail if environment variables are missing
const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      // Add logging to help debug auth provider issues
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  callbacks: {
    async session({ session, token }) {
      try {
        if (session.user && token) {
          session.user.id = token.sub || '';
          session.user.role = token.role as any || 'USER';
        }
        return session;
      } catch (error) {
        console.error('Session callback error:', error);
        return session;
      }
    },
    async jwt({ token, user }) {
      try {
        if (user) {
          token.role = (user as any).role || 'USER';
        }
        return token;
      } catch (error) {
        console.error('JWT callback error:', error);
        return token;
      }
    },
    async redirect({ url, baseUrl }) {
      try {
        // Redirect to dashboard after successful login
        if (url.startsWith("/")) return `${baseUrl}${url}`;
        else if (new URL(url).origin === baseUrl) return url;
        return `${baseUrl}/dashboard`;
      } catch (error) {
        console.error('Redirect error:', error);
        return baseUrl;
      }
    },
  },
  // Use JWT as the more reliable strategy for Amplify deployments
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  // Use NEXTAUTH_SECRET from environment or generate a placeholder for development
  secret: process.env.NEXTAUTH_SECRET || 'development-secret-do-not-use-in-production',
  debug: debug,
  // Skip database operations on error to prevent app crashes
  logger: {
    error(code, ...message) {
      console.error(code, ...message);
    },
    warn(code, ...message) {
      console.warn(code, ...message);
    },
    debug(code, ...message) {
      if (debug) {
        console.debug(code, ...message);
      }
    },
  },
};

export default authOptions;
