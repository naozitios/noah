# Phase 6 — Search

**Goal:** Implement full-text search across article titles, body, categories, and tags with ranked results.

## Dependencies

- Phase 4 (Reader Website) — search UI placement exists

---

## Scope

### 6.1 Backend: Full-Text Search

Implement using Neon PostgreSQL full-text search (`tsvector` / `tsquery`):

- Create a `tsvector` column on the `articles` table combining:
  - `title` (weighted highest — 'A')
  - `summary` (weighted medium — 'B')
  - `content_html` stripped of HTML tags (weighted lowest — 'C')
- Include category names and tag names via joins
- Create a GIN index on the `tsvector` column
- Query using `ts_query` with prefix matching for partial word search

Search endpoint:

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/search?q= | Full-text search |

Ranking logic:
1. Exact title match
2. Title partial match
3. Tag match
4. Category match
5. Body content match

Results returned as:

```json
{
  "results": [
    {
      "type": "article",
      "slug": "database-design",
      "title": "...",
      "summary": "...",
      "match_field": "title",
      "score": 0.95
    }
  ],
  "query": "database",
  "total": 12
}
```

### 6.2 Search UI

- Search bar in header on all reader pages
- Search results page with:
  - List of results with title, summary, category, and match indicator
  - Highlight matched terms in results
  - "No results" state
  - Loading state
- Keyboard shortcut: `/` to focus search
- Debounced input (300ms delay before querying)

### 6.3 Admin: Article Search

- Reuse search on admin articles list page
- Filter by status alongside search query

---

## Acceptance Criteria

- [ ] Search returns relevant results ranked by the defined logic
- [ ] Partial word search works (e.g., "datab" matches "database")
- [ ] Search indexes titles, body, categories, and tags
- [ ] Results highlight matched terms
- [ ] Empty query returns empty results (no random articles)
- [ ] Search bar is accessible from all reader pages
- [ ] Search works on mobile layout
- [ ] Admin articles list has search functionality

---

## Coding Conventions

All code in this phase must follow [CONVENTIONS.md](../CONVENTIONS.md). API route handlers must stay under 60 lines — extract search query logic into a service.
