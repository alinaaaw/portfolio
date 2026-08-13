# Backend Roadmap

This document records possible backend features for future versions of the Lab 17 portfolio. These are product ideas, not current functionality. The website currently remains a JSON-driven interactive frontend.

## Content Management

Create a private editor where Alina can add or update projects, experience entries, Lab Log posts, notes, links, and images without editing JSON or application code.

Possible capabilities:

- Secure owner login
- Draft and published states
- Scheduled publishing
- Reordering and categorizing entries
- Previewing changes inside the lab before publishing
- Revision history and rollback

## Contact and Messages

Allow visitors to contact Alina through an interaction that belongs naturally in the lab, such as picking up the business card, using the workstation, or leaving a note near the printer.

This feature needs more design work before implementation. A contact form should not feel like a generic form placed on top of the scene, and it should not expose a private inbox or create unnecessary security and maintenance work.

### Possible approaches

#### Email Link Only

Keep the current `mailto:` link. The visitor writes from their own email application, and the website stores nothing.

- Lowest maintenance
- No message database or privacy policy needed
- Naturally preserves the visitor's real email identity
- Depends on the visitor having an email application configured
- Offers little control over the experience

#### Server-Sent Contact Form

Add a short in-world form and send the message to `awu78@uw.edu` through a transactional email service. Do not permanently store the message on the website.

- Provides a smoother experience than `mailto:`
- Keeps the interaction inside the lab
- Avoids building a full private inbox
- Requires server-side validation, rate limiting, spam protection, and an email provider
- The interface must clearly explain what information is being sent

#### Private Message Inbox

Save messages in a database and show them in an owner-only dashboard, with optional email notifications.

- Supports message status, notes, search, and history
- Could become an interesting hidden workstation feature for the owner
- Introduces more personal-data responsibility
- Requires authentication, retention rules, deletion tools, spam controls, and ongoing maintenance

### Recommended direction

Start with the existing email link. If visitors have trouble using it, move to a minimal server-sent form that asks only for name, email, and message. Deliver messages by email without storing them permanently.

The interaction could work like this:

1. The visitor selects Contact.
2. The camera moves to the printer desk and the business card is picked up.
3. The card offers two choices: open email or leave a message.
4. Leave a message opens a small workstation-style note window.
5. After a successful send, the printer produces a short transmission receipt.

Before adding the form, define:

- Which email delivery service to use
- Whether any message data is retained
- Rate limits per visitor
- Spam protection that does not interrupt the atmosphere
- A clear success and failure state
- Whether attachments are prohibited
- How the sender's email address is verified or validated

## Anonymous Exploration Analytics

Record anonymous interaction events to understand how visitors explore the portfolio.

Useful events might include:

- Scene entered
- Object inspected
- Computer file opened
- Project opened
- Fax discovered
- Contact method selected
- Exploration completed

Use aggregate data rather than invasive tracking. Avoid collecting typed content, precise location, or unnecessary identifying information.

## Persistent Exploration Progress

Remember which clues and objects a visitor has already explored so they can continue later.

Possible states:

- Discovered objects
- Opened files and books
- Completed clue sequences
- Fax unlocked or read
- Last visited scene

Anonymous progress could begin with browser storage. Account-based or cross-device progress would require a backend and authentication.

## Hidden Content and Server-Side Unlocks

Keep selected files, messages, or endings on the server until the visitor satisfies an exploration condition.

This could prevent major reveals from being visible immediately in the downloaded frontend data and make the mystery structure more meaningful. The server should validate unlock conditions rather than trusting only the browser.

## File and Media Uploads

Allow Alina to upload project images, papers, PDFs, prototypes, and research artifacts through the private content editor.

The system would need:

- File-type and size restrictions
- Image optimization and accessible descriptions
- Private drafts and public assets
- Replacement and deletion tools
- Storage cleanup for unused files
- Safe PDF and document handling

Uploaded material could appear naturally as computer files, books, drawer documents, or pinned board references.

## Live Lab Log

Publish new Lab Log entries without rebuilding the site. Entries could behave like professional updates while remaining written as authentic lab records rather than generic social-media posts.

Potential fields:

- Date and time
- Entry type
- Title
- Short body
- Related project or experience
- Tags
- Draft or published status

## Real-Time Lab Events

Allow new events to arrive while a visitor is exploring, such as a fax, workstation alert, status update, or newly synchronized Lab Log entry.

Possible uses:

- Alina sends a new research update from the owner dashboard
- The printer receives a time-limited fax
- A workstation file changes from pending to synchronized
- Special events appear during a launch, internship, or project release

Real-time delivery adds infrastructure and should be used only when the event changes the experience meaningfully. Most updates can use normal database requests or periodic refreshes instead.

## Suggested Implementation Order

1. Anonymous exploration analytics
2. Private content management and Live Lab Log publishing
3. File and media uploads
4. Persistent exploration progress
5. Server-side unlocks
6. Carefully designed contact messaging
7. Real-time lab events

The first backend version should remain small. Content management and lightweight analytics provide the clearest value without changing the core atmosphere of the portfolio.
