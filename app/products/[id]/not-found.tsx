import Link from "next/link"
 
export default function NotFound() {
  return (
    <div className="container py-16 flex flex-col items-center justify-center text-center">
      <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
      <p className="text-muted-foreground mb-6">
        Sorry, we couldn't find the product you're looking for.
      </p>
      <Link 
        href="/products"
        className="px-4 py-2 bg-hibiscus-600 text-white rounded-md hover:bg-hibiscus-700"
      >
        Back to All Products
      </Link>
    </div>
  )
}
