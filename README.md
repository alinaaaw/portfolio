# Alina Portfolio - Versioned Workspace

This project keeps each portfolio direction as a separate, directly accessible
version. A new version never silently overwrites an earlier one.

## Start the website

1. Open the `alina-portfolio-demo` folder.
2. Double-click **`START-WEBSITE.cmd`**.
3. Keep the command window open while viewing the website.
4. Press `Ctrl + C` in that window when finished, then close it.

The launcher opens Version 1 by default. If the preview is already running,
double-clicking the launcher simply opens it again.

## Open a specific version

- Version index: <http://127.0.0.1:3000/>
- Version 1: <http://127.0.0.1:3000/version1>
- Version 2, when created: <http://127.0.0.1:3000/version2>

See [VERSIONS.md](VERSIONS.md) for the complete version architecture,
development rules, and opening methods.

## Current checkpoints

- The original Version 1 checkpoint is preserved in Git tag `version1`.
- Its portable source snapshot is stored at
  `checkpoints/alina-portfolio-version1.zip`.
- Its design decisions are documented in [VERSION-1.md](VERSION-1.md).

## Main folder map

```text
alina-portfolio-demo/
├── START-WEBSITE.cmd          Double-click launcher
├── README.md                  Quick-start guide
├── VERSIONS.md                Version architecture and rules
├── VERSION-1.md               Version 1 design record
├── app/
│   ├── layout.tsx             Shared document shell
│   ├── page.tsx               Version index at /
│   └── version1/
│       ├── layout.tsx         Version 1 metadata and stylesheet
│       └── page.tsx           Version 1 content and interactions
├── public/
│   ├── styles/
│   │   ├── version-index.css  Version index styling
│   │   └── version1.css       Version 1 styling
│   └── og.png                 Version 1 social image
├── scripts/
│   └── start-website.ps1      Local preview helper
├── checkpoints/               Read-only source snapshots
├── tests/                     Rendering and version checks
└── build/, worker/, db/       Framework and hosting support
```

## Editing guide

- Edit Version 1 content in `app/version1/page.tsx`.
- Edit Version 1 visuals in `public/styles/version1.css`.
- Edit the version index in `app/page.tsx` and
  `public/styles/version-index.css`.
- Create a separate `app/version2/` folder and `version2.css` for Version 2.
- Do not edit the Version 1 ZIP checkpoint.

