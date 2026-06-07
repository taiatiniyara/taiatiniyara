"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Briefcase,
  FolderGit2,
  Box,
  MessageSquare,
  FileText,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect, startTransition } from "react"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/services", label: "Services", icon: Briefcase },
  { href: "/admin/projects", label: "Projects", icon: FolderGit2 },
  { href: "/admin/products", label: "Products", icon: Box },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/posts", label: "Blog Posts", icon: FileText },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    startTransition(() => setOpen(false))
  }, [pathname])

  async function handleLogout() {
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    })
    window.location.href = "/admin/login"
  }

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  const sidebarNav = (
    <>
      <div className="p-6">
        <Link
          href="/admin"
          className="text-lg font-semibold tracking-tight"
          onClick={() => setOpen(false)}
        >
          Taia Admin
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-3" aria-label="Admin navigation">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive(item.href, item.exact)
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="size-4 shrink-0" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-3">
        <Button
          variant="ghost"
          className="w-full justify-start"
          size="sm"
          onClick={handleLogout}
        >
          <LogOut className="size-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </>
  )

  return (
    <>
      <Button
        variant="ghost"
        size="icon-sm"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close sidebar" : "Open sidebar"}
        aria-expanded={open}
      >
        {open ? <X className="size-4" /> : <Menu className="size-4" />}
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-background transition-transform duration-200 ease-out lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarNav}
      </aside>
    </>
  )
}
