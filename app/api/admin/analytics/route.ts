import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth.config"

import { db } from "@/lib/db"

// Mock data
const mockAnalyticsData = {
  revenue: {
    total: 15231.89,
    previousPeriod: 12680.45,
    percentChange: 20.1,
  },
  subscriptions: {
    total: 573,
    previousPeriod: 372,
    percentChange: 54.0,
    breakdown: [
      { name: "Monthly", value: 573, color: "#E11D8F" },
      { name: "Quarterly", value: 342, color: "#9D174D" },
      { name: "Annual", value: 175, color: "#500724" },
    ],
  },
  orders: {
    total: 1234,
    previousPeriod: 1037,
    percentChange: 19.0,
  },
  customers: {
    total: 2350,
    previousPeriod: 2170,
    percentChange: 8.3,
    new: 180,
  },
  revenueByMonth: [
    { name: "Jan", total: 1420.65 },
    { name: "Feb", total: 1530.85 },
    { name: "Mar", total: 1355.33 },
    { name: "Apr", total: 1921.55 },
    { name: "May", total: 2345.87 },
    { name: "Jun", total: 3201.89 },
  ],
  topProducts: [
    { id: "PROD001", name: "Hibiscus Tablets (30 count)", sales: 523, revenue: 15684.77 },
    { id: "PROD002", name: "Hibiscus Tablets (90 count)", sales: 312, revenue: 24956.88 },
    { id: "PROD003", name: "Hibiscus Extract (2oz)", sales: 287, revenue: 10042.13 },
    { id: "PROD004", name: "Hibiscus & Hawthorn Complex", sales: 198, revenue: 7918.02 },
    { id: "PROD005", name: "Hibiscus Tea (30 bags)", sales: 156, revenue: 3118.44 },
  ],
}

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

  // In a real app, you would fetch analytics data from the database
  return NextResponse.json(mockAnalyticsData)
}
