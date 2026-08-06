# Alina Portfolio - Version 2 Design

This branch contains the expanded **Focus Field** portfolio direction. The
animated field remains the entrance, while four deeper rooms make the person
behind the work the center of the site.

## Open locally

Double-click `START-WEBSITE.cmd`. Keep the command window open while viewing
the site, and press `Ctrl + C` when finished.

When opened through the Portfolio Hub, the direct Version 2 address is
<http://127.0.0.1:3102/>.

## Current rooms

| Room | Address | Purpose |
| --- | --- | --- |
| Outdoor Range | `/` | Physics-based archery entrance and signal discovery |
| Locker 17 | `/about` | Personal evidence explored through stored objects |
| Repair Shed | `/projects` | Project work orders and adjustment records |
| Target Archive | `/notes` | Reversible used targets and pencilled thought traces |
| Route Board | `/away` | Interactive travel plans and off-screen traces |

## Branch purpose

- Branch: `version2-design`
- Design: animated spatial portfolio with multi-page personal depth
- Status: active and independently editable
- Version 1 is maintained separately in `version1-design`

## Main files

```text
app/page.tsx                 Interactive outdoor range entrance
app/about/page.tsx           Locker-based personal evidence room
app/projects/page.tsx        Repair shed and project work orders
app/notes/page.tsx           Reversible target archive
app/away/page.tsx            Clubhouse route board and travel traces
app/_components/V2Nav.tsx    Shared navigation for interior rooms
app/_components/focus-field  Archery animation loop and trajectory physics
app/layout.tsx               Metadata and page shell
public/site.css              Complete Version 2 visual system
public/og.png                Version 2 social preview
VERSION-2.md                 Original Version 2 checkpoint notes
START-WEBSITE.cmd            Local launcher
```

Keep review changes uncommitted until the direction is approved.
