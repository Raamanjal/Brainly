# MindShelf — Implementation Roadmap

> Working name: **MindShelf**. It describes a personal library for links, notes, PDFs, media, search, and AI without overlapping with the well-known Brainly education brand.

## Product goal

Turn the current saved-link application into a reliable personal second brain: users can save, organise, search, share, and eventually ask questions about their links, media, notes, and uploaded documents.

---

## Phase 1 — Fix existing functionality

### 1. Fix deletion

- [x] Add a delete button to every content card.
- [x] Change the API to `DELETE /api/v1/content/:id`.
- [x] Fix the backend ownership check: content records use `userid`, while the current delete query incorrectly uses `userId`.
- [x] Return `404` if the item does not exist or does not belong to the current user.
- [x] Update the UI immediately after a successful delete, or refresh the list.
- [x] Confirm deletion before removing an item.

### 2. Fix sharing

- [x] Add the frontend public route `/share/:hash`.
- [x] Fetch `GET /api/v1/brain/share/:hash` and display a read-only collection page.
- [x] Replace the current `alert()` with copy-to-clipboard and a share-success confirmation.
- [ ] Add a “Stop sharing” action that removes the public link.
- [ ] Add “Regenerate link” for a new public URL.
- [ ] Build the share URL from a frontend environment variable, not `http://localhost:5173`.
- [ ] Make it clear that sharing exposes all currently saved content for that account.

### 3. Authentication and reliability cleanup

- [X ] Protect `/dashboard`; redirect unauthenticated users to sign-in.
- [x] Add logout and remove the stored token.
- [ ] Safely handle expired/invalid JWTs in backend middleware.
- [ ] Redirect to sign-in on `401` API responses.
- [ ] Add form validation to sign-up, sign-in, and content creation.
- [ ] Add loading, empty, error, and retry states.
- [ ] Replace all browser alerts with toast notifications.

---

## Phase 2 — Organisation and normal search

### 4. Fix and add tags

- [x] Use a consistent tag model with `title` and `userId`.
- [x] Tags must be unique per user, but different users may have the same tag title.
- [x] Add create/select tags in the Add Content modal.
- [x] Populate tags when content is fetched.
- [x] Add endpoints:

```text
POST   /api/v1/tags
GET    /api/v1/tags
PATCH  /api/v1/tags/:id
DELETE /api/v1/tags/:id
```

- [x] When a tag is deleted, remove its reference from all associated content safely.
- [x] Render tags as selectable chips on content cards.

### 5. Filter by tag and type

- [ ] Replace the static sidebar items with the user’s actual tags.
- [ ] Add “All content” and type filters.
- [ ] Allow filtering by one or more tags.
- [ ] Persist filters in the URL, for example:

```text
/dashboard?tags=react,typescript&type=video
```

- [ ] Show the active filters and provide a clear-all action.

### 6. Normal keyword search

- [ ] Add a search bar for title, URL, manual notes, and tag names.
- [ ] Extend content listing: `GET /api/v1/content?query=&tags=&type=`.
- [ ] Debounce search input on the frontend.
- [ ] Add indexes for `userid`, `tags`, `type`, and searchable content fields.
- [ ] Display a useful “no matches” state.

---

## Phase 3 — Better content capture and file support

### 7. Support more content types

- [ ] Video: YouTube, Vimeo, Loom, and other sources where embedding is permitted.
- [ ] Audio: Spotify, SoundCloud, podcast links, and uploaded audio.
- [ ] Articles: normal web links with fetched metadata.
- [ ] Images: remote image URLs and uploaded images.
- [ ] PDFs: public PDF links and uploaded PDFs.
- [ ] Notes: text-only personal entries.
- [ ] Replace the current two-button type selection with a full type selector.
- [ ] Validate URL source/type combinations and show a preview before saving.

### 8. Uploads and downloads

- [ ] Upload PDFs, images, and audio to object storage; do not store large files directly in MongoDB.
- [ ] Store file metadata in MongoDB: original filename, MIME type, size, storage key, and download URL.
- [ ] Add secure download and delete endpoints.
- [ ] Enforce file-type and file-size limits.
- [ ] Extract PDF text after upload for keyword search and future AI features.

---

## Phase 4 — AI enrichment

### 9. Auto-tagging, summaries, and smart titles

- [ ] When content is saved, retrieve permitted metadata, text, or a transcript where available.
- [ ] Generate a cleaner title, short summary, and 3–6 suggested tags using an AI model.
- [ ] Match suggested tags against the user’s current tags; create new tags only when needed.
- [ ] Add fields such as:

```ts
summary: string
sourceText: string
aiStatus: "pending" | "complete" | "failed"
```

- [ ] Run AI enrichment asynchronously in a background job so saving content remains fast.
- [ ] Let users edit or reject generated titles, summaries, and tags.

---

## Phase 5 — Embeddings and RAG

### 10. Good embeddings

- [ ] Split extracted text into small, meaningful chunks; do not create only one embedding for an entire PDF or video.
- [ ] Generate and store an embedding for each chunk.
- [ ] Store chunk metadata:

```ts
contentId: ObjectId
userId: ObjectId
chunkText: string
chunkIndex: number
embedding: number[]
```

- [ ] Start with MongoDB Atlas Vector Search for the simplest fit with the current MongoDB stack.
- [ ] Alternatives: PostgreSQL + pgvector, Qdrant, or Pinecone.
- [ ] Always filter vector searches by `userId`; users must never retrieve another user’s content.
- [ ] Recreate embeddings if extracted source text changes.

### 11. AI search and chat with PDFs (RAG)

Build a dedicated “Ask MindShelf” page:

```text
User question
→ create an embedding for the question
→ retrieve the most relevant chunks for that user
→ send question + retrieved chunks to the AI model
→ return an answer with cited saved items
```

- [ ] Cite every answer with source cards and original links.
- [ ] Let users open a cited source in the dashboard or original website.
- [ ] Tell the user when there is insufficient context instead of inventing an answer.
- [ ] Support PDF chat because PDF text is extracted and chunked at upload time.
- [ ] Keep normal keyword search: it is faster and better for exact titles and URLs.

---

## Phase 6 — UI, product identity, and polish

### 12. Better UI

- [ ] Responsive, mobile-friendly layout.
- [ ] Card grid/list view toggle.
- [ ] Better cards: favicon, thumbnail, tags, summary, saved date, and action menu.
- [ ] Improved capture flow: paste URL → preview metadata → add tags/notes → save.
- [ ] Accessible modal behavior: keyboard navigation, Escape-to-close, focus management, and semantic buttons.
- [ ] Dark mode.
- [ ] Keyboard shortcuts and a command palette.
- [ ] Consistent toast notifications and polished empty states.

### 13. Rename and branding

- [ ] Rename “Brainly” across frontend labels, metadata, favicon, README, and deployment configuration.
- [ ] Preferred name: **MindShelf**.
- [ ] Other possible names: Recall, Linkloom, SecondBrain, NexusNote.
- [ ] Create a simple logo, colour system, and typography rules that support the new identity.

---

## Recommended build order

```text
Delete + share fixes
→ tags + tag filters
→ normal search
→ more content types + secure uploads
→ UI refresh and rename
→ AI titles, summaries, and auto-tags
→ extraction + chunking + embeddings
→ RAG chat with citations
```

## Key principle

Do not begin embeddings or RAG until content ownership, tagging, uploads, and ordinary search are dependable. Strong foundations make the AI layer safer, cheaper, and much more useful.
