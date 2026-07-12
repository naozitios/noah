# Refactor PRD — Codebase Cleanup & Architecture Alignment

**Status:** Proposed
**Date:** 2026-07-12
**Scope:** Full codebase refactor to align implementation with PRD vision and coding conventions

---

## 1. Problem Statement

The codebase has drifted significantly from the project's own PRD and coding conventions. Multiple architectural patterns coexist, conventions are routinely violated, and the foundation is not solid enough to support the planned feature phases (TipTap editor, search, version history, AI features). This refactor addresses structural debt before new features are built.

---

## 2. Findings

### 2.1 Architecture Mismatches

| # | Issue | Location | Severity |
|---|---|---|---|
| A1 | **Two competing routing systems** — `/blog/[id]` (flat, static) and `/[categorySlug]/[articleSlug]` (hierarchical, server) serve the same content with different layouts | `app/blog/[id]/page.tsx`, `app/[categorySlug]/[articleSlug]/page.tsx` | High |
| A2 | **PRD describes DB-backed articles/categories/tags** but implementation uses filesystem markdown. Only `media` table exists in schema | `db/schema.ts`, `lib/garden-data.ts` | High |
| A3 | **Two competing auth systems** — `lib/auth.ts` implements JWT (jose + bcrypt), but `app/api/admin/login/route.ts` uses custom SHA-256 tokens. The JWT system is unused | `lib/auth.ts`, `app/api/admin/login/route.ts` | High |
| A4 | **Duplicated markdown rendering** — `blog/[id]/page.tsx` has 15 lines of inline ReactMarkdown config; `components/markdown.tsx` is a separate reusable component with different config | `app/blog/[id]/page.tsx:53-68`, `components/markdown.tsx` | Medium |
| A5 | **Inconsistent URL structure** — BentoCard links to `/blog/${entry.id}`, sitemap uses `/${pillar}/${id}`, category pages use `/${categorySlug}/${entryId}`. Links are broken across contexts | `components/bento-card.tsx:70`, `app/sitemap.ts:18` | High |
| A6 | **Client-side "routing" on homepage** — `PageShell` uses React state to switch between home/products/investments/principles views instead of using Next.js file-based routing | `components/page-shell.tsx:27` | Medium |

### 2.2 Convention Violations

| # | Violation | Convention | Locations |
|---|---|---|---|
| C1 | **Default exports** on 8 page/layout files | "Named only" exports | All `page.tsx` and `layout.tsx` files |
| C2 | **No service layer** — API routes contain all business logic | "Business logic goes into service layer" | `app/api/media/upload/route.ts`, `app/api/media/[id]/route.ts` |
| C3 | **No validation layer** — No zod schemas for API input | "validation.ts — request body/query validation (zod)" | All API routes |
| C4 | **No auth middleware** on admin API routes | "All admin routes protected by middleware" | `app/api/media/route.ts`, `app/api/media/upload/route.ts`, `app/api/media/[id]/route.ts` |
| C5 | **Folder structure doesn't match spec** — No `src/` directory, no `admin/`/`reader/` split | CONVENTIONS.md §2 | Entire project |
| C6 | **`page-shell.tsx` at 145 lines** — Header, nav, theme toggle, mobile menu, page state, layout all in one component | "Max 150 lines per component" | `components/page-shell.tsx` |
| C7 | **`garden-data.ts` at 154 lines** — Approaching 200-line file limit | "Max 200 lines per file" | `lib/garden-data.ts` |

### 2.3 Code Quality Issues

| # | Issue | Impact |
|---|---|---|
| Q1 | **`ignoreBuildErrors: true`** in next.config — TypeScript errors silently pass | Broken builds ship to production |
| Q2 | **`images.unoptimized: true`** — Image optimization disabled | Poor performance, contradicts PRD §7.6 |
| Q3 | **`formatDate` duplicated** in `lib/garden-data.ts:37` and `lib/utils.ts:8` | Maintenance burden, potential drift |
| Q4 | **No filesystem caching** — `getEntries()` reads disk on every call | Slow page builds as content grows |
| Q5 | **No error boundaries or loading states** | Poor UX on errors |
| Q6 | **`@media (prefers-color-scheme: dark)` block** in globals.css duplicates `.dark` class variables | Conflicts with `next-themes` class-based theming, causes flash/inconsistency |
| Q7 | **No tests exist** | Convention requires 80% coverage on service/API layers |
| Q8 | **Hardcoded external URLs** (LinkedIn, GitHub, CV) in page-shell | Not configurable, mixed into navigation component |

---

## 3. Goals

1. **Single routing system** — One canonical URL pattern for articles, consistent across all links, sitemaps, and navigation
2. **Unified auth** — One auth system (JWT) used consistently across all admin routes
3. **Convention compliance** — All code follows CONVENTIONS.md (named exports, file sizes, folder structure, service layer, validation)
4. **Build integrity** — TypeScript errors caught at build time, image optimization enabled
5. **Component decomposition** — Break oversized components into focused, testable units
6. **Eliminate duplication** — Single markdown renderer, single date formatter, single data access layer
7. **Foundation for DB migration** — Structure the data layer so content can move from filesystem to database without rewriting UI

---

## 4. Non-Goals

- Migrating content from markdown files to the database (that's a separate phase — this refactor prepares the structure for it)
- Building new features (TipTap editor, search, etc.)
- Redesigning the UI or visual appearance
- Changing the content authoring workflow (markdown files remain the source of truth for now)

---

## 5. Success Criteria

- [ ] `npm run build` completes with `ignoreBuildErrors: false`
- [ ] `npm run lint` passes with zero errors
- [ ] All admin API routes reject unauthenticated requests
- [ ] Single URL pattern for articles — all links, sitemaps, and navigation use the same pattern
- [ ] No file exceeds 200 lines; no component exceeds 150 lines
- [ ] No default exports (except Next.js page/layout requirements)
- [ ] `formatDate` exists in exactly one location
- [ ] Markdown rendering config exists in exactly one location
- [ ] Auth system uses JWT consistently (no SHA-256 tokens)
- [ ] All API routes have zod validation
- [ ] Image optimization is enabled

---

## 6. Risk Assessment

| Risk | Mitigation |
|---|---|
| Breaking existing URLs affects SEO/bookmarks | Keep `/blog/[id]` as a redirect to the canonical `/[categorySlug]/[articleSlug]` pattern during transition |
| Filesystem → DB migration is a large effort | This refactor only prepares the data access layer interface; actual migration is a future phase |
| Refactor scope creep | Strictly limit to the issues listed in §2; defer all new features |
| Breaking the admin media workflow | Test media upload/list/delete end-to-end after auth middleware is added |
