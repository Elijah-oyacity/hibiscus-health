import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function SubscriptionStatus() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Plan</CardTitle>
        <CardDescription>$29.99/month</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Current Period</span>
            <span className="font-medium">15 days left</span>
          </div>
          <Progress value={50} />
        </div>
        <div className="space-y-2">
          <div className="text-sm font-medium">Plan Details</div>
          <ul className="text-sm text-muted-foreground">
            <li>30-day supply of Hibiscus Tablets</li>
            <li>Free shipping</li>
            <li>Cancel anytime</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Change Plan</Button>
        <Button variant="destructive">Cancel Subscription</Button>
      </CardFooter>
    </Card>
  )
}
