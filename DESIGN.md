# ALINA.WU — DESIGN SYSTEM

## Overview

A tactile, cinematic clubhouse world built from dark space, aged timber, brushed
metal, canvas, rope, and paper evidence. It should feel professional on arrival
and reveal warmth, curiosity, and quiet humor through exploration.

The outdoor range and the interior rooms belong to one physical place. The range
must use the same materials, lighting, weight, and camera language as the locker,
workbench, archive, and route board. Important spatial objects are rendered in 3D;
2D interface elements are reserved for labels, readouts, annotations, and content.

Archery contributes tension, focus, trajectory, impact, and release without making
the portfolio feel militaristic or like a full game. Personality is communicated
through objects, traces, corrections, and interaction—not adjective lists.

## Colors

Large surfaces are dark, warm, and low-saturation. Lime and coral are signal colors,
not decorative fills.

- **Deep Ink (`#101827`)** — navigation, deep shadow, and high-contrast surfaces.
- **Charcoal Green (`#1B2824`)** — atmospheric backgrounds and range depth.
- **Range Green (`#405346`)** — ground, canvas, and environmental surfaces.
- **Dark Timber (`#3B2B23`)** — structural frames and shadowed wood.
- **Warm Timber (`#76543B`)** — doors, benches, stands, and handles.
- **Aged Paper (`#F3E7C8`)** — labels, notes, target faces, and readable surfaces.
- **Brushed Metal (`#9D9B90`)** — hardware and small structural details.
- **Focus Lime (`#C9FF69`)** — focus, discovery, and active feedback.
- **Impact Coral (`#FF7356`)** — impact and committed action.
- **Dusk Amber (`#E7B06A`)** — warm practical light.

Use one signal color as the dominant accent in a view. Avoid pure black, pure white,
rainbow palettes, neon overload, and generic blue-purple gradients. Essential text
and controls must maintain WCAG AA contrast.

## Typography

- **Primary sans:** Noto Sans SC or a clean humanist sans-serif for display and body.
- **Monospace:** Space Mono for labels, states, captions, and metadata.
- **Optional annotation:** a restrained handwritten face for very short notes only.

Display headings are compact and confident. Body text uses generous line height.
Monospace labels are small, uppercase, and widely tracked. Typography may sit on
paper, enamel plates, or dark instrument panels, but should not float as a large
generic hero block over the environment.

Avoid excessive bold text, terminal styling, and technology-logo walls.

## Layout

The layout is world-first rather than card-first.

- Use a full-viewport 3D environment as the main visual anchor.
- Maintain clear foreground, middle ground, and background depth.
- Keep permanent navigation minimal and visually quiet.
- Reveal detail through focused layers and spatial transitions.
- Treat route changes as movement between parts of one clubhouse.
- Use an 8px spacing base and a 720px maximum width for long-form text.
- Prefer asymmetry, breathing room, and one strong focal point.
- Simplify composition on mobile instead of shrinking the desktop scene.

Avoid dashboard grids, dense HUD overlays, repeated cards, and large text blocks
that obscure the environment.

## Materials, Lighting & Depth

Depth comes from perspective, overlapping geometry, restrained haze, contact
shadows, and material response—not flat decorative layers.

- Give major geometry thickness and softened or chamfered edges.
- Use rough timber, matte paper, worn canvas, and selectively reflective metal.
- Light scenes with one warm directional key and a cooler ambient fill.
- Ground every important object with a contact shadow.
- Use a human-eye perspective camera with subtle pointer parallax.
- Keep the outdoor range slightly hazy so it feels connected to the darker rooms.
- Let focus and impact alter light, camera, or material response in a restrained way.

Do not use flat clip-path mountains, generic CSS clouds, grid floors, or floating
icon illustrations as primary scenery. Avoid sterile showroom lighting and glossy
plastic surfaces.

## Shapes & Components

- Rings, crosshairs, arcs, trajectories, and notches are recurring motifs.
- Interactive objects use distinctive silhouettes and material cues before labels.
- Borders are thin and precise; physical surfaces may be slightly imperfect.
- Controls are compact, high-contrast, and use monospace labels.
- Primary actions use either Focus Lime or Impact Coral.
- Focus states use a visible 2px Focus Lime outline.
- Content surfaces favor paper, ink, diagrams, and annotations over generic cards.

Avoid pill-shaped UI everywhere, photorealistic weapons, generic 3D technology
symbols, and decorative objects that suggest an interaction but do nothing.

## Motion

- Ambient movement uses slow, asynchronous 8–30 second cycles.
- Hover and focus reactions use 120–220ms transitions.
- Physical responses settle over 400–900ms with natural easing.
- Spatial transitions use 700–1100ms and preserve visual continuity.
- Input-linked motion shows tension, weight, trajectory, impact, and settling.
- Outdoor camera movement should feel observational, not like the whole world floats.
- Environmental changes may persist during the visit to create memory.

Avoid synchronized loops, constant camera shake, excessive bounce, automatic
carousels, long intros, and motion without interaction value.

## Accessibility & Performance

Support keyboard and touch, provide a non-precision alternative for aiming, and
respect `prefers-reduced-motion`. Reduce secondary effects on lower-power devices
and load detailed assets only when needed. Sound is optional and off by default.

## Do's and Don'ts

### Do

- Make the world feel inhabited before input.
- Use physical feedback, material continuity, and spatial continuity.
- Communicate personality indirectly through discovery.
- Balance professional composition with subtle humor.
- Keep interactions understandable within a few seconds.

### Don't

- Do not use a car, avatar movement, map, score, or complex game controls.
- Do not describe personality with adjective lists.
- Do not let the homepage become a separate bright cartoon world.
- Do not turn every section into the same card or modal.
- Do not sacrifice clarity, accessibility, or loading speed for effects.
- Do not copy another portfolio's assets, composition, or identity.
