import Database from "better-sqlite3"
import { drizzle } from "drizzle-orm/better-sqlite3"
import { services } from "../lib/schema"

const sqlite = new Database("data/taiatiniyara.db")
sqlite.pragma("journal_mode = WAL")
const db = drizzle(sqlite)

const now = new Date().toISOString()

const data = [
  {
    title: "Web Application Development",
    description: "Full‑stack web apps built with React, Next.js, and Node.js. Responsive, fast, and accessible on every device.",
    icon: "Code",
    sortOrder: 1,
  },
  {
    title: "Mobile App Development",
    description: "Cross‑platform mobile experiences using React Native. One codebase, native feel on iOS and Android.",
    icon: "Smartphone",
    sortOrder: 2,
  },
  {
    title: "API Development",
    description: "REST and GraphQL APIs designed for scale. Rate‑limiting, auth, caching, and documentation included.",
    icon: "Server",
    sortOrder: 3,
  },
  {
    title: "Database Design",
    description: "Schema architecture, migrations, indexing, and query optimization for SQLite, PostgreSQL, and beyond.",
    icon: "Database",
    sortOrder: 4,
  },
  {
    title: "UI / UX Design",
    description: "User‑centered interfaces with shadcn/ui, Radix primitives, and Tailwind CSS. Dark mode included.",
    icon: "Globe",
    sortOrder: 5,
  },
  {
    title: "Cloud & DevOps",
    description: "Deployment pipelines, Cloudflare R2 storage, Vercel hosting, CI/CD, and infrastructure as code.",
    icon: "Shield",
    sortOrder: 6,
  },
]

async function seed() {
  console.log("Seeding services...")

  for (const item of data) {
    await db.insert(services).values({
      ...item,
      createdAt: now,
      updatedAt: now,
    })
  }

  console.log(`Inserted ${data.length} services.`)
  process.exit(0)
}

seed()
