import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Taia Tiniyara, LLC. All rights reserved.
        </p>
        <nav className="flex gap-4 text-sm text-muted-foreground">
          <Link href="/privacy" className="hover:text-foreground">
            Privacy Policy
          </Link>
          <Link href="/#contact" className="hover:text-foreground">
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  )
}
