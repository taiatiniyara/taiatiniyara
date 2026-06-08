<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md — Taia Tiniyara

## Project Identity

**Taia Tiniyara, LLC** — a software engineering studio. This site serves as the public business website with a blog and an admin panel for content management.

Two revenue streams:
- **Client services**: custom web apps, mobile apps, API development
- **SaaS products**: internal products, added over time

## Reference Documents

Before writing any code, read these files in this order:

1. `docs/SPECS.md` — full technical specification (architecture, data model, tech stack, env vars, design decisions)
2. `docs/ROADMAP.md` — 4-phase implementation plan with checkable tasks

## Architecture Rules (NON-NEGOTIABLE)

```
lib/           → Infrastructure ONLY. No React, no JSX, no UI. Pure server-side.
  utils.ts         cn() utility (clsx + tailwind-merge)
  db.ts            Drizzle + better-sqlite3 connection
  schema.ts        Drizzle table definitions (source of truth for DB shape)
  auth.ts          Cookie session auth (HMAC-signed)
  r2.ts            Cloudflare R2 S3 client
  email.ts         Nodemailer transport
  rate-limiter.ts  In-memory rate limiter
  validations/     Zod schemas (shared by server actions and forms)
  data.ts          Public data-fetching helpers

proxy.ts       → Auth gate for admin routes. Next.js 16 replaces middleware.ts with proxy.ts.
                  Named export: `export function proxy(request: NextRequest)`.

app/           → Routes, server actions, and feature-specific components colocated.
  (public)/        Route group for public pages
    blog/
      _components/   Blog-specific components (post-card, tip-tap-content, pagination)
      _actions/      Server actions for blog data
  admin/
    login/           Standalone login page (no admin layout wrapping)
    (dashboard)/     Protected admin pages (gate via proxy.ts + layout with sidebar)
    _components/     Admin-specific components (sidebar, forms, tiptap-editor, upload-button)
    _actions/        Server actions for admin CRUD

components/    → SHARED components only.
  ui/               shadcn/ui primitives (button, card, input, dialog, etc.)
  layout/           Shared layout (navbar, footer, theme-provider, theme-toggle)
  sections/         Homepage sections (hero, services, portfolio, products, contact)
```

**Rules:**
- Server actions live in `_actions/` folders colocated with their routes, NEVER in `lib/`.
- Components live in `_components/` folders colocated with their routes, NEVER in `lib/`.
- If a component is used by more than one route group, it belongs in `components/`.
- Zod schemas live in `lib/validations/` because both server actions and client forms import them.
- `lib/schema.ts` is the single source of truth for the database shape. No other file defines table structures.

## Tech Stack

| Layer | Package | Version | Purpose |
|---|---|---|---|
| Framework | next | 16.2.7 | App Router, RSC, server actions |
| UI | react / react-dom | 19.2.4 | Component library |
| Styling | tailwindcss | ^4 | Utility-first CSS |
| CSS plugin | @tailwindcss/postcss | ^4 | PostCSS integration |
| Components | shadcn | ^4.10.0 | shadcn/ui v4 (radix-sera style) |
| Primitives | radix-ui | ^1.5.0 | Headless UI primitives |
| Icons | lucide-react | ^1.17.0 | Icon library |
| Class merging | clsx + tailwind-merge + cva | latest | `cn()` utility, component variants |
| Toasts | sonner | ^2.0.7 | Toast notifications |
| Animation | tw-animate-css | ^1.4.0 | CSS animation utilities |
| Database | better-sqlite3 + drizzle-orm | TBD | SQLite with type-safe queries |
| Storage | @aws-sdk/client-s3 | TBD | Cloudflare R2 (S3-compatible) |
| Validation | zod | TBD | Schema validation |
| Email | nodemailer | TBD | Contact form notifications |
| Theme | next-themes | TBD | Dark/light mode toggle |
| Editor | @tiptap/react + extensions | TBD | Rich text editor for blog posts |

**Do NOT add new dependencies without updating this file and SPECS.md.**

## Code Conventions

### TypeScript
- Strict mode is on (`tsconfig.json`). No `any` unless truly unavoidable.
- Prefer `type` imports (`import type { ... } from "..."`).
- Export types alongside their modules. Don't create `types.ts` dump files.
- Use `@/*` path alias for all internal imports. Never use relative paths beyond `./` for same-directory files.

### Naming
- **Files**: kebab-case (`post-card.tsx`, `rate-limiter.ts`, `theme-toggle.tsx`).
- **Components**: PascalCase, named export preferred over default. Exception: Next.js page/layout files use `export default`.
- **Functions**: camelCase (`getPublishedPosts`, `createService`).
- **Database columns**: camelCase in Drizzle schema (`sortOrder`, `createdAt`, `isRead`).
- **Database tables**: plural, camelCase in code (`services`, `posts`). Let Drizzle map to snake_case SQLite if desired — otherwise store as camelCase.
- **Zod schemas**: PascalCase ending in `Schema` (`ServiceSchema`, `PostSchema`). Export inferred types (`export type Service = z.infer<typeof ServiceSchema>`).

### Imports
- Order: external packages → `@/lib/*` → `@/components/*` → `./` relative imports.
- Group by source, separate groups with blank lines.
- Never mix default and named imports from the same package on one line.

### Server vs Client Components
- All components are Server Components by default. Only add `"use client"` when needed.
- Client boundaries: interactive state (`useState`, `useEffect`), event handlers (`onClick`, `onSubmit`), browser APIs, custom hooks.
- **Tip**: shadcn/ui components that wrap Radix primitives (Dialog, AlertDialog, Accordion, Checkbox) are already client components — importing them does NOT make your component a client component. Only add `"use client"` if your own file uses hooks.
- Keep client components as leaf nodes. Push state up only when multiple children need it.

### shadcn/ui v4 (radix-sera)
- Current style is `radix-sera`. Components use `data-slot` attributes, `group/name` syntax, `aria-*` selectors.
- Theme tokens are CSS custom properties (oklch). Use `bg-primary`, `text-primary-foreground`, etc. — not raw colors.
- `cn()` from `@/lib/utils` for all class merging. Use `cva` for component variants.
- To add a new shadcn component: `npx shadcn@latest add <component-name>`. Do NOT hand-write shadcn components.

### Forms & Validation
- All form submissions go through server actions (not API routes, except for uploads).
- Use `useActionState` + Zod on the server. Client receives field errors back via action return value.
- Validation schemas in `lib/validations/` are the single source of truth — imported by both server actions and client forms.
- Sanitize inputs before DB insertion. Never trust client data.

### Database
- ALWAYS use Drizzle's typed query builder. Never write raw SQL.
- All DB operations must be wrapped in try/catch with meaningful error returns.
- Use Drizzle transactions when mutating multiple tables atomically.
- Run `npm run db:push` (TBD) after schema changes. Never manually alter the SQLite file.

### Styling
- Tailwind v4 uses `@import "tailwindcss"` in CSS (no `tailwind.config.ts`).
- Theme tokens in globals.css via `@theme inline` + `:root` / `.dark`.
- Use semantic tokens: `bg-background`, `text-foreground`, `bg-primary`, `text-muted-foreground`, `border-border`.
- For one-off values, use Tailwind arbitrary values: `bg-[oklch(0.5_0.2_290)]`. Prefer theme tokens when possible.
- Responsive: mobile-first (`md:`, `lg:`, `xl:` breakpoints). Test at 375px, 768px, 1024px, 1440px.
- Dark mode: use `dark:` prefix. All pages must work in both modes.

### Loading & Error States
- Every async page gets a `loading.tsx` sibling with skeleton UI.
- Every route group gets an `error.tsx` boundary (or a root-level one with `"use client"`).
- Every form submission shows a toast (success or error) via sonner.
- Empty states: show a meaningful message with an action CTA, not a blank page.

### Metadata & SEO
- Every public page exports a `metadata` object (or `generateMetadata` for dynamic routes).
- Include: `title`, `description`, `openGraph` (title, description, siteName, images), `alternates.canonical`.
- Blog posts use `generateMetadata` based on slug, pulling from the DB.
- JSON-LD via `<script type="application/ld+json">` in layout (Organization) and blog post pages (BlogPosting).

## Phase Status

Track progress in `docs/ROADMAP.md`. Mark tasks `[x]` when complete. Work in phase order — don't skip ahead unless a dependency is already satisfied.

**Current phase:** Phase 1 (Foundation)

## Common Pitfalls

1. **Don't put server actions in `lib/`.** They belong in `_actions/` folders colocated with routes.
2. **Don't use API routes for form submissions.** Use server actions. Exceptions: file uploads (`/api/upload`), auth (`/api/auth`), contact form (`/api/contact` — because it's called from the public homepage which has no auth context).
3. **Don't import server code into client components.** Server actions, DB queries, and filesystem access are server-only. Use `"server-only"` import if needed.
4. **Don't forget `loading.tsx` and `error.tsx`.** Every async route needs them.
5. **Don't hardcode colors.** Use theme tokens (`text-primary`, `bg-secondary`, etc.).
6. **Don't let the TipTap JSON content renderer execute arbitrary HTML.** Parse and sanitize the JSON nodes into React elements.
7. **Don't store secrets in client code.** Only server-side environment variables (no `NEXT_PUBLIC_` prefix for secrets).
8. **Don't add new dependencies without updating AGENTS.md and SPECS.md.**

## Quality Bar

Before marking a Phase task complete:
- ESLint passes with zero warnings (`npm run lint`)
- TypeScript compiles with zero errors (`npx tsc --noEmit`)
- Works in both light and dark mode
- Works on mobile (375px) and desktop
- Loading and error states present
- Form validation works (submit empty form, see errors)
