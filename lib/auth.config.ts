import type { AuthOptions } from 'next-auth';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';

const authConfig: AuthOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
  ],
  pages: {
    signIn: '/login', // Optional: custom login page
    error: '/auth/error', // Optional: custom error page
  },
  // You can add global session/jwt callbacks here if needed
};

export default authConfig;
