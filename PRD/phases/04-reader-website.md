# Phase 4 — Reader Website

**Goal:** Build the public-facing reader experience — homepage, article pages, category pages with breadcrumbs, navigation, and responsive layout.

## Dependencies

- Phase 1 (Foundation) — read APIs
- Phase 3 (TipTap Editor) — `content_html` available for rendering

---

## Scope

### 4.1 Homepage

- Site name and tagline
- Category tree (top-level categories with expandable children)
- Featured / recent articles grid
- Search bar (UI only — search logic in Phase 6)
- Footer with links

### 4.2 Article Page

- Clean, typography-focused layout (Medium-like)
- Featured image at top (if `featured_image_id` set)
- Article title
- Published date and last updated date
- Category breadcrumbs
- Rendered HTML content from `content_html`
- Tags displayed below content
- Related articles sidebar (based on shared categories — basic implementation)
- Previous / Next article navigation within current category
- Share buttons (copy link)
- Internal links navigate to other articles in-platform

### 4.3 Category Page

- Category title
- List of articles in this category (title + summary + date)
- Subcategory navigation (if child categories exist)
- Breadcrumbs showing full category path

### 4.4 Breadcrumbs

Every article and category page shows:

`Home > Category > Subcategory > Article Title`

### 4.5 Responsive Layout

- Mobile-first design
- Single column on mobile, two-column on desktop (sidebar)
- Collapsible navigation on mobile
- Touch-friendly tap targets

### 4.6 Navigation

- Header with site name and top-level category links
- Category dropdown / expandable menu
- Footer with category sitemap and links

### 4.7 Performance

- Lazy-load images (loading="lazy")
- Pre-rendered HTML from API (no client-side rendering pipeline)
- Minimal JavaScript for read pages (avoid React overhead where possible — consider SSR or static generation per article)

---

## Acceptance Criteria

- [ ] Homepage loads and displays categories + recent articles
- [ ] Article page renders HTML content correctly
- [ ] Category page lists articles with subcategory navigation
- [ ] Breadcrumbs show correct path on every page
- [ ] Internal links navigate to correct articles
- [ ] Related articles shown on article page
- [ ] Previous / Next navigation works
- [ ] Layout is responsive (mobile, tablet, desktop)
- [ ] Images lazy-load
- [ ] Page loads fast (< 2s on 3G)

---

## Coding Conventions

All code in this phase must follow [CONVENTIONS.md](../CONVENTIONS.md). One component per file, max 150 lines per component.
