# Specs — Taia Tiniyara Website

## Business Context

Taia Tiniyara, LLC — a software engineering studio. Two revenue streams:
- **Client services**: custom web apps, mobile apps, API development (TypeScript, Node.js)
- **SaaS products**: internal products, added as they launch

Target clients: businesses and individuals needing software built.

## Site Structure

```
/              → Home (Hero → Stats → Services → Process → Team → Portfolio → Testimonials → Products → Blog Preview → Contact → Footer)
/blog          → Card grid, 9 posts/page, paginated
/blog/[slug]   → Individual post with TipTap JSON renderer + JSON-LD + OpenGraph
/admin         → Dashboard (stats, links to CRUD)
/admin/login   → Single-password auth with 7-day session
/admin/posts/new       → New blog post
/admin/posts/[id]/edit → Edit blog post
/privacy       → Privacy policy
/robots.txt    → Auto-generated robots.txt
/sitemap.xml   → Auto-generated sitemap with blog posts
```

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, RSC) |
| UI | React 19, Tailwind CSS v4, shadcn/ui v4 (radix-sera) |
| Icons | lucide-react |
| Notifications | sonner (toast library) |
| Theme | `oklch` CSS custom properties, dark mode via `.dark` class |
| Fonts | Geist (body + code), Roboto Slab (headings), Source Serif 4 (blog posts) |
| Database | SQLite via better-sqlite3 + Drizzle ORM |
| Content | Blog body = TipTap JSON stored in R2, metadata in SQLite |
| Storage | Cloudflare R2 (images + blog JSON), server-side upload |
| Email | Nodemailer (own SMTP) with branded HTML templates |
| Auth | Single password via `ADMIN_PASSWORD` env var, HMAC-signed cookie session (7-day expiry) |
| Validation | Zod v4 (server actions + forms) |
| Image | Next.js `<Image>` with R2 domain configured in `next.config.ts` |
| Animation | Custom Intersection Observer-based scroll reveal |
| Rate Limiting | Custom fixed-window rate limiter on contact form and login endpoints |
| Security | CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy (production only) |
| Deployment | PM2 via `ecosystem.config.js`, manual deploy (`git pull && build && pm2 restart`) |

## Architecture

```
app/
├── layout.tsx                      # Root layout (fonts, metadata, viewport, Toaster, JSON-LD: Organization + WebSite)
├── globals.css                     # Tailwind + shadcn theme + dark mode + custom animations
├── loading.tsx                     # Root loading skeleton
├── error.tsx                       # Root error boundary
├── not-found.tsx                   # Custom 404 page
├── (public)/                       # Public route group
│   ├── layout.tsx                  # Public layout (navbar + footer)
│   ├── page.tsx                    # Homepage (composes sections)
│   ├── loading.tsx                 # Public loading skeleton
│   ├── error.tsx                   # Public error boundary
│   ├── blog/
│   │   ├── page.tsx                # Blog listing
│   │   ├── loading.tsx             # Blog listing loading skeleton
│   │   ├── error.tsx               # Blog error boundary
│   │   ├── [slug]/
│   │   │   ├── page.tsx            # Blog post detail (fetches JSON from R2)
│   │   │   └── loading.tsx         # Blog post loading skeleton
│   │   └── _components/            # Blog-specific components
│   │       ├── post-card.tsx
│   │       ├── tip-tap-content.tsx # Renders TipTap JSON → React elements
│   │       └── pagination.tsx
│   ├── privacy/page.tsx
│   ├── robots.ts
│   └── sitemap.ts
├── admin/
│   ├── login/page.tsx              # Standalone login page (no admin layout)
│   ├── (dashboard)/                # Protected admin route group
│   │   ├── layout.tsx              # Admin sidebar layout
│   │   ├── page.tsx                # Dashboard (counts: services, projects, products, posts, unread messages)
│   │   ├── loading.tsx             # Admin loading skeleton
│   │   ├── error.tsx               # Admin error boundary
│   │   ├── services/page.tsx       # Services CRUD list
│   │   ├── projects/page.tsx       # Projects CRUD list
│   │   ├── products/page.tsx       # Products CRUD list
│   │   ├── posts/
│   │   │   ├── page.tsx            # Posts CRUD list
│   │   │   ├── new/page.tsx        # New post form
│   │   │   └── [id]/edit/page.tsx  # Edit post form (fetches JSON from R2)
│   │   └── messages/page.tsx       # Contact messages viewer
│   ├── _components/                # Admin-specific components
│   │   ├── sidebar.tsx
│   │   ├── services-form.tsx
│   │   ├── projects-form.tsx
│   │   ├── products-form.tsx
│   │   ├── posts-form.tsx
│   │   ├── tip-tap-editor.tsx      # Rich text editor (paste-to-upload images)
│   │   ├── upload-button.tsx
│   │   ├── input-field.tsx
│   │   └── messages-list.tsx
│   └── _actions/                   # Server actions for admin CRUD
│       ├── services.ts
│       ├── projects.ts
│       ├── products.ts
│       ├── posts.ts                # Uploads TipTap JSON to R2, stores key
│       └── contacts.ts
└── api/
    ├── auth/route.ts               # Login/logout
    ├── upload/route.ts             # R2 upload handler (auth-gated)
    └── contact/route.ts            # Contact form submission + email notification

components/
├── ui/                             # shadcn/ui v4 (radix-sera) primitives
│   ├── accordion.tsx
│   ├── alert.tsx
│   ├── alert-dialog.tsx
│   ├── badge.tsx
│   ├── breadcrumb.tsx
│   ├── button.tsx
│   ├── card.tsx
│   ├── checkbox.tsx
│   ├── dialog.tsx
│   ├── input.tsx
│   ├── label.tsx
│   ├── select.tsx
│   ├── separator.tsx
│   ├── sheet.tsx
│   ├── sidebar.tsx
│   ├── skeleton.tsx
│   ├── textarea.tsx
│   └── tooltip.tsx
├── layout/                         # Shared layout components
│   ├── navbar.tsx                  # Sticky navbar, mobile hamburger, hash links
│   ├── footer.tsx
│   ├── theme-provider.tsx          # next-themes provider
│   └── theme-toggle.tsx            # Light/dark/system toggle
├── sections/                       # Homepage sections
│   ├── hero.tsx
│   ├── hero-code-window.tsx        # Animated code window (hero sub-component)
│   ├── stats.tsx                   # Project/Service/Client counts
│   ├── services.tsx                # Fetches from DB, ordered by sortOrder
│   ├── process.tsx                 # How-we-work section
│   ├── team.tsx                    # Team section
│   ├── team-ai-grid.tsx            # AI grid animation (team sub-component)
│   ├── portfolio.tsx               # Featured projects first, then all
│   ├── testimonials.tsx            # Client testimonials from projects
│   ├── products.tsx                # Conditional: hidden if 0 published products
│   ├── blog-preview.tsx            # Latest 3 blog posts
│   └── contact.tsx                 # Contact form (6 fields, toast notifications)
└── shared/
    └── scroll-reveal.tsx           # Intersection Observer scroll animation wrapper

lib/
├── utils.ts                        # cn() + safeJsonParse()
├── db.ts                           # Drizzle + better-sqlite3 connection
├── schema.ts                       # Drizzle table definitions (5 tables)
├── auth.ts                         # HMAC-signed cookie session (startup warning if default secret)
├── r2.ts                           # Cloudflare R2: uploadToR2() + getFromR2()
├── email.ts                        # Nodemailer + branded HTML email templates
├── rate-limiter.ts                 # Fixed-window in-memory rate limiter
├── validations/                    # Zod schemas (shared by server actions and forms)
│   ├── services.ts
│   ├── projects.ts
│   ├── products.ts
│   ├── contacts.ts
│   └── posts.ts
└── data.ts                         # Public data-fetching helpers (9 functions)
```

### Architecture Rules

- **lib/ = infrastructure only.** No UI, no React, no JSX. Pure server-side utilities.
- **Server actions colocated with routes.** `app/admin/_actions/` for admin CRUD.
- **Components colocated with their pages.** `app/admin/_components/` for admin-only, `app/(public)/blog/_components/` for blog-only.
- **Shared components live in `components/`.** Layout, sections, shadcn/ui primitives, and shared utilities.
- **Validation schemas in `lib/validations/`.** Single source of truth for both server actions and client forms.
- **Blog data fetching** uses `lib/data.ts` (public helpers), not separate server actions.

## Data Models (SQLite)

### services

| Field | Type | Notes |
|---|---|---|
| id | integer (PK) | autoincrement |
| title | text | |
| description | text | |
| icon | text | Lucide icon name |
| sortOrder | integer | display ordering |
| createdAt | text | ISO timestamp |
| updatedAt | text | ISO timestamp |

### projects

| Field | Type | Notes |
|---|---|---|
| id | integer (PK) | autoincrement |
| title | text | |
| description | text | |
| techStack | text | JSON array of tech tags |
| imageUrl | text | R2 image URL |
| link | text | live site or GitHub URL |
| clientName | text | |
| completedDate | text | |
| testimonial | text | |
| featured | integer | 0/1 boolean |
| sortOrder | integer | display ordering |
| createdAt | text | ISO timestamp |
| updatedAt | text | ISO timestamp |

### products

| Field | Type | Notes |
|---|---|---|
| id | integer (PK) | autoincrement |
| name | text | |
| description | text | |
| techStack | text | JSON array of tech tags |
| imageUrl | text | R2 logo/screenshot URL |
| link | text | |
| status | text | `launched`, `in-progress`, or `coming-soon` |
| featured | integer | 0/1 boolean |
| sortOrder | integer | display ordering |
| createdAt | text | ISO timestamp |
| updatedAt | text | ISO timestamp |

### contacts

| Field | Type | Notes |
|---|---|---|
| id | integer (PK) | autoincrement |
| name | text | |
| email | text | |
| projectType | text | web-app, mobile-app, api, saas, other |
| timeline | text | asap, 1-3-months, 3-6-months, exploring |
| budgetRange | text | under-5k, 5k-25k, 25k-plus |
| message | text | |
| isRead | integer | 0/1 boolean |
| createdAt | text | ISO timestamp |
| updatedAt | text | ISO timestamp |

### posts

| Field | Type | Notes |
|---|---|---|
| id | integer (PK) | autoincrement |
| title | text | |
| slug | text | unique |
| excerpt | text | |
| tags | text | JSON array |
| status | text | `draft` or `published` |
| coverUrl | text | R2 image URL |
| contentR2Key | text | R2 object key for TipTap JSON (e.g. `posts/{slug}/content.json`) |
| seoTitle | text | |
| seoDesc | text | |
| publishedAt | text | ISO timestamp |
| createdAt | text | ISO timestamp |
| updatedAt | text | ISO timestamp |

## Auth Design

- Single password stored in `ADMIN_PASSWORD` environment variable.
- Login page at `/admin/login` compares submitted password against env var.
- On success, sets an HMAC-signed cookie (`session`).
- Cookie signed with `SESSION_SECRET` env var (startup warning if default `"change-me-in-production"` is used).
- Session expiry: 7 days (persists across browser restarts).
- `proxy.ts` verifies session on all `/admin/*` routes except `/admin/login`; redirects to login if invalid.
- Logout clears the cookie.

## Storage Design (Cloudflare R2)

- **Images**: uploaded via `/api/upload` (server-side, auth-gated, multipart form). Saved to R2 at `uploads/{uuid}.{ext}`. Public URL returned and stored in DB.
- **Blog content**: TipTap editor produces JSON. Server action uploads JSON to R2 at `posts/{slug}/content.json`. Blog post detail and edit pages fetch JSON from R2 via `getFromR2()`.
- **Client**: `@aws-sdk/client-s3` with R2-compatible endpoint.
- **Image optimization**: `next/image` with R2 domain in `next.config.ts` `images.remotePatterns`.

## Form Validation

- All forms validated with Zod on the server (server actions or API routes).
- Validation schemas in `lib/validations/` — single source of truth.
- Client-side validation via `useActionState` and Zod field errors displayed in forms.
- Sanitized input before DB insertion (no XSS).

## SEO Implementation

- `metadata` export on every public page (title, description, openGraph, twitter).
- Root layout exports `metadataBase`, `viewport`, `robots`, `icons` (favicon via `/logo.svg`), and default OG/twitter images.
- All pages have `alternates.canonical` — relative paths via `metadataBase` for root, absolute for children.
- JSON-LD: `Organization` + `WebSite` (SearchAction) on root layout, `BlogPosting` + `BreadcrumbList` on post pages.
- Blog posts use `generateMetadata` (dynamic per-post: title, description, cover image, article meta tags).
- Blog listing uses `generateMetadata` (dynamic paginated: page-specific title, description, canonical).
- Blog pages use `revalidate = 3600` (ISR hourly) and `generateStaticParams` for published posts.
- Breadcrumb UI on blog post pages (Home > Blog > Post) with matching BreadcrumbList JSON-LD.
- TipTap renderer remaps heading level 1 → `<h2>` to avoid duplicate h1.
- External links use `rel="nofollow"` (portfolio, products, blog content links as `ugc`).
- TipTap editor prompts for alt text on image insertion (URL prompt + paste-to-upload).
- Auto-generated `robots.txt` via `app/(public)/robots.ts` (disallows `/admin/`).
- Auto-generated `sitemap.xml` via `app/(public)/sitemap.ts` (includes blog post slugs + images).

## Feature Flags / Conditional Rendering

- **Products section (homepage)**: hidden if 0 published products in DB.
- **Navbar "Products" link**: hidden if products section hidden.
- **Portfolio (homepage)**: shows featured projects first, falls back to all projects.
- **Blog pagination**: hidden when totalPages <= 1.

## Color Scheme

- **Light mode**: white background, neutral-950 text, rose/pink primary.
- **Dark mode**: neutral-900 background, neutral-50 text, deeper rose primary.
- **Primary**: `oklch(0.525 0.223 3.958)` — vivid rose/pink.
- **Dark primary**: `oklch(0.459 0.187 3.815)`.
- **Secondary**: muted neutral-gray.
- **Theme**: CSS custom properties via `@theme inline` in globals.css, `.dark` class overrides.

## Rate Limiting

- Fixed-window in-memory rate limiter in `lib/rate-limiter.ts`.
- Applied to:
  - Login endpoint (`/api/auth`) — 5 attempts per 60s window.
  - Contact form submission (`/api/contact`) — 3 submissions per 60s window.
- Resets on server restart (acceptable for single-instance PM2 deploy).

## Email

- Nodemailer with own SMTP server.
- Branded HTML email templates (rose/pink palette matching app theme).
- Contact form submissions trigger email notification to `NOTIFICATION_EMAIL` (default: `taiatiniyara@gmail.com`).
- Plain-text fallback included for clients that block HTML.
- Email includes all form fields: name, email, project type, timeline, budget, message.
- Reply-to set to submitter's email for direct replies.

## Image Handling

- Upload via admin panel → R2 via `/api/upload`.
- Paste-to-upload in TipTap editor: pasting an image uploads to R2 and inserts the URL.
- Display via `next/image` with R2 domain in `next.config.ts` `images.remotePatterns`.
- Responsive sizes and srcset handled by Next.js image optimization.

## Scroll Animations

- Custom Intersection Observer-based scroll reveal component (`components/shared/scroll-reveal.tsx`).
- Elements fade/slide in when they enter the viewport.
- `html { scroll-behavior: smooth; }` for hash-link smooth scrolling.
- No external animation library dependency.

## Security Headers

Applied via `next.config.ts` `headers()` — conditional by environment:

- **Always**: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- **Production only**: `Strict-Transport-Security` (2-year max-age, includeSubDomains, preload), `Content-Security-Policy` (restrictive with self/default, unsafe-inline scripts/styles for JSON-LD, https: images, form-action 'self', frame-ancestors 'none')

## Environment Variables

```
ADMIN_PASSWORD=...          # Admin login password
SESSION_SECRET=...          # HMAC signing secret (startup warns if default)
NEXT_PUBLIC_SITE_URL=...    # Public site URL (must be set at build time)
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
NOTIFICATION_EMAIL=...      # Where contact notifications go (default: taiatiniyara@gmail.com)
```

## Out of Scope

- Automated tests (deferred post-launch)
- Analytics
- RSS feed
- Newsletter signup
- CI/CD pipeline (manual deploy only)
- User management / roles (single admin user)
- Docker / containerization
