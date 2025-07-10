"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { loadStripe } from "@stripe/stripe-js"

// Mock data
const initialCartItems = [
  {
    id: "PROD001",
    name: "Hibiscus Tablets (30 count)",
    price: 29.99,
    quantity: 1,
    image: "https://res.cloudinary.com/elijjaaahhhh/image/upload/v1747395956/kmusmgvtnomcjs2rn6ib.png",
  },
  {
    id: "PROD003",
    name: "Hibiscus Extract (2oz)",
    price: 34.99,
    quantity: 1,
    image: "https://res.cloudinary.com/elijjaaahhhh/image/upload/v1747395956/kmusmgvtnomcjs2rn6ib.png",
  },
]

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function CartPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [cartItems, setCartItems] = useState(initialCartItems)

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/login")
    }
  }, [session, status, router])

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="container py-10">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-hibiscus-600 mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  // Don't render if not authenticated
  if (!session) {
    return null
  }

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return
    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = subtotal >= 50 ? 0 : 5.99
  const total = subtotal + shipping

  const handleCheckout = async () => {
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cartItems,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Checkout API error:", errorData)
        return
      }

      const { sessionId } = await response.json()
      
      if (!sessionId) {
        console.error("No session ID returned from checkout API")
        return
      }

      const stripe = await stripePromise

      if (stripe) {
        const { error } = await stripe.redirectToCheckout({
          sessionId,
        })

        if (error) {
          console.error("Error redirecting to checkout:", error)
        }
      }
    } catch (error) {
      console.error("Error creating checkout session:", error)
    }
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold">Your Cart</h1>
      {cartItems.length === 0 ? (
        <div className="mt-10 flex flex-col items-center justify-center space-y-4">
          <p className="text-muted-foreground">Your cart is empty</p>
          <Button asChild className="bg-hibiscus-600 hover:bg-hibiscus-700">
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-lg border">
              <div className="p-6">
                <h2 className="text-lg font-medium">Items ({cartItems.length})</h2>
                <div className="mt-6 space-y-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border">
                        <Image
                          src={"https://res.cloudinary.com/elijjaaahhhh/image/upload/v1747395956/kmusmgvtnomcjs2rn6ib.png"}
                          alt={item.name}
                          width={100}
                          height={100}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between text-base font-medium">
                          <h3>
                            <Link href={`/products/${item.id}`}>{item.name}</Link>
                          </h3>
                          <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                              <span className="sr-only">Decrease quantity</span>
                            </Button>
                            <Input
                              type="number"
                              min="1"
                              className="h-8 w-12 rounded-none border-y border-x-0 text-center"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value) || 1)}
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                              <span className="sr-only">Increase quantity</span>
                            </Button>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)}>
                            <Trash className="mr-2 h-4 w-4" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="rounded-lg border p-6">
              <h2 className="text-lg font-medium">Order Summary</h2>
              <div className="mt-6 space-y-4">
                <div className="flex justify-between">
                  <p className="text-muted-foreground">Subtotal</p>
                  <p className="font-medium">${subtotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-muted-foreground">Shipping</p>
                  <p className="font-medium">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</p>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <p className="font-medium">Total</p>
                  <p className="font-bold">${total.toFixed(2)}</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {subtotal < 50 && "Add $" + (50 - subtotal).toFixed(2) + " more for free shipping"}
                </p>
                <Button className="w-full bg-hibiscus-600 hover:bg-hibiscus-700" onClick={handleCheckout}>
                  Checkout
                </Button>
                <p className="text-center text-xs text-muted-foreground">Secure checkout powered by Stripe</p>
              </div>
            </div>
            <div className="mt-6">
              <Button asChild variant="outline" className="w-full">
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
