import Link from "next/link"
import { Heart } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Heart className="h-6 w-6 fill-hibiscus-600 text-hibiscus-600" />
          <p className="text-center text-sm leading-loose md:text-left">
            &copy; {new Date().getFullYear()} Hibiscus Health. All rights reserved.
          </p>
        </div>
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-6 md:px-0">
          <nav className="flex gap-4 sm:gap-6">
            <Link href="/terms" className="text-sm font-medium underline underline-offset-4">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm font-medium underline underline-offset-4">
              Privacy
            </Link>
            <Link href="/contact" className="text-sm font-medium underline underline-offset-4">
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
