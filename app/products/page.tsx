"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

// Fallback image
const fallbackImage = "/placeholder.svg"

// Product type definition based on our schema
type Product = {
  id: string
  name: string
  slug: string
  description: string
  price: number
  imageUrl: string | null
  stockQuantity: number
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)
        const response = await fetch('/api/products')
        
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        
        const data = await response.json()
        setProducts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error('Error fetching products:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])
  // Function to render product cards with loading skeletons
  const renderProductGrid = () => {
    if (loading) {
      // Show loading skeletons while fetching products
      return Array(6).fill(0).map((_, index) => (
        <Card key={`skeleton-${index}`} className="flex flex-col overflow-hidden">
          <div className="aspect-square overflow-hidden">
            <Skeleton className="h-[300px] w-full" />
          </div>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
          </CardHeader>
          <CardContent className="flex-1">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6 mb-2" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-8 w-1/3 mt-4" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      ))
    }

    if (error) {
      return (
        <div className="col-span-full text-center py-12">
          <p className="text-red-500 mb-4">Failed to load products: {error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      )
    }

    if (products.length === 0) {
      return (
        <div className="col-span-full text-center py-12">
          <p className="text-muted-foreground mb-4">No products available at this time.</p>
        </div>
      )
    }

    // Display actual products
    return products.map((product) => (
      <Card key={product.id} className="flex flex-col overflow-hidden">
        <div className="aspect-square overflow-hidden">
          <Image
            src={product.imageUrl || fallbackImage}
            alt={product.name}
            width={300}
            height={300}
            className="h-full w-full object-cover transition-transform hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = fallbackImage;
            }}
          />
        </div>
        <CardHeader>
          <CardTitle>{product.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <p className="text-muted-foreground">{product.description}</p>
          <p className="mt-4 text-2xl font-bold">${(product.price / 100).toFixed(2)}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {product.stockQuantity > 0 
              ? `In stock: ${product.stockQuantity}` 
              : "Out of stock"}
          </p>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button asChild className="w-full bg-hibiscus-600 hover:bg-hibiscus-700">
            <Link href={`/products/${product.slug}`}>View Details</Link>
          </Button>
          <Button 
            variant="outline" 
            className="w-full"
            disabled={product.stockQuantity <= 0}
          >
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    ))
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Products</h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          Premium hibiscus supplements formulated to support healthy blood pressure naturally.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
        {renderProductGrid()}
      </div>
    </div>
  )
}
