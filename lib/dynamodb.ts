import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, GetCommand, PutCommand, UpdateCommand, DeleteCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import crypto from "crypto";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
});

export const dynamodb = DynamoDBDocumentClient.from(client);

// Types matching your Prisma schema
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: string;
  stripePriceId: string;
  productId: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
  emailVerified?: string | null;
  role: "USER" | "ADMIN";
  createdAt: string;
  updatedAt: string;
}

export interface UserSubscription {
  id: string;
  userId: string;
  stripeSubscriptionId: string;
  status: string;
  subscriptionPlanId: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELED" | "FAILED";
  stripePaymentIntentId?: string | null;
  shippingAddress?: any;
  billingAddress?: any;
  createdAt: string;
  updatedAt: string;
}

// DynamoDB Service Classes
export class SubscriptionPlanService {
  private tableName = process.env.NODE_ENV === "production" 
    ? "hibiscus-subscription-plans-prod" 
    : "SubscriptionPlans";

  async findMany(): Promise<SubscriptionPlan[]> {
    const command = new ScanCommand({
      TableName: this.tableName,
    });
    
    const result = await dynamodb.send(command);
    return (result.Items as SubscriptionPlan[]) || [];
  }

  async findById(id: string): Promise<SubscriptionPlan | null> {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: { id },
    });
    
    const result = await dynamodb.send(command);
    return (result.Item as SubscriptionPlan) || null;
  }

  async findByStripePriceId(stripePriceId: string): Promise<SubscriptionPlan | null> {
    const command = new ScanCommand({
      TableName: this.tableName,
      FilterExpression: "stripePriceId = :stripePriceId",
      ExpressionAttributeValues: {
        ":stripePriceId": stripePriceId,
      },
    });
    
    const result = await dynamodb.send(command);
    return (result.Items?.[0] as SubscriptionPlan) || null;
  }

  async create(plan: Omit<SubscriptionPlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<SubscriptionPlan> {
    const now = new Date().toISOString();
    const newPlan: SubscriptionPlan = {
      id: crypto.randomUUID(),
      ...plan,
      createdAt: now,
      updatedAt: now,
    };

    const command = new PutCommand({
      TableName: this.tableName,
      Item: newPlan,
    });
    
    await dynamodb.send(command);
    return newPlan;
  }

  async update(id: string, updates: Partial<Omit<SubscriptionPlan, 'id' | 'createdAt'>>): Promise<SubscriptionPlan | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const updatedPlan = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const command = new PutCommand({
      TableName: this.tableName,
      Item: updatedPlan,
    });
    
    await dynamodb.send(command);
    return updatedPlan;
  }

  async delete(id: string): Promise<boolean> {
    const command = new DeleteCommand({
      TableName: this.tableName,
      Key: { id },
    });
    
    await dynamodb.send(command);
    return true;
  }
}

export class UserService {
  private tableName = process.env.NODE_ENV === "production" 
    ? "hibiscus-users-prod" 
    : "Users";

  async findByEmail(email: string): Promise<User | null> {
    const command = new ScanCommand({
      TableName: this.tableName,
      FilterExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": email,
      },
    });
    
    const result = await dynamodb.send(command);
    return (result.Items?.[0] as User) || null;
  }

  async findById(id: string): Promise<User | null> {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: { id },
    });
    
    const result = await dynamodb.send(command);
    return (result.Item as User) || null;
  }

  async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const now = new Date().toISOString();
    const newUser: User = {
      id: crypto.randomUUID(),
      ...user,
      role: user.role || "USER",
      createdAt: now,
      updatedAt: now,
    };

    const command = new PutCommand({
      TableName: this.tableName,
      Item: newUser,
    });
    
    await dynamodb.send(command);
    return newUser;
  }

  async update(id: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const updatedUser = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const command = new PutCommand({
      TableName: this.tableName,
      Item: updatedUser,
    });
    
    await dynamodb.send(command);
    return updatedUser;
  }
}

export class UserSubscriptionService {
  private tableName = process.env.NODE_ENV === "production" 
    ? "hibiscus-user-subscriptions-prod" 
    : "UserSubscriptions";

  async findByUserId(userId: string): Promise<UserSubscription[]> {
    const command = new ScanCommand({
      TableName: this.tableName,
      FilterExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
    });
    
    const result = await dynamodb.send(command);
    return (result.Items as UserSubscription[]) || [];
  }

  async findByStripeSubscriptionId(stripeSubscriptionId: string): Promise<UserSubscription | null> {
    const command = new ScanCommand({
      TableName: this.tableName,
      FilterExpression: "stripeSubscriptionId = :stripeSubscriptionId",
      ExpressionAttributeValues: {
        ":stripeSubscriptionId": stripeSubscriptionId,
      },
    });
    
    const result = await dynamodb.send(command);
    return (result.Items?.[0] as UserSubscription) || null;
  }

  async create(subscription: Omit<UserSubscription, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserSubscription> {
    const now = new Date().toISOString();
    const newSubscription: UserSubscription = {
      id: crypto.randomUUID(),
      ...subscription,
      createdAt: now,
      updatedAt: now,
    };

    const command = new PutCommand({
      TableName: this.tableName,
      Item: newSubscription,
    });
    
    await dynamodb.send(command);
    return newSubscription;
  }

  async update(id: string, updates: Partial<Omit<UserSubscription, 'id' | 'createdAt'>>): Promise<UserSubscription | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const updatedSubscription = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const command = new PutCommand({
      TableName: this.tableName,
      Item: updatedSubscription,
    });
    
    await dynamodb.send(command);
    return updatedSubscription;
  }

  async findById(id: string): Promise<UserSubscription | null> {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: { id },
    });
    
    const result = await dynamodb.send(command);
    return (result.Item as UserSubscription) || null;
  }
}

export class OrderService {
  private tableName = process.env.NODE_ENV === "production" 
    ? "hibiscus-orders-prod" 
    : "Orders";

  async findByUserId(userId: string): Promise<Order[]> {
    const command = new ScanCommand({
      TableName: this.tableName,
      FilterExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
    });
    
    const result = await dynamodb.send(command);
    return (result.Items as Order[]) || [];
  }

  async create(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    const now = new Date().toISOString();
    const newOrder: Order = {
      id: crypto.randomUUID(),
      ...order,
      createdAt: now,
      updatedAt: now,
    };

    const command = new PutCommand({
      TableName: this.tableName,
      Item: newOrder,
    });
    
    await dynamodb.send(command);
    return newOrder;
  }

  async findById(id: string): Promise<Order | null> {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: { id },
    });
    
    const result = await dynamodb.send(command);
    return (result.Item as Order) || null;
  }
}

// Export service instances
export const subscriptionPlanService = new SubscriptionPlanService();
export const userService = new UserService();
export const userSubscriptionService = new UserSubscriptionService();
export const orderService = new OrderService();
