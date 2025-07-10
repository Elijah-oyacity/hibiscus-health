import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth.config"
import { db } from "@/lib/db"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email || "" },
      include: {
        orders: {
          orderBy: { createdAt: "desc" },
          take: 5,
          include: {
            orderItems: {
              include: {
                product: true
              }
            }
          }
        },
        subscriptions: {
          include: {
            subscriptionPlan: true,
          },
          orderBy: { createdAt: "desc" },
          take: 1,
        }
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Calculate statistics
    const totalOrders = user.orders.length
    const totalSpent = user.orders.reduce((sum, order) => sum + order.totalAmount, 0)

    // Get subscription details
    const activeSubscription = user.subscriptions[0]

    // Get monthly order data for chart
    const today = new Date()
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(today.getMonth() - 5)

    // Get all orders from the last 6 months
    const recentOrders = await db.order.findMany({
      where: {
        userId: user.id,
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
    })

    // Create monthly data for the chart
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const chartData = Array.from({ length: 6 }, (_, i) => {
      const monthIndex = (today.getMonth() - i + 12) % 12
      const year = today.getFullYear() - (monthIndex > today.getMonth() ? 1 : 0)
      
      const monthOrders = recentOrders.filter(order => {
        const orderDate = new Date(order.createdAt)
        return orderDate.getMonth() === monthIndex && orderDate.getFullYear() === year
      })
      
      const monthlyTotal = monthOrders.reduce((sum, order) => sum + order.totalAmount, 0)
      
      return {
        name: months[monthIndex],
        total: monthlyTotal / 100, // Convert from cents to dollars
      }
    }).reverse()

    const response = {
      totalOrders,
      totalSpent: totalSpent / 100, // Convert from cents to dollars
      activeSubscription: activeSubscription ? {
        name: activeSubscription.subscriptionPlan.name,
        price: activeSubscription.subscriptionPlan.price / 100, // Convert from cents to dollars
        interval: activeSubscription.subscriptionPlan.interval,
        nextBillingDate: activeSubscription.currentPeriodEnd.toISOString(),
        status: activeSubscription.status,
        daysLeft: Math.ceil(
          (new Date(activeSubscription.currentPeriodEnd).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        ),
        percentLeft: Math.round(
          (new Date(activeSubscription.currentPeriodEnd).getTime() - today.getTime()) /
          (new Date(activeSubscription.currentPeriodEnd).getTime() - new Date(activeSubscription.currentPeriodStart).getTime()) * 100
        ),
        features: [
          activeSubscription.subscriptionPlan.interval === "month" ? "30-day supply of Hibiscus Tablets" :
          activeSubscription.subscriptionPlan.interval === "quarter" ? "90-day supply of Hibiscus Tablets" :
          "365-day supply of Hibiscus Tablets",
          "Free shipping",
          activeSubscription.subscriptionPlan.interval === "quarter" ? "10% savings" :
          activeSubscription.subscriptionPlan.interval === "year" ? "15% savings" : null,
          activeSubscription.subscriptionPlan.interval === "year" ? "Free wellness consultation" : null,
          "Cancel anytime"
        ].filter(Boolean),
      } : null,
      recentOrders: user.orders.map(order => ({
        id: order.id,
        amount: order.totalAmount / 100, // Convert from cents to dollars
        status: order.status,
        date: order.createdAt.toISOString(),
        items: order.orderItems.map(item => ({
          id: item.id,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.price / 100, // Convert from cents to dollars
        })),
      })),
      chartData,
      accountCreationDate: user.createdAt.toISOString(),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("[API] Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Error fetching dashboard stats" }, { status: 500 })
  }
}