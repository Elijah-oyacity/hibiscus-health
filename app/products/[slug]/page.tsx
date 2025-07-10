"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { notFound, useRouter } from "next/navigation"
import { Check, Heart, ShoppingCart, ArrowLeft, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

// Product type based on our prisma schema
type Product = {
  id: string
  name: string
  slug: string
  description: string
  longDescription?: string | null
  benefits?: string | null
  ingredients?: string | null
  dosage?: string | null
  price: number
  stockQuantity: number
  imageUrl: string | null
  isFeatured: boolean
}

// Fallback image
const fallbackImage = "/placeholder.svg"

export default function ProductPage({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true)
        const response = await fetch(`/api/products?slug=${params.slug}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            return notFound()
          }
          throw new Error('Failed to fetch product')
        }
        
        const data = await response.json()
        setProduct(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error('Error fetching product:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.slug])

  if (loading) {
    return (
      <div className="container py-10">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
          <div className="flex flex-col gap-4">
            <Skeleton className="aspect-square w-full rounded-lg" />
          </div>
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-8 w-1/4" />
              <Skeleton className="h-5 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-10">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <p className="text-red-500">Error loading product: {error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
          <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  if (!product) {
    return notFound()
  }

  // Extract features from benefits if available
  const features = product.benefits 
    ? product.benefits.split('\n').filter(f => f.trim().length > 0)
    : []

  return (
    <div className="container py-10">
      <Button 
        variant="ghost" 
        onClick={() => router.back()} 
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Products
      </Button>

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div className="overflow-hidden rounded-lg border bg-background">
            <Image
              src={product.imageUrl || fallbackImage}
              alt={product.name}
              width={600}
              height={600}
              className="aspect-square object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = fallbackImage;
              }}
            />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-3xl font-bold">${(product.price / 100).toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">{product.description}</p>
          </div>
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              {features.length > 0 && <TabsTrigger value="features">Benefits</TabsTrigger>}
              {(product.dosage || product.ingredients) && (
                <TabsTrigger value="usage">Usage & Ingredients</TabsTrigger>
              )}
            </TabsList>
            <TabsContent value="description" className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {product.longDescription || product.description}
                </p>
              </div>
            </TabsContent>
            {features.length > 0 && (
              <TabsContent value="features" className="space-y-4">
                <div className="space-y-2">
                  <ul className="grid gap-2">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-hibiscus-600" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
            )}
            {(product.dosage || product.ingredients) && (
              <TabsContent value="usage" className="space-y-4">
                <div className="space-y-4">
                  {product.dosage && (
                    <div>
                      <h3 className="font-medium">Recommended Usage</h3>
                      <p className="text-sm text-muted-foreground">{product.dosage}</p>
                    </div>
                  )}
                  {product.ingredients && (
                    <div>
                      <h3 className="font-medium">Ingredients</h3>
                      <p className="text-sm text-muted-foreground">{product.ingredients}</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            )}
          </Tabs>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Button 
              className="w-full bg-hibiscus-600 hover:bg-hibiscus-700"
              disabled={product.stockQuantity <= 0}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              {product.stockQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}
            </Button>
            <Button variant="outline" className="w-full">
              <Heart className="mr-2 h-4 w-4" />
              Add to Wishlist
            </Button>
          </div>
          {product.stockQuantity > 0 ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="h-4 w-4 text-green-500" />
              <span>In stock: {product.stockQuantity} available</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-red-500">
              <span>Currently out of stock</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Check className="h-4 w-4 text-green-500" />
            <span>Free shipping on orders over $50</span>
          </div>
        </div>
      </div>
    </div>
  )
}
