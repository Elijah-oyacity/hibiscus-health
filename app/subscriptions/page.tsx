"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Check, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { apiFetch } from "@/lib/api-utils"

// Define the subscription plan type based on our Prisma schema
type SubscriptionPlan = {
  id: string
  name: string
  description: string
  price: number // Stored in cents in the database
  interval: string
  stripePriceId: string
  productId: string | null
  active: boolean
}

export default function SubscriptionsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [subscribingPlanId, setSubscribingPlanId] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  useEffect(() => {
    async function fetchSubscriptions() {
      try {
        setLoading(true)
        const data = await apiFetch("/api/subscription", {
          redirectOn403: false // Don't redirect for public subscription plans
        })
        
        setPlans(data.plans || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        console.error("Error fetching subscription plans:", err)
      } finally {
        setLoading(false)
      }
    }

    if (session?.user) {
      fetchSubscriptions()
    }
  }, [session])

  // Helper function to format price from cents to dollars
  const formatPrice = (price: number) => {
    return (price / 100).toFixed(2)
  }

  // Helper function to get the monthly price equivalent
  const getMonthlyPrice = (price: number, interval: string) => {
    switch (interval) {
      case "month":
        return price
      case "quarter":
        return price / 3
      case "year":
        return price / 12
      default:
        return price
    }
  }

  // Helper function to get benefits based on plan interval
  const getPlanBenefits = (plan: SubscriptionPlan) => {
    const benefits = [
      {
        interval: "month",
        benefits: [
          "30-day supply",
          "Free shipping",
          "Cancel anytime"
        ]
      },
      {
        interval: "quarter",
        benefits: [
          "90-day supply",
          "Free shipping",
          "10% savings",
          "Cancel anytime"
        ]
      },
      {
        interval: "year",
        benefits: [
          "365-day supply",
          "Free shipping",
          "15% savings",
          "Free wellness consultation",
          "Cancel anytime"
        ]
      }
    ]
    
    // Find the benefits for this plan's interval or use default
    const planBenefits = benefits.find(b => b.interval === plan.interval)?.benefits || [
      "Free shipping",
      "Cancel anytime"
    ]
    
    return planBenefits
  }

  // Loading skeletons for subscription plans
  const SubscriptionSkeleton = () => (
    <Card className="flex flex-col">
      <CardHeader>
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent className="flex-1">
        <Skeleton className="h-8 w-24 mb-2" />
        <Skeleton className="h-4 w-36 mb-6" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  )
  
  if (status === "loading") {
    return null // Don't render anything while checking auth
  }
  
  const handleSubscribe = async (planId: string) => {
    setSubscribingPlanId(planId)
    setError(null)
    try {
      const data = await apiFetch("/api/checkout/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      })
      
      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url
      } else if (data.sessionId) {
        // If only sessionId is returned but no URL, we need to create a Checkout redirect URL
        const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
        console.warn("No checkout URL returned, but sessionId exists. This requires client-side redirect.")
        
        // We would normally use Stripe.js to redirect, but for simplicity:
        window.location.href = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscriptions?success=true&session_id=${data.sessionId}`
      } else {
        throw new Error("No checkout URL or session ID returned")
      }
    } catch (err: any) {
      console.error("Subscription error:", err)
      setError(err.message || "An error occurred during checkout")
    } finally {
      setSubscribingPlanId(null)
    }
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Subscription Plans</h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          Choose a plan that works for you. Cancel anytime.
        </p>
      </div>
      
      {/* Error display */}
      {error && (
        <Alert variant="destructive" className="my-6 mx-auto max-w-5xl">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      )}
      
      {/* Subscription plans grid */}
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
        {loading ? (
          // Show skeletons while loading
          <>
            <SubscriptionSkeleton />
            <SubscriptionSkeleton />
            <SubscriptionSkeleton />
          </>
        ) : plans.length === 0 ? (
          // No plans found
          <div className="col-span-3 text-center py-12">
            <h3 className="text-xl font-medium">No subscription plans available</h3>
            <p className="text-muted-foreground mt-2">Please check back later for subscription options.</p>
          </div>
        ) : (
          // Display actual plans
          plans
            .filter(plan => plan.active)
            .sort((a, b) => {
              // Sort by interval priority (month, quarter, year)
              const intervalPriority = { "month": 1, "quarter": 2, "year": 3 }
              return (intervalPriority[a.interval as keyof typeof intervalPriority] || 99) - 
                     (intervalPriority[b.interval as keyof typeof intervalPriority] || 99)
            })
            .map((plan, index) => {
              // Check if this is the "most popular" plan (typically quarterly)
              const isPopular = plan.interval === "quarter"
              const monthlyEquivalent = getMonthlyPrice(plan.price, plan.interval)
              const planBenefits = getPlanBenefits(plan)
              
              return (
                <Card 
                  key={plan.id} 
                  className={`flex flex-col ${isPopular ? "border-hibiscus-600" : ""}`}
                >
                  <CardHeader>
                    {isPopular && (
                      <div className="text-center text-sm font-medium text-hibiscus-600">MOST POPULAR</div>
                    )}
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="text-3xl font-bold">${formatPrice(plan.price)}</div>
                    <p className="text-sm text-muted-foreground">
                      per {plan.interval}
                      {plan.interval !== "month" && ` ($${formatPrice(monthlyEquivalent)}/month)`}
                    </p>
                    <ul className="mt-4 space-y-2">
                      {planBenefits.map((benefit, i) => (
                        <li key={i} className="flex items-center">
                          <Check className="mr-2 h-4 w-4 text-hibiscus-600" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full bg-hibiscus-600 hover:bg-hibiscus-700"
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={subscribingPlanId === plan.id}
                    >
                      {subscribingPlanId === plan.id ? "Redirecting..." : "Subscribe Now"}
                    </Button>
                  </CardFooter>
                </Card>
              )
            })
        )}
      </div>
      <div className="mx-auto max-w-3xl space-y-4 text-center">
        <h2 className="text-2xl font-bold">Subscription FAQs</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">How do subscriptions work?</h3>
            <p className="text-muted-foreground">
              When you subscribe, we'll automatically ship your hibiscus supplements at the frequency you choose. Your
              payment method will be charged automatically, and you can cancel or modify your subscription at any time.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Can I cancel my subscription?</h3>
            <p className="text-muted-foreground">
              Yes, you can cancel your subscription at any time from your account dashboard. There are no cancellation
              fees or commitments.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Can I change my subscription plan?</h3>
            <p className="text-muted-foreground">
              Yes, you can upgrade, downgrade, or change your subscription plan at any time from your account dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
