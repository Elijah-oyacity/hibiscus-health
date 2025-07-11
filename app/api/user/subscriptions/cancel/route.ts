import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { db } from "@/lib/db"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
})

export async function POST(req: Request) {
  try {
    console.log("[API] /api/user/subscriptions/cancel POST called")
    const session = await getServerSession()
    console.log("[API] Session:", session)

    if (!session?.user) {
      console.warn("[API] Unauthorized access attempt")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the request body
    const { subscriptionId } = await req.json()
    console.log("[API] Received body:", { subscriptionId })

    if (!subscriptionId) {
      console.warn("[API] Missing subscription ID")
      return NextResponse.json({ error: "Missing subscription ID" }, { status: 400 })
    }

    // Get user from database
    const user = await db.user.findUnique({
      where: { email: session.user.email || "" },
    })

    if (!user) {
      console.warn("[API] User not found:", session.user.email)
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Verify the subscription belongs to the user
    const userSubscription = await db.userSubscription.findFirst({
      where: {
        userId: user.id,
        stripeSubscriptionId: subscriptionId,
      },
    })

    if (!userSubscription) {
      console.warn("[API] Subscription not found or does not belong to user")
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 })
    }

    // Cancel the subscription with Stripe
    // This will allow the subscription to remain active until the end of the current period
    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    })

    // Update the subscription in our database
    await db.userSubscription.update({
      where: {
        id: userSubscription.id,
      },
      data: {
        cancelAtPeriodEnd: true,
      },
    })

    return NextResponse.json({ 
      success: true,
      message: "Subscription will be canceled at the end of the billing period" 
    })
  } catch (error) {
    console.error("[API] Error canceling subscription:", error)
    return NextResponse.json(
      { error: "Error canceling subscription" }, 
      { status: 500 }
    )
  }
}
