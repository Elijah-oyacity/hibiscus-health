// lib/db-utils.ts
import { db } from "./db"

// Helper functions to handle Prisma model naming inconsistencies
export const UserSubscription = {
  findMany: (args: any) => db.userSubscription.findMany(args),
  findUnique: (args: any) => db.userSubscription.findUnique(args),
  findFirst: (args: any) => db.userSubscription.findFirst(args),
  create: (args: any) => db.userSubscription.create(args),
  update: (args: any) => db.userSubscription.update(args),
  updateMany: (args: any) => db.userSubscription.updateMany(args),
  delete: (args: any) => db.userSubscription.delete(args),
  deleteMany: (args: any) => db.userSubscription.deleteMany(args),
}
