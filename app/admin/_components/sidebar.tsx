"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Briefcase,
  FolderKanban,
  Package,
  FileText,
  MessageSquare,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet"

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/services", label: "Services", icon: Briefcase },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/posts", label: "Posts", icon: FileText },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
]

function SidebarNav({
  pathname,
  onNavigate,
}: {
  pathname: string
  onNavigate?: () => void
}) {
  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" })
    window.location.href = "/admin/login"
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b px-4">
        <Link
          href="/admin"
          className="flex items-center"
          onClick={onNavigate}
        >
          <Image
            src="/logo.svg"
            alt="Taia Tiniyara"
            width={120}
            height={28}
            className="h-7 w-auto"
            style={{ width: "auto", height: "auto" }}
          />
        </Link>
      </div>

      <nav className="flex-1 space-y-0.5 p-2">
        {links.map((link) => {
          const Icon = link.icon
          const active = pathname === link.href

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-2 rounded-none px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="size-4 shrink-0" />
              {link.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t p-2">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-none px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <LogOut className="size-4" />
          Logout
        </button>
      </div>
    </div>
  )
}

export function AdminSidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openPath, setOpenPath] = useState<string | null>(null)

  function handleOpen() {
    setMobileOpen(true)
    setOpenPath(pathname)
  }

  function handleClose() {
    setMobileOpen(false)
    setOpenPath(null)
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-56 md:shrink-0 md:flex-col md:border-r md:bg-card">
        <SidebarNav pathname={pathname} />
      </aside>

      {/* Mobile header bar */}
      <div className="flex h-14 items-center gap-2 border-b bg-card px-4 md:hidden">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleOpen}
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </Button>
        <Image
          src="/logo.svg"
          alt="Taia Tiniyara"
          width={100}
          height={24}
          className="h-6 w-auto"
          style={{ width: "auto", height: "auto" }}
        />
      </div>

      {/* Mobile sheet drawer */}
      <Sheet open={mobileOpen && openPath === pathname} onOpenChange={(v) => { if (!v) handleClose() }}>
        <SheetContent side="left" className="w-56 p-0" showCloseButton={false}>
          <SheetTitle className="sr-only">Admin Navigation</SheetTitle>
          <div className="absolute top-4 right-4 z-10">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleClose}
              aria-label="Close menu"
            >
              <X className="size-4" />
            </Button>
          </div>
          <SidebarNav
            pathname={pathname}
            onNavigate={handleClose}
          />
        </SheetContent>
      </Sheet>
    </>
  )
}
