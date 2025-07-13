import Link from "next/link"
import { Heart, ShoppingCart } from "lucide-react"

import { MainNav } from "@/components/main-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { buttonVariants } from "@/components/ui/button"
import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth.config"
import { UserAccountDropdown } from "./user-account-dropdown"

export async function SiteHeader() {
  const session = await getServerSession(authOptions)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <MainNav />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Link
              href="/products"
              className={buttonVariants({
                variant: "ghost",
                size: "icon",
              })}
            >
              <Heart className="h-5 w-5" />
              <span className="sr-only">Products</span>
            </Link>
            <Link
              href="/cart"
              className={buttonVariants({
                variant: "ghost",
                size: "icon",
              })}
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Cart</span>
            </Link>
            <ThemeToggle />
            <UserAccountDropdown session={session} />
          </nav>
        </div>
      </div>
    </header>
  )
}
