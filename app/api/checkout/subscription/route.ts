import { NextResponse } from "next/server"
import Stripe from "stripe"
import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth.config"
import { db } from "@/lib/db"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
})

export async function POST(req: Request) {
  try {
    console.log("[API] /api/checkout/subscription POST called")
    const session = await getServerSession(authOptions)
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

    // Verify the Stripe price exists before creating checkout session
    try {
      await stripe.prices.retrieve(plan.stripePriceId);
    } catch (priceError) {
      console.error("[API] Stripe price not found:", plan.stripePriceId);
      
      // Instead of using the invalid price ID, we can create a new price for this plan
      try {
        // First, create or get a product
        const product = await stripe.products.create({
          name: plan.name,
          description: plan.description,
        });

        // Then create a price for that product
        // Convert our plan interval to Stripe's supported intervals (month, year, week, day)
        let stripeInterval: 'month' | 'year' | 'week' | 'day' = 'month';
        let intervalCount = 1;
        
        if (plan.interval === 'quarter') {
          stripeInterval = 'month';
          intervalCount = 3;
        } else if (plan.interval === 'month' || plan.interval === 'year') {
          stripeInterval = plan.interval as 'month' | 'year';
        }
        
        const price = await stripe.prices.create({
          unit_amount: plan.price,
          currency: 'usd',
          recurring: {
            interval: stripeInterval,
            interval_count: intervalCount,
          },
          product: product.id,
        });

        // Update the plan in the database with the new stripe price ID
        await db.subscriptionPlan.update({
          where: { id: plan.id },
          data: {
            stripePriceId: price.id,
            productId: product.id,
          }
        });

        // Update our local plan object with the new price ID
        plan.stripePriceId = price.id;
        
        console.log(`[API] Created new Stripe price: ${price.id} for plan: ${plan.id}`);
      } catch (createPriceError) {
        console.error("[API] Failed to create new Stripe price:", createPriceError);
        return NextResponse.json({ 
          error: "Invalid price configuration in subscription plan. Please contact support." 
        }, { status: 500 });
      }
    }
    
    // Create checkout session with verified or newly created price
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
    return NextResponse.json({ 
      sessionId: checkoutSession.id,
      url: checkoutSession.url  // Include the URL to redirect the user
    })
  } catch (error) {
    console.error("[API] Error creating checkout session:", error)
    return NextResponse.json(
      { error: "Error creating checkout session" }, 
      { status: 500 }
    )
  }
}
