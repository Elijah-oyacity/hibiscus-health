"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (sessionId) {
      // In a real app, you would fetch the order details from your API
      // For now, we'll simulate it with a timeout
      const timer = setTimeout(() => {
        setOrderDetails({
          id: "ORD" + Math.floor(Math.random() * 10000),
          date: new Date().toISOString(),
          total: 64.98,
          items: [
            {
              name: "Hibiscus Tablets (30 count)",
              quantity: 1,
              price: 29.99,
            },
            {
              name: "Hibiscus Extract (2oz)",
              quantity: 1,
              price: 34.99,
            },
          ],
        })
        setLoading(false)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [sessionId])

  if (loading) {
    return (
      <div className="container flex h-[70vh] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Processing Your Order</CardTitle>
            <CardDescription>Please wait while we confirm your payment...</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-hibiscus-200 border-t-hibiscus-600" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!orderDetails) {
    return (
      <div className="container flex h-[70vh] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Order Not Found</CardTitle>
            <CardDescription>We couldn't find your order details.</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button asChild className="bg-hibiscus-600 hover:bg-hibiscus-700">
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Order Confirmed!</CardTitle>
            <CardDescription>
              Thank you for your purchase. Your order has been received and is being processed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg border p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Order Number</p>
                  <p className="font-medium">{orderDetails.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{new Date(orderDetails.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="font-medium">${orderDetails.total.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment</p>
                  <p className="font-medium">Credit Card</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="mb-2 font-medium">Order Summary</h3>
              <div className="space-y-2">
                {orderDetails.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between">
                    <p>
                      {item.name} x {item.quantity}
                    </p>
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm">
                A confirmation email has been sent to your email address. You can also view your order details in your
                account dashboard.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:space-x-2 sm:space-y-0">
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/dashboard">View Order History</Link>
            </Button>
            <Button asChild className="w-full bg-hibiscus-600 hover:bg-hibiscus-700 sm:w-auto">
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
