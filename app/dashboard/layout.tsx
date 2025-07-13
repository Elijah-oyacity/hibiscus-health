import type React from "react"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth.config"
import Link from "next/link"
import { CreditCard, Home, Package, Settings, User, ShoppingBag } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr]">
      <aside className="hidden w-[200px] flex-col md:flex lg:w-[240px]">
        <nav className="grid items-start gap-2 py-4">
          <Link href="/dashboard" className={cn(buttonVariants({ variant: "ghost" }), "justify-start")}>
            <Home className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
          <Link href="/dashboard/orders" className={cn(buttonVariants({ variant: "ghost" }), "justify-start")}>
            <Package className="mr-2 h-4 w-4" />
            Orders
          </Link>
          <Link href="/dashboard/products" className={cn(buttonVariants({ variant: "ghost" }), "justify-start")}>
            <ShoppingBag className="mr-2 h-4 w-4" />
            Products
          </Link>
          <Link href="/dashboard/subscriptions" className={cn(buttonVariants({ variant: "ghost" }), "justify-start")}>
            <CreditCard className="mr-2 h-4 w-4" />
            Subscriptions
          </Link>
          <Link href="/account" className={cn(buttonVariants({ variant: "ghost" }), "justify-start")}>
            <User className="mr-2 h-4 w-4" />
            Account
          </Link>
          <Link href="/account/settings" className={cn(buttonVariants({ variant: "ghost" }), "justify-start")}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </nav>
      </aside>
      <main className="flex w-full flex-col overflow-hidden">{children}</main>
    </div>
  )
}
