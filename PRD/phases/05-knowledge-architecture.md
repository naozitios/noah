# Phase 5 — Knowledge Architecture

**Goal:** Build the full knowledge graph features — hierarchical category navigation, internal linking management, backlinks display, and rich related article logic.

## Dependencies

- Phase 4 (Reader Website) — reader pages exist to add features to

---

## Scope

### 5.1 Hierarchical Category Navigation

- Full recursive category tree in navigation
- All levels expandable/collapsible
- Category page shows only direct children (not all descendants flat)
- Breadcrumbs support unlimited nesting depth

### 5.2 Internal Linking Graph

- CRUD UI for `article_links` in the admin dashboard
  - Table showing all outbound links from an article
  - Add link: search + select destination article
  - Remove link
- On article save, parse TipTap JSON for internal links and sync `article_links` table
- Backlinks section on article page: "Referenced in X other articles"

### 5.3 Enhanced Related Articles

Improve the Phase 4 related articles logic:

- Weighted scoring based on:
  - Shared categories (highest weight)
  - Shared tags
  - Direct link in `article_links`
  - Backlink presence
- Display top 3–5 related articles
- Exclude current article from results

### 5.4 Admin: Link Manager

- Dedicated page listing all article-to-article links
- Filter by source or destination article
- Detect broken links (linking to deleted/draft articles)
- Bulk remove links

### 5.5 Sitemap Breadcrumbs

Ensure breadcrumbs appear on every category and article page consistently, including full parent chain up to root.

---

## API Additions

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /api/articles/:id/backlinks | No | List articles linking to this one |
| GET | /api/articles/:id/related | No | Get related articles (scored) |

---

## Acceptance Criteria

- [ ] Category navigation shows all levels of the tree
- [ ] Article links are extracted on save and stored in `article_links`
- [ ] Backlinks section shows on article page
- [ ] Related articles use weighted scoring
- [ ] Admin can view and manage all article links
- [ ] Breadcrumbs render correctly for deeply nested categories
- [ ] Removing a linked article handles broken references gracefully

---

## Coding Conventions

All code in this phase must follow [CONVENTIONS.md](../CONVENTIONS.md). Business logic belongs in service layer, not route handlers.
