# Phase 7 — SEO & Polish

**Goal:** Ensure every article is independently indexable with proper metadata, structured data, sitemaps, and performance optimization.

## Dependencies

- Phase 4 (Reader Website) — article pages exist to add meta tags to

---

## Scope

### 7.1 Per-Article SEO Metadata

Admin editor additions:

- SEO Title field (defaults to article title, max 70 chars)
- SEO Description field (defaults to summary, max 160 chars)
- Open Graph Image override (defaults to featured image)
- Slug editing (with uniqueness validation)
- Canonical URL field (auto-generated, editable override)

### 7.2 HTML Meta Tags

Every reader page renders:

| Tag | Source |
|---|---|
| `<title>` | seo_title → title → site name |
| `<meta name="description">` | seo_description → summary |
| `<link rel="canonical">` | Canonical URL |
| `<meta property="og:title">` | seo_title → title |
| `<meta property="og:description">` | seo_description → summary |
| `<meta property="og:image">` | OG image → featured image |
| `<meta property="og:url">` | Current page URL |
| `<meta property="og:type">` | "article" for articles, "website" for others |
| `<meta name="twitter:card">` | "summary_large_image" |
| `<meta name="twitter:title">` | seo_title → title |
| `<meta name="twitter:description">` | seo_description → summary |
| `<meta name="twitter:image">` | OG image → featured image |

### 7.3 JSON-LD Structured Data

Inject JSON-LD on article pages:

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Article Title",
  "description": "SEO description or summary",
  "image": "Featured image URL",
  "author": {
    "@type": "Person",
    "name": "Admin Name"
  },
  "datePublished": "2024-01-01T00:00:00Z",
  "dateModified": "2024-06-01T00:00:00Z"
}
```

### 7.4 XML Sitemap

- Auto-generated sitemap at `/sitemap.xml`
- Includes all published articles and category pages
- Updates when articles are published or unpublished
- Proper `<lastmod>`, `<changefreq>`, `<priority>` values

### 7.5 robots.txt

- Served at `/robots.txt`
- Allow all crawler access
- Disallow `/admin` paths
- Point to sitemap

### 7.6 Image Optimization

- Serve WebP format where supported (convert on upload via sharp)
- Generate thumbnails (200px) and medium (800px) variants
- Lazy loading with blur-up placeholder
- Proper alt text on all images

### 7.7 Performance Optimization

- Enable compression (brotli / gzip) at Nginx level
- Set proper Cache-Control headers for static assets
- Implement CDN for static assets (Cloudflare or similar)
- Minimize CSS/JS bundle sizes
- Core Web Vitals audit: target LCP < 2.5s, FID < 100ms, CLS < 0.1
- Lighthouse score target: 90+ across all categories

---

## Acceptance Criteria

- [ ] Every article page has unique title and meta description
- [ ] Open Graph and Twitter Card tags render correctly
- [ ] JSON-LD structured data validates on Schema.org
- [ ] /sitemap.xml contains all published articles and categories
- [ ] /robots.txt disallows /admin
- [ ] Images are optimized and served in WebP
- [ ] Lighthouse score ≥ 90 on desktop and mobile
- [ ] Sitemap auto-updates on publish/unpublish

---

## Coding Conventions

All code in this phase must follow [CONVENTIONS.md](../CONVENTIONS.md). Meta tag generation should be in a single utility module under 200 lines.
