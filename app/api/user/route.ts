import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

// Mock data
const mockUserData = {
  subscription: {
    id: "SUB001",
    plan: "Monthly",
    status: "active",
    currentPeriodStart: "2024-05-01T00:00:00.000Z",
    currentPeriodEnd: "2024-06-01T00:00:00.000Z",
    nextBillingDate: "2024-06-01T00:00:00.000Z",
  },
  orders: [
    {
      id: "ORD001",
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
  ],
  stats: {
    totalSpent: 89.97,
    totalOrders: 3,
    memberSince: "2024-05-01T00:00:00.000Z",
  },
}

export async function GET(req: Request) {
  const session = await getServerSession()

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // In a real app, you would fetch the user's data from the database
  return NextResponse.json(mockUserData)
}
