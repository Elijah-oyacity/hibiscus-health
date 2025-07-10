import { NextResponse } from "next/server"
import Stripe from "stripe"
import { getServerSession } from "next-auth"
import { db } from "@/lib/db"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
})

export async function POST(req: Request) {
  try {
    console.log("[API] /api/subscription POST called")
    const session = await getServerSession()
    console.log("[API] Session:", session)

    if (!session?.user) {
      console.warn("[API] Unauthorized access attempt")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, price, interval, description } = await req.json()
    console.log("[API] Received body:", { name, price, interval, description })

    if (!name || !price || !interval || !description) {
      console.warn("[API] Missing required fields", { name, price, interval, description })
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // 1. Create product in Stripe
    let product
    try {
      product = await stripe.products.create({
        name,
        description,
      })
      console.log("[API] Stripe product created:", product)
    } catch (stripeProductErr) {
      console.error("[API] Stripe product creation failed:", stripeProductErr)
      return NextResponse.json({ error: "Stripe product creation failed" }, { status: 500 })
    }

    // 2. Create recurring price in Stripe
    let stripePrice
    try {
      stripePrice = await stripe.prices.create({
        unit_amount: Math.round(Number(price) * 100),
        currency: "usd",
        recurring: { interval },
        product: product.id,
      })
      console.log("[API] Stripe price created:", stripePrice)
    } catch (stripePriceErr) {
      console.error("[API] Stripe price creation failed:", stripePriceErr)
      return NextResponse.json({ error: "Stripe price creation failed" }, { status: 500 })
    }

    // 3. Save to database
    let plan
    try {
      plan = await db.subscriptionPlan.create({
        data: {
          name,
          description,
          price: Math.round(Number(price) * 100),
          interval,
          stripePriceId: stripePrice.id,
          productId: product.id,
          active: true,
        },
      })
      console.log("[API] Plan saved to DB:", plan)
    } catch (dbErr) {
      console.error("[API] DB save failed:", dbErr)
      return NextResponse.json({ error: "DB save failed" }, { status: 500 })
    }

    return NextResponse.json({ plan })
  } catch (error) {
    console.error("[API] Error creating subscription plan:", error)
    return NextResponse.json({ error: "Error creating subscription plan" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    console.log("[API] /api/subscription GET called")
    let session
    try {
      session = await getServerSession()
      console.log("[API] Session:", session)
    } catch (authError) {
      console.error("[API] Auth error:", authError)
      return NextResponse.json({ error: "Auth error", details: String(authError) }, { status: 500 })
    }

    if (!session?.user) {
      console.warn("[API] Unauthorized access attempt")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let plans
    try {
      plans = await db.subscriptionPlan.findMany({
        orderBy: { createdAt: "desc" },
      })
      console.log("[API] Plans fetched:", plans)
    } catch (dbError) {
      console.error("[API] DB fetch failed:", dbError)
      return NextResponse.json({ error: "DB fetch failed", details: String(dbError) }, { status: 500 })
    }

    return NextResponse.json({ plans })
  } catch (error) {
    console.error("[API] Error fetching subscription plans:", error)
    return NextResponse.json({ error: "Error fetching subscription plans", details: String(error) }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { id, ...data } = await req.json()
    if (!id) {
      return NextResponse.json({ error: "Missing plan id" }, { status: 400 })
    }
    const plan = await db.subscriptionPlan.update({
      where: { id },
      data,
    })
    return NextResponse.json({ plan })
  } catch (error) {
    console.error("[API] Error updating subscription plan:", error)
    return NextResponse.json({ error: "Error updating subscription plan" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { id } = await req.json()
    if (!id) {
      return NextResponse.json({ error: "Missing plan id" }, { status: 400 })
    }
    await db.subscriptionPlan.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[API] Error deleting subscription plan:", error)
    return NextResponse.json({ error: "Error deleting subscription plan" }, { status: 500 })
  }
}
