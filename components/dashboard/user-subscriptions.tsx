"use client"

import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { CalendarDays, CreditCard } from "lucide-react"
import { Badge } from "@/components/ui/badge"

type UserSubscription = {
  id: string
  status: string
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  stripeSubscriptionId: string
  subscriptionPlan: {
    id: string
    name: string
    description: string
    price: number
    interval: string
    stripePriceId: string
    productId: string | null
    active: boolean
  }
}

export function UserSubscriptions() {
  const { toast } = useToast()
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUserSubscriptions() {
      try {
        setLoading(true)
        
        // Mock subscription data for demo purposes
        // In a real app, we would fetch from API: const response = await fetch("/api/user/subscriptions")
        const mockSubscriptions = [
          {
            id: "sub_123456",
            status: "active",
            currentPeriodStart: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
            currentPeriodEnd: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
            cancelAtPeriodEnd: false,
            stripeSubscriptionId: "sub_mock123",
            subscriptionPlan: {
              id: "plan_monthly",
              name: "Monthly Plan",
              description: "Perfect for trying out our products",
              price: 2999, // $29.99
              interval: "month",
              stripePriceId: "price_monthly",
              productId: "prod_123",
              active: true
            }
          }
        ];
        
        // Uncomment the below lines and remove mock data when API is ready
        // const response = await fetch("/api/user/subscriptions")
        // if (!response.ok) {
        //   throw new Error("Failed to fetch your subscriptions")
        // }
        // const data = await response.json()
        // setSubscriptions(data.subscriptions || [])
        
        setSubscriptions(mockSubscriptions);
        
      } catch (err) {
        toast({
          title: "Error",
          description: err instanceof Error ? err.message : "Failed to load subscriptions",
          variant: "destructive",
        })
        console.error("Error fetching subscriptions:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserSubscriptions()
  }, [toast])

  // Format price from cents to dollars
  const formatPrice = (price: number) => {
    return (price / 100).toFixed(2)
  }

  // Calculate days remaining in subscription period
  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate)
    const now = new Date()
    const diffTime = end.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  // Calculate progress percentage for subscription period
  const getProgressPercentage = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const now = new Date()
    
    const totalDuration = end.getTime() - start.getTime()
    const elapsed = now.getTime() - start.getTime()
    
    let percentage = (elapsed / totalDuration) * 100
    
    // Ensure percentage is between 0 and 100
    percentage = Math.max(0, Math.min(100, percentage))
    
    return Math.round(percentage)
  }

  // Get benefits based on subscription interval
  const getPlanBenefits = (interval: string) => {
    switch(interval) {
      case "month":
        return ["30-day supply", "Free shipping", "Cancel anytime"]
      case "quarter":
        return ["90-day supply", "Free shipping", "10% savings", "Cancel anytime"]
      case "year":
        return ["365-day supply", "Free shipping", "15% savings", "Free wellness consultation", "Cancel anytime"]
      default:
        return ["Free shipping", "Cancel anytime"]
    }
  }

  // Cancel subscription
  const handleCancelSubscription = async (subscriptionId: string) => {
    if (!confirm("Are you sure you want to cancel this subscription?")) return
    
    try {
      // For demo purposes, we'll simulate a successful cancellation
      // In a real app, we would call the API
      // const response = await fetch("/api/user/subscriptions/cancel", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ subscriptionId }),
      // })

      // if (!response.ok) {
      //   const error = await response.json()
      //   throw new Error(error.message || "Failed to cancel subscription")
      // }
      
      // Update local state to simulate cancellation
      setSubscriptions(subscriptions.map(sub => {
        if (sub.stripeSubscriptionId === subscriptionId) {
          return {
            ...sub,
            cancelAtPeriodEnd: true
          };
        }
        return sub;
      }));

      toast({
        title: "Subscription canceled",
        description: "Your subscription will remain active until the end of the current billing period.",
      })

    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to cancel subscription",
        variant: "destructive",
      })
    }
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-500"
      case "trialing":
        return "bg-blue-500"
      case "past_due":
        return "bg-amber-500"
      case "canceled":
        return "bg-red-500"
      case "incomplete":
      case "incomplete_expired":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-40 mb-2" />
          <Skeleton className="h-4 w-60" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-2 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </CardFooter>
      </Card>
    )
  }

  if (subscriptions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Active Subscriptions</CardTitle>
          <CardDescription>
            You don't have any active subscriptions. Browse our subscription plans to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Subscribe to Hibiscus Health products for regular deliveries and exclusive benefits.
          </p>
        </CardContent>
        <CardFooter>
          <Button 
            className="bg-hibiscus-600 hover:bg-hibiscus-700 w-full"
            onClick={() => window.location.href = "/subscriptions"}
          >
            Browse Subscription Plans
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <>
      {subscriptions.map((subscription) => {
        const daysRemaining = getDaysRemaining(subscription.currentPeriodEnd)
        const progressPercentage = getProgressPercentage(
          subscription.currentPeriodStart,
          subscription.currentPeriodEnd
        )
        const planBenefits = getPlanBenefits(subscription.subscriptionPlan.interval)
        
        return (
          <Card key={subscription.id} className="mb-4">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{subscription.subscriptionPlan.name}</CardTitle>
                  <CardDescription>
                    ${formatPrice(subscription.subscriptionPlan.price)}/{subscription.subscriptionPlan.interval}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(subscription.status)}>
                  {subscription.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {subscription.status === "active" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center">
                      <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
                      Current Period
                    </span>
                    <span className="font-medium">{daysRemaining} days left</span>
                  </div>
                  <Progress value={progressPercentage} />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Renews: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}</span>
                    {subscription.cancelAtPeriodEnd && (
                      <span className="text-red-500">Cancels at period end</span>
                    )}
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <div className="text-sm font-medium flex items-center">
                  <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
                  Plan Details
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {planBenefits.map((benefit, i) => (
                    <li key={i} className="flex items-center">
                      <span className="text-hibiscus-600 mr-2">•</span> {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline"
                onClick={() => window.location.href = "/subscriptions"}
              >
                Change Plan
              </Button>
              {subscription.status === "active" && !subscription.cancelAtPeriodEnd && (
                <Button 
                  variant="destructive"
                  onClick={() => handleCancelSubscription(subscription.stripeSubscriptionId)}
                >
                  Cancel Subscription
                </Button>
              )}
            </CardFooter>
          </Card>
        )
      })}
    </>
  )
}
