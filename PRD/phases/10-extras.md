# Phase 10 — Extras

**Goal:** Add quality-of-life features — dark mode, RSS feed, newsletter integration, analytics dashboard, and final polish.

## Dependencies

- Phase 4 (Reader Website) — reader pages exist for enhancements
- Phase 7 (SEO & Polish) — sitemap and metadata foundation in place

---

## Scope

### 10.1 Dark Mode

- Toggle in reader website header
- Persist preference in `localStorage`
- Respect `prefers-color-scheme` media query (respect system setting by default)
- Tailwind dark mode class strategy
- All reader pages support dark mode
- Admin dashboard dark mode (if time permits)

### 10.2 RSS Feed

- Auto-generated RSS 2.0 feed at `/feed.xml` or `/rss.xml`
- Includes all published articles (title, summary, link, pubDate)
- Ordered by `published_at` descending
- Category-specific feeds: `/feed.xml?category=engineering`
- Cache feed output and regenerate on publish/unpublish

### 10.3 Newsletter Integration

- "Subscribe via email" form on homepage and article pages
- Integration with external newsletter service:
  - **Option A**: ConvertKit API
  - **Option B**: Mailchimp API
  - **Option C**: Beehiiv API
- Email collected and sent to the service via server-side API call
- Double opt-in handled by the external service
- Configurable via admin settings

### 10.4 Analytics Dashboard

- Simple analytics tracked in the database:
  - Page views per article
  - Referrer tracking
  - Daily unique visitors (by IP hash)
  - Top 10 articles by views
  - Top 10 referrers

| Column | Type | Notes |
|---|---|---|
| id | UUID | |
| article_id | UUID | FK → articles (nullable for homepage) |
| path | TEXT | Request path |
| referrer | TEXT | HTTP referrer |
| ip_hash | VARCHAR(64) | Anonymized IP (SHA256) |
| user_agent | TEXT | |
| created_at | TIMESTAMPTZ | |

- Admin dashboard shows:
  - Total page views (30-day, all-time)
  - Views per article
  - Views over time (line chart)
  - Top referrers
- Privacy: no cookies, no personal data stored, IPs are hashed
- Libraries: Chart.js or Recharts for charts

### 10.5 Final Polish

- **Loading states**: Skeleton loaders on all pages
- **Error pages**: Custom 404, 500 pages for reader site
- **Toast notifications**: Success/error feedback in admin dashboard
- **Keyboard shortcuts**: Document admin keyboard shortcuts (Ctrl+S to save, etc.)
- **Accessibility audit**: Ensure WCAG 2.1 AA compliance
  - Proper heading hierarchy
  - Alt text on all images
  - Focus indicators
  - Keyboard navigable
  - Screen reader friendly
- **SEO checklist**: Final review of all Phase 7 items
- **Security audit**:
  - Rate limiting on login and search endpoints
  - CORS configuration
  - Helmet.js middleware for security headers
  - SQL injection prevention (already handled by ORM)
  - XSS prevention (already handled by DOMPurify in content pipeline)

---

## API Additions

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/analytics/pageview | No | Record a page view |
| GET | /api/analytics/stats | Yes | Get analytics data for dashboard |

---

## Acceptance Criteria

- [ ] Dark mode toggle works and persists across sessions
- [ ] RSS feed validates and contains all published articles
- [ ] Newsletter signup form submits email to external service
- [ ] Analytics dashboard shows correct page view data
- [ ] Custom 404 page displays for unknown routes
- [ ] All admin actions show toast feedback
- [ ] Lighthouse accessibility score ≥ 90
- [ ] Security headers are present (CSP, X-Frame-Options, etc.)
- [ ] Login endpoint has rate limiting

---

## Coding Conventions

All code in this phase must follow [CONVENTIONS.md](../CONVENTIONS.md). Each extra feature is independent — keep each in its own file under 200 lines.
