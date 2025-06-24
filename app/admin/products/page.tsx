import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import Link from "next/link"
import { Plus } from "lucide-react"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { ProductsTable } from "@/components/admin/products-table"
import { db } from "@/lib/db"

export default async function AdminProductsPage() {
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
    <DashboardShell>
      <DashboardHeader heading="Products" text="Manage your product catalog.">
        <Link href="/admin/products/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </DashboardHeader>
      <ProductsTable />
    </DashboardShell>
  )
}
