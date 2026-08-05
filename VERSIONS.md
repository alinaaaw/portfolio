# Portfolio Version Architecture

This file is the authoritative guide for opening, creating, and preserving
portfolio versions.

## Why versions are separated

Each portfolio version represents a complete design direction. Keeping routes,
metadata, content, interactions, and styles separate makes it possible to:

- compare versions side by side;
- preserve an earlier direction without freezing all future work;
- redesign freely without creating style conflicts;
- open any version without switching branches or running Git commands.

## Opening versions

Start the local website once by double-clicking `START-WEBSITE.cmd`. Then open:

| Destination | Address |
| --- | --- |
| Version index | <http://127.0.0.1:3000/> |
| Version 1 | <http://127.0.0.1:3000/version1> |
| Version 2, once created | <http://127.0.0.1:3000/version2> |

Only one local server is needed. Different versions are routes inside the same
website, so they can be opened in separate browser tabs and compared directly.

## Folder contract

Every version receives its own route folder and stylesheet:

```text
app/
├── page.tsx
├── version1/
│   ├── layout.tsx
│   └── page.tsx
└── version2/
    ├── layout.tsx
    └── page.tsx

public/styles/
├── version-index.css
├── version1.css
└── version2.css
```

The root `app/page.tsx` is only the version index. It should not contain the
portfolio itself.

Each version layout owns that version's metadata and stylesheet. Shared project
infrastructure may remain at the repository root, but visual and content work
must not leak from one version into another.

## Creating Version 2

1. Create `app/version2/page.tsx` for the new experience.
2. Create `app/version2/layout.tsx` for Version 2 metadata and stylesheet.
3. Create `public/styles/version2.css`.
4. Add an active Version 2 card to the version index.
5. Keep all Version 1 files unchanged unless a specific V1 correction is
   requested.
6. Validate `/`, `/version1`, and `/version2` before creating the V2 checkpoint.
7. Record the finished direction in `VERSION-2.md`, a Git tag, and a portable
   ZIP snapshot.

## Checkpoint rules

- Git tags preserve exact source history.
- ZIP files in `checkpoints/` provide nontechnical, portable recovery.
- `VERSION-N.md` files explain the design state and known next questions.
- A checkpoint is read-only. Later corrections belong to a new commit or
  version unless explicitly backported.

