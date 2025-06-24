import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { db } from "@/lib/db"

// Mock data
const mockCustomers = [
  {
    id: "USR001",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    joinedAt: "2024-05-28T00:00:00.000Z",
    plan: "Monthly",
    totalSpent: 89.97,
    orders: 3,
  },
  {
    id: "USR002",
    name: "Michael Chen",
    email: "m.chen@example.com",
    joinedAt: "2024-05-27T00:00:00.000Z",
    plan: "Quarterly",
    totalSpent: 159.98,
    orders: 2,
  },
  {
    id: "USR003",
    name: "Jessica Williams",
    email: "jwilliams@example.com",
    joinedAt: "2024-05-26T00:00:00.000Z",
    plan: "Annual",
    totalSpent: 299.99,
    orders: 1,
  },
  {
    id: "USR004",
    name: "David Rodriguez",
    email: "drodriguez@example.com",
    joinedAt: "2024-05-25T00:00:00.000Z",
    plan: "Monthly",
    totalSpent: 59.98,
    orders: 2,
  },
  {
    id: "USR005",
    name: "Emily Taylor",
    email: "etaylor@example.com",
    joinedAt: "2024-05-24T00:00:00.000Z",
    plan: "Quarterly",
    totalSpent: 79.99,
    orders: 1,
  },
]

export async function GET(req: Request) {
  const session = await getServerSession()

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Check if user is admin
  const user = await db.user.findUnique({
    where: {
      email: session.user.email as string,
    },
    select: {
      role: true,
    },
  })

  if (user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  // In a real app, you would fetch customers from the database
  return NextResponse.json(mockCustomers)
}
