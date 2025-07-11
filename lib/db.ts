// lib/db.ts
import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-unused-vars
  var prisma: PrismaClient | undefined;
}

// Add connection options with more robustness for cloud environments
const prismaClientSingleton = () => {
  try {
    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      errorFormat: 'pretty',
    });
  } catch (error) {
    console.error('Failed to initialize Prisma client:', error);
    // Return a minimal client to prevent app crashes
    // This allows the app to start even with database connectivity issues
    return {} as PrismaClient;
  }
};

// Use existing client instance if available to avoid connection issues
export const db = globalThis.prisma || prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prisma = db;

// Handle connection errors gracefully
db.$connect()
  .then(() => {
    console.log('Database connection established successfully');
  })
  .catch((error) => {
    console.error('Failed to connect to database:', error);
    // Don't throw here - let the app continue and handle database errors at the API level
  });

// Add middleware to handle Prisma errors consistently
/*
db.$use(async (params, next) => {
  try {
    return await next(params);
  } catch (error) {
    console.error(`Prisma error in ${params.model}.${params.action}:`, error);
    throw error;
  }
});
*/