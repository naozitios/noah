# Phase 3 — TipTap Editor

**Goal:** Integrate a full-featured TipTap editor for article creation with internal linking, image uploads, and the content pipeline (TipTap JSON → HTML → sanitize → store).

## Dependencies

- Phase 1 (Foundation) — article APIs
- Phase 2 (Admin Dashboard) — article create/edit UI entry points

---

## Scope

### 3.1 TipTap Integration

- Install and configure TipTap with React
- Extensions to include:

| Extension | Purpose |
|---|---|
| StarterKit | Headings, bold, italic, lists, code blocks, blockquotes, horizontal rules |
| Underline | Underline formatting |
| Link | Hyperlinks with autocomplete |
| Image | Image embedding (with upload handler) |
| Table | Tables |
| CodeBlockLowlight | Syntax-highlighted code blocks |
| Placeholder | Placeholder text |
| TextAlign | Text alignment |
| TaskList | Checkbox lists |
| SlashCommand | Quick-insert menu (type `/`) |
| Callout | Callout/alert blocks |

### 3.2 Content Pipeline

```
Editor Input
     │
     ▼
TipTap JSON (source of truth)
     │
     ├──► POST /api/articles (stored in content_json)
     │
     └──► Render → HTML (TipTap HTML serializer)
                 → Sanitize (DOMPurify)
                 → Stored in articles.content_html
```

- On save: serialize TipTap state to JSON, render to HTML, sanitize, send both to API
- On edit load: hydrate TipTap editor from saved `content_json`

### 3.3 Image Upload

- Image extension with custom upload handler
- On image insert/paste: upload to media API → insert returned URL into editor
- Progress indicator during upload
- Image alt text editing

### 3.4 Internal Link Autocomplete

- When creating a link, show a searchable dropdown of existing articles
- Fetch article list from API
- Insert link as `<a href="/category-slug/article-slug">`
- On save, also create entry in `article_links` table

### 3.5 Editor UI

- Toolbar: bold, italic, underline, heading selector, list buttons, link, image, code block, table, callout, undo/redo
- Slash command menu
- Full-screen mode toggle
- Word count / reading time estimate (rough)

### 3.6 Preview Mode

- Preview renders `content_html` in a reader-like view
- Accessible via "Preview" button in editor toolbar
- Opens in a modal or side panel

### 3.7 Auto-Save

- Debounced auto-save (e.g., 3 seconds after last keystroke)
- Saves as draft status
- Indicators: "Saving..." → "Saved" → "Draft saved at 2:30 PM"
- Manual "Save Draft" and "Publish" buttons

### 3.8 API Additions

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /api/articles/search?q= | Yes | Search articles by title (for link autocomplete) |

---

## Acceptance Criteria

- [ ] All TipTap extensions listed above work in the editor
- [ ] Content pipeline: JSON stored, HTML rendered, sanitized, displayed in preview
- [ ] Images upload correctly and appear in the editor
- [ ] Internal link autocomplete shows article suggestions
- [ ] Saving creates both `content_json` and `content_html`
- [ ] Preview mode shows rendered article accurately
- [ ] Auto-save saves draft on idle
- [ ] Publish sets status to `published` with `published_at` timestamp
- [ ] Editing existing article loads previously saved TipTap state

---

## Coding Conventions

All code in this phase must follow [CONVENTIONS.md](../CONVENTIONS.md). Extract editor extensions into separate files (one per extension) to stay under 200 lines per file.
