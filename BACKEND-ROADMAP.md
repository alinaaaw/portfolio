# Backend Roadmap

This document defines when and why backend capabilities should be added to the Lab 17 portfolio. It is a product and architecture roadmap, not a description of current functionality.

## 1. Current State and Principles

The website is currently a JSON-driven interactive frontend. Visitor-facing content is stored in `content/*.json`, imported by the application, and published as part of each site build. The existing portfolio does not require a database or CMS to function.

Add backend infrastructure only when a feature needs at least one of the following:

- A secret that must never reach the browser
- Persistent or shared data
- Private owner-only tools
- Dynamic publishing without rebuilding the website
- Server-side validation, rate limiting, or abuse protection

Backend work should follow these principles:

- Preserve the atmosphere and exploration structure of the lab.
- Introduce capabilities gradually instead of replacing the JSON system at once.
- Keep structural scene configuration and stable interface labels in JSON.
- Collect the minimum visitor data needed for a clear product purpose.
- Treat AI output as a draft or sourced answer, never as unquestioned truth.
- Prefer simple, reversible implementations with clear fallback behavior.

## 2. Phase One: AI Lab Guide and Dossier Q&A

The first backend feature should be an in-world AI guide. It should help visitors explore the lab and answer detailed questions about Alina's work without breaking the mystery or exposing private material.

### Visitor Experience

The guide receives lightweight context about the current scene, discovered objects, and exploration progress. It can then:

- Answer questions about projects, experience, research, and process
- Suggest a relevant scene, object, file, or next action
- Connect related material from different areas of the lab
- Avoid revealing content the visitor has not unlocked

### Approved Knowledge Base

The assistant should answer only from approved public materials:

- Project summaries and case studies
- Professional experience and public resume content
- Research notes and design-process documentation
- Selected public dossier files
- Navigation descriptions for the interactive lab

When the knowledge base does not support an answer, the guide should say so rather than inventing information. Answers should reference the relevant source file or section when possible.

### Request Architecture

1. The browser sends the question and exploration context to `POST /api/guide`.
2. A Cloudflare Worker validates and rate-limits the request.
3. The Worker calls the OpenAI Responses API and uses File Search with a vector store containing the approved dossier files.
4. The endpoint returns a concise answer, source references, and an optional exploration suggestion.

The `OPENAI_API_KEY` must be stored as a Cloudflare secret and used only by the Worker. It must never appear in browser code, public environment variables, or the repository.

### Safety and Privacy

- Clearly identify the guide as an AI assistant.
- Limit question length, answer length, and request frequency.
- Add abuse protection such as Turnstile if needed.
- Keep conversation state in the browser or short-lived server state for the first version.
- Do not permanently store full chat transcripts in the MVP.
- Provide a useful fallback when the AI service is unavailable.

## 3. Phase Two: Analytics and Feedback

After the AI guide works reliably, add privacy-conscious analytics that combine exploration behavior, AI question patterns, and direct visitor feedback. These should be treated as one analytics system rather than separate tracking features.

### Useful Events and Metrics

Exploration events:

- Scene entered or object inspected
- Computer file, book, or project opened
- Fax discovered or exploration completed
- Contact method selected

AI guide events:

- Normalized question topic, such as projects, experience, research, contact, or navigation
- Dossier files or sections retrieved
- Answered, unanswered, refused, or failed result
- Suggested location and whether the visitor followed it
- Response latency and approximate usage or cost range
- Whether the visitor continued exploring after using the guide

Feedback events:

- Helpful or not-helpful rating
- Optional short visitor comment
- Missing information or unanswered-question category

### Privacy Rules

- Prefer aggregate events and normalized topics over raw question text.
- Do not store IP addresses, precise location, or unnecessary identifiers.
- Use a random anonymous session identifier only when events need to be connected into a journey.
- If raw questions or feedback are retained, provide notice, redact sensitive information, define a short retention period, and support deletion.

An owner dashboard could summarize popular topics, unanswered questions, helpfulness ratings, common exploration journeys, and recent feedback. Cloudflare D1 is an appropriate datastore once persistent analytics are introduced.

## 4. Phase Three: Content Management and Publishing

The CMS should be a small private publishing tool, not a replacement for the entire website architecture.

### Hybrid Content Model

Keep these items in JSON because they are structural and rarely change:

- Scene configuration and object identifiers
- Navigation labels and interaction controls
- Stable system messages and shared interface copy
- Data shapes required by the 3D experience

Move frequently updated editorial content to Cloudflare D1 only when needed:

- Lab Log entries
- Project updates and case studies
- Books and references
- Drafts, publication state, and revision metadata

The website should keep a safe JSON fallback if dynamic content cannot be loaded.

### Staged CMS Rollout

0. Continue using local JSON with AI-assisted editing and normal site deployment.
1. Build the smallest private CMS for Lab Log entries only.
2. After the Lab Log workflow is proven, expand the editor to projects and books.
3. Add images, PDFs, and other media only after text publishing is stable.
4. Add scheduling or advanced revision management only when there is a demonstrated need.

### Minimum CMS Workflow

1. Alina signs in to the private owner area.
2. She creates an entry manually or asks AI to generate a structured draft from her notes.
3. She edits the draft and previews it inside the lab presentation.
4. She explicitly approves and publishes it.
5. She can unpublish or roll back to an earlier revision.

AI-generated content must never publish automatically. The editor should validate the generated structure before previewing or saving it.

### Lab Log First Release

The first CMS-managed content type should contain only the fields needed by the existing Lab Log:

- Date and time
- Entry type
- Title
- Short body
- Related project or experience
- Tags
- Draft or published status
- Revision timestamp

This provides useful dynamic publishing without requiring the 3D application to be rebuilt around a general-purpose CMS.

### Media Uploads Later

When media management becomes necessary, use private drafts and public assets with:

- File-type and size restrictions
- Image optimization and accessible descriptions
- Safe PDF and document handling
- Replacement, deletion, and unused-file cleanup
- Cloudflare R2 or an equivalent object store

Uploaded material could appear as computer files, books, drawer documents, or pinned board references.

## 5. Optional Future Capabilities

These features should wait until the AI guide, analytics, and basic publishing workflow are stable.

### Exploration Progress and Server-Side Unlocks

Anonymous progress can begin in browser storage and include discovered objects, opened files, completed clue sequences, the fax state, and the last visited scene.

Use backend storage only for cross-device progress, account-based progress, or hidden content that must not be included in downloaded frontend data. For protected reveals, the server should validate unlock conditions rather than trusting only the browser.

### Contact and Messages

Keep the existing `mailto:` interaction initially. If visitors have trouble using it, add a short in-world form that sends name, email, and message through a transactional email service without permanently storing the message.

The form would require server-side validation, rate limiting, spam protection, clear success and failure states, and a decision about email verification. A private message inbox should be considered only if search, status, history, or internal notes later provide enough value to justify the additional personal-data responsibility.

### Real-Time Lab Events

Real-time delivery could support a newly received fax, workstation alert, synchronized Lab Log entry, or time-limited project event. Most updates should use ordinary database requests or periodic refreshes. Add real-time infrastructure only when immediate delivery materially improves the experience.

## 6. Expected Backend Services

| Capability | Likely service | Introduce when |
| --- | --- | --- |
| API routes, secret handling, and validation | Cloudflare Worker | AI guide MVP |
| Dossier retrieval and answer generation | OpenAI Responses API and File Search | AI guide MVP |
| Anonymous analytics and feedback | Cloudflare D1 | Analytics phase |
| CMS records, drafts, and revisions | Cloudflare D1 | Lab Log CMS |
| Uploaded images and documents | Cloudflare R2 | Media phase |
| Contact delivery | Transactional email provider | Only if a form replaces `mailto:` |
| Device-local exploration progress | Browser storage | Before any account system |

## 7. Implementation Order

0. Keep the current JSON publishing workflow and use AI-assisted local editing when helpful.
1. Build the AI Lab Guide MVP with an approved dossier knowledge base and no permanent chat storage.
2. Add unified exploration analytics, AI question analytics, and user feedback.
3. Build the private Lab Log CMS with AI drafting, manual approval, preview, publishing, and rollback.
4. Expand the proven CMS workflow to projects and books.
5. Add file and media uploads.
6. Add persistent exploration progress and server-side unlocks if the experience requires them.
7. Add a server-sent contact form only if the existing email link is insufficient.
8. Add real-time lab events only for a clearly defined experience.

The AI Lab Guide provides the clearest reason to introduce a backend. The CMS should follow only after the guide and analytics create a real need for private data tools. This order keeps the first backend small while preserving a path toward dynamic publishing and richer visitor insight.
