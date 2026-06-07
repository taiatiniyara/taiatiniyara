import type { Metadata } from "next"
import { db } from "@/lib/db"
import { services, projects, products, contacts, posts } from "@/lib/schema"
import { count } from "drizzle-orm"
import Link from "next/link"
import {
  Briefcase,
  FolderGit2,
  Box,
  MessageSquare,
  FileText,
  ChevronRight,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Admin — Taia Tiniyara",
}

async function getStats() {
  const [serviceCount] = await db.select({ count: count() }).from(services)
  const [projectCount] = await db.select({ count: count() }).from(projects)
  const [productCount] = await db.select({ count: count() }).from(products)
  const [contactCount] = await db.select({ count: count() }).from(contacts)
  const [postCount] = await db.select({ count: count() }).from(posts)

  return {
    services: serviceCount.count,
    projects: projectCount.count,
    products: productCount.count,
    contacts: contactCount.count,
    posts: postCount.count,
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold tracking-tight mb-8">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Services"
          count={stats.services}
          href="/admin/services"
          icon={Briefcase}
        />
        <StatCard
          label="Projects"
          count={stats.projects}
          href="/admin/projects"
          icon={FolderGit2}
        />
        <StatCard
          label="Products"
          count={stats.products}
          href="/admin/products"
          icon={Box}
        />
        <StatCard
          label="Messages"
          count={stats.contacts}
          href="/admin/messages"
          icon={MessageSquare}
        />
        <StatCard
          label="Blog Posts"
          count={stats.posts}
          href="/admin/posts"
          icon={FileText}
        />
      </div>
    </div>
  )
}

function StatCard({
  label,
  count,
  href,
  icon: Icon,
}: {
  label: string
  count: number
  href: string
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 rounded-lg border bg-card p-6 transition-colors hover:bg-accent/50"
    >
      <div className="flex size-10 items-center justify-center rounded-md bg-primary/10">
        <Icon className="size-5 text-primary" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-2xl font-semibold">{count}</p>
      </div>
      <ChevronRight className="size-4 text-muted-foreground" />
    </Link>
  )
}
