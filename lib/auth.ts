import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import authConfig from './auth.config';
import { db } from './db';

// Define UserRole type manually
export type UserRole = 'USER' | 'ADMIN';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: UserRole;
    };
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' }, // JWT strategy is recommended
  ...authConfig,
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;
      const existingUser = await db.user.findUnique({
        where: { id: token.sub },
      });
      if (!existingUser) return token;
      token.role = existingUser.role;
      return token;
    },
    // async redirect({ url, baseUrl }) {
    //   if (url.startsWith("/")) return `${baseUrl}${url}`;
    //   else if (new URL(url).origin === baseUrl) return url;
    //   return baseUrl;
    // },
  },
  // events: {
  //   async signIn(message) { console.log("User signed in:", message.user) },
  //   async linkAccount(message) { /* new account linked */ }
  // }
});
