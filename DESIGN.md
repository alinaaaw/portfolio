# ALINA.WU — DESIGN SYSTEM

## Overview

An animated, illustrated digital world that feels professional at first glance
and more playful through exploration. The style is crafted, alive, warm, and
slightly unexpected without becoming childish or game-menu heavy.

Use low-poly or 2.5D environments, soft baked-looking light, restrained technical
labels, and physical interaction. Archery contributes a visual language of rings,
trajectories, tension, focus, impact, and release.

The interface should create curiosity before it explains. Personality is expressed
through interaction, environmental traces, corrections, and quiet humor—not direct
lists of traits.

## Colors

Large surfaces use natural atmospheric colors. Lime and coral are signal colors
reserved for focus and impact.

- **Deep Ink (`#101827`)** — text, navigation, dark surfaces, and depth.
- **Sky Blue (`#88ADD1`)** — atmosphere and open backgrounds.
- **Field Green (`#667A63`)** — ground, foliage, and secondary surfaces.
- **Warm Paper (`#F2EBDD`)** — readable content surfaces.
- **Chalk White (`#F7F4EA`)** — high-contrast text and fine detail.
- **Target Coral (`#E9664A`)** — impact and committed action.
- **Focus Lime (`#C7E86A`)** — focus, discovery, and active feedback.
- **Dusk Peach (`#E9A17F`)** — warmth and atmospheric transitions.

Use only one signal color as the dominant accent in a view. Avoid pure black,
pure white, rainbow palettes, neon overload, and generic blue-purple gradients.
Maintain WCAG AA contrast for essential text and controls.

## Typography

- **Primary sans:** Noto Sans SC or a clean humanist sans-serif for display and body.
- **Monospace:** Space Mono for labels, states, captions, and metadata.
- **Optional annotation:** a restrained handwritten face only for very short notes.

Display headings are large and compact. Body text uses generous line height.
Monospace labels are small, uppercase, and widely tracked. Outlined type may
highlight one word in a major heading, never a paragraph.

Avoid excessive bold text, terminal styling, and technology-logo walls.

## Layout

The layout is world-first rather than card-first.

- Use a full-viewport animated environment as the main visual anchor.
- Maintain clear foreground, middle ground, and background layers.
- Keep permanent navigation minimal and visually quiet.
- Reveal detail through focused layers and spatial transitions.
- Use an 8px spacing base and a 720px maximum width for long-form text.
- Prefer asymmetry, open space, and one strong focal point.
- Simplify composition on mobile instead of shrinking the desktop scene.

Avoid dashboard grids, dense HUD overlays, repeated cards, and large text blocks
over the animated environment.

## Elevation & Depth

Create depth through scale, lighting, haze, camera parallax, and overlapping
environmental layers. Use broad soft shadows and subtle fog.

Focused content uses Warm Paper or Deep Ink surfaces that appear connected to
the world. Avoid heavy glassmorphism, nested shadows, excessive blur, and glowing
outlines on every object.

## Shapes

- Circles, rings, crosshairs, arcs, and trajectories are recurring motifs.
- Environmental geometry is low-poly with softened or chamfered edges.
- Interactive elements use distinctive silhouettes rather than labels alone.
- Borders are thin and precise; organic forms are slightly imperfect.

Avoid pill-shaped UI everywhere, photorealistic weapons, militaristic styling,
and generic 3D technology symbols.

## Components

### Surfaces and controls

- Controls are compact, high-contrast, and use monospace labels.
- Primary actions use either Focus Lime or Target Coral.
- Focus states use a visible 2px Focus Lime outline.
- Content surfaces favor paper, ink, diagrams, and annotations over generic cards.

### Motion

- Ambient movement uses asynchronous 8–30 second cycles.
- Hover and focus reactions use 120–220ms transitions.
- Physical responses settle over 400–900ms with natural easing.
- Spatial transitions use 700–1100ms and preserve visual continuity.
- Input-linked motion shows tension, weight, trajectory, impact, and settling.
- Environmental changes may persist during the visit to create memory.

Avoid synchronized loops, constant camera shake, excessive bounce, automatic
carousels, long intros, and motion without interaction value.

### Accessibility and performance

Support keyboard and touch, provide a non-precision alternative for aiming, and
respect `prefers-reduced-motion`. Reduce secondary effects on lower-power devices
and load detailed assets only when needed. Sound is optional and off by default.

## Do's and Don'ts

### Do

- Make the world feel alive before input.
- Use physical feedback and spatial continuity.
- Communicate personality indirectly through discovery.
- Balance professional composition with subtle humor.
- Keep interactions understandable within a few seconds.

### Don't

- Do not use a car, avatar movement, map, score, or complex game controls.
- Do not describe personality with adjective lists.
- Do not use generic mountains, grid floors, code rain, or cyberpunk HUDs.
- Do not turn every section into the same card or modal.
- Do not sacrifice clarity, accessibility, or loading speed for effects.
- Do not copy another portfolio's assets, composition, or identity.
