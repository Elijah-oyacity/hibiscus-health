import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default async function SubscriptionsPage() {
  const session = await getServerSession()

  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Subscription Plans</h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          Choose a plan that works for you. Cancel anytime.
        </p>
      </div>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Monthly</CardTitle>
            <CardDescription>Perfect for trying out our products</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="text-3xl font-bold">$29.99</div>
            <p className="text-sm text-muted-foreground">per month</p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-hibiscus-600" />
                <span>30-day supply</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-hibiscus-600" />
                <span>Free shipping</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-hibiscus-600" />
                <span>Cancel anytime</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-hibiscus-600 hover:bg-hibiscus-700">Subscribe Now</Button>
          </CardFooter>
        </Card>
        <Card className="flex flex-col border-hibiscus-600">
          <CardHeader>
            <div className="text-center text-sm font-medium text-hibiscus-600">MOST POPULAR</div>
            <CardTitle>Quarterly</CardTitle>
            <CardDescription>Best value for regular users</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="text-3xl font-bold">$79.99</div>
            <p className="text-sm text-muted-foreground">per quarter ($26.66/month)</p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-hibiscus-600" />
                <span>90-day supply</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-hibiscus-600" />
                <span>Free shipping</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-hibiscus-600" />
                <span>10% savings</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-hibiscus-600" />
                <span>Cancel anytime</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-hibiscus-600 hover:bg-hibiscus-700">Subscribe Now</Button>
          </CardFooter>
        </Card>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Annual</CardTitle>
            <CardDescription>Maximum savings for committed users</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="text-3xl font-bold">$299.99</div>
            <p className="text-sm text-muted-foreground">per year ($25.00/month)</p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-hibiscus-600" />
                <span>365-day supply</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-hibiscus-600" />
                <span>Free shipping</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-hibiscus-600" />
                <span>15% savings</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-hibiscus-600" />
                <span>Free wellness consultation</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-hibiscus-600 hover:bg-hibiscus-700">Subscribe Now</Button>
          </CardFooter>
        </Card>
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
