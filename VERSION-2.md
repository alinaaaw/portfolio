# VERSION 2 - CHECKPOINT

**Frozen on:** 2026-08-05
**Checkpoint name:** `version2`
**Website language:** English
**Local route:** `/version2`

## What Version 2 explores

Version 2 turns the portfolio into an animated spatial field. It keeps the
exploratory feeling of a game-like portfolio without asking the visitor to
drive, learn controls, or navigate a menu system.

The visitor moves the pointer to look around, notices five signals, and follows
whatever catches their attention. Curiosity becomes the navigation model.

## Design identity

- Blue-hour landscape with layered parallax, moving light, and route signals.
- Professional editorial typography instead of a literal game interface.
- The archery target becomes the visual and conceptual center of the field.
- Five project and personality signals remain visible in one coherent space.
- The visitor is welcomed as a guest and can explore in any order.
- Motion supports discovery but respects reduced-motion preferences.

## Included interactions

- Pointer-responsive field depth and focus cursor.
- Five discoverable areas: web, algorithm, hardware, notes, and travel.
- Discovery counter and contextual signal readout.
- Runnable algorithm route study.
- Hardware power and signal-state demonstration.
- Personal field notes connected to laser shooting and archery.
- Travel route recalculation with a Plan B.
- Responsive layouts for desktop and mobile.

## Relationship to Version 1

Version 1 remains available at `/version1` with its own files and stylesheet.
Version 2 lives only in `app/version2/`, `public/styles/version2.css`, and
`public/versions/version2/`. Shared framework files serve both routes but do not
merge their designs.

## Preservation

The exact source is preserved by the Git tag `version2` and by the ZIP snapshot
in `checkpoints/`. Future directions should start as a separate version.
