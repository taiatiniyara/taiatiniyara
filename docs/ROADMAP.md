# Roadmap — Taia Tiniyara Website

## Legend

- `[ ]` Not started
- `[~]` In progress
- `[x]` Done

---

## Phase 1: Foundation

> DB connection, auth, and both layouts (public + admin). Nothing public-facing renders yet beyond placeholder layouts.

### Database

- [x] `lib/db.ts` — Drizzle + better-sqlite3 connection
- [x] `lib/schema.ts` — All 5 table definitions (services, projects, products, contacts, posts)
- [x] `drizzle.config.ts` — Drizzle Kit config
- [x] `npm run db:push` script — push schema to SQLite

### Auth

- [x] `lib/auth.ts` — HMAC-signed cookie session (sign, verify, getSession), startup warning if default secret
- [x] `ADMIN_PASSWORD` + `SESSION_SECRET` env var handling
- [x] `app/api/auth/route.ts` — POST login (compare password, set 7-day cookie), POST logout (clear cookie)
- [x] `app/admin/login/page.tsx` — Login form UI
- [x] `proxy.ts` — Auth gate for admin routes (verify session, redirect to login)
- [x] `app/admin/(dashboard)/layout.tsx` — Admin sidebar layout (links: Dashboard, Services, Projects, Products, Posts, Messages)

### Layouts

- [x] `app/layout.tsx` — Metadata (site name, description, openGraph), fonts + Toaster + theme + JSON-LD
- [x] `components/layout/theme-provider.tsx` — next-themes provider (system + manual toggle)
- [x] `components/layout/theme-toggle.tsx` — Dark/light/system toggle button
- [x] `components/layout/navbar.tsx` — Public navbar (logo, nav links, theme toggle, mobile hamburger)
- [x] `components/layout/footer.tsx` — Public footer (copyright, links)
- [x] `app/admin/_components/sidebar.tsx` — Admin sidebar component

### Shared Infrastructure

- [x] `lib/rate-limiter.ts` — Fixed-window in-memory rate limiter
- [x] `lib/r2.ts` — Cloudflare R2 S3 client (uploadToR2, getFromR2)
- [x] `lib/email.ts` — Nodemailer transport with branded HTML email templates
- [x] `lib/validations/` — Zod schemas for all 5 models
- [x] `lib/data.ts` — Public data-fetching helpers (9 functions: getActiveServices, getFeaturedProjects, getPublishedProducts, getProductCount, getPublishedPosts, getPostBySlug, getTestimonials, getRecentPosts, getStats)
- [x] `app/admin/(dashboard)/page.tsx` — Dashboard (counts: services, projects, products, posts, unread messages)
- [x] `app/(public)/page.tsx` — Homepage (all 10 sections)
- [x] `.env.example` file with all 14 variables

---

## Phase 2: Content Management

> All admin CRUD pages + R2 upload. Populate data through the admin panel.

### R2 Upload

- [x] `app/api/upload/route.ts` — Server-side multipart upload to R2, return public URL (auth-gated)
- [x] `app/admin/_components/upload-button.tsx` — Upload button + preview component
- [x] `app/admin/_components/tip-tap-editor.tsx` — TipTap rich text editor (paste-to-upload images)
- [x] `app/admin/_components/input-field.tsx` — Reusable form input with Zod error display
- [x] Blog post JSON uploaded to R2 via server actions, stored in `posts/{slug}/content.json`

### Admin CRUD Pages

- [x] `app/admin/(dashboard)/services/page.tsx` — List + create + edit + delete services
- [x] `app/admin/_components/services-form.tsx` — Service form (title, description, icon picker, sort order)
- [x] `app/admin/(dashboard)/projects/page.tsx` — List + create + edit + delete projects
- [x] `app/admin/_components/projects-form.tsx` — Project form (title, description, tech stack, image upload, link, client, date, testimonial, featured, sort order)
- [x] `app/admin/(dashboard)/products/page.tsx` — List + create + edit + delete products
- [x] `app/admin/_components/products-form.tsx` — Product form (name, description, tech stack, image upload, link, status, featured, sort order)
- [x] `app/admin/(dashboard)/posts/page.tsx` — List + create + edit + delete blog posts
- [x] `app/admin/(dashboard)/posts/new/page.tsx` — New post form page
- [x] `app/admin/(dashboard)/posts/[id]/edit/page.tsx` — Edit post form page (fetches JSON from R2)
- [x] `app/admin/_components/posts-form.tsx` — Post form (title, slug, excerpt, tags, cover image, TipTap editor, status, SEO title, SEO description)

### Admin Messages

- [x] `app/admin/(dashboard)/messages/page.tsx` — Contact messages viewer (table: name, email, date, read/unread, message preview)
- [x] Message detail modal — view full message, mark as read
- [x] `app/admin/_components/messages-list.tsx` — Messages list sub-component

### Server Actions

- [x] `app/admin/_actions/services.ts` — CRUD actions for services
- [x] `app/admin/_actions/projects.ts` — CRUD actions for projects
- [x] `app/admin/_actions/products.ts` — CRUD actions for products
- [x] `app/admin/_actions/posts.ts` — CRUD actions for posts (upload TipTap JSON to R2, store key)
- [x] `app/admin/_actions/contacts.ts` — Read, mark as read, archive actions for contacts

### Admin UX

- [x] Toast notifications on create/update/delete (sonner)
- [x] Delete confirmation dialogs (alert-dialog)

---

## Phase 3: Public Site

> All public-facing pages and sections. Data layer is stable from Phase 2.

### Homepage Sections

- [x] `components/sections/hero.tsx` — Hero section (headline, subheadline, CTA buttons)
- [x] `components/sections/hero-code-window.tsx` — Animated code window (hero sub-component)
- [x] `components/sections/stats.tsx` — Project/service/client count stats bar
- [x] `components/sections/services.tsx` — Services grid (fetches from DB, ordered by sortOrder)
- [x] `components/sections/process.tsx` — How-we-work process section
- [x] `components/sections/team.tsx` — Team section
- [x] `components/sections/team-ai-grid.tsx` — AI grid animation (team sub-component)
- [x] `components/sections/portfolio.tsx` — Projects showcase (featured first, then all, ordered by sortOrder)
- [x] `components/sections/testimonials.tsx` — Client testimonials (fetched from projects with testimonials)
- [x] `components/sections/products.tsx` — Products section (conditional: hidden if 0 published products)
- [x] `components/sections/blog-preview.tsx` — Latest 3 blog posts preview
- [x] `components/sections/contact.tsx` — Contact form (6 fields: name, email, project type, timeline, budget, message)
- [x] `components/shared/scroll-reveal.tsx` — Intersection Observer scroll reveal wrapper
- [x] `app/globals.css` — `scroll-behavior: smooth` for hash-link smooth scrolling

### Homepage

- [x] `app/(public)/page.tsx` — Compose all 10 sections in order, with section IDs for smooth scroll

### Blog

- [x] `app/(public)/blog/page.tsx` — Blog listing (card grid, 9 posts/page, pagination)
- [x] `app/(public)/blog/_components/post-card.tsx` — Blog post card component
- [x] `app/(public)/blog/_components/pagination.tsx` — Pagination component
- [x] `app/(public)/blog/[slug]/page.tsx` — Blog post detail page with JSON-LD (fetches content from R2)
- [x] `app/(public)/blog/_components/tip-tap-content.tsx` — TipTap JSON → React element renderer
- [x] `app/(public)/blog/loading.tsx` — Blog listing loading skeletons
- [x] `app/(public)/blog/[slug]/loading.tsx` — Blog post loading skeleton
- [x] `app/(public)/blog/error.tsx` — Blog error boundary

### Contact Form

- [x] `app/api/contact/route.ts` — POST handler (validate with Zod, insert to DB, send email via Nodemailer, rate limit)
- [x] Contact form with 6 fields: name, email, project type (select), timeline (select), budget (select), message
- [x] Branded HTML email notification sent to `NOTIFICATION_EMAIL` with all form fields
- [x] Success/error toast on form submission
- [x] Form resets properly on success (key-based remount for Radix Select components)

### Static Pages

- [x] `app/(public)/privacy/page.tsx` — Privacy policy page

### SEO Files

- [x] `app/(public)/robots.ts` — Auto-generated robots.txt (disallows /admin/)
- [x] `app/(public)/sitemap.ts` — Auto-generated sitemap.xml (includes all blog post slugs)

### Navbar Conditional Links

- [x] Navbar "Products" link hidden when 0 published products in DB

---

## Phase 4: Polish

> SEO metadata, structured data, scroll animations, loading/error states, responsive polish, security.

### SEO Metadata

- [x] `app/layout.tsx` — Metadata export (site name, description, openGraph defaults, canonical)
- [x] `app/(public)/page.tsx` — Metadata export (homepage-specific title/description)
- [x] `app/(public)/blog/page.tsx` — Metadata export (blog listing)
- [x] `app/(public)/blog/[slug]/page.tsx` — Metadata export (per-post title, description, openGraph image = coverUrl)
- [x] `app/(public)/privacy/page.tsx` — Metadata export

### Structured Data (JSON-LD)

- [x] `app/layout.tsx` — `Organization` schema in `<script type="application/ld+json">`
- [x] `app/(public)/blog/[slug]/page.tsx` — `BlogPosting` schema per post (author, datePublished, image, etc.)

### Scroll Animations

- [x] `components/shared/scroll-reveal.tsx` — Intersection Observer scroll reveal wrapper
- [x] `app/globals.css` — `scroll-behavior: smooth` for hash-link smooth scrolling

### Loading & Error States

- [x] `app/loading.tsx` — Root loading skeleton
- [x] `app/error.tsx` — Root error boundary
- [x] `app/not-found.tsx` — Custom 404 page
- [x] `app/(public)/loading.tsx` — Public route group loading skeleton
- [x] `app/(public)/error.tsx` — Public route group error boundary
- [x] `app/(public)/blog/loading.tsx` — Blog listing loading skeleton
- [x] `app/(public)/blog/[slug]/loading.tsx` — Blog post loading skeleton
- [x] `app/(public)/blog/error.tsx` — Blog error boundary
- [x] `app/admin/(dashboard)/loading.tsx` — Admin loading skeleton
- [x] `app/admin/(dashboard)/error.tsx` — Admin error boundary
- [x] All data-dependent components handle empty/null states gracefully

### Image Optimization

- [x] Configure `next.config.ts` with `images.remotePatterns` for R2 domain
- [x] Use `next/image` for all R2-sourced images (project images, product images, blog covers)
- [x] Navbar logo uses `unoptimized` `next/image` (SVG, CSS-sized)

### Responsive Polish

- [x] Mobile hamburger menu for public navbar
- [x] Admin sidebar collapses to icons on small screens
- [ ] All forms and pages tested at mobile widths

### Security

- [x] `next.config.ts` headers: CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- [x] CSP and HSTS applied only in production (development needs `unsafe-eval` for React)
- [x] Startup warning if `SESSION_SECRET` is still the default value
- [x] Startup warning if `NEXT_PUBLIC_SITE_URL` is not set at build time
- [x] Rate limiting on `/api/auth` (5/60s) and `/api/contact` (3/60s)
- [x] `ecosystem.config.js` with all 14 env var placeholders for PM2 deployment

### Email

- [x] Branded HTML email templates (rose/pink palette matching app theme)
- [x] Contact notification includes all form fields with human-readable labels
- [x] Plain-text fallback for clients that block HTML
- [x] `NOTIFICATION_EMAIL` env var (defaults to `taiatiniyara@gmail.com`)

### Editor Enhancements

- [x] Paste-to-upload: pasting images into TipTap editor uploads to R2 and inserts URL
- [x] Toast notification on image upload failure

### Final Pass

- [x] ESLint passes with zero warnings
- [x] TypeScript strict mode, zero errors
- [ ] Lighthouse audit (≥90 performance, ≥90 SEO, ≥90 accessibility)
- [ ] Cross-browser smoke test (Chrome, Firefox, Safari)
- [ ] Mobile responsive smoke test
- [ ] Dark mode visual pass (all pages, all states)
- [x] `.env.example` file with all 14 variables
