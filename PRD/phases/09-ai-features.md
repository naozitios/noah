# Phase 9 — AI Features

**Goal:** Enhance the platform with AI-powered features — summaries, related article suggestions, auto-tagging, and a writing assistant.

## Dependencies

- Phase 3 (TipTap Editor) — editor exists for writing assistant integration
- Phase 5 (Knowledge Architecture) — article graph exists for relationship analysis
- Phase 8 (Version History) — revision data may be used for AI context

---

## Scope

### 9.1 AI-Generated Summaries

- Button in the article editor: "Generate Summary with AI"
- Sends article content (TipTap JSON converted to plain text) to an LLM
- LLM returns a 1–3 sentence summary
- Summary is inserted into the `summary` field (editable before save)
- Optional: regenerate summary on content change

Implementation options:
- OpenAI API (`gpt-4o-mini` or similar for cost efficiency)
- Anthropic Claude API
- Self-hosted model (Ollama) for privacy

### 9.2 Related Article Suggestions

- AI-powered recommendations based on content similarity
- Uses embeddings (text-embedding-3-small or similar) to find semantically similar articles
- Store embeddings in a `article_embeddings` table:

| Column | Type |
|---|---|
| article_id | UUID | FK → articles |
| embedding | vector(1536) | Or whatever dimension the model uses |
| updated_at | TIMESTAMPTZ |

- Generate/update embedding on article publish
- Query nearest neighbors for related articles (via pgvector if using Neon, or cosine similarity in application code)
- Fall back to Phase 5's keyword-based related articles if AI unavailable

### 9.3 Auto-Tagging

- On article save, send content to LLM
- LLM suggests 3–5 relevant tags from existing tag set (or proposes new ones)
- Present suggestions to admin as checkboxes: "Suggested tags: [Investment] [Finance] [Risk]"
- Admin accepts/rejects before tags are saved
- Trainable: learn from accepted/rejected tag suggestions over time

### 9.4 Writing Assistant

- In-editor AI features:
  - **Complete sentence**: AI suggests completion of current line
  - **Rewrite**: select text → "Rewrite with AI" → get alternatives
  - **Fix grammar**: AI proofreads selected text
  - **Change tone**: rewrite as professional / casual / persuasive
- Implemented as a TipTap plugin with a floating AI menu
- Requests sent to LLM with relevant context (current paragraph, surrounding text)

### 9.5 Knowledge Graph Visualization

- Visual graph of article connections
- Nodes = articles, edges = `article_links` relationships
- Interactive (drag, zoom, click to navigate)
- Filter by category
- Show related articles via AI similarity as dashed edges
- Library options: D3.js, vis.js, React Flow

### 9.6 Reading Time Estimation

- Calculate from word count of `content_html` (stripped of markup)
- Average reading speed: 200–250 words per minute
- Display on article page: "8 min read"
- Recalculate on article update

---

## Database Addition

```sql
CREATE TABLE article_embeddings (
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  embedding vector(1536),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (article_id)
);
```

Requires pgvector extension on Neon.

---

## Acceptance Criteria

- [ ] "Generate Summary" produces a coherent summary of acceptable length
- [ ] Related articles include semantically similar content (not just shared categories)
- [ ] Auto-tagging suggests relevant existing tags
- [ ] Writing assistant can rewrite/complete text in the editor
- [ ] Knowledge graph visualization renders correctly with real data
- [ ] Reading time displays accurately on article pages
- [ ] All AI features degrade gracefully if the AI service is unavailable
- [ ] API keys managed via server-side env vars (never exposed to client)

---

## Coding Conventions

All code in this phase must follow [CONVENTIONS.md](../CONVENTIONS.md). Each AI feature should be its own module (summaries, embeddings, auto-tagging, writing assistant) to stay under 200 lines each.
