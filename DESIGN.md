# VERSION 1 UI DESIGN RULES

**Project:** Alina Wu Portfolio — Personal Workbench

**Status:** Canonical UI direction for Version 1

**Applies to:** Every future layout, component, interaction, animation, and content change in `version1-design`

## 1. Experience statement

Version 1 is a personal workbench that welcomes a visitor as a guest.

It should feel like entering the active space of a thoughtful computer science
student: structured but not sterile, professional but not self-promotional,
curious about both technical systems and complicated human behavior.

The site should reveal personality through projects, notes, annotations,
unfinished questions, travel plans, and traces of use. It must not read like a
résumé template or behave like a game menu.

## 2. The design hierarchy

The hierarchy is fixed:

1. **The workbench is the main experience.** It contains the strongest visual
   composition, the richest content, and most of the meaningful interaction.
2. **Projects are the main evidence.** Websites, an algorithm, and hardware
   should demonstrate ability through artifacts, decisions, and outcomes.
3. **Notes and travel add the human layer.** They show curiosity, uncertainty,
   planning, humor, and life beyond code.
4. **The target is a supporting motif.** It connects archery, focus, deliberate
   practice, and choosing a direction. It is not the site's navigation model or
   main attraction.

### Target rules

- Keep the target to one compact module. It must never dominate the first
  viewport or compete with the workbench.
- Label its purpose in plain language. A guest should understand it without
  experimentation or explanation from the site owner.
- Give it one short, satisfying interaction with an immediate visible result.
- Let its result point toward relevant workbench content; do not trap the result
  inside the target itself.
- Do not turn it into a score system, shooting game, or multi-step menu.
- If the target can be removed without changing the visitor's understanding,
  either connect it more clearly to the content or simplify it.

## 3. Core design principles

### 3.1 Evidence before claims

Show the project, working state, design decision, note, route, or result. Avoid
unsupported claims such as “passionate,” “innovative,” or “expert.” Confidence
should come from specificity.

### 3.2 Professional, with signs of life

The base layout should be composed and legible. Personality comes from small
human traces: a margin note, a crossed-out assumption, a backup plan, a status
label, a recent question, or a restrained joke. Do not manufacture messiness.

### 3.3 Interaction must reveal something

An interaction is justified only when it reveals content, shows a relationship,
records progress, demonstrates a project, or helps the guest choose a route.
Movement without meaning is decoration.

### 3.4 Clear before clever

A guest should understand what can be touched, what changed, and what to do
next. Unusual presentation is welcome; unusual behavior requires clear labels
and familiar controls.

### 3.5 Curiosity without false certainty

The interface may expose work in progress, alternate explanations, and “not yet”
states. The voice should sound observant and honest, never overconfident.

### 3.6 A guest may leave at any time

Every major viewport must communicate something useful on its own. Exploration
adds depth, but essential information must not depend on completing a sequence.

## 4. Information architecture

The preferred page sequence is:

1. **Welcome:** a concise first-person introduction and one clear invitation.
2. **Workbench:** the primary exploratory area and visual center of gravity.
3. **Working profile:** beliefs, method, learning, and human context.
4. **Contact:** a direct, quiet ending without a marketing-style conversion pitch.

Project details may open in panels or dedicated pages. In either form, every
detail view should contain:

- what the thing is;
- the problem or question;
- Alina's role and decisions;
- a tangible result, demo, or artifact when available;
- one clear next route back into the workbench.

## 5. Interaction model

### 5.1 Layered discovery

Use four depths of interaction:

1. **Glance:** the object and its category are understandable without action.
2. **Hover or focus:** a short preview or response confirms interactivity.
3. **Open:** the guest receives meaningful detail, not a larger duplicate.
4. **Continue:** a relevant next trace allows exploration without forcing an order.

### 5.2 Workbench behavior

- Workbench objects should feel distinct in shape and material while sharing a
  consistent interaction grammar.
- Hover, keyboard focus, and touch must all lead to equivalent understanding.
- Opening an object should leave a restrained visited trace.
- The trace should help orientation or unlock context; it must not exist only as
  a completion counter.
- Connections between projects, psychology, learning, and travel should be
  visible when they are relevant.
- A visual object that looks movable or clickable must respond. A decorative
  object must not imitate a control.

### 5.3 Feedback rules

Every action must visibly answer three questions:

1. What did I act on?
2. What changed?
3. Where can I go next?

Use state, copy, movement, and contrast together. Do not rely on a color change
alone. Feedback should begin immediately and settle quickly.

### 5.4 Interaction density

- Prefer a few connected interactions over many isolated tricks.
- Each major section should contain at most one primary interactive idea.
- Avoid simultaneous motion in multiple areas.
- Do not add an interaction solely because the page feels visually quiet.
- New interactions must work with pointer, touch, and keyboard input.

## 6. Visual language

### 6.1 Direction

The visual direction is **editorial field notes on an active technical
workbench**.

It combines:

- a warm paper surface;
- dark ink and crisp rules;
- utilitarian monospaced metadata;
- large editorial headlines;
- a limited set of vivid technical accents;
- restrained irregularity through notes, rotation, clips, and object placement.

The result should feel authored, not themed.

### 6.2 Color

Use the existing semantic palette as the default:

| Token | Value | Role |
| --- | --- | --- |
| Paper | `#f2efe7` | Main surface and visual warmth |
| Ink | `#20201d` | Primary text, borders, and dark panels |
| Muted | `#6e6b63` | Secondary explanation and metadata |
| Blue | `#315cff` | Focus, links, active technical states |
| Acid | `#d8ff48` | Discovery, small highlights, live states |
| Orange | `#ff6a3d` | Human emphasis, questions, exceptions |
| Yellow | `#f3c84b` | Hardware and physical-system accents |

Rules:

- Paper and ink should carry most of the page.
- Accent colors must communicate category, state, or emphasis.
- Do not introduce gradients, neon effects, or additional brand colors without
  a documented semantic role.
- Never use color as the only indication of status or interactivity.

### 6.3 Typography

- Use the sans-serif face for narrative copy, headings, and project explanation.
- Use the monospaced face for labels, indices, measurements, system states, and
  annotations.
- Large headlines may be expressive; body copy must remain calm and readable.
- Avoid long paragraphs in all caps or monospaced text.
- Maintain a clear heading hierarchy and keep line lengths comfortable.

### 6.4 Layout and material

- Use generous space around major sections and denser composition inside the
  workbench.
- Borders, paper layers, modest hard shadows, and slight rotations may suggest
  physical objects.
- Irregularity must look intentional and must not damage alignment, reading
  order, or mobile behavior.
- Do not use generic glass cards, uniform dashboard grids, oversized rounded
  rectangles, or template-style skill meters.

## 7. Motion

- Motion should explain cause and effect: opening, connecting, marking,
  revealing, or changing state.
- Prefer short transitions around `160–350ms`.
- Ambient motion must remain subtle and limited to one visual area at a time.
- Never autoplay sound.
- Avoid parallax that interferes with reading or pointer accuracy.
- Respect `prefers-reduced-motion`; no information may depend on animation.

## 8. Content voice

The website is currently written in English. Copy should sound like a real
first-person host: precise, curious, lightly dry, and occasionally playful.

Use:

- concrete observations;
- questions still being investigated;
- brief annotations and status notes;
- honest boundaries such as “not yet” or “still testing”;
- project language that explains decisions and outcomes.

Avoid:

- inflated self-description;
- generic portfolio slogans;
- forced jokes or childish microcopy;
- long unexplained diary entries;
- certainty where evidence is incomplete;
- copy that sounds generated, corporate, or motivational.

## 9. Responsive and accessible behavior

- Design for mobile as a deliberate linear composition, not a shrunken desktop.
- Preserve the workbench metaphor on small screens by stacking artifacts in a
  meaningful order.
- All interactive targets should be comfortably touchable; aim for at least
  `44 × 44px` where practical and never create tightly packed tiny controls.
- Provide visible keyboard focus with sufficient contrast.
- Do not hide essential information behind hover.
- Use semantic HTML and accessible names for controls and dialogs.
- Preserve a logical reading and focus order.
- Text, controls, and meaningful graphics should meet WCAG 2.2 AA contrast and
  interaction requirements.
- Zoom, reflow, reduced motion, keyboard use, and touch use are release checks,
  not optional polish.

## 10. Do / do not

| Do | Do not |
| --- | --- |
| Make the workbench the main event | Turn the target into the whole concept |
| Reveal personality through evidence and traces | Add a generic “personality” section |
| Connect interactions into a visitor route | Scatter unrelated hover effects |
| Use annotations to add context | Cover the page in decorative sticky notes |
| Let projects demonstrate skill | Use skill bars or unsupported ratings |
| Keep uncertainty visible when honest | Perform confidence or expertise |
| Reward exploration with useful content | Require completion to understand the site |
| Preserve clarity on mobile and keyboard | Design only for precise mouse movement |

## 11. UI change checklist

Before merging any UI change, answer all of the following:

- Does this strengthen the personal workbench concept?
- Is the workbench still the primary experience?
- Is the target still a compact supporting motif?
- Does every new interaction reveal information or a relationship?
- Is the action and its result understandable without instructions from Alina?
- Does it feel professional, specific, and human rather than templated?
- Does the copy sound observant rather than overconfident?
- Does it work with mouse, touch, and keyboard?
- Does it remain useful with reduced motion?
- Does it work at mobile and desktop widths?
- Are focus, contrast, semantics, and target sizes accessible?
- Has the change been tested in the actual page rather than only as isolated code?

If a proposed design conflicts with this document, either change the design or
update this document in the same commit with a clear reason. Silent exceptions
are not allowed.

## 12. Reference standards

These rules are adapted to this portfolio rather than copied from a general
design system. The external standards used as evaluation references are:

- [Mozilla Protocol — Design Principles](https://protocol.mozilla.org/docs/fundamentals/principles)
- [GitHub Primer — Accessibility Foundations](https://primer.style/accessibility/foundations/)
- [U.S. Web Design System — Design Principles](https://designsystem.digital.gov/design-principles/)
- [W3C — Web Content Accessibility Guidelines 2.2](https://www.w3.org/TR/WCAG22/)
- [Apple Human Interface Guidelines — Design Principles](https://developer.apple.com/design/human-interface-guidelines/design-principles)
