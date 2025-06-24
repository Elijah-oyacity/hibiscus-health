import { NextResponse } from "next/server"

// Mock data
const subscriptionPlans = [
  {
    id: "PLAN001",
    name: "Monthly",
    description: "Perfect for trying out our products",
    price: 29.99,
    interval: "month",
    stripePriceId: "price_monthly",
    productId: "PROD001",
    active: true,
  },
  {
    id: "PLAN002",
    name: "Quarterly",
    description: "Best value for regular users",
    price: 79.99,
    interval: "quarter",
    stripePriceId: "price_quarterly",
    productId: "PROD002",
    active: true,
  },
  {
    id: "PLAN003",
    name: "Annual",
    description: "Maximum savings for committed users",
    price: 299.99,
    interval: "year",
    stripePriceId: "price_annual",
    productId: "PROD002",
    active: true,
  },
]

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (id) {
    const plan = subscriptionPlans.find((p) => p.id === id)

    if (!plan) {
      return NextResponse.json({ error: "Subscription plan not found" }, { status: 404 })
    }

    return NextResponse.json(plan)
  }

  return NextResponse.json(subscriptionPlans)
}
