"use client"

import Link from "next/link"
import Image from "next/image"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { Menu, X, ArrowRight } from "lucide-react"
import { useState } from "react"

type Props = {
  showProducts?: boolean
}

export function Navbar({ showProducts = true }: Props) {
  const [open, setOpen] = useState(false)

  const mainLinks = [
    { href: "/", label: "Home" },
    { href: "/#services", label: "Services" },
    { href: "/#portfolio", label: "Portfolio" },
    ...(showProducts ? [{ href: "/#products", label: "Products" }] : []),
    { href: "/blog", label: "Blog" },
  ]

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.svg"
            alt="Taia Tiniyara"
            width={140}
            height={32}
            className="h-8 w-auto"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {mainLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-none px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/#contact"
            className="ml-2 inline-flex items-center gap-1 rounded-none bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Start a Project
            <ArrowRight className="size-3.5" />
          </Link>
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href="/#contact"
            className="inline-flex items-center gap-1 rounded-none bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 md:hidden"
          >
            Start
            <ArrowRight className="size-3" />
          </Link>
          <ThemeToggle />
          <button
            className="rounded-none p-2 md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t bg-background px-4 py-3 md:hidden animate-in slide-in-from-top-2 fade-in-0 duration-200">
          {mainLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block rounded-none px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/#contact"
            className="mt-2 flex items-center gap-1 rounded-none bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
            onClick={() => setOpen(false)}
          >
            Start a Project
            <ArrowRight className="size-3.5" />
          </Link>
        </nav>
      )}
    </header>
  )
}
