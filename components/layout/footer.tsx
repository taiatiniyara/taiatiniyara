import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Taia Tiniyara, LLC. All rights reserved.
          </p>
          <nav className="flex items-center gap-6 text-sm text-muted-foreground" aria-label="Footer navigation">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/blog" className="hover:text-foreground transition-colors">
              Blog
            </Link>
            <a
              href="mailto:hello@taiatiniyara.com"
              className="hover:text-foreground transition-colors"
              rel="noopener"
            >
              hello@taiatiniyara.com
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
