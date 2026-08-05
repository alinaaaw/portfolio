# Alina Portfolio - Version 2 Design

This branch contains the expanded **Focus Field** portfolio direction. The
animated field remains the entrance, while four deeper rooms make the person
behind the work the center of the site.

## Open locally

Double-click `START-WEBSITE.cmd`. Keep the command window open while viewing
the site, and press `Ctrl + C` when finished.

Local address: <http://127.0.0.1:3000/>

## Current rooms

| Room | Address | Purpose |
| --- | --- | --- |
| Focus Field | `/` | Animated exploratory entrance |
| About | `/about` | Personality, beliefs, and ways of thinking |
| Projects | `/projects` | Web, algorithm, and hardware approaches |
| Notes | `/notes` | Curated thought traces and current interests |
| Away | `/away` | Travel, planning, and life outside the screen |

## Branch purpose

- Branch: `version2-design`
- Design: animated spatial portfolio with multi-page personal depth
- Status: active and independently editable
- Version 1 is maintained separately in `version1-design`

## Main files

```text
app/page.tsx                 Interactive Focus Field entrance
app/about/page.tsx           Personal profile and impression interaction
app/projects/page.tsx        Interactive project observatory
app/notes/page.tsx           Selectable thought traces
app/away/page.tsx            Interactive travel route and off-screen life
app/_components/V2Nav.tsx    Shared navigation for interior rooms
app/layout.tsx               Metadata and page shell
public/site.css              Complete Version 2 visual system
public/og.png                Version 2 social preview
VERSION-2.md                 Original Version 2 checkpoint notes
START-WEBSITE.cmd            Local launcher
```

Keep review changes uncommitted until the direction is approved.
