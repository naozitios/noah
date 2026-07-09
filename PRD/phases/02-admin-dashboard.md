# Phase 2 — Admin Dashboard

**Goal:** Build the React-based admin interface for managing articles, categories, tags, and media.

## Dependencies

- Phase 1 (Foundation) — APIs and auth must exist

---

## Scope

### 2.1 Frontend Scaffolding

- Initialize React project (Vite + TypeScript)
- Set up Tailwind CSS
- Set up routing (React Router)
- Create layout with sidebar navigation
- Configure API client (axios or fetch) with JWT interceptors

### 2.2 Login Page

- Login form (username + password)
- Error state handling
- Redirect to dashboard on success
- Redirect to login if token expired

### 2.3 Dashboard Home

- Stats overview: total articles, published count, draft count
- Quick action buttons (New Article, New Category)
- Recent articles list

### 2.4 Articles CRUD

- Table/list view with columns: title, status, category, updated date
- Search and filter by status
- Create article → opens editor (placeholder until Phase 3)
- Edit article → opens editor
- Delete with confirmation dialog
- Bulk actions (archive, delete)

### 2.5 Categories CRUD

- Tree view showing parent/child relationships
- Expand/collapse children
- Inline create, edit, delete
- Drag or dropdown to set parent category
- Sort order controls

### 2.6 Tags CRUD

- Simple list view
- Create, edit, delete inline

### 2.7 Media Library

- Grid view of uploaded images/files
- Upload button (file picker)
- Drag & drop upload support
- Copy URL / Markdown embed button
- Delete media

### 2.8 API Integration

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/media/upload | Upload file (multipart) |
| GET | /api/media | List media |

(Auth required for all admin calls)

---

## Acceptance Criteria

- [ ] Login page works end-to-end with JWT
- [ ] Dashboard shows correct article stats
- [ ] Articles can be created, edited, and deleted from UI
- [ ] Categories can be managed as a tree from UI
- [ ] Tags can be created and deleted from UI
- [ ] Media can be uploaded and viewed in the library
- [ ] All admin routes redirect to login if unauthenticated
- [ ] Responsive sidebar navigation works

---

## Coding Conventions

All code in this phase must follow [CONVENTIONS.md](../CONVENTIONS.md). Key limits: 200 lines per file, 150 lines per component, named exports only.
