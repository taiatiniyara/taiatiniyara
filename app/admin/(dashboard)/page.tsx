import { Card } from "@/components/ui/card"
import { db } from "@/lib/db"
import { services, projects, products, posts, contacts } from "@/lib/schema"
import { sql } from "drizzle-orm"
import { Briefcase, FolderKanban, Package, FileText, MessageSquare } from "lucide-react"

export default async function DashboardPage() {
  const [servicesCount, projectsCount, productsCount, postsCount, unreadMessages] =
    await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(services),
      db.select({ count: sql<number>`count(*)` }).from(projects),
      db.select({ count: sql<number>`count(*)` }).from(products),
      db.select({ count: sql<number>`count(*)` }).from(posts),
      db
        .select({ count: sql<number>`count(*)` })
        .from(contacts)
        .where(sql`is_read = 0`),
    ])

  const stats = [
    { label: "Services", value: servicesCount[0]?.count ?? 0, icon: Briefcase },
    { label: "Projects", value: projectsCount[0]?.count ?? 0, icon: FolderKanban },
    { label: "Products", value: productsCount[0]?.count ?? 0, icon: Package },
    { label: "Posts", value: postsCount[0]?.count ?? 0, icon: FileText },
    { label: "Unread Messages", value: unreadMessages[0]?.count ?? 0, icon: MessageSquare },
  ]

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="p-4">
              <div className="flex items-center gap-3">
                <Icon className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
