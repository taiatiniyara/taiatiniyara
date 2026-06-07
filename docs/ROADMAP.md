# Roadmap — Taia Tiniyara

## Phase 1: Foundation (blocks everything)

| # | Task | Depends On | Status |
|---|---|---|---|
| 1 | Drizzle + better-sqlite3 setup (schema, db connection, migrations) | — | ⬜ |
| 2 | Admin auth (env var password, cookie session, middleware) | 1 | ⬜ |
| 3 | Admin layout + dashboard stats page | 2 | ⬜ |
| 4 | Public layout: Navbar, theme toggle, smooth scroll, footer | — | ⬜ |

## Phase 2: Admin CRUD

| # | Task | Depends On | Status |
|---|---|---|---|
| 5 | Admin: Services CRUD | 3 | ⬜ |
| 6 | Admin: Portfolio Projects CRUD (R2 image URLs) | 3, 1 | ⬜ |
| 7 | Admin: Products CRUD (R2 image URLs) | 3, 1 | ⬜ |
| 8 | Admin: Blog Posts CRUD (TipTap editor, R2 JSON + images) | 3, 1 | ⬜ |
| 9 | Admin: Contact Messages viewer | 3, 1 | ⬜ |

## Phase 3: R2 Integration

| # | Task | Depends On | Status |
|---|---|---|---|
| 10 | R2 server-side upload handler | — | ⬜ |

## Phase 4: Public Pages

| # | Task | Depends On | Status |
|---|---|---|---|
| 11 | Hero section | 4 | ⬜ |
| 12 | Services section (DB-driven) | 4, 1 | ⬜ |
| 13 | Portfolio section (DB-driven) | 4, 1 | ⬜ |
| 14 | Products section (DB-driven, conditionally rendered) | 4, 1 | ⬜ |
| 15 | Contact form + Nodemailer | 4, 1 | ⬜ |
| 16 | Blog listing page (card grid, 9/page, paginated) | 4, 1 | ⬜ |
| 17 | Blog post page (TipTap JSON renderer) | 4, 1 | ⬜ |
| 18 | Privacy policy page | 4 | ⬜ |

## Phase 5: Polish

| # | Task | Depends On | Status |
|---|---|---|---|
| 19 | SEO metadata + Open Graph (all pages) | 4 | ⬜ |
| 20 | Scroll-triggered fade-in animations | 4 | ⬜ |
| 21 | Final lint + build check | all | ⬜ |
