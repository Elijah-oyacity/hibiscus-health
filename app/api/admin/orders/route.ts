import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth.config"

import { db } from "@/lib/db"

// Mock data
const mockOrders = [
  {
    id: "ORD001",
    customer: {
      id: "USR001",
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
    },
    date: "2024-05-01T00:00:00.000Z",
    status: "delivered",
    total: 29.99,
    items: [
      {
        id: "PROD001",
        name: "Hibiscus Tablets (30 count)",
        quantity: 1,
        price: 29.99,
      },
    ],
  },
  {
    id: "ORD002",
    customer: {
      id: "USR001",
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
    },
    date: "2024-05-15T00:00:00.000Z",
    status: "delivered",
    total: 29.99,
    items: [
      {
        id: "PROD001",
        name: "Hibiscus Tablets (30 count)",
        quantity: 1,
        price: 29.99,
      },
    ],
  },
  {
    id: "ORD003",
    customer: {
      id: "USR001",
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
    },
    date: "2024-06-01T00:00:00.000Z",
    status: "processing",
    total: 29.99,
    items: [
      {
        id: "PROD001",
        name: "Hibiscus Tablets (30 count)",
        quantity: 1,
        price: 29.99,
      },
    ],
  },
  {
    id: "ORD004",
    customer: {
      id: "USR002",
      name: "Michael Chen",
      email: "m.chen@example.com",
    },
    date: "2024-05-20T00:00:00.000Z",
    status: "delivered",
    total: 79.99,
    items: [
      {
        id: "PROD002",
        name: "Hibiscus Tablets (90 count)",
        quantity: 1,
        price: 79.99,
      },
    ],
  },
  {
    id: "ORD005",
    customer: {
      id: "USR002",
      name: "Michael Chen",
      email: "m.chen@example.com",
    },
    date: "2024-05-20T00:00:00.000Z",
    status: "delivered",
    total: 79.99,
    items: [
      {
        id: "PROD002",
        name: "Hibiscus Tablets (90 count)",
        quantity: 1,
        price: 79.99,
      },
    ],
  },
]

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)

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

  // In a real app, you would fetch orders from the database
  return NextResponse.json(mockOrders)
}
