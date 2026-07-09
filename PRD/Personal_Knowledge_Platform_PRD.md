# Personal Knowledge Platform PRD v3

## Table of Contents

1.  Vision
2.  Goals & Non-Goals
3.  Users
4.  System Architecture
5.  Coding Standards
6.  Tech Stack
7.  Functional Requirements
8.  Database Design
9.  API Specification
10. Authentication
11. Admin Dashboard
12. Editor Architecture
13. Reader Experience
14. Navigation & Knowledge Architecture
15. Search
16. SEO
17. Media & Storage
18. Version History
19. Deployment
20. AI Roadmap
21. Project Phases

---

# 1. Vision

Build a personal knowledge platform that combines a Medium-like reading experience with a wiki-like knowledge graph.

This is a structured knowledge base — not a chronological blog. Articles are interconnected through hierarchical categories and rich internal links. Content is evergreen: organized by topic, not by date.

Only one administrator creates and edits content. Visitors have read-only access.

---

# 2. Goals & Non-Goals

## Goals

- Publish long-form evergreen articles
- Organize ideas into hierarchical knowledge (categories with unlimited nesting)
- Connect related articles via internal links (knowledge graph)
- Excellent SEO (indexable, structured data, sitemaps)
- Fast page loads
- Simple to maintain (single admin, no user management)
- Easy future AI integration

## Non-Goals

- Public editing / UGC
- Comments or forums
- Social networking
- Multiple authors (future maybe)
- Real-time collaboration

---

# 3. Users

## Admin

The only content creator. Responsibilities:

- Create / Edit / Delete articles
- Publish / Draft articles
- Manage categories (hierarchical)
- Manage tags
- Manage internal links between articles
- Upload media (images, documents)
- Manage SEO metadata (title, description, OG image)
- View revision history
- Preview articles before publishing

## Reader

Visitors with read-only access:

- Browse categories (tree navigation)
- Read articles
- Navigate through linked content (internal links, related articles)
- Search across titles, body, tags, and categories
- Share articles

---

# 4. System Architecture

```
┌──────────────────────────────────────────────┐
│                  React SPA                     │
│  ┌──────────────┐       ┌──────────────────┐  │
│  │ Admin Dashboard│       │  Reader Pages    │  │
│  │  (Login)       │       │  (Static-like)   │  │
│  │  TipTap Editor │       │  Article View    │  │
│  │  CRUD UI       │       │  Category View   │  │
│  └──────┬───────┘       └────────┬─────────┘  │
└─────────┼─────────────────────────┼────────────┘
          │                         │ (SSR / CSR)
          ▼                         ▼
┌──────────────────────────────────────────────┐
│              REST API (Node/Express)          │
│  - Authentication (JWT)                       │
│  - CRUD: Articles, Categories, Tags, Media    │
│  - Search endpoint                            │
│  - HTML rendering from TipTap JSON            │
└──────────────────────┬───────────────────────┘
                       ▼
┌──────────────────────────────────────────────┐
│              PostgreSQL                        │
│  - Articles (TipTap JSON + pre-rendered HTML) │
│  - Categories (self-referencing tree)         │
│  - Tags (M2M)                                 │
│  - Article links (M2M)                        │
│  - Media                                      │
│  - Revisions                                  │
└──────────────────────────────────────────────┘
                       │
                       ▼
           ┌─────────────────────┐
           │  Object Storage (S3) │
           │  (Media uploads)     │
           └─────────────────────┘
```

Key design decisions:

- **TipTap JSON** is the source of truth for article content (enables future migration, AI transformations, and diff-based revisions)
- **HTML** is pre-generated at save time and stored separately (fast reader page loads without real-time rendering)
- Admin Dashboard and Reader Pages can be separate React apps or the same app with route-based guards

---

# 5. Coding Standards

All code in this project must follow the conventions in [CONVENTIONS.md](./CONVENTIONS.md). Key rules:

| Rule | Limit |
|---|---|
| Max lines per file | 200 |
| Max lines per component | 150 |
| Max lines per function | 40 |
| Exports | Named only |
| TypeScript | `strict: true`, no `any` |
| CSS | Tailwind only |

---

# 6. Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React (Vite) |
| Editor | TipTap (ProseMirror-based WYSIWYG) |
| Styling | Tailwind CSS |
| Backend | Node.js / Express |
| Database | Neon (serverless PostgreSQL) |
| ORM | Drizzle ORM or Prisma |
| Auth | JWT (bcrypt password hashing) |
| Media Storage | S3-compatible object storage (MinIO / AWS S3 / R2) |
| Reverse Proxy | Nginx |
| CI/CD | GitHub Actions |
| Hosting | VPS or Railway / Render |

---

# 7. Functional Requirements

## Admin

- Login with username/password
- Dashboard home with article stats
- Create / Edit / Delete articles
- Draft / Publish / Archive workflow
- Preview article before publishing
- Manage categories (create, edit, delete, reorder)
- Manage tags (create, edit, delete)
- Upload media (images, documents)
- Manage internal links between articles
- Edit SEO metadata per article
- View revision history (compare / restore)

## Reader

- Homepage showing all categories and recent articles
- Category pages with article listing
- Article page with rendered HTML content
- Breadcrumbs showing category path
- Related articles sidebar
- Previous / Next article navigation
- Full-text search
- Internal link navigation (click through to linked articles)
- Responsive design (mobile + desktop)

---

# 8. Database Design

## articles

| Column | Type | Notes |
|---|---|---|
| id | UUID / Serial | Primary key |
| slug | VARCHAR(255) | Unique URL slug |
| title | VARCHAR(500) | Article title |
| summary | TEXT | Short excerpt |
| content_json | JSONB | TipTap JSON (source of truth) |
| content_html | TEXT | Pre-rendered sanitized HTML |
| featured_image_id | UUID (FK → media) | Optional hero image |
| status | VARCHAR(20) | draft / published / archived |
| seo_title | VARCHAR(70) | Override for <title> |
| seo_description | VARCHAR(160) | Meta description |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |
| published_at | TIMESTAMPTZ | NULL for drafts |

## categories

| Column | Type | Notes |
|---|---|---|
| id | UUID / Serial | Primary key |
| name | VARCHAR(255) | Display name |
| slug | VARCHAR(255) | Unique URL slug |
| parent_id | UUID (FK → categories) | NULL for root categories |
| sort_order | INTEGER | For manual ordering |

## article_categories

| Column | Type |
|---|---|
| article_id | UUID (FK → articles) |
| category_id | UUID (FK → categories) |

(Polymorphic: supports multiple categories per article, though typically one primary)

## tags

| Column | Type |
|---|---|
| id | UUID / Serial |
| name | VARCHAR(100) |
| slug | VARCHAR(100) |

## article_tags

| Column | Type |
|---|---|
| article_id | UUID (FK → articles) |
| tag_id | UUID (FK → tags) |

## article_links

Stores explicit internal links between articles.

| Column | Type |
|---|---|
| source_article_id | UUID (FK → articles) |
| destination_article_id | UUID (FK → articles) |

## media

| Column | Type |
|---|---|
| id | UUID / Serial |
| filename | VARCHAR(500) |
| path | VARCHAR(500) | Storage key |
| mime_type | VARCHAR(50) |
| size_bytes | INTEGER |
| alt_text | TEXT |
| created_at | TIMESTAMPTZ |

## revisions

| Column | Type |
|---|---|
| id | UUID / Serial |
| article_id | UUID (FK → articles) |
| content_json | JSONB | Snapshot of TipTap JSON |
| content_html | TEXT | Snapshot of HTML |
| created_at | TIMESTAMPTZ |

---

# 9. API Specification

## Articles

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /api/articles | No | List published articles (paginated) |
| GET | /api/articles/:slug | No | Get single article by slug |
| POST | /api/articles | Yes | Create article |
| PUT | /api/articles/:id | Yes | Update article |
| DELETE | /api/articles/:id | Yes | Delete article |

## Categories

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /api/categories | No | List all categories (tree) |
| GET | /api/categories/:slug | No | Get category with articles |
| POST | /api/categories | Yes | Create category |
| PUT | /api/categories/:id | Yes | Update category |
| DELETE | /api/categories/:id | Yes | Delete category |

## Tags

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /api/tags | No | List all tags |
| POST | /api/tags | Yes | Create tag |
| PUT | /api/tags/:id | Yes | Update tag |
| DELETE | /api/tags/:id | Yes | Delete tag |

## Media

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /api/media | Yes | List uploads |
| POST | /api/media/upload | Yes | Upload file |
| DELETE | /api/media/:id | Yes | Delete file |

## Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/auth/login | No | Login, returns JWT |
| POST | /api/auth/verify | No | Verify token validity |

## Revisions

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /api/articles/:id/revisions | Yes | List revisions |
| GET | /api/revisions/:id | Yes | Get revision content |
| POST | /api/articles/:id/restore/:revisionId | Yes | Restore revision |

## Search

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /api/search?q= | No | Full-text search across content |

---

# 10. Authentication

- JWT-based authentication
- Single admin account (username + hashed password via bcrypt)
- Token set in HTTP-only cookie or Authorization header
- Token expiration with refresh option (or simple re-login)
- All admin routes protected by middleware
- Reader routes require no authentication

---

# 11. Admin Dashboard

The admin dashboard is the control center. Only accessible after login.

## Pages / Sections

| Section | Description |
|---|---|
| Dashboard | Stats overview (total articles, published, drafts) |
| Articles | List view with search, filter by status, create/edit/delete |
| Categories | Tree view, CRUD, reorder |
| Tags | List view, CRUD |
| Media | Grid/list of uploaded files, upload, delete |
| Article Editor | TipTap-based WYSIWYG (see Editor Architecture) |
| Revision History | Per-article timeline with compare/restore |
| SEO Settings | Global defaults for title suffix, OG defaults |
| Settings | Site name, description, admin account management |

---

# 12. Editor Architecture

## Editor Choice: TipTap

TipTap (built on ProseMirror) is chosen over raw HTML for its structured JSON output, extensibility, and future AI compatibility.

## Content Pipeline

```
Editor Input
     │
     ▼
TipTap JSON (source of truth)
     │
     ├──► Stored in articles.content_json
     │
     └──► Render → HTML → Sanitize (DOMPurify) → Stored in articles.content_html
                              │
                              ▼
                      Served to readers
```

## Editor Features

- Headings (H1–H4)
- Paragraphs with formatting (bold, italic, underline, strikethrough)
- Bullet & ordered lists
- Tables
- Code blocks with syntax highlighting
- Blockquotes
- Callout / alert blocks
- Horizontal dividers
- Images (upload or paste, auto-upload to media library)
- Video embeds (YouTube, Vimeo)
- Hyperlinks with internal article search (auto-complete article titles)
- Slash commands (quick insert)
- Undo / Redo history

## Internal Linking

When creating a link, the editor should suggest existing articles by title. On save, the link is stored both:
- In the TipTap JSON as a standard `<a>` link with the article's URL
- In the `article_links` table for graph traversal and related article suggestions

---

# 13. Reader Experience

## Article Page

- Clean, typography-focused layout (Medium-like)
- Title, published date, category breadcrumbs
- Rendered HTML content from `content_html`
- Featured image at top (if present)
- Tags displayed below content
- Related articles sidebar (based on shared categories + tags + `article_links`)
- Previous / Next article navigation
- Share buttons (copy link, Twitter, etc.)
- Internal links navigate to other articles within the platform

## Category Page

- Category title and description
- List of articles in this category
- Subcategory navigation
- Breadcrumbs showing full category path

## Homepage

- Site name and description
- Category tree (top-level categories with expandable children)
- Featured / recent articles
- Search bar

## Design Principles

- Mobile-first responsive design
- Fast load times (pre-rendered HTML, lazy-loaded images)
- Focus on readability (good typography, ample whitespace, readable line lengths)

---

# 14. Navigation & Knowledge Architecture

## Category Tree

Categories form a self-referencing tree with unlimited nesting depths.

Example structure:

```
Products
├── Solvea
│   ├── Vision
│   ├── Architecture
│   ├── Product Principles
│   ├── Experiments
│   └── Lessons
└── Product B
    ├── Vision
    └── Architecture

Investments
├── Company A
│   ├── Thesis
│   ├── Assumptions
│   ├── Financial Model
│   ├── Risks
│   └── Updates
└── Company B
    ├── Thesis
    └── Financial Model

Engineering
├── Backend
│   ├── Database
│   ├── API Design
│   └── Authentication
├── Frontend
│   ├── Architecture
│   └── Components
└── Infrastructure

Business
├── Principles
├── Strategy
└── Metrics

Personal
├── Learning
└── Writing
```

## Breadcrumbs

Every article and category page shows full breadcrumb path:

`Home > Products > Solvea > Architecture`

## Internal Linking Graph

Articles link to other articles naturally (like Wikipedia). The `article_links` table stores these relationships explicitly, enabling:
- Related articles suggestions
- Knowledge graph visualization (future)
- Article-level backlinks display

## Navigation Elements

- Global nav: top-level categories in header
- Breadcrumbs on every page
- Related articles at bottom of each article
- Previous / Next article within current category
- Sitemap footer

---

# 15. Search

Full-text search across:
- Article titles
- Article body (content_html — stripped of markup for indexing)
- Category names
- Tag names

## Search Ranking

Rank results by relevance:
1. Exact title match (highest)
2. Title partial match
3. Tag match
4. Category match
5. Body content match

Implementation options:
- PostgreSQL full-text search via Neon (`tsvector` / `tsquery`) for simplicity
- Meilisearch or Typesense for better UX (typo tolerance, instant results) — Phase 2 improvement

---

# 16. SEO

Every article page must be independently indexable with:

| Requirement | Implementation |
|---|---|
| SEO Title | Stored per-article, falls back to article title |
| Meta Description | Stored per-article, falls back to summary |
| Canonical URL | Auto-generated from slug + category path |
| Open Graph Tags | og:title, og:description, og:image, og:url, og:type=article |
| Twitter Card | twitter:card=summary_large_image |
| JSON-LD | Article structured data (headline, author, datePublished, dateModified, image) |
| XML Sitemap | Auto-generated, updated on publish/unpublish |
| robots.txt | Allow all, disallow /admin |
| Clean URLs | `/category-slug/article-slug` |
| Internal Links | Links between articles improve discoverability and distribute link equity |

---

# 17. Media & Storage

## Storage

- All uploaded files stored in S3-compatible object storage
- Local file system fallback for development

## Media Library

- Grid / list view of all uploaded media
- Upload (drag & drop or file picker)
- Copy embed URL / markdown
- Delete media
- Image optimization: serve resized variants (thumb, medium, full) via image transformation (sharp on upload, or external service)

## Supported Types

- Images: JPEG, PNG, WebP, GIF, SVG
- Documents: PDF (embed in reader)
- Video: embed via URL (YouTube, Vimeo) rather than self-hosted

---

# 18. Version History

Every article save (auto-save or manual) creates a revision snapshot.

## Features

- Timeline of all revisions for each article
- Compare two revisions side-by-side (TipTap JSON diff or HTML diff)
- Restore a previous revision (replaces current content)
- Revision metadata: timestamp, change description (optional)

## Storage

- Revisions stored in the `revisions` table
- Each revision contains full `content_json` and `content_html` snapshots
- Retention: unlimited (storage is cheap for text)

---

# 19. Deployment

## Infrastructure

| Component | Technology |
|---|---|
| Web Server | Nginx (reverse proxy + static files) |
| Frontend | React SPA, built and served as static files |
| Backend | Node.js / Express, run via process manager (PM2) |
| Database | Neon (serverless PostgreSQL) |
| Media Storage | S3-compatible (AWS S3, Cloudflare R2, or MinIO) |

## CI/CD (GitHub Actions)

- On push to `main`: build frontend → run tests → deploy
- Database migrations run as part of deploy
- Secrets managed via GitHub Secrets

## Environment Config

```
DATABASE_URL=
JWT_SECRET=
STORAGE_ENDPOINT=
STORAGE_BUCKET=
STORAGE_REGION=
STORAGE_ACCESS_KEY=
STORAGE_SECRET_KEY=
ADMIN_USERNAME=
ADMIN_PASSWORD_HASH=
SITE_URL=
SITE_NAME=
```

---

# 20. AI Roadmap

Post-MVP enhancements:

| Feature | Description |
|---|---|
| AI Summaries | Auto-generate article summaries using LLM |
| Related Article Suggestions | AI-powered recommendations based on content similarity |
| Auto-Tagging | Suggest tags from article content |
| Writing Assistant | In-editor AI suggestions (Grammarly-like, content suggestions) |
| Knowledge Graph Viz | Visual graph of article connections |
| Reading Time Estimation | Auto-generated from word count |
| Internal Link Suggestions | Suggest articles to link to based on content analysis |

---

# 21. Project Phases

## Phase 1 — Foundation

- Database schema (all tables + migrations)
- Express server setup
- JWT authentication (login, verify, middleware)
- Admin user setup
- Basic API: CRUD articles, categories, tags

## Phase 2 — Admin Dashboard

- Login page
- Dashboard layout + navigation
- Articles list + CRUD
- Categories CRUD (tree support)
- Tags CRUD
- Media upload + library

## Phase 3 — TipTap Editor

- TipTap integration with all features
- Content pipeline (JSON → HTML → sanitize → store)
- Image upload in editor
- Internal link autocomplete
- Preview mode
- Auto-save (debounced)

## Phase 4 — Reader Website

- Homepage with category tree + recent articles
- Article page with rendered HTML
- Category page with article listing
- Breadcrumbs
- Responsive layout
- Previous / Next article navigation
- Related articles sidebar

## Phase 5 — Knowledge Architecture

- Hierarchical category navigation (full tree)
- Internal linking graph (`article_links` CRUD)
- Backlinks display on article pages
- Sitemap breadcrumbs on every page

## Phase 6 — Search

- PostgreSQL full-text search implementation
- Search endpoint
- Search UI (input, results, highlighting)
- Ranked results

## Phase 7 — SEO & Polish

- Per-article SEO metadata editor
- JSON-LD structured data
- Open Graph / Twitter Card meta tags
- XML sitemap generation (auto-update)
- robots.txt
- Canonical URLs
- Performance optimization (lazy loading, image optimization, caching)

## Phase 8 — Version History

- Auto-create revision on save
- Revision list view
- Side-by-side diff
- Restore revision

## Phase 9 — AI Features

- AI summary generation
- Related article suggestions
- Auto-tagging
- Writing assistant
- Knowledge graph visualization

## Phase 10 — Extras

- Dark mode
- RSS feed
- Newsletter integration
- Analytics dashboard (page views, referrers)
- Reading time on article pages
