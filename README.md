# Alina Portfolio — Version 1 Design

This branch contains only the **Personal Workbench** portfolio direction.

## Open locally

Double-click `START-WEBSITE.cmd`. Keep the command window open while viewing
the site, and press `Ctrl + C` when finished.

Local address: <http://127.0.0.1:3000/>

## Branch purpose

- Branch: `version1-design`
- Design: editorial Personal Workbench
- Status: active and independently editable
- Version 2 is maintained separately in `version2-design`.

## UI design source of truth

Read `DESIGN.md` before making any UI or interaction change. It defines the
required product hierarchy, visual language, interaction rules, content voice,
responsive behavior, and accessibility checks for Version 1.

## Main files

```text
app/page.tsx              Version 1 content and interactions
app/layout.tsx            Version 1 metadata and page shell
public/site.css           Version 1 visual design
public/og.png             Version 1 social preview
DESIGN.md                 Canonical UI and interaction rules
VERSION-1.md              Design notes
START-WEBSITE.cmd         Local launcher
```

Commit each meaningful change to this branch so earlier states remain
available in Git history.
