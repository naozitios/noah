# Coding Conventions

These conventions apply to all code written for this project. Every phase must follow them unless explicitly overridden.

---

## 1. File & Folder Size Limits

| Rule | Limit | Rationale |
|---|---|---|
| Max lines per file | **200** | Forces single responsibility, easy to read in one scroll |
| Max lines per React component | **150** | Extract child components if exceeded |
| Max lines per function | **40** | Extract helper functions |
| Max lines per API route handler | **60** | Business logic goes into service layer |
| Max nesting depth | **3 levels** | Extract early returns or helper functions |

If a file exceeds 200 lines, split it into smaller modules. A folder with multiple small files is preferred over one large file.

---

## 2. Folder Structure

```
src/
├── admin/             # Admin dashboard components & pages
│   ├── components/    # Shared admin UI components
│   ├── pages/         # Route-level page components
│   └── hooks/         # Admin-specific hooks
├── reader/            # Reader-facing pages & components
│   ├── components/
│   ├── pages/
│   └── hooks/
├── api/               # Backend API routes
│   ├── articles/
│   ├── categories/
│   ├── tags/
│   ├── media/
│   ├── auth/
│   ├── revisions/
│   ├── search/
│   └── analytics/
├── db/                # Database schema, migrations, seeds
│   └── migrations/
├── lib/               # Shared utilities, helpers, config
├── middleware/         # Express middleware
└── types/             # Shared TypeScript types
```

- Each API route folder contains: `route.ts`, `controller.ts`, `service.ts`, `validation.ts`
- Each page folder contains: `page.tsx`, optionally `components/` for page-specific components
- Keep related files close together — not split across distant folders

---

## 3. Naming Conventions

### Files

| Type | Convention | Example |
|---|---|---|
| React components | PascalCase | `ArticleEditor.tsx` |
| Hooks | camelCase, prefixed with `use` | `useArticles.ts` |
| API routes | kebab-case | `get-articles.ts` |
| Utilities | camelCase | `formatSlug.ts` |
| Database migrations | numbered, descriptive | `0001_create_articles.sql` |
| Types/interfaces | PascalCase, prefixed with `I` (interface) or `T` (type) if disambiguation needed | `IArticle`, `TCreateArticleInput` |
| CSS modules | camelCase matching component | `ArticleEditor.module.css` |

### Code

| Item | Convention | Example |
|---|---|---|
| Variables | camelCase | `articleSlug` |
| Functions | camelCase, verb-first | `getArticleBySlug()` |
| Constants | UPPER_SNAKE_CASE | `MAX_TITLE_LENGTH` |
| Database columns | snake_case | `content_json`, `published_at` |
| API endpoints | kebab-case, plural nouns | `/api/articles`, `/api/categories` |
| Query params | camelCase | `?searchQuery=...` |
| Database table names | plural snake_case | `articles`, `article_tags` |

---

## 4. Imports

- **No default exports** — always use named exports (better refactoring, explicit imports)
- Absolute imports for cross-directory references (configure path aliases)
- Group and order imports:

```typescript
// 1. External dependencies
import { useState } from 'react';
import { z } from 'zod';

// 2. Internal modules (absolute)
import { apiClient } from '@/lib/api-client';
import { ArticleCard } from '@/reader/components/article-card';

// 3. Types
import type { IArticle } from '@/types/article';

// 4. Relative (sibling) imports — only for closely related files
import { formatDate } from './utils';
```

---

## 5. TypeScript

- `strict: true` in tsconfig — no exceptions
- Prefer `interface` over `type` for object shapes
- Use `type` for unions, intersections, and primitives
- No `any` — use `unknown` and narrow with type guards
- All function parameters and return types must be explicitly typed
- Async functions must return explicit `Promise<T>` types

---

## 6. React Components

```typescript
// Preferred pattern — single file, named export
export function ArticleCard({ article }: ArticleCardProps) {
  // ...
}
```

- One component per file (exception: tightly coupled tiny helpers)
- Props interface defined in the same file, exported if reused
- No inline styles — use Tailwind utility classes
- No class components — functional components only
- Extract logic into custom hooks when a component exceeds 150 lines

---

## 7. No Commented-Out Code

- Delete dead code — don't leave it commented out "for later"
- Use version control to recover old code
- TODO comments are allowed but must include an owner or issue reference: `// TODO(@noah): handle edge case — see issue #42`

---

## 8. API Route Pattern

```
route.ts          — defines method, path, middleware chain
controller.ts     — extracts params, calls service, formats response
service.ts        — business logic, database queries
validation.ts     — request body/query validation (zod)
```

Controller functions must be under 60 lines. Business logic never lives in route files.

---

## 9. Database

- All schema changes via migrations (never raw SQL in production)
- Use the ORM (Drizzle or Prisma) for all queries — no raw SQL except for full-text search vectors
- Migrations are immutable once committed — create a new migration to change a table

---

## 10. Git & Commits

- Imperative mood: `Add search endpoint`, not `Added search endpoint` or `Adding search endpoint`
- Prefix with scope: `api: add search endpoint`, `editor: fix image upload`
- Keep commits focused — one logical change per commit
- No commits with lint errors or type errors

---

## 11. Error Handling

- API errors return consistent JSON shape:

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Article not found"
  }
}
```

- Use custom error classes extending `AppError` with a `code` and `statusCode`
- No bare `throw new Error(...)` in API routes — use typed errors
- Client-side errors logged to console in development only

---

## 12. CSS / Styling

- Tailwind CSS only — no CSS-in-JS, no Sass, no styled-components
- Extract repeated utility patterns into Tailwind components via `@apply` only in exceptional cases
- Responsive design: mobile-first (base styles = mobile, `sm:` / `md:` / `lg:` for larger screens)

---

## 13. Testing

- Tests live next to the file they test: `article-service.test.ts` beside `article-service.ts`
- Unit test all service functions
- Integration test all API routes
- Component tests for complex UI (editor, forms)
- Minimum 80% coverage on service and API layers

---

## 14. Enforcement

- CI pipeline blocks PRs that violate file size limits, TypeScript strictness, or test coverage thresholds
- ESLint + Prettier run on every commit (pre-commit hook via husky)
- Run `npm run lint` and `npm run typecheck` before every commit

---

## Quick Reference

| Rule | Limit |
|---|---|
| Max lines per file | 200 |
| Max lines per component | 150 |
| Max lines per function | 40 |
| Max lines per route handler | 60 |
| Max nesting depth | 3 |
| Exports | Named only (no default exports) |
| Typescript | `strict: true`, no `any` |
| CSS | Tailwind only |
| Comments | No commented-out code |
| File organization | Feature-based folders |
