# Phase 1 — Foundation

**Goal:** Set up the database schema, backend server, authentication, and CRUD APIs for articles, categories, and tags.

## Dependencies

- None (this is the starting point)

---

## Scope

### 1.1 Project Scaffolding

- Initialize Node.js / Express project with TypeScript
- Set up project structure (routes, controllers, middleware, models)
- Configure environment variables
- Set up Neon PostgreSQL connection via Drizzle ORM or Prisma
- Configure ESLint, Prettier, and basic dev scripts

### 1.2 Database Schema

Run migrations to create all tables:

**articles**

| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| slug | VARCHAR(255) | Unique |
| title | VARCHAR(500) | |
| summary | TEXT | |
| content_json | JSONB | TipTap JSON |
| content_html | TEXT | Pre-rendered HTML |
| featured_image_id | UUID | FK → media (nullable) |
| status | VARCHAR(20) | draft / published / archived |
| seo_title | VARCHAR(70) | |
| seo_description | VARCHAR(160) | |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |
| published_at | TIMESTAMPTZ | |

**categories**

| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| name | VARCHAR(255) | |
| slug | VARCHAR(255) | Unique |
| parent_id | UUID | FK → categories (nullable) |
| sort_order | INTEGER | |

**article_categories**

| Column | Type |
|---|---|
| article_id | UUID | FK → articles |
| category_id | UUID | FK → categories |

**tags**

| Column | Type |
|---|---|
| id | UUID | Primary key |
| name | VARCHAR(100) | |
| slug | VARCHAR(100) | Unique |

**article_tags**

| Column | Type |
|---|---|
| article_id | UUID | FK → articles |
| tag_id | UUID | FK → tags |

**article_links**

| Column | Type |
|---|---|
| source_article_id | UUID | FK → articles |
| destination_article_id | UUID | FK → articles |

**media**

| Column | Type |
|---|---|
| id | UUID | Primary key |
| filename | VARCHAR(500) | |
| path | VARCHAR(500) | |
| mime_type | VARCHAR(50) | |
| size_bytes | INTEGER | |
| alt_text | TEXT | |
| created_at | TIMESTAMPTZ | |

**revisions**

| Column | Type |
|---|---|
| id | UUID | Primary key |
| article_id | UUID | FK → articles |
| content_json | JSONB | |
| content_html | TEXT | |
| created_at | TIMESTAMPTZ | |

### 1.3 Authentication

- Single admin user seeded via migration or env vars
- POST `/api/auth/login` — username/password → JWT
- POST `/api/auth/verify` — validate token
- JWT middleware for protected routes
- Password hashing with bcrypt
- Token expiry with HTTP-only cookie or Authorization header

### 1.4 CRUD API: Articles

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /api/articles | No | List published articles (paginated) |
| GET | /api/articles/:slug | No | Get single article by slug |
| POST | /api/articles | Yes | Create article |
| PUT | /api/articles/:id | Yes | Update article |
| DELETE | /api/articles/:id | Yes | Delete article |

### 1.5 CRUD API: Categories

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /api/categories | No | List all categories (tree) |
| GET | /api/categories/:slug | No | Get category with articles |
| POST | /api/categories | Yes | Create category |
| PUT | /api/categories/:id | Yes | Update category |
| DELETE | /api/categories/:id | Yes | Delete category |

### 1.6 CRUD API: Tags

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /api/tags | No | List all tags |
| POST | /api/tags | Yes | Create tag |
| PUT | /api/tags/:id | Yes | Update tag |
| DELETE | /api/tags/:id | Yes | Delete tag |

---

## Environment Config

```
DATABASE_URL=postgresql://...
JWT_SECRET=
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=
SITE_URL=http://localhost:5173
```

---

## Acceptance Criteria

- [ ] All tables created in Neon via migration
- [ ] Admin user can login and receive a JWT
- [ ] Protected routes reject unauthenticated requests
- [ ] Articles can be created, read, updated, deleted via API
- [ ] Categories can be created, read, updated, deleted via API (tree structure preserved)
- [ ] Tags can be created, read, updated, deleted via API
- [ ] Pagination works on article list
- [ ] Slug uniqueness enforced on articles and categories

---

## Coding Conventions

All code in this phase must follow [CONVENTIONS.md](../CONVENTIONS.md). Key limits: 200 lines per file, 40 lines per function, 3 levels max nesting.
