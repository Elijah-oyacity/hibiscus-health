import { NextResponse } from "next/server"
import Stripe from "stripe"
import { getServerSession } from "next-auth"
import { db } from "@/lib/db"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
})

export async function POST(req: Request) {
  try {
    console.log("[API] /api/checkout/subscription POST called")
    const session = await getServerSession()
    console.log("[API] Session:", session)

    if (!session?.user) {
      console.warn("[API] Unauthorized access attempt")
      return NextResponse.json({ error: "You must be logged in to subscribe" }, { status: 401 })
    }

    const { planId } = await req.json()
    console.log("[API] Received body:", { planId })

    if (!planId) {
      console.warn("[API] Missing plan ID")
      return NextResponse.json({ error: "Missing subscription plan ID" }, { status: 400 })
    }

    // Get subscription plan from database
    const plan = await db.subscriptionPlan.findUnique({
      where: { id: planId },
    })

    if (!plan || !plan.active) {
      console.warn("[API] Invalid plan ID or inactive plan:", planId)
      return NextResponse.json({ error: "Invalid subscription plan" }, { status: 400 })
    }

    // Get user from database
    const user = await db.user.findUnique({
      where: { email: session.user.email || "" },
    })

    if (!user) {
      console.warn("[API] User not found:", session.user.email)
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Create checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      billing_address_collection: "auto",
      customer_email: user.email || undefined,
      line_items: [
        {
          price: plan.stripePriceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      allow_promotion_codes: true,
      subscription_data: {
        metadata: {
          userId: user.id,
          planId: plan.id,
        },
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscriptions?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscriptions?canceled=true`,
    })

    console.log("[API] Checkout session created:", checkoutSession.id)
    return NextResponse.json({ sessionId: checkoutSession.id })
  } catch (error) {
    console.error("[API] Error creating checkout session:", error)
    return NextResponse.json(
      { error: "Error creating checkout session" }, 
      { status: 500 }
    )
  }
}
