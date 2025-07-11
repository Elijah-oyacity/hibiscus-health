"use client"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Check, AlertCircle, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { loadStripe } from "@stripe/stripe-js"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
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

export default function Home() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [loading, setLoading] = useState<string | null>(null) // For subscription button loading state
  const [plansLoading, setPlansLoading] = useState<boolean>(true) // For initial plans loading state
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSubscriptionPlans() {
      try {
        setPlansLoading(true)
        const data = await apiFetch("/api/subscription", {
          redirectOn403: false // Don't redirect for public subscription plans
        })
        
        setPlans(data.plans || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        console.error("Error fetching subscription plans:", err)
      } finally {
        setPlansLoading(false)
      }
    }
    
    fetchSubscriptionPlans()
  }, [])

  const handleSubscribe = async (planId: string) => {
    setLoading(planId)
    try {
      const data = await apiFetch("/api/checkout/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      })
      
      if (data.sessionId) {
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
        await stripe?.redirectToCheckout({ sessionId: data.sessionId })
      } else {
        console.error("Subscription error response:", data)
        setError(data.error || "Failed to start subscription.")
      }
    } catch (err) {
      console.error("Network or JS error:", err)
      setError(err instanceof Error ? err.message : "A network error occurred. Please try again.")
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Natural Support for <span className="gradient-heading">Healthy Blood Pressure</span>
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Our premium hibiscus supplements are scientifically formulated to help maintain healthy blood pressure
                  levels naturally.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/products">
                  <Button size="lg" className="bg-hibiscus-600 hover:bg-hibiscus-700">
                    Shop Products
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/subscriptions">
                  <Button size="lg" variant="outline">
                    View Subscriptions
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Image
                src="https://res.cloudinary.com/elijjaaahhhh/image/upload/v1747395956/kmusmgvtnomcjs2rn6ib.png"
                alt="Hibiscus Health Supplements"
                width={550}
                height={550}
                className="rounded-lg object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="w-full bg-muted py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">The Benefits of Hibiscus</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Hibiscus has been used for centuries in traditional medicine. Modern research supports its many health
                benefits.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Blood Pressure Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Studies show hibiscus may help maintain healthy blood pressure levels already within normal range.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Rich in Antioxidants</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Packed with powerful antioxidants that help combat free radicals and support overall health.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Heart Health</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  May support healthy cholesterol levels and promote cardiovascular wellness.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Subscription Plans */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Subscription Plans</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Choose a plan that works for you. Cancel anytime.
              </p>
            </div>
          </div>

          {/* Error display */}
          {error && (
            <Alert variant="destructive" className="my-6 mx-auto max-w-5xl">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error}. Please try refreshing the page.
              </AlertDescription>
            </Alert>
          )}

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
            {plansLoading ? (
              // Loading skeletons
              [...Array(3)].map((_, i) => (
                <Card key={i} className="flex flex-col">
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
              ))
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
                .map((plan) => {
                  // Format price from cents to dollars
                  const priceInDollars = (plan.price / 100).toFixed(2)
                  
                  // Calculate monthly equivalent price
                  let monthlyPrice: number
                  switch (plan.interval) {
                    case "month":
                      monthlyPrice = plan.price
                      break
                    case "quarter":
                      monthlyPrice = plan.price / 3
                      break
                    case "year":
                      monthlyPrice = plan.price / 12
                      break
                    default:
                      monthlyPrice = plan.price
                  }
                  const monthlyPriceInDollars = (monthlyPrice / 100).toFixed(2)

                  // Check if this is the "most popular" plan (typically quarterly)
                  const isPopular = plan.interval === "quarter"

                  // Get benefits based on plan interval
                  const getPlanBenefits = () => {
                    switch (plan.interval) {
                      case "month":
                        return [
                          "30-day supply",
                          "Free shipping",
                          "Cancel anytime"
                        ]
                      case "quarter":
                        return [
                          "90-day supply",
                          "Free shipping",
                          "10% savings",
                          "Cancel anytime"
                        ]
                      case "year":
                        return [
                          "365-day supply",
                          "Free shipping",
                          "15% savings",
                          "Free wellness consultation",
                          "Cancel anytime"
                        ]
                      default:
                        return [
                          "Free shipping",
                          "Cancel anytime"
                        ]
                    }
                  }
                  const benefits = getPlanBenefits()

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
                        <div className="text-3xl font-bold">${priceInDollars}</div>
                        <p className="text-sm text-muted-foreground">
                          per {plan.interval}
                          {plan.interval !== "month" && ` ($${monthlyPriceInDollars}/month)`}
                        </p>
                        <ul className="mt-4 space-y-2">
                          {benefits.map((benefit, i) => (
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
                          disabled={!!loading}
                        >
                          {loading === plan.id ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Redirecting...
                            </>
                          ) : (
                            "Subscribe Now"
                          )}
                        </Button>
                      </CardFooter>
                    </Card>
                  )
                })
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full bg-muted py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">What Our Customers Say</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Don't just take our word for it. Here's what our customers have to say.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Sarah M.</CardTitle>
                <CardDescription>Verified Customer</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  "I've been taking Hibiscus Health supplements for 3 months now, and my blood pressure readings have
                  been consistently in the healthy range. I'm so grateful!"
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Michael T.</CardTitle>
                <CardDescription>Verified Customer</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  "The subscription service is so convenient. I never have to worry about running out, and the quarterly
                  plan saves me money. Win-win!"
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Jennifer K.</CardTitle>
                <CardDescription>Verified Customer</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  "My doctor was impressed with my recent checkup results. I've been taking Hibiscus Health for 6 months
                  along with a healthy diet and exercise."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-hibiscus-50 dark:bg-hibiscus-950">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Start Your Health Journey Today
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of satisfied customers who have made Hibiscus Health a part of their daily wellness
                routine.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/products">
                <Button size="lg" className="bg-hibiscus-600 hover:bg-hibiscus-700">
                  Shop Products
                </Button>
              </Link>
              <Link href="/subscriptions">
                <Button size="lg" variant="outline">
                  View Subscriptions
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
