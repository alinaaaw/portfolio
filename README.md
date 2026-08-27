# Alina Portfolio / Lab 17

Lab 17 is Alina Wu's interactive portfolio: a lightweight 3D workspace where
visitors explore projects, research, experience, and personal notes through
six connected stations.

## Open locally

Double-click `START-WEBSITE.cmd`. Keep the command window open while viewing
the site, and press `Ctrl + C` when finished.

## What is here

- An explorable 3D laboratory room with direct and keyboard-accessible routes.
- Project evidence, research notes, and experience records maintained in
  `content/*.json`.
- A gradual fieldwork narrative that supports the portfolio without replacing
  its factual content.

## Main files

```text
app/page.tsx              Portfolio narrative and project files
app/_components/LabGame.tsx  Three.js room, object hitboxes, and camera transitions
app/_components/ZoneCloseup3D.tsx  Five interactive Three.js object close-ups
app/layout.tsx            Metadata and page shell
public/site.css           Complete visual design and responsive behavior
public/og.png             Social preview for Lab 17
DESIGN.md                 Canonical design and interaction rules
TODO.md                   Launch plan and acceptance checklist
```

## Before a release

Run the production build and automated tests, then follow the release checks in
`TODO.md`. Keep factual portfolio copy in `content/` and follow
`content/CONTENT_GUIDE.md` when updating it.
