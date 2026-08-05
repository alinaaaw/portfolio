# Alina Portfolio Design Lab

This repository explores two portfolio concepts in parallel. The default
`main` branch intentionally contains no website implementation.

## Active design branches

| Branch | Direction | Character |
| --- | --- | --- |
| `version1-design` | Personal Workbench | Editorial, warm, structured, with projects, notes, and travel |
| `version2-design` | Focus Field | Spatial, animated, and built around focus, signals, and discovery |

Each design branch contains its own complete app, styles, assets, configuration,
tests, and local launcher. Changes to one design do not alter the other.

## Switch designs locally

```powershell
git switch version1-design
git switch version2-design
```

The files shown in this folder change automatically when you switch branches.
Commit work on the corresponding design branch so you can return to any earlier
state through Git history.

Once a final direction is chosen, it can be merged into `main` and used as the
published portfolio.
