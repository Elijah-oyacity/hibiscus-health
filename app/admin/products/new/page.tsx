import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ProductForm } from "@/components/admin/product-form"
import { db } from "@/lib/db"

export default async function NewProductPage() {
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
      <DashboardHeader heading="Add Product" text="Create a new product in your catalog." />
      <div className="grid gap-8">
        <ProductForm />
      </div>
    </DashboardShell>
  )
}
