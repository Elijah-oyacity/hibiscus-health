"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { signOut, useSession } from "next-auth/react"
import { User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export function UserAccountDropdown({ session }: { session: any }) {
  const { data } = useSession()
  const router = useRouter()
  const user = session?.user || data?.user

  // Debug: Show session info for troubleshooting persistence
  // Remove this after debugging
  if (typeof window !== "undefined") {
    // eslint-disable-next-line no-console
    console.log("[UserAccountDropdown] session:", session, "useSession data:", data)
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center justify-center rounded-full p-2 hover:bg-muted"
      >
        <User className="h-5 w-5" />
        <span className="sr-only">Login</span>
      </Link>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <User className="h-5 w-5" />
          <span className="sr-only">Account</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          {user.name || user.email || "Account"}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard">Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            await signOut({ callbackUrl: "/login" })
            router.refresh()
          }}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
