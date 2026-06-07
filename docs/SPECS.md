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
/admin/login   → Password auth
/privacy       → Privacy policy
/robots.txt    → Auto-generated robots.txt
/sitemap.xml   → Auto-generated sitemap with blog posts
```

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind v4, shadcn/ui v4 (radix-sera) |
| Theme | Mist base, purple primary (`oklch(0.491 0.27 292.581)`), system + manual toggle |
| Fonts | Geist Sans, Geist Mono |
| Database | SQLite via better-sqlite3 + Drizzle ORM |
| Content | Blog body = TipTap JSON stored in R2, metadata in SQLite |
| Email | Nodemailer (own SMTP) |
| Storage | Cloudflare R2 (images + blog JSON), server-side upload |
| Auth | Single password, env var (`ADMIN_PASSWORD`), cookie session (HMAC-signed) |
| Hosting | Own VPS, manual deploy (`git pull && build && pm2 restart`) |

## Data Models (SQLite)

### services
| Field | Type | Notes |
|---|---|---|
| id | integer (PK) | autoincrement |
| title | text | |
| description | text | |
| icon | text | Lucide icon name |
| sort_order | integer | for ordering |

### projects
| Field | Type | Notes |
|---|---|---|
| id | integer (PK) | autoincrement |
| title | text | |
| description | text | |
| tech_stack | text | JSON array of tags |
| image_url | text | R2 URL |
| link | text | live site or GitHub |
| client_name | text | |
| completed_date | text | |
| testimonial | text | |
| featured | integer | 0/1 boolean |
| created_at | text | ISO timestamp |

### products
| Field | Type | Notes |
|---|---|---|
| id | integer (PK) | autoincrement |
| name | text | |
| description | text | |
| tech_stack | text | JSON array of tags |
| image_url | text | R2 logo/screenshot |
| link | text | |
| status | text | 'launched', 'in-progress', 'coming-soon' |
| featured | integer | 0/1 boolean |
| created_at | text | ISO timestamp |

### contacts
| Field | Type | Notes |
|---|---|---|
| id | integer (PK) | autoincrement |
| name | text | |
| email | text | |
| message | text | |
| created_at | text | ISO timestamp |

### posts
| Field | Type | Notes |
|---|---|---|
| id | integer (PK) | autoincrement |
| title | text | |
| slug | text | unique |
| excerpt | text | |
| tags | text | JSON array |
| status | text | 'draft' or 'published' |
| cover_url | text | R2 URL |
| content_r2_key | text | R2 key for TipTap JSON |
| seo_title | text | |
| seo_desc | text | |
| published_at | text | ISO timestamp |
| created_at | text | ISO timestamp |
| updated_at | text | ISO timestamp |

## Feature Flags / Conditional Rendering
- **Products section**: hidden if 0 published products in DB
- **Navbar "Products" link**: hidden if section hidden
- **Portfolio**: shows featured projects first, falls back to all projects
- **Blog pagination**: hidden when totalPages <= 1

## Color Scheme
- Light: white background, zinc text, purple primary
- Dark: zinc-900 background, zinc-50 text, purple primary
- Accent: muted blue-gray secondary

## SEO Implementation
- `metadata` export on every public page
- `openGraph` (website/article) and `twitter` metadata
- `alternates.canonical` on every page
- JSON-LD: `Organization` on layout, `BlogPosting` on post pages
- Auto-generated `robots.txt` (`/robots.ts`) and `sitemap.xml` (`/sitemap.ts`)
- Semantic HTML throughout

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
