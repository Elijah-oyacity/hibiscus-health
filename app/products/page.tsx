import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// Mock data
const products = [
  {
    id: "PROD001",
    name: "Hibiscus Tablets (30 count)",
    description: "One month supply of our premium hibiscus tablets for blood pressure support.",
    price: 29.99,
    image: "https://res.cloudinary.com/elijjaaahhhh/image/upload/v1747395956/kmusmgvtnomcjs2rn6ib.png",
  },
  {
    id: "PROD002",
    name: "Hibiscus Tablets (90 count)",
    description: "Three month supply of our premium hibiscus tablets for blood pressure support.",
    price: 79.99,
    image: "https://res.cloudinary.com/elijjaaahhhh/image/upload/v1747395956/kmusmgvtnomcjs2rn6ib.png",
  },
  {
    id: "PROD003",
    name: "Hibiscus Extract (2oz)",
    description: "Concentrated hibiscus extract in liquid form for maximum absorption.",
    price: 34.99,
    image: "https://res.cloudinary.com/elijjaaahhhh/image/upload/v1747395956/kmusmgvtnomcjs2rn6ib.png",
  },
  {
    id: "PROD004",
    name: "Hibiscus & Hawthorn Complex",
    description: "Advanced formula combining hibiscus with hawthorn for comprehensive heart health support.",
    price: 39.99,
    image: "https://res.cloudinary.com/elijjaaahhhh/image/upload/v1747395956/kmusmgvtnomcjs2rn6ib.png",
  },
  {
    id: "PROD005",
    name: "Hibiscus Tea (30 bags)",
    description: "Premium hibiscus tea bags for a delicious way to support healthy blood pressure.",
    price: 19.99,
    image: "https://res.cloudinary.com/elijjaaahhhh/image/upload/v1747395956/kmusmgvtnomcjs2rn6ib.png",
  },
]

export default function ProductsPage() {
  return (
    <div className="container py-10">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Products</h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          Premium hibiscus supplements formulated to support healthy blood pressure naturally.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id} className="flex flex-col overflow-hidden">
            <div className="aspect-square overflow-hidden">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                width={300}
                height={300}
                className="h-full w-full object-cover transition-transform hover:scale-105"
              />
            </div>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-muted-foreground">{product.description}</p>
              <p className="mt-4 text-2xl font-bold">${product.price.toFixed(2)}</p>
            </CardContent>
            <CardFooter className="flex gap-2">
              {/* <Button asChild className="w-full bg-hibiscus-600 hover:bg-hibiscus-700">
                <Link href={`/products/${product.id}`}>View Details</Link>
              </Button> */}
              <Button variant="outline" className="w-full">
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
