import { NextResponse } from "next/server"
import Stripe from "stripe"

import { db } from "@/lib/db"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "whsec_test"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get("stripe-signature") as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error: any) {
    return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 })
  }

  const session = event.data.object as Stripe.Checkout.Session

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      if (session.mode === "subscription") {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string)

        await db.subscription.create({
          data: {
            userId: session.client_reference_id as string,
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: subscription.customer as string,
            subscriptionPlanId: subscription.metadata.planId,
            status: subscription.status,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
        })
      } else if (session.mode === "payment") {
        // Handle one-time payment
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id)

        const order = await db.order.create({
          data: {
            userId: session.client_reference_id as string,
            amount: session.amount_total! / 100,
            currency: session.currency as string,
            status: "completed",
            stripePaymentId: session.payment_intent as string,
            items: {
              create: lineItems.data.map((item) => ({
                productId: item.price?.product as string,
                quantity: item.quantity || 1,
                price: item.amount_total / 100,
              })),
            },
          },
        })
      }
      break

    case "invoice.payment_succeeded":
      // Update subscription status
      const invoice = event.data.object as Stripe.Invoice
      const subscriptionId = invoice.subscription as string

      if (subscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)

        await db.subscription.updateMany({
          where: {
            stripeSubscriptionId: subscriptionId,
          },
          data: {
            status: subscription.status,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
        })
      }
      break

    case "customer.subscription.updated":
      // Update subscription details
      const updatedSubscription = event.data.object as Stripe.Subscription

      await db.subscription.updateMany({
        where: {
          stripeSubscriptionId: updatedSubscription.id,
        },
        data: {
          status: updatedSubscription.status,
          currentPeriodStart: new Date(updatedSubscription.current_period_start * 1000),
          currentPeriodEnd: new Date(updatedSubscription.current_period_end * 1000),
        },
      })
      break

    case "customer.subscription.deleted":
      // Cancel subscription
      const deletedSubscription = event.data.object as Stripe.Subscription

      await db.subscription.updateMany({
        where: {
          stripeSubscriptionId: deletedSubscription.id,
        },
        data: {
          status: "canceled",
        },
      })
      break
  }

  return NextResponse.json({ received: true })
}
