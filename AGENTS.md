<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Taia Tiniyara — Project Context

## What This Is
A single-page business website for **Taia Tiniyara, LLC** — a software engineering studio.
- Client services: web apps, mobile apps, APIs (TypeScript/Node.js)
- SaaS products: internal products, added over time
- Blog: engineering content, TipTap rich text editor
- Admin dashboard: CRUD all content, view contact messages

## Tech Stack
- **Next.js 16** (App Router, RSC)
- **React 19**, TypeScript 5, Tailwind CSS v4
- **shadcn/ui v4** (radix-sera style, mist base, purple primary)
- **SQLite** via **better-sqlite3 + Drizzle ORM** (db file at `data/taiatiniyara.db`)
- **R2** (Cloudflare) for images and blog content JSON (server-side upload)
- **Nodemailer** (own SMTP) for contact form
- **next-themes** (dark/light toggle)
- **TipTap** (rich text editor, content stored as JSON in R2)
- **Geist Sans + Geist Mono** fonts

## Commands
```bash
npm run dev      # Start dev server (Turbopack)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
npx drizzle-kit push    # Push schema to SQLite
npx drizzle-kit generate # Generate migrations
```

## File Structure
```
app/
  page.tsx              # Home (single page with sections)
  layout.tsx            # Root layout (fonts, metadata, html)
  globals.css           # Tailwind + shadcn theme tokens
  blog/
    page.tsx            # Blog listing (card grid, pagination)
    [slug]/
      page.tsx          # Blog post (TipTap JSON renderer)
  admin/
    layout.tsx          # Admin sidebar layout
    page.tsx            # Dashboard stats
    login/
      page.tsx          # Login form
    services/
      page.tsx          # Services CRUD
    projects/
      page.tsx          # Projects CRUD
    products/
      page.tsx          # Products CRUD
    posts/
      page.tsx          # Blog posts CRUD
    messages/
      page.tsx          # View contact messages
  privacy/
    page.tsx            # Privacy policy
  api/
    auth/
      route.ts          # Login/logout API
    upload/
      route.ts          # R2 upload handler
    contact/
      route.ts          # Contact form submission
components/
  ui/                   # shadcn components
  admin/                # Admin-specific components
  sections/             # Home page sections (Hero, Services, etc.)
  blog/                 # Blog components
  layout/               # Navbar, Footer, ThemeToggle
lib/
  utils.ts              # cn() helper
  db.ts                 # Drizzle connection
  schema.ts             # Drizzle schema
  auth.ts               # Auth helpers (cookie session, password verify)
  r2.ts                 # R2 client
  email.ts              # Nodemailer transport
  data.ts               # Public data fetching functions
data/
  taiatiniyara.db       # SQLite database (gitignored)
drizzle.config.ts       # Drizzle Kit config
docs/
  SPECS.md              # Full technical spec
  ROADMAP.md            # Implementation plan
```

## Conventions
- Use shadcn/ui components, never raw HTML inputs/buttons
- All DB queries via Drizzle in `lib/data.ts`
- Admin routes check auth via middleware or layout
- No client-side data fetching — server components + server actions
- Icon library: Lucide (already installed)
- Theme: purple primary, dark mode supported everywhere
- Images: upload to R2, store URL in DB, no local file storage

## Environment Variables
```
ADMIN_PASSWORD=...
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=...
SMTP_HOST=...
SMTP_PORT=...
SMTP_USER=...
SMTP_PASS=...
SMTP_FROM=...
```
