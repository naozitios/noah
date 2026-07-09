# Inline Media Upload for Article Editor

**Status:** Proposed  
**Phase:** Post-MVP Polish  
**Priority:** Medium  

---

## Overview

Enable users to upload and insert media directly within the article markdown editor, eliminating the need to toggle between the editor and media library.

---

## Problem

Current workflow is inefficient:
1. User writing article needs an image
2. Leaves editor → navigates to `/admin/media`
3. Uploads file → copies path
4. Returns to editor → manually pastes `![alt](/uploads/...)`

Users should be able to insert media without leaving the editor.

---

## Solution

Add two features to the article editor:

### 1. Quick Upload Button
- **Location:** Above the markdown textarea
- **Action:** Opens file picker
- **Behavior:**
  - User selects file → uploads to `/api/media/upload`
  - Auto-inserts markdown syntax at cursor: `![filename](/uploads/path)`
  - Shows upload progress indicator
  - Handles errors gracefully

### 2. Media Library Picker Modal
- **Location:** Next to upload button
- **Action:** Opens modal showing all uploaded media
- **Behavior:**
  - Lists files from `/api/media`
  - Click to insert: `![filename](/uploads/path)`
  - Search/filter by filename
  - Shows file metadata (size, type)

---

## Technical Requirements

### UI Components
- Media toolbar above textarea with two buttons:
  - "📤 Upload Media" → file input
  - "🖼️ Insert Media" → modal

### API Usage
- `POST /api/media/upload` - upload file
- `GET /api/media` - list media

### Markdown Insertion
- Insert at current cursor position
- Format: `![filename](/uploads/unique-name.ext)`
- Preserve cursor position after insert

### Error Handling
- Network errors → show toast
- File too large → reject
- Upload timeout → retry option

---

## Acceptance Criteria

- [ ] Upload button appears above markdown textarea
- [ ] User can select file and upload without leaving editor
- [ ] Markdown syntax auto-inserts at cursor
- [ ] Media picker modal shows all uploaded files
- [ ] Clicking media in picker inserts markdown
- [ ] Upload progress visible to user
- [ ] Errors display clear messages

---

## Out of Scope

- Drag-and-drop file upload (future)
- Image cropping/editing (future)
- Automatic cleanup of orphaned uploads (future)
- Image optimization/compression (future)

---

## Success Metrics

- Time to insert media reduced from ~3 actions to 1
- User feedback on editor UX
- No increase in API errors during upload
