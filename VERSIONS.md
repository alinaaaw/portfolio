# Portfolio Version Architecture

This is the authoritative guide for opening, creating, and preserving portfolio versions.

## Why versions are separated

Each portfolio version is a complete design direction. Routes, metadata,
content, interactions, styles, and social images are isolated so that versions
can be compared without switching branches or overwriting earlier work.

## Opening versions

Double-click `START-WEBSITE.cmd` once, then select a version. Direct shortcuts
are also available:

| Destination | Launcher | Address |
| --- | --- | --- |
| Version index | `START-WEBSITE.cmd` | <http://127.0.0.1:3000/> |
| Version 1 | `OPEN-VERSION-1.cmd` | <http://127.0.0.1:3000/version1> |
| Version 2 | `OPEN-VERSION-2.cmd` | <http://127.0.0.1:3000/version2> |

All destinations use the same local server and can be opened in separate tabs.

## Folder contract

```text
app/
|-- page.tsx
|-- version1/
|   |-- layout.tsx
|   `-- page.tsx
`-- version2/
    |-- layout.tsx
    `-- page.tsx

public/
|-- styles/
|   |-- version-index.css
|   |-- version1.css
|   `-- version2.css
`-- versions/
    |-- version1/og.png
    `-- version2/og.png
```

The root `app/page.tsx` is only the version selector. Each version layout owns
its metadata and stylesheet. Shared runtime, dependencies, tests, and framework
configuration remain at the repository root because they serve every version;
they do not determine a version's visual direction.

## Creating a future version

1. Create `app/versionN/page.tsx` and `app/versionN/layout.tsx`.
2. Create `public/styles/versionN.css` and version-specific assets under
   `public/versions/versionN/`.
3. Add the new route to the version index and optionally add a launcher.
4. Do not edit earlier version folders unless a specific correction is asked for.
5. Validate the index, every preserved route, and the new route.
6. Add `VERSION-N.md`, a Git tag, and a portable ZIP checkpoint.

## Checkpoint rules

- Git tags preserve exact source history.
- ZIP files in `checkpoints/` provide portable, nontechnical recovery.
- `VERSION-N.md` files explain each design state and its open questions.
- Checkpoints are read-only. Later changes belong to a new commit or version
  unless explicitly backported.
