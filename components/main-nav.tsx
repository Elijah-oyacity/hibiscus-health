import type React from "react"
import Link from "next/link"
import { Heart } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <Heart className="h-6 w-6 fill-hibiscus-600 text-hibiscus-600" />
        <span className="inline-block font-bold">Hibiscus Health</span>
      </Link>
      <nav className={cn("flex items-center space-x-6 text-sm font-medium", className)} {...props}>
        <Link href="/products" className={cn(buttonVariants({ variant: "link" }), "text-foreground")}>
          Products
        </Link>
        <Link href="/subscriptions" className={cn(buttonVariants({ variant: "link" }), "text-foreground")}>
          Subscriptions
        </Link>
        <Link href="/about" className={cn(buttonVariants({ variant: "link" }), "text-foreground")}>
          About
        </Link>
        {/* <Link href="/blog" className={cn(buttonVariants({ variant: "link" }), "text-foreground")}>
          Blog
        </Link> */}
      </nav>
    </div>
  )
}
