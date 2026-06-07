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
  layout.tsx            # Root layout (fonts, metadata, html, JSON-LD)
  globals.css           # Tailwind + shadcn theme tokens + prose-custom
  robots.ts             # robots.txt generation
  sitemap.ts            # Dynamic sitemap.xml generation
  logo.svg              # ? Reference needed: site logo
  error.tsx             # Global error boundary (uses shared ErrorDisplay)
  loading.tsx           # Root loading state (uses shared Loading)
  blog/
    page.tsx            # Blog listing (card grid, pagination)
    loading.tsx         # Blog loading state
    [slug]/
      page.tsx          # Blog post (TipTap JSON renderer, JSON-LD, OpenGraph)
  admin/
    layout.tsx          # Admin sidebar layout + auth guard
    page.tsx            # Dashboard stats
    loading.tsx         # Admin loading state
    error.tsx           # Admin error boundary
    login/
      page.tsx          # Login form
    services/
      page.tsx          # Services CRUD table
    projects/
      page.tsx          # Projects CRUD table
    products/
      page.tsx          # Products CRUD table
    posts/
      page.tsx          # Blog posts CRUD table
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
  ui/                   # shadcn components (Button, Input)
  admin/                # Admin components (forms, sidebar, editor, upload)
    input-field.tsx     # Shared form input with optional action slot
  sections/             # Home page sections (Hero, Services, Portfolio, Products, Contact)
  blog/                 # Blog components
    tip-tap-content.tsx # Shared TipTap JSON → HTML renderer
  layout/               # Navbar, Footer, ThemeToggle, ThemeProvider, ScrollReveal
  shared/               # Shared utilities
    loading.tsx         # Shared Loading component
    error-display.tsx   # Shared ErrorDisplay component
lib/
  utils.ts              # cn() helper, parseTags()
  db.ts                 # Drizzle connection
  schema.ts             # Drizzle schema definitions
  auth.ts               # Auth helpers (cookie session, password verify)
  r2.ts                 # R2 client (upload, fetch)
  email.ts              # Nodemailer transport
  data.ts               # Public data fetching functions
  actions/              # Server actions (create, update, delete)
    services.ts
    projects.ts
    products.ts
    posts.ts
    posts-content.ts
data/
  taiatiniyara.db       # SQLite database (gitignored)
drizzle.config.ts       # Drizzle Kit config
docs/
  SPECS.md              # Full technical spec
  ROADMAP.md            # Implementation plan
```

## Coding Conventions

### Architecture
- **Server-first**: All data fetching happens in Server Components or server actions. No `"use client"` data fetching.
- **Server Components** render static content. **Client Components** (`"use client"`) only for interactivity (forms, toggles, animations).
- **Server Actions** (`"use server"` in `lib/actions/`) handle all mutations (create, update, delete).
- Admin auth guard lives in `app/admin/layout.tsx` — validates session cookie before rendering.

### Components
- **Always use shadcn/ui components** (Button, Input, etc.) — never raw HTML inputs/buttons.
- Shared/repeated code goes in `components/shared/` or `lib/utils.ts`.
- One component per file. Named exports (not default) for all components except Next.js pages.
- Use `interface` (not `type`) for component props.

### Database
- All DB queries via Drizzle ORM in `lib/data.ts` (reads) and `lib/actions/*.ts` (writes).
- Use `InferSelectModel` for type inference from schema.
- Schema in `lib/schema.ts` — run `npx drizzle-kit push` after schema changes.

### Styling
- Tailwind CSS v4 with `@theme inline` for shadcn design tokens.
- Purple primary theme (`oklch(0.491 0.27 292.581)`), dark mode via `next-themes`.
- Use `cn()` from `lib/utils.ts` for conditional class merging.
- Blog content styled with `.prose-custom` utility (defined in `globals.css`).

### SEO
- Every page MUST export `metadata` (or `generateMetadata` for dynamic routes).
- Include `openGraph` and `twitter` metadata on all public pages.
- Use `alternates.canonical` on every page.
- JSON-LD structured data: Organization on layout, BlogPosting on posts.
- `robots.ts` and `sitemap.ts` auto-generated at root.
- All images must have descriptive `alt` text.
- Use semantic HTML: `<nav>`, `<article>`, `<section>`, `<time>`, `<header>`, `<footer>`.

### Imports
- Always use `@/` path alias for internal imports (no relative `../../` chains).
- Import order: external libraries → internal modules → local components.
- Only import what you need — tree-shaking.

### Error Handling
- Use shared `ErrorDisplay` component from `components/shared/error-display.tsx` for all error boundaries.
- Use shared `Loading` component from `components/shared/loading.tsx` for all loading states.
- API routes return `NextResponse.json({ error: "message" }, { status: 4xx/5xx })`.
- Server actions use try/catch, rethrow for form state handling.

### Environment Variables
```
ADMIN_PASSWORD=...          # Admin login password
SESSION_SECRET=...          # HMAC signing secret for session cookies (default: "change-me-in-production")
NEXT_PUBLIC_SITE_URL=...    # Public site URL (e.g. https://taiatiniyara.com)
R2_ACCOUNT_ID=...           # Cloudflare R2 account ID
R2_ACCESS_KEY_ID=...        # R2 access key
R2_SECRET_ACCESS_KEY=...    # R2 secret key
R2_BUCKET_NAME=...          # R2 bucket name
R2_PUBLIC_URL=...           # R2 public URL (e.g. https://pub-xxx.r2.dev)
SMTP_HOST=...               # SMTP server host
SMTP_PORT=...               # SMTP port (587 or 465)
SMTP_USER=...               # SMTP username
SMTP_PASS=...               # SMTP password
SMTP_FROM=...               # From address for emails
```

### Documentation
- **Update docs whenever code changes.** This is non-negotiable.
- `AGENTS.md` is the primary source of truth for AI agents and developers.
- `docs/SPECS.md` documents the data models, architecture decisions, and tech choices.
- `docs/ROADMAP.md` tracks implementation progress.
- Always consult Next.js 16 docs in `node_modules/next/dist/docs/` before using Next.js APIs — this version has breaking changes.

### Git
- Never commit secrets, `.env` files, or `data/*.db*` files.
- Never commit `node_modules/` or `.next/`.
- Commit messages should be concise and descriptive.
