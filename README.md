# Noah's Digital Garden

A personal digital garden built with Next.js 16, featuring investment research, product case studies, principles, and public assumptions — all organized as markdown content and rendered through a bento-card interface.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript 5.7
- **Styling**: Tailwind CSS v4 + `tailwind-merge` + `tw-animate-css`
- **Content**: Markdown files with `gray-matter` frontmatter, rendered via `react-markdown` + `remark-gfm`
- **Database**: Neon Serverless Postgres via `@neondatabase/serverless` + Drizzle ORM
- **Auth**: JWT (`jose`) + bcrypt password hashing (`bcryptjs`)
- **Themes**: `next-themes` (dark/light)
- **Icons**: `lucide-react`

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

Create a `.env.local` file:

```env
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
JWT_SECRET=your-jwt-secret
ADMIN_PASSWORD_HASH=$2a$10$...   # generate with: node -e "require('bcryptjs').hash('your-password', 10).then(console.log)"
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Project Structure

```
app/
  [categorySlug]/          # Pillar listing + article pages
  admin/                   # Admin panel (login, media manager)
  api/                     # API routes (admin login, media CRUD)
  blog/                    # Legacy /blog/[id] redirect to /pillar/id
  feed.xml/                # RSS feed
  sitemap.ts               # Sitemap
  robots.ts                # Robots.txt
components/
  bento-card.tsx           # Article card with hover gradient
  garden-board.tsx         # Grid of cards with subsection filters
  intro-card.tsx           # Homepage hero
  markdown.tsx             # Markdown renderer
  page-shell.tsx           # Client-side page orchestrator
  site-header.tsx          # Nav + theme toggle
  ...
content/
  pillars/                 # Pillar definitions (id, label, blurb, subsection mapping)
  entries/                 # Markdown articles organized by pillar/subsection
db/
  schema.ts                # Drizzle schema (media table)
  index.ts                 # DB connection
lib/
  garden-data.ts           # Content parsing + entry/pillar loading
  auth.ts                  # JWT + bcrypt helpers
  api/                     # API service layer (media, uploads, auth, errors)
```

## Content System

Entries are markdown files under `content/entries/<pillar>/<subsection>/`. Pillar and subsection are **inferred from the directory path** — no need to declare them in frontmatter.

### Frontmatter

```yaml
---
title: Your article title
meta: Mental model          # short label shown on cards
date: 2025-01-01
ready: true                  # false hides from production
description: A short summary  # shown on cards and as a callout on the article page
---
```

### Pillar Mapping

Each pillar is defined in `content/pillars/<pillar>.md` with a subsection mapping (directory name → display name):

```yaml
---
id: investments
label: Investments
blurb: Investment research and takes.
subsections:
  existing-takes: Existing takes
  previous-takes: Previous takes
---
```

Adding a new subsection: create the directory under `content/entries/<pillar>/<new-dir>/`, add it to the pillar's `subsections` mapping, and drop markdown files in.

## Admin

- `/admin/login` — password login (bcrypt-verified, issues JWT stored in localStorage)
- `/admin/media` — upload, list, and delete media files (stored in `public/uploads/`, metadata in Postgres)

## Database

Uses Neon Serverless Postgres with Drizzle ORM. Schema lives in `db/schema.ts`. The `media` table tracks uploaded files.

```bash
# Apply schema changes
npx drizzle-kit push
```
