# Alina Portfolio - Versioned Workspace

This project keeps each portfolio direction as a separate, directly accessible
version. A new version never silently overwrites an earlier one.

## Start the website

1. Open the `alina-portfolio-demo` folder.
2. Double-click `START-WEBSITE.cmd` to open the version index.
3. Keep the command window open while viewing the website.
4. Press `Ctrl + C` in that window when finished, then close it.

For a direct shortcut, double-click `OPEN-VERSION-1.cmd` or
`OPEN-VERSION-2.cmd`. If the preview is already running, any launcher simply
opens the requested page in a browser.

## Open a specific version

| Destination | Address |
| --- | --- |
| Version index | <http://127.0.0.1:3000/> |
| Version 1 | <http://127.0.0.1:3000/version1> |
| Version 2 | <http://127.0.0.1:3000/version2> |

Only one local server is needed. The versions can stay open in separate tabs.
See [VERSIONS.md](VERSIONS.md) for the architecture and preservation rules.

## Current checkpoints

- Version 1: Git tag `version1`, `checkpoints/alina-portfolio-version1.zip`,
  and [VERSION-1.md](VERSION-1.md).
- Version 2: Git tag `version2`, `checkpoints/alina-portfolio-version2.zip`,
  and [VERSION-2.md](VERSION-2.md).

## Main folder map

```text
alina-portfolio-demo/
|-- START-WEBSITE.cmd          Opens the version index
|-- OPEN-VERSION-1.cmd         Opens Version 1 directly
|-- OPEN-VERSION-2.cmd         Opens Version 2 directly
|-- README.md                  Quick-start guide
|-- VERSIONS.md                Version architecture and rules
|-- VERSION-1.md               Version 1 design record
|-- VERSION-2.md               Version 2 design record
|-- app/
|   |-- layout.tsx             Shared document shell
|   |-- page.tsx               Version index at /
|   |-- version1/              Isolated Version 1 route
|   `-- version2/              Isolated Version 2 route
|-- public/
|   |-- styles/
|   |   |-- version-index.css
|   |   |-- version1.css
|   |   `-- version2.css
|   `-- versions/
|       |-- version1/og.png
|       `-- version2/og.png
|-- scripts/start-website.ps1  Shared local preview helper
|-- checkpoints/               Read-only source snapshots
`-- tests/                     Rendering and version checks
```

## Editing guide

- Edit Version 1 only in `app/version1/` and `public/styles/version1.css`.
- Edit Version 2 only in `app/version2/` and `public/styles/version2.css`.
- Edit the selector in `app/page.tsx` and `public/styles/version-index.css`.
- Keep shared runtime and framework files at the repository root.
- Do not edit ZIP checkpoints.
