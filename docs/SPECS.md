# Specs — Taia Tiniyara Website

## Business Context

Taia Tiniyara, LLC — a software engineering studio. Two revenue streams:
- **Client services**: custom web apps, mobile apps, API development (TypeScript, Node.js)
- **SaaS products**: internal products, added as they launch

Target clients: businesses and individuals needing software built.

## Site Structure

```
/              → Home (Hero → Services → Portfolio → Products → Contact → Footer)
/blog          → Card grid, 9 posts/page, paginated
/blog/[slug]   → Individual post with TipTap JSON renderer + JSON-LD + OpenGraph
/admin         → Dashboard (stats, links to CRUD)
/admin/login   → Single-password auth with 7-day session
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
| Email | Nodemailer (own SMTP) |
| Auth | Single password via `ADMIN_PASSWORD` env var, HMAC-signed cookie session (7-day expiry) |
| Validation | Zod (server actions + forms) |
| Image | Next.js `<Image>` with R2 domain configured in `next.config.ts` |
| Animation | Custom Intersection Observer-based scroll reveal |
| Rate Limiting | Custom rate limiter on contact form and login endpoints |
| Hosting | Own VPS, manual deploy (`git pull && build && pm2 restart`) |

## Architecture

```
app/
├── layout.tsx                      # Root layout (fonts, Toaster, metadata)
├── page.tsx                        # Homepage (composes sections)
├── globals.css                     # Tailwind + shadcn theme + dark mode
├── (public)/                       # Public route group
│   ├── blog/
│   │   ├── page.tsx                # Blog listing
│   │   ├── [slug]/page.tsx         # Blog post detail
│   │   ├── _components/            # Blog-specific components
│   │   │   ├── post-card.tsx
│   │   │   ├── tip-tap-content.tsx # Renders TipTap JSON → HTML
│   │   │   └── pagination.tsx
│   │   └── _actions/              # Server actions for blog
│   │       └── posts.ts
│   ├── privacy/page.tsx
│   ├── robots.ts
│   └── sitemap.ts
├── admin/
│   ├── page.tsx                    # Dashboard
│   ├── login/page.tsx
│   ├── services/page.tsx
│   ├── projects/page.tsx
│   ├── products/page.tsx
│   ├── posts/page.tsx
│   ├── messages/page.tsx
│   ├── layout.tsx                  # Admin sidebar + auth guard
│   ├── loading.tsx
│   ├── error.tsx
│   ├── _components/               # Admin-specific components
│   │   ├── sidebar.tsx
│   │   ├── services-form.tsx
│   │   ├── projects-form.tsx
│   │   ├── products-form.tsx
│   │   ├── posts-form.tsx
│   │   ├── tip-tap-editor.tsx
│   │   ├── upload-button.tsx
│   │   └── input-field.tsx
│   └── _actions/                  # Server actions for admin
│       ├── services.ts
│       ├── projects.ts
│       ├── products.ts
│       ├── posts.ts
│       └── contacts.ts
└── api/
    ├── auth/route.ts               # Login/logout
    ├── upload/route.ts             # R2 upload handler
    └── contact/route.ts            # Contact form submission

components/
├── ui/                             # shadcn/ui primitives
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── textarea.tsx
│   ├── dialog.tsx
│   ├── alert-dialog.tsx
│   ├── alert.tsx
│   ├── accordion.tsx
│   ├── badge.tsx
│   ├── breadcrumb.tsx
│   └── checkbox.tsx
├── layout/                         # Shared layout components
│   ├── navbar.tsx
│   ├── footer.tsx
│   ├── theme-provider.tsx
│   └── theme-toggle.tsx
└── sections/                       # Homepage sections
    ├── hero.tsx
    ├── services.tsx
    ├── portfolio.tsx
    ├── products.tsx
    ├── contact.tsx
    └── scroll-to-section.tsx

lib/
├── utils.ts                        # cn() utility (clsx + tailwind-merge)
├── db.ts                           # Drizzle + better-sqlite3 connection
├── schema.ts                       # Drizzle table definitions
├── auth.ts                         # Cookie session auth (HMAC-signed)
├── r2.ts                           # Cloudflare R2 S3 client
├── email.ts                        # Nodemailer transport
├── rate-limiter.ts                 # Simple rate limiter
├── validations/                    # Zod schemas
│   ├── services.ts
│   ├── projects.ts
│   ├── products.ts
│   ├── contacts.ts
│   └── posts.ts
└── data.ts                         # Public data-fetching helpers
```

### Architecture Rules

- **lib/ = infrastructure only.** No UI, no React, no JSX. Pure server-side utilities.
- **Server actions colocated with routes.** `app/admin/_actions/` for admin CRUD, `app/blog/_actions/` for blog queries.
- **Components colocated with their pages.** `app/admin/_components/` for admin-only components, `app/blog/_components/` for blog-only components.
- **Shared components live in `components/`.** Layout (navbar/footer), sections (hero/services/etc.), and shadcn/ui primitives.
- **Validation schemas in `lib/validations/`.** Shared between server actions and client forms.

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
| contentR2Key | text | R2 object key for TipTap JSON |
| seoTitle | text | |
| seoDesc | text | |
| publishedAt | text | ISO timestamp |
| createdAt | text | ISO timestamp |
| updatedAt | text | ISO timestamp |

## Auth Design

- Single password stored in `ADMIN_PASSWORD` environment variable.
- Login page at `/admin/login` compares submitted password against env var.
- On success, sets an HMAC-signed cookie (`session`).
- Cookie signed with `SESSION_SECRET` env var (default: `change-me-in-production`).
- Session expiry: 7 days (persists across browser restarts).
- Admin layout reads cookie, validates HMAC, redirects to `/admin/login` if invalid/missing.
- Logout clears the cookie.

## Storage Design (Cloudflare R2)

- **Images**: uploaded via `/api/upload` (server-side, multipart form). Saved to R2. Public URL stored in DB.
- **Blog content**: TipTap editor outputs JSON. JSON saved to R2. `content_r2_key` stored in `posts` table.
- **Client**: `@aws-sdk/client-s3` with R2-compatible endpoint.
- **Image optimization**: `next/image` with R2 domain configured in `next.config.ts` `images.remotePatterns`.

## Form Validation

- All forms validated with Zod on the server (server actions).
- Validation schemas in `lib/validations/`.
- Client-side validation via `useActionState` and displaying Zod field errors.
- Sanitized input before DB insertion (no XSS).

## SEO Implementation

- `metadata` export on every public page (title, description, openGraph, twitter).
- `alternates.canonical` on every page.
- JSON-LD: `Organization` on root layout, `BlogPosting` on post pages.
- Auto-generated `robots.txt` via `app/robots.ts`.
- Auto-generated `sitemap.xml` via `app/sitemap.ts`.
- Semantic HTML throughout.

## Feature Flags / Conditional Rendering

- **Products section (homepage)**: hidden if 0 published products in DB.
- **Navbar "Products" link**: hidden if products section hidden.
- **Portfolio (homepage)**: shows featured projects first, falls back to all projects.
- **Blog pagination**: hidden when totalPages <= 1.

## Color Scheme

- **Light mode**: white background, zinc text, purple primary.
- **Dark mode**: zinc-900 background, zinc-50 text, purple primary.
- **Primary**: `oklch(0.491 0.27 292.581)` (purple).
- **Accent**: muted blue-gray secondary.
- **Theme**: CSS custom properties via `@theme inline` in globals.css, `.dark` class overrides.

## Rate Limiting

- Custom in-memory rate limiter in `lib/rate-limiter.ts`.
- Applied to:
  - Login endpoint (`/api/auth`) — prevents brute force.
  - Contact form submission (`/api/contact`) — prevents spam.
- Token bucket or sliding window approach. Configurable via env vars if needed.

## Email

- Nodemailer with own SMTP server.
- Contact form submissions trigger email notification to site owner.
- Environment variables: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`.

## Image Handling

- Upload via admin panel → R2 via `/api/upload`.
- Display via `next/image` with R2 domain in `next.config.ts` `images.remotePatterns`.
- Responsive sizes and srcset handled by Next.js image optimization.

## Scroll Animations

- Custom Intersection Observer-based scroll reveal component.
- Elements fade/slide in when they enter the viewport.
- No external animation library dependency.

## Environment Variables

```
ADMIN_PASSWORD=...          # Admin login password
SESSION_SECRET=...          # HMAC signing secret (default: "change-me-in-production")
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

## Out of Scope

- Automated tests (deferred post-launch)
- Analytics
- RSS feed
- Newsletter signup
- CI/CD pipeline (manual deploy only)
- User management / roles (single admin user)
- Docker / containerization
