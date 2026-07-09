# Phase 8 — Version History

**Goal:** Track every article revision with snapshot storage, side-by-side diff, and the ability to restore previous versions.

## Dependencies

- Phase 3 (TipTap Editor) — content is in TipTap JSON format for meaningful diffing

---

## Scope

### 8.1 Auto-Save Revisions

- On every article save (manual or auto-save), create a new row in `revisions` table
- Store full `content_json` and `content_html` snapshots
- Record `created_at` timestamp
- Skip revision if content is identical to last revision (compare JSON hash)

### 8.2 Revision Timeline

- In the admin article editor, a "History" panel/section
- List view of all revisions for the current article
- Each entry shows: version number, timestamp, word count, character count
- Click a revision to view its content (read-only)

### 8.3 Side-by-Side Diff

- Compare any two revisions side-by-side
- Left panel: older revision, Right panel: newer revision
- Highlight added (green) and removed (red) text
- If TipTap JSON diff is complex, fall back to HTML diff

### 8.4 Restore Revision

- "Restore this version" button on each revision
- Confirmation dialog before restore
- On restore:
  - Current content is saved as a revision (auto-snapshot)
  - Restored revision content replaces both `content_json` and `content_html`
  - `updated_at` timestamp updates
  - A new revision entry is created (the restored state)

### 8.5 API

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /api/articles/:id/revisions | Yes | List all revisions for an article |
| GET | /api/revisions/:id | Yes | Get full content of a specific revision |
| POST | /api/articles/:id/restore/:revisionId | Yes | Restore a previous revision |

---

## Acceptance Criteria

- [ ] Every save creates a revision entry
- [ ] Duplicate content does not create duplicate revisions
- [ ] Revision list shows chronological history with timestamps
- [ ] Side-by-side diff highlights changes clearly
- [ ] Restoring a revision correctly updates article content
- [ ] Restore operation creates a snapshot of the pre-restore state
- [ ] Revision history is accessible from the article editor
- [ ] API endpoints return data correctly

---

## Coding Conventions

All code in this phase must follow [CONVENTIONS.md](../CONVENTIONS.md). Diff logic should be extracted into a dedicated utility file.
