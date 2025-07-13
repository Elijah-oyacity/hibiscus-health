// Database abstraction layer - switches between Prisma and DynamoDB
// Temporarily simplified to fix build issues

// Import Prisma types for consistency (but not the client itself)
let prismaDb: any = null;

// Function to get Prisma DB lazily
async function getPrismaDb() {
  if (!prismaDb) {
    const { db } = await import("./db");
    prismaDb = db;
  }
  return prismaDb;
}

// Check if we're in production and should use DynamoDB
// Updated logic to better handle Amplify environment
const USE_DYNAMODB = process.env.USE_DYNAMODB === "true" || 
                     (process.env.NODE_ENV === "production" && process.env.USE_DYNAMODB !== "false");

// Log the database choice for debugging
console.log(`[DB-ADAPTER] Environment: ${process.env.NODE_ENV}, USE_DYNAMODB: ${process.env.USE_DYNAMODB}, Will use: ${USE_DYNAMODB ? 'DynamoDB' : 'Prisma'}`);

// Types for consistency between Prisma and DynamoDB
export interface DbSubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: string;
  stripePriceId: string;
  productId: string | null;
  active: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface DbUser {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
  emailVerified?: Date | string | null;
  role: "USER" | "ADMIN";
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface DbUserSubscription {
  id: string;
  userId: string;
  stripeSubscriptionId: string;
  status: string;
  subscriptionPlanId: string;
  currentPeriodStart: Date | string;
  currentPeriodEnd: Date | string;
  cancelAtPeriodEnd: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface DbOrder {
  id: string;
  userId: string;
  totalAmount: number;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELED" | "FAILED";
  stripePaymentIntentId?: string | null;
  shippingAddress?: any;
  billingAddress?: any;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Helper functions to transform between Prisma and our unified types
function transformPrismaUser(prismaUser: any): DbUser {
  return {
    ...prismaUser,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function transformPrismaOrder(prismaOrder: any): DbOrder {
  return {
    ...prismaOrder,
    // Map totalAmount to our standard field name for compatibility
    ...(prismaOrder.totalAmount && { totalAmount: prismaOrder.totalAmount }),
  };
}

// DynamoDB services - lazy loaded to avoid build issues
let dynamoDBServices: any = null;

async function getDynamoDBServices() {
  if (!dynamoDBServices) {
    const { 
      subscriptionPlanService, 
      userService, 
      userSubscriptionService, 
      orderService 
    } = await import("./dynamodb");
    dynamoDBServices = {
      subscriptionPlanService,
      userService,
      userSubscriptionService,
      orderService
    };
  }
  return dynamoDBServices;
}

// Database service that abstracts between Prisma and DynamoDB
export const db = {
  subscriptionPlan: {
    findMany: async (): Promise<DbSubscriptionPlan[]> => {
      if (USE_DYNAMODB) {
        const services = await getDynamoDBServices();
        return await services.subscriptionPlanService.findMany();
      } else {
        // Use Prisma for development
        const prismaDb = await getPrismaDb();
        const plans = await prismaDb.subscriptionPlan.findMany({
          orderBy: { createdAt: "desc" }
        });
        return plans;
      }
    },

    findUnique: async (where: { id?: string; stripePriceId?: string }): Promise<DbSubscriptionPlan | null> => {
      if (USE_DYNAMODB) {
        const services = await getDynamoDBServices();
        if (where.id) {
          return await services.subscriptionPlanService.findById(where.id);
        } else if (where.stripePriceId) {
          return await services.subscriptionPlanService.findByStripePriceId(where.stripePriceId);
        }
        return null;
      } else {
        const prismaDb = await getPrismaDb();
        // Handle optional where clause properly
        if (where.id) {
          return await prismaDb.subscriptionPlan.findUnique({ where: { id: where.id } });
        } else if (where.stripePriceId) {
          return await prismaDb.subscriptionPlan.findUnique({ where: { stripePriceId: where.stripePriceId } });
        }
        return null;
      }
    },

    create: async (data: Omit<DbSubscriptionPlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<DbSubscriptionPlan> => {
      if (USE_DYNAMODB) {
        const services = await getDynamoDBServices();
        return await services.subscriptionPlanService.create(data);
      } else {
        const { db: prismaDb } = await import("./db");
        return await prismaDb.subscriptionPlan.create({ data });
      }
    },

    update: async (where: { id: string }, data: Partial<Omit<DbSubscriptionPlan, 'id' | 'createdAt' | 'updatedAt'>>): Promise<DbSubscriptionPlan | null> => {
      if (USE_DYNAMODB) {
        const services = await getDynamoDBServices();
        // Convert Date objects to strings for DynamoDB - but updatedAt is not in the data type
        const cleanData = { ...data };
        return await services.subscriptionPlanService.update(where.id, cleanData);
      } else {
        const { db: prismaDb } = await import("./db");
        return await prismaDb.subscriptionPlan.update({ where, data });
      }
    },

    delete: async (where: { id: string }): Promise<void> => {
      if (USE_DYNAMODB) {
        const services = await getDynamoDBServices();
        await services.subscriptionPlanService.delete(where.id);
      } else {
        const { db: prismaDb } = await import("./db");
        await prismaDb.subscriptionPlan.delete({ where });
      }
    }
  },

  user: {
    findUnique: async (where: { id?: string; email?: string }): Promise<DbUser | null> => {
      if (USE_DYNAMODB) {
        const services = await getDynamoDBServices();
        if (where.id) {
          return await services.userService.findById(where.id);
        } else if (where.email) {
          return await services.userService.findByEmail(where.email);
        }
        return null;
      } else {
        const { db: prismaDb } = await import("./db");
        let result = null;
        if (where.id) {
          result = await prismaDb.user.findUnique({ where: { id: where.id } });
        } else if (where.email) {
          result = await prismaDb.user.findUnique({ where: { email: where.email } });
        }
        return result ? transformPrismaUser(result) : null;
      }
    },

    create: async (data: Omit<DbUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<DbUser> => {
      if (USE_DYNAMODB) {
        const services = await getDynamoDBServices();
        // Convert Date objects to strings for DynamoDB
        const cleanData = { 
          ...data,
          emailVerified: data.emailVerified instanceof Date ? data.emailVerified.toISOString() : data.emailVerified
        };
        return await services.userService.create(cleanData);
      } else {
        const { db: prismaDb } = await import("./db");
        const result = await prismaDb.user.create({ data });
        return transformPrismaUser(result);
      }
    },

    update: async (where: { id: string }, data: Partial<Omit<DbUser, 'id' | 'createdAt'>>): Promise<DbUser | null> => {
      if (USE_DYNAMODB) {
        const services = await getDynamoDBServices();
        // Convert Date objects to strings for DynamoDB
        const cleanData = { 
          ...data,
          emailVerified: data.emailVerified instanceof Date ? data.emailVerified.toISOString() : data.emailVerified,
          updatedAt: data.updatedAt instanceof Date ? data.updatedAt.toISOString() : data.updatedAt
        };
        return await services.userService.update(where.id, cleanData);
      } else {
        const { db: prismaDb } = await import("./db");
        const result = await prismaDb.user.update({ where, data });
        return transformPrismaUser(result);
      }
    }
  },

  userSubscription: {
    findMany: async (where?: { userId?: string }): Promise<DbUserSubscription[]> => {
      if (USE_DYNAMODB) {
        const services = await getDynamoDBServices();
        if (where?.userId) {
          return await services.userSubscriptionService.findByUserId(where.userId);
        }
        // For no where clause, we'd need to scan all - not recommended for DynamoDB
        return [];
      } else {
        const { db: prismaDb } = await import("./db");
        return await prismaDb.userSubscription.findMany({ where });
      }
    },

    findUnique: async (where: { id?: string; stripeSubscriptionId?: string }): Promise<DbUserSubscription | null> => {
      if (USE_DYNAMODB) {
        const services = await getDynamoDBServices();
        if (where.id) {
          return await services.userSubscriptionService.findById(where.id);
        } else if (where.stripeSubscriptionId) {
          return await services.userSubscriptionService.findByStripeSubscriptionId(where.stripeSubscriptionId);
        }
        return null;
      } else {
        const { db: prismaDb } = await import("./db");
        if (where.id) {
          return await prismaDb.userSubscription.findUnique({ where: { id: where.id } });
        } else if (where.stripeSubscriptionId) {
          return await prismaDb.userSubscription.findUnique({ where: { stripeSubscriptionId: where.stripeSubscriptionId } });
        }
        return null;
      }
    },

    create: async (data: Omit<DbUserSubscription, 'id' | 'createdAt' | 'updatedAt'>): Promise<DbUserSubscription> => {
      if (USE_DYNAMODB) {
        const services = await getDynamoDBServices();
        // Convert Date objects to strings for DynamoDB
        const cleanData = {
          ...data,
          currentPeriodStart: data.currentPeriodStart instanceof Date ? data.currentPeriodStart.toISOString() : data.currentPeriodStart,
          currentPeriodEnd: data.currentPeriodEnd instanceof Date ? data.currentPeriodEnd.toISOString() : data.currentPeriodEnd
        };
        return await services.userSubscriptionService.create(cleanData);
      } else {
        const { db: prismaDb } = await import("./db");
        return await prismaDb.userSubscription.create({ data });
      }
    },

    update: async (where: { id: string }, data: Partial<Omit<DbUserSubscription, 'id' | 'createdAt'>>): Promise<DbUserSubscription | null> => {
      if (USE_DYNAMODB) {
        const services = await getDynamoDBServices();
        // Convert Date objects to strings for DynamoDB
        const cleanData = {
          ...data,
          currentPeriodStart: data.currentPeriodStart instanceof Date ? data.currentPeriodStart.toISOString() : data.currentPeriodStart,
          currentPeriodEnd: data.currentPeriodEnd instanceof Date ? data.currentPeriodEnd.toISOString() : data.currentPeriodEnd,
          updatedAt: data.updatedAt instanceof Date ? data.updatedAt.toISOString() : data.updatedAt
        };
        return await services.userSubscriptionService.update(where.id, cleanData);
      } else {
        const { db: prismaDb } = await import("./db");
        return await prismaDb.userSubscription.update({ where, data });
      }
    }
  },

  order: {
    findMany: async (where?: { userId?: string }): Promise<DbOrder[]> => {
      if (USE_DYNAMODB) {
        const services = await getDynamoDBServices();
        if (where?.userId) {
          return await services.orderService.findByUserId(where.userId);
        }
        // For no where clause, we'd need to scan all - not recommended for DynamoDB
        return [];
      } else {
        const { db: prismaDb } = await import("./db");
        return await prismaDb.order.findMany({ where });
      }
    },

    findUnique: async (where: { id: string }): Promise<DbOrder | null> => {
      if (USE_DYNAMODB) {
        const services = await getDynamoDBServices();
        return await services.orderService.findById(where.id);
      } else {
        const { db: prismaDb } = await import("./db");
        const result = await prismaDb.order.findUnique({ where });
        return result ? transformPrismaOrder(result) : null;
      }
    },

    create: async (data: Omit<DbOrder, 'id' | 'createdAt' | 'updatedAt'>): Promise<DbOrder> => {
      if (USE_DYNAMODB) {
        const services = await getDynamoDBServices();
        return await services.orderService.create(data);
      } else {
        const { db: prismaDb } = await import("./db");
        const result = await prismaDb.order.create({ data });
        return transformPrismaOrder(result);
      }
    },

    update: async (where: { id: string }, data: Partial<Omit<DbOrder, 'id' | 'createdAt'>>): Promise<DbOrder | null> => {
      if (USE_DYNAMODB) {
        const services = await getDynamoDBServices();
        // Convert Date objects to strings for DynamoDB
        const cleanData = {
          ...data,
          updatedAt: data.updatedAt instanceof Date ? data.updatedAt.toISOString() : data.updatedAt
        };
        return await services.orderService.update(where.id, cleanData);
      } else {
        const { db: prismaDb } = await import("./db");
        const result = await prismaDb.order.update({ where, data });
        return transformPrismaOrder(result);
      }
    }
  }
};

// Helper function to get database type
export const getDatabaseType = () => USE_DYNAMODB ? "dynamodb" : "prisma";
