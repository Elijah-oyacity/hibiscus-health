import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth.config"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { AccountForm } from "@/components/account/account-form"
import { Separator } from "@/components/ui/separator"
import { db } from "@/lib/db"

export default async function AccountSettingsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login")
  }

  const user = await db.user.findUnique({
    where: {
      email: session.user.email as string,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  })

  if (!user) {
    redirect("/login")
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Account Settings" text="Manage your account settings and preferences." />
      <div className="grid gap-10">
        <div>
          <h3 className="text-lg font-medium">Profile</h3>
          <p className="text-sm text-muted-foreground">This is how others will see you on the site.</p>
          <Separator className="my-6" />
          <AccountForm user={user} />
        </div>
      </div>
    </DashboardShell>
  )
}
