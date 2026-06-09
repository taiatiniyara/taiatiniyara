# Taia Tiniyara — Software Engineering Studio

Public business website with a blog and an admin panel for content management.

- **Front-end**: Next.js 16 (App Router, RSC), React 19, Tailwind CSS v4, shadcn/ui v4
- **Database**: SQLite via better-sqlite3 + Drizzle ORM
- **Storage**: Cloudflare R2 (images + blog content)
- **Auth**: Single-password HMAC-signed cookie session
- **Email**: Nodemailer with branded HTML templates
- **Validation**: Zod v4
- **Deployment**: PM2 via `ecosystem.config.js`

## Quick Start

```bash
cp .env.example .env.local
# Fill in the required values in .env.local
npm install
npm run db:push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Admin Panel

Navigate to `/admin/login` and use the password set in `ADMIN_PASSWORD`.

## NPM Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint check |
| `npm run db:push` | Push schema to SQLite |
| `npm run db:generate` | Generate migration files |
| `npm run db:migrate` | Run migrations |

## Documentation

- `docs/SPECS.md` — Full technical specification
- `docs/ROADMAP.md` — Implementation plan with checkable tasks
- `AGENTS.md` — Code conventions and architecture rules for AI agents
