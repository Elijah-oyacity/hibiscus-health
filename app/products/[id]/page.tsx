import Image from "next/image"
import { notFound } from "next/navigation"
import { Check, Heart, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data
const products = [
  {
    id: "PROD001",
    name: "Hibiscus Tablets (30 count)",
    description: "One month supply of our premium hibiscus tablets for blood pressure support.",
    longDescription:
      "Our Hibiscus Tablets are formulated with premium hibiscus extract, standardized to contain the optimal concentration of anthocyanins and other beneficial compounds. Each tablet provides 500mg of hibiscus extract, carefully processed to preserve its natural properties.\n\nHibiscus has been used for centuries in traditional medicine and modern research suggests it may help maintain healthy blood pressure levels already within normal range. Our tablets are manufactured in a GMP-certified facility and undergo rigorous testing for purity and potency.",
    price: 29.99,
    image: "/placeholder-aek36.png",
    features: [
      "500mg of premium hibiscus extract per tablet",
      "30-day supply (1 tablet daily)",
      "Standardized for consistent potency",
      "No artificial colors or preservatives",
      "Gluten-free and vegan-friendly",
      "Made in a GMP-certified facility",
    ],
    usage:
      "Take one tablet daily with water, preferably with a meal. For best results, use consistently as part of a healthy lifestyle that includes a balanced diet and regular exercise.",
    ingredients:
      "Hibiscus sabdariffa extract (flower), Microcrystalline cellulose, Vegetable capsule (hypromellose), Rice flour, Magnesium stearate (vegetable source).",
  },
  {
    id: "PROD002",
    name: "Hibiscus Tablets (90 count)",
    description: "Three month supply of our premium hibiscus tablets for blood pressure support.",
    longDescription:
      "Our Hibiscus Tablets are formulated with premium hibiscus extract, standardized to contain the optimal concentration of anthocyanins and other beneficial compounds. Each tablet provides 500mg of hibiscus extract, carefully processed to preserve its natural properties.\n\nHibiscus has been used for centuries in traditional medicine and modern research suggests it may help maintain healthy blood pressure levels already within normal range. Our tablets are manufactured in a GMP-certified facility and undergo rigorous testing for purity and potency.\n\nThis 90-count bottle provides a convenient three-month supply for those committed to their health regimen.",
    price: 79.99,
    image: "/placeholder-f17mz.png",
    features: [
      "500mg of premium hibiscus extract per tablet",
      "90-day supply (1 tablet daily)",
      "Standardized for consistent potency",
      "No artificial colors or preservatives",
      "Gluten-free and vegan-friendly",
      "Made in a GMP-certified facility",
    ],
    usage:
      "Take one tablet daily with water, preferably with a meal. For best results, use consistently as part of a healthy lifestyle that includes a balanced diet and regular exercise.",
    ingredients:
      "Hibiscus sabdariffa extract (flower), Microcrystalline cellulose, Vegetable capsule (hypromellose), Rice flour, Magnesium stearate (vegetable source).",
  },
]

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === params.id)

  if (!product) {
    notFound()
  }

  return (
    <div className="container py-10">
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div className="overflow-hidden rounded-lg border bg-background">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              width={600}
              height={600}
              className="aspect-square object-cover"
            />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-3xl font-bold">${product.price.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">{product.description}</p>
          </div>
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="usage">Usage & Ingredients</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{product.longDescription}</p>
              </div>
            </TabsContent>
            <TabsContent value="features" className="space-y-4">
              <div className="space-y-2">
                <ul className="grid gap-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-hibiscus-600" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="usage" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Recommended Usage</h3>
                  <p className="text-sm text-muted-foreground">{product.usage}</p>
                </div>
                <div>
                  <h3 className="font-medium">Ingredients</h3>
                  <p className="text-sm text-muted-foreground">{product.ingredients}</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Button className="w-full bg-hibiscus-600 hover:bg-hibiscus-700">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
            <Button variant="outline" className="w-full">
              <Heart className="mr-2 h-4 w-4" />
              Add to Wishlist
            </Button>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Check className="h-4 w-4 text-green-500" />
            <span>In stock and ready to ship</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Check className="h-4 w-4 text-green-500" />
            <span>Free shipping on orders over $50</span>
          </div>
        </div>
      </div>
    </div>
  )
}
