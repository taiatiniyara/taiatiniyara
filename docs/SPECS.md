# Specs — Taia Tiniyara Website

## Business Context

Taia Tiniyara, LLC — a software engineering studio. Two revenue streams:
- **Client services**: custom web apps, mobile apps, API development (TypeScript, Node.js)
- **SaaS products**: internal products, added as they launch

Target clients: businesses and individuals needing software built.

## Site Structure (Single Page + Blog + Admin)

```
/              → Home (Hero → Services → Portfolio → Products → Contact → Footer)
/blog          → Card grid, 9 posts/page, paginated
/blog/[slug]   → Individual post with TipTap JSON renderer
/admin         → Dashboard (stats, links to CRUD)
/admin/login   → Password auth
/privacy       → Privacy policy
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
| Auth | Single password, env var (`ADMIN_PASSWORD`), cookie session |
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
- **Blog "Products"**: always visible once 1+ product exists

## Color Scheme (from globals.css)
- Light: white background, zinc text, purple primary
- Dark: zinc-900 background, zinc-50 text, purple primary
- Accent: muted blue-gray secondary

## Dependencies to Add
- `drizzle-orm`, `better-sqlite3`, `@types/better-sqlite3`
- `drizzle-kit` (dev)
- `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-image`
- `nodemailer`, `@types/nodemailer`
- `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner` (for R2)
- `next-themes` (dark/light toggle)
