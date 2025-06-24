import type React from "react"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import Link from "next/link"
import { BarChart, CreditCard, Home, Package, Settings, ShoppingCart, Users } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { db } from "@/lib/db"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await getServerSession()

  if (!session?.user) {
    redirect("/login")
  }

  // Check if user is admin
  const user = await db.user.findUnique({
    where: {
      email: session.user.email as string,
    },
    select: {
      role: true,
    },
  })

  if (user?.role !== "ADMIN") {
    redirect("/dashboard")
  }

  return (
    <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr]">
      <aside className="hidden w-[200px] flex-col md:flex lg:w-[240px]">
        <nav className="grid items-start gap-2 py-4">
          <Link href="/admin/dashboard" className={cn(buttonVariants({ variant: "ghost" }), "justify-start")}>
            <Home className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
          <Link href="/admin/products" className={cn(buttonVariants({ variant: "ghost" }), "justify-start")}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Products
          </Link>
          <Link href="/admin/orders" className={cn(buttonVariants({ variant: "ghost" }), "justify-start")}>
            <Package className="mr-2 h-4 w-4" />
            Orders
          </Link>
          <Link href="/admin/subscriptions" className={cn(buttonVariants({ variant: "ghost" }), "justify-start")}>
            <CreditCard className="mr-2 h-4 w-4" />
            Subscriptions
          </Link>
          <Link href="/admin/customers" className={cn(buttonVariants({ variant: "ghost" }), "justify-start")}>
            <Users className="mr-2 h-4 w-4" />
            Customers
          </Link>
          <Link href="/admin/analytics" className={cn(buttonVariants({ variant: "ghost" }), "justify-start")}>
            <BarChart className="mr-2 h-4 w-4" />
            Analytics
          </Link>
          <Link href="/admin/settings" className={cn(buttonVariants({ variant: "ghost" }), "justify-start")}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </nav>
      </aside>
      <main className="flex w-full flex-col overflow-hidden">{children}</main>
    </div>
  )
}
