import type React from "react"
import { Mona_Sans as FontSans } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Suspense } from "react"
import { getServerSession } from "next-auth"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { cn } from "@/lib/utils"
import { AuthProvider } from "@/components/auth-provider"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

import "@/app/globals.css"

// Add environment diagnostics
console.log(`Application starting: Environment=${process.env.NODE_ENV}, Auth Secret exists=${!!process.env.NEXTAUTH_SECRET}, Database URL exists=${!!process.env.DATABASE_URL}`);

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata = {
  title: "Hibiscus Health | Natural Blood Pressure Support",
  description:
    "Premium hibiscus supplements for natural blood pressure management. Subscribe to your health journey today.",
  keywords: ["hibiscus", "blood pressure", "supplements", "health", "natural remedies"],
    generator: 'v0.dev'
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AuthProvider session={session}>
            <div className="relative flex min-h-screen flex-col">
              <SiteHeader />
              <Suspense>
                <main className="flex-1">{children}</main>
              </Suspense>
              <SiteFooter />
            </div>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
