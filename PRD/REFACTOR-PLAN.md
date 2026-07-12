# Refactor Plan — Phase-by-Phase Execution

**Companion document:** [REFACTOR-PRD.md](./REFACTOR-PRD.md)

---

## Phase 1 — Build Integrity & Config Fixes

**Goal:** Make the build honest. Fix config that hides errors and degrades performance.
**Risk:** Low | **Effort:** Small

### Tasks

| # | Task | File(s) | Details |
|---|---|---|---|
| 1.1 | Remove `ignoreBuildErrors` | `next.config.mjs` | Set to `false` (or remove). Fix any resulting TS errors. |
| 1.2 | Enable image optimization | `next.config.mjs` | Remove `images: { unoptimized: true }` |
| 1.3 | Remove duplicate `formatDate` | `lib/utils.ts`, `lib/garden-data.ts` | Keep the one in `lib/utils.ts`. Update `garden-data.ts` to import from `lib/utils.ts`. Update all consumers. |
| 1.4 | Remove `@media (prefers-color-scheme: dark)` block | `app/globals.css:122-158` | Delete the entire `@media` block. The `.dark` class + `next-themes` handles theming. The `@media` block creates conflicting variable definitions. |

### Verification
- `npm run build` completes successfully
- `npm run lint` passes
- Dark/light theme toggle still works correctly
- Images load with optimization (check `/_next/image` URLs in browser)

---

## Phase 2 — Unify Auth System

**Goal:** Single JWT-based auth used consistently across all admin routes.
**Risk:** Medium | **Effort:** Small

### Tasks

| # | Task | File(s) | Details |
|---|---|---|---|
| 2.1 | Rewrite login route to use JWT | `app/api/admin/login/route.ts` | Replace SHA-256 token with `createToken()` from `lib/auth.ts`. Use bcrypt to compare password against `ADMIN_PASSWORD_HASH` env var. |
| 2.2 | Create auth middleware | `lib/api/auth-middleware.ts` | New file. Extracts JWT from `Authorization` header, calls `verifyToken()`, returns user or throws `AppError('UNAUTHORIZED')`. |
| 2.3 | Protect media API routes | `app/api/media/route.ts`, `app/api/media/upload/route.ts`, `app/api/media/[id]/route.ts` | Add auth check at the top of each handler. |
| 2.4 | Update admin login page | `app/admin/login/page.tsx` | Store JWT token. Send as `Authorization: Bearer <token>` on subsequent requests. |
| 2.5 | Update admin media page | `app/admin/media/page.tsx` | Add auth header to all `fetch` calls. Redirect to `/admin/login` on 401. |

### Verification
- Unauthenticated `GET /api/media` returns 401
- Login returns a JWT; subsequent requests with `Authorization: Bearer <jwt>` succeed
- Expired/invalid tokens return 401

---

## Phase 3 — Unify Routing & URL Structure

**Goal:** One canonical URL pattern for articles. All links, sitemaps, and navigation use it.
**Risk:** Medium | **Effort:** Medium

### Decision: Canonical URL Pattern

Use `/[categorySlug]/[articleSlug]` as the canonical pattern (matches PRD §14 clean URLs: `/category-slug/article-slug`).

The `/blog/[id]` route becomes a **redirect** to the canonical URL for backwards compatibility.

### Tasks

| # | Task | File(s) | Details |
|---|---|---|---|
| 3.1 | Make `/blog/[id]` a redirect | `app/blog/[id]/page.tsx` | Replace full page with `redirect()` to `/${entry.pillar}/${entry.id}`. Keep `generateStaticParams` for the redirect. |
| 3.2 | Update BentoCard links | `components/bento-card.tsx:70` | Change `href` from `/blog/${entry.id}` to `/${entry.pillar}/${entry.id}` |
| 3.3 | Unify article page layout | `app/[categorySlug]/[articleSlug]/page.tsx` | Incorporate the prev/next navigation from `blog/[id]/page.tsx`. Use the shared `Markdown` component instead of inline ReactMarkdown. |
| 3.4 | Verify sitemap URLs | `app/sitemap.ts` | Already uses `/${e.pillar}/${e.id}` — confirm consistency. |
| 3.5 | Verify RSS feed URLs | `app/feed.xml/route.ts` | Already uses `/${e.pillar}/${e.id}` — confirm consistency. |

### Verification
- All card clicks navigate to `/[pillar]/[id]`
- Old `/blog/[id]` URLs redirect to `/[pillar]/[id]`
- Sitemap, RSS, and in-page links all use the same pattern
- Article page shows prev/next navigation and uses shared `Markdown` component

---

## Phase 4 — Decompose Oversized Components

**Goal:** Break components that approach or exceed convention limits into focused, single-responsibility units.
**Risk:** Low | **Effort:** Medium

### Tasks

| # | Task | File(s) | Details |
|---|---|---|---|
| 4.1 | Extract `SiteHeader` | `components/site-header.tsx` (new) | Move header, nav links, theme toggle, mobile menu, and external links out of `page-shell.tsx`. |
| 4.2 | Extract `NavIndicator` hook | `hooks/use-nav-indicator.ts` (new) | Move the `useEffect` + `indicator` state logic for the sliding nav underline. |
| 4.3 | Simplify `PageShell` | `components/page-shell.tsx` | After extraction, should be ~40 lines: compose `SiteHeader`, `IntroCard`, `GardenBoard`, `SiteFooter`. |
| 4.4 | Extract `ArticleMeta` | `components/article-meta.tsx` (new) | The subsection badge + date + reading time display (duplicated between article pages). |
| 4.5 | Extract `Breadcrumb` | `components/breadcrumb.tsx` (new) | Breadcrumb nav component (currently inline in both category and article pages). |
| 4.6 | Extract `PrevNextNav` | `components/prev-next-nav.tsx` (new) | Previous/Next article navigation from `blog/[id]/page.tsx`. |

### Verification
- No component file exceeds 150 lines
- `page-shell.tsx` is under 80 lines after decomposition
- Visual appearance is identical
- All navigation, theme toggle, and mobile menu still work

---

## Phase 5 — API Layer Structure & Validation

**Goal:** Align API routes with the controller/service/validation pattern from CONVENTIONS.md §8.
**Risk:** Low | **Effort:** Medium

### Tasks

| # | Task | File(s) | Details |
|---|---|---|---|
| 5.1 | Create media service | `lib/api/media-service.ts` (new) | Move DB query logic from route handlers into service functions: `listMedia()`, `createMedia()`, `deleteMedia()`. |
| 5.2 | Create upload service | `lib/api/upload-service.ts` (new) | Move file write logic: `saveUpload(file)`. |
| 5.3 | Add zod validation | `lib/api/media-validation.ts` (new) | Zod schemas for upload params (file type, size limits). |
| 5.4 | Simplify route handlers | `app/api/media/*/route.ts` | Each handler becomes: validate → call service → return response. Under 20 lines each. |
| 5.5 | Create content service interface | `lib/content-service.ts` (new) | Define an interface (`ContentService`) that abstracts data access: `getEntries()`, `getEntryById()`, `getPillars()`. Initial implementation wraps the filesystem. Future: swap for DB implementation. |
| 5.6 | Update page data fetching | All `page.tsx` files | Use `ContentService` instead of importing directly from `garden-data.ts`. |

### Verification
- All API routes under 60 lines
- Business logic is in service files
- Zod validation rejects invalid input
- Pages still render correctly using the content service interface
- `garden-data.ts` is only imported by the content service implementation

---

## Phase 6 — Convention Compliance Sweep

**Goal:** Fix remaining convention violations across the codebase.
**Risk:** Low | **Effort:** Small

### Tasks

| # | Task | File(s) | Details |
|---|---|---|---|
| 6.1 | Convert default exports to named | All `page.tsx`, `layout.tsx` | Note: Next.js requires default exports for page/layout files. Add a `// eslint-disable-next-line` or update CONVENTIONS.md to exempt Next.js page/layout files. |
| 6.2 | Update CONVENTIONS.md | `PRD/CONVENTIONS.md` | Add explicit exemption: "Next.js page and layout files require default exports — these are exempt from the named-only rule." |
| 6.3 | Remove unused `Inter` import | `app/blog/[id]/page.tsx:9` | This file will be a redirect after Phase 3. If any remnants remain, clean up. |
| 6.4 | Clean up `components/markdown.tsx` | `components/markdown.tsx` | Ensure it handles all the cases that `blog/[id]/page.tsx` handled inline (headings, lists, blockquotes, links, code, strong). |

### Verification
- `npm run lint` passes
- All files under 200 lines
- All components under 150 lines
- No dead code or unused imports

---

## Phase 7 — Add Caching & Performance

**Goal:** Prevent repeated filesystem reads during builds. Prepare for scale.
**Risk:** Low | **Effort:** Small

### Tasks

| # | Task | File(s) | Details |
|---|---|---|---|
| 7.1 | Add in-memory cache to content service | `lib/content-service.ts` | Cache `getEntries()` and `getPillars()` results. Invalidate on demand (or use Next.js `unstable_cache`). |
| 7.2 | Add `generateStaticParams` to category pages | `app/[categorySlug]/page.tsx`, `app/[categorySlug]/[articleSlug]/page.tsx` | Enable static generation for all known content at build time. |

### Verification
- Build time doesn't degrade as content grows
- Pages are statically generated at build time
- Content updates trigger rebuilds (or use ISR with revalidation)

---

## Execution Order & Dependencies

```
Phase 1 (Config Fixes)
    │
    ├──► Phase 2 (Auth)
    │        │
    │        ├──► Phase 5 (API Structure)
    │        │
    │        └──► Phase 6 (Convention Sweep)
    │
    ├──► Phase 3 (Routing)
    │        │
    │        └──► Phase 4 (Decompose Components)
    │
    └──► Phase 7 (Caching) — can run in parallel with any phase
```

**Recommended order:** 1 → 2 → 3 → 4 → 5 → 6 → 7

Phase 1 and 7 are independent and can be done at any point. Phase 2 should precede Phase 5 (auth middleware is needed before restructuring API routes). Phase 3 should precede Phase 4 (routing changes affect component structure).

---

## Estimated Effort

| Phase | Effort | Files Changed | Files Created |
|---|---|---|---|
| 1 — Config Fixes | 30 min | 4 | 0 |
| 2 — Auth | 1 hr | 5 | 1 |
| 3 — Routing | 1.5 hr | 4 | 0 |
| 4 — Decompose | 2 hr | 2 | 4–5 |
| 5 — API Structure | 2 hr | 4 | 3–4 |
| 6 — Convention Sweep | 30 min | 3–4 | 0 |
| 7 — Caching | 30 min | 1–2 | 0 |
| **Total** | **~8 hrs** | | |
