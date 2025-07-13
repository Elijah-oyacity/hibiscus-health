import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth.config"
import { db } from "@/lib/db"

export async function GET(req: Request) {
  try {
    console.log("[API] /api/user/subscriptions GET called")
    const session = await getServerSession(authOptions)
    console.log("[API] Session:", session)

    if (!session?.user) {
      console.warn("[API] Unauthorized access attempt")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the user's email from the session
    const email = session.user.email

    // Get user from database
    const user = await db.user.findUnique({
      where: { email: email || "" },
    })

    if (!user) {
      console.warn("[API] User not found:", email)
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get user's subscriptions including the subscription plan details
    const subscriptions = await db.userSubscription.findMany({
      where: { userId: user.id },
      include: {
        subscriptionPlan: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    console.log("[API] User subscriptions fetched:", subscriptions)
    return NextResponse.json({ subscriptions })
  } catch (error) {
    console.error("[API] Error fetching user subscriptions:", error)
    return NextResponse.json(
      { error: "Error fetching user subscriptions" }, 
      { status: 500 }
    )
  }
}
