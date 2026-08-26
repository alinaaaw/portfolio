# ALINA.WU - VERSION 3 DESIGN SYSTEM

This document is the implementation specification for Lab 17. Values below are
the current source of truth unless a component explicitly defines a local
variant. CSS values live in `public/site.css`; room and close-up values live in
`app/_components/LabGame.tsx` and `app/_components/ZoneCloseup3D.tsx`.

## Product direction

Lab 17 is a personal portfolio presented as a lightweight 3D workspace. The
visitor explores one coherent room, inspects six stations, and gradually finds
evidence that Alina is working away from the lab. The portfolio must read as a
real workspace first and a mystery second.

The opening must not announce a disappearance. The computer bulletin introduces
the absence later. After all six stations are discovered, the printer produces
an off-site research update that resolves the story indirectly.

## Experience structure

1. Enter the room and learn that objects can be inspected.
2. Drag horizontally to look around; hover to identify a station.
3. Click a station and wait for the camera move before its interface opens.
4. Explore nested objects: files, books, pages, notes, drawer contents, and the
   field case.
5. Use the Room Index as an optional direct-access route.
6. Discover all six stations to activate the printer.
7. Let the fax finish printing before it becomes readable or persists in other
   views.

## Portfolio stations

- Computer: profile, README, Lab Log, projects, experience, research, and the
  first unexplained bulletin.
- Desk drawer: physical iterations, components, project folders, and field
  materials. The drawer must open and close from the same handle.
- Research book: project thinking, process notes, diagrams, and margins.
- Bookshelf: personal books, films, and Alina's own notes. The shelf may remain
  visibly unfiled until real entries are selected; project references live in
  the computer's internal reference website.
- Note board: principles, plans, open questions, and working rules.
- Field case: life outside the lab, observations, activities, and field
  experiments. Formal project findings and deployments stay in project files.
- Printer and contact card: the final report and a diegetic contact route. Both
  share the same printer-desk close-up.

## Color system

### Interface tokens

| Token | Value | Required use |
| --- | --- | --- |
| `--void` | `#050B0A` | Page background and deepest empty space |
| `--ink` | `#07100F` | Near-black text, buttons, and dark surfaces |
| `--panel` | `#101817` | Primary panels and dark cards |
| `--panel-2` | `#182321` | Secondary panels and raised dark surfaces |
| `--paper` | `#E5DCC6` | Default light text and warm paper |
| `--paper-bright` | `#F4EDDB` | High-emphasis light text |
| `--muted` | `#9DA59E` | Secondary copy and inactive metadata |
| `--line` | `rgba(229, 220, 198, 0.22)` | Default borders and dividers |
| `--signal` | `#D1F45C` | Available interaction, active signal, focus |
| `--cyan` | `#70C9C0` | Discovered state, synced data, research signal |
| `--red` | `#E45A43` | Anomaly, annotation, warning, editorial accent |
| `--shadow` | `rgba(0, 0, 0, 0.54)` | Standard deep shadow |

Color meaning is fixed:

- Lime `#D1F45C` means "this can be acted on now."
- Cyan `#70C9C0` means "this has been found, synced, or recovered."
- Red `#E45A43` means "pay attention to this exception or annotation."
- Warm paper colors contain portfolio content; green-black colors contain the
  environment and navigation.

Do not use red as a generic decoration or lime as ordinary body text. Doing so
removes the interaction hierarchy.

### Room 3D palette

| Material role | Hex | Three.js value |
| --- | --- | --- |
| Background / fog | `#07100F` | `0x07100f` |
| Dark equipment | `#101817` | `0x101817` |
| Metal | `#293432` | `0x293432` |
| Steel | `#707A75` | `0x707a75` |
| Dark wood | `#604938` | `0x604938` |
| Light wood | `#8C694B` | `0x8c694b` |
| Paper | `#DFD3B8` | `0xdfd3b8` |
| Cyan signal | `#70C9C0` | `0x70c9c0` |
| Lime signal | `#D1F45C` | `0xd1f45c` |
| Red accent | `#E45A43` | `0xe45a43` |
| Green equipment | `#294139` | `0x294139` |

### Close-up 3D palette

Close-ups use slightly warmer, darker material values so objects feel closer
without looking like a different art direction.

| Material role | Hex | Three.js value |
| --- | --- | --- |
| Background / fog | `#07100F` | `0x07100f` |
| Dark equipment | `#101817` | `0x101817` |
| Metal | `#303A36` | `0x303a36` |
| Steel | `#78817C` | `0x78817c` |
| Dark wood | `#51392A` | `0x51392a` |
| Light wood | `#76543C` | `0x76543c` |
| Paper | `#E2D8BD` | `0xe2d8bd` |
| Aged paper | `#C3B58D` | `0xc3b58d` |
| Cyan signal | `#70C9C0` | `0x70c9c0` |
| Lime signal | `#D1F45C` | `0xd1f45c` |
| Red accent | `#B94E3E` | `0xb94e3e` |
| Green equipment | `#294139` | `0x294139` |

## Typography

- Primary sans: `Noto Sans SC`, loaded through Next font as `--font-sans`.
- Technical labels: `Space Mono` at weights `400` and `700`, exposed as
  `--font-mono`.
- Editorial serif accents: `Georgia, serif`.
- Handwritten notes and physical documents: `"Segoe Print", cursive`.
- Room navigation and scene readouts use `6px` to `9px` Space Mono with
  `0.08em` to `0.18em` tracking.
- Long-form document copy should remain at least `13px`; handwritten reading
  copy is normally `15px` to `20px`.
- Large document headings use responsive `clamp()` values, usually from `34px`
  to `62px`.

All site copy remains English. Interface labels may use uppercase for technical
metadata, but sentences and hints must use normal capitalization.

## Layout constants

- Room viewport: `100vw x 100svh`, with overflow hidden.
- Top navigation: `64px` desktop, `58px` below `620px`.
- Tactile close-up frame: maximum `1500px x 930px`, constrained to
  `98vw x 96vh`.
- Close-up header: `58px` high.
- Computer monitor frame: maximum `1460px x 920px`, constrained to
  `98vw x 96vh`, with `13px` bezel padding and `14px` corner radius.
- Explore dock: maximum `780px`; six columns desktop, three columns below
  `850px`; labels collapse below `620px`.
- Room status panel: `270px` wide at desktop.
- Hover readout: `220px` wide at desktop and hidden below `850px`.
- Primary responsive breakpoints: `850px` and `620px`.

## Three.js rendering rules

### Shared renderer behavior

- Use `WebGLRenderer` with antialiasing and `high-performance` power preference.
- Use `SRGBColorSpace` output and `ACESFilmicToneMapping`.
- Enable shadows with `PCFSoftShadowMap`.
- Every visible close-up mesh casts and receives shadows unless a special
  transparent material makes that inappropriate.
- Dispose geometries, materials, observers, animation frames, and event
  listeners when a scene unmounts.
- Invisible hit geometry uses transparent `MeshBasicMaterial` with opacity `0`
  and `depthWrite: false`.

Room renderer values:

- Pixel ratio cap: `1.65`.
- Tone-mapping exposure: `0.92`.
- Exponential fog density: `0.021`.
- Perspective camera: FOV `43`, near `0.1`, far `80`.

Close-up renderer values:

- Pixel ratio cap: `1.6`.
- Tone-mapping exposure: `1.0`.
- Exponential fog density: `0.035`.
- Perspective camera: FOV `42`, near `0.1`, far `50`.

### Material rules

All primary objects use `MeshStandardMaterial`.

- Room default: roughness `0.80`, metalness `0.05`.
- Close-up default: roughness `0.78`, metalness `0.04`.
- Paper: roughness approximately `0.90-0.96`, metalness `0.01`.
- Wood: roughness approximately `0.78-0.92`, metalness `0.02-0.04`.
- Painted equipment: roughness approximately `0.45-0.70`, metalness
  `0.10-0.35`.
- Steel and structural metal: roughness approximately `0.30-0.48`, metalness
  `0.60-0.76`.
- Screens use low roughness and a cyan emissive color. Typical emissive
  intensity is `0.72-1.20`.
- Interactive highlighting adds lime emissive color at intensity `0.16`; it
  should reveal an object, not turn the entire model fluorescent.

### Geometry and modeling rules

1. Work in a consistent right-handed scene: X is horizontal, Y is vertical,
   and Z is depth. Objects rest on surfaces through explicit Y coordinates.
2. Use `BoxGeometry` for architectural primitives and hidden hit areas.
3. Use `RoundedBoxGeometry` for close objects that a person could touch:
   printers, books, drawer fronts, cards, folders, monitors, and cases.
4. Rounded boxes use four bevel segments. Radius is capped at the smallest of
   the requested radius or 20% of width, height, and depth.
5. Use cylinders for handles, pens, mugs, lamp stems, pins, and hinges. Default
   segment count is `24`; small hardware may use `12-22`, and hero round forms
   may use `28-32`.
6. Use `TubeGeometry` only for cables, threads, and routes. Cables normally use
   radius `0.018-0.025` and `6-7` radial segments.
7. Thin layered boxes create printed lines, labels, page marks, buttons, and
   screen content. Do not replace readable interfaces with texture images.
8. Group compound objects before animating them. The contact card, printer
   paper, drawer tray, and workspace each move as a group so their child details
   do not drift apart.
9. A close-up must preserve the object's recognizable construction from Room
   View. More detail may be added, but neighboring objects and relative location
   should not contradict the room.
10. Slight irregularity is intentional: use rotations near `-0.12` to `0.13`
    radians for papers, cards, books, and desk objects. Avoid perfectly aligned
    showroom arrangements.
11. Preserve physical clearance. A drawer front must cover the cavity while
    closed, contents must remain behind it, and printed paper must not exist
    before the print state begins.
12. Model at a useful silhouette level. Add bevels, frames, lips, hinges,
    handles, screens, key rows, and layered paper before adding tiny decoration.

Reference dimensions currently used in Drawer close-up:

- Desk top: `9 x 0.34 x 4.7`.
- Drawer cabinet top: `4.25 x 0.18 x 3.55`.
- Drawer front: `4.02 x 1.18 x 0.27`.
- Monitor: `3.45 x 2.15 x 0.28`.
- Printer source model: `3.5 x 1.42 x 2.7`, placed at scale `0.62`.
- Contact card source model: `2.55 x 0.045 x 1.45`, placed at scale `0.48`.

These numbers describe the committed composition. If any one object is resized,
re-check its neighboring objects and camera framing rather than changing it in
isolation.

## Room camera and lighting

Default room camera position is `(0, 4.75, 11.5)` and target is
`(0, 1.72, -2.55)`.

| Station | Camera position | Camera target |
| --- | --- | --- |
| Computer | `(-5.7, 2.95, -2.75)` | `(-5.7, 2.45, -6.12)` |
| Drawer | `(-3.5, 2.3, -2.55)` | `(-3.53, 0.84, -5.47)` |
| Research book | `(3.8, 4.55, 2.3)` | `(3.8, 1.55, -1.75)` |
| Bookshelf | `(8.05, 3.45, -2.65)` | `(8.2, 3.0, -6.35)` |
| Note board | `(1.1, 3.35, -4.7)` | `(1.1, 3.1, -8.5)` |
| Field case | `(-4.9, 3.45, 4.65)` | `(-4.9, 1.45, 1.55)` |
| Printer | `(-2.15, 3.15, -3.45)` | `(-2.15, 2.12, -6.5)` |

Room lighting:

- Hemisphere: sky `#71918B`, ground `#080C0B`, intensity `0.72`.
- Key directional light: `#FFD29C`, intensity `2.7`, position `(-5, 11, 7)`.
- Cyan point light: `#70C9C0`, intensity `9`, distance `16`, decay `1.85`.
- Warm point light: `#FFB46A`, intensity `12`, distance `16`, decay `1.7`.
- Board spotlight: `#FFCD92`, intensity `11`, distance `10`, angle `0.7`,
  penumbra `0.5`, decay `1.5`.
- Work spotlight: `#FFE2B9`, intensity `13`, distance `10`, angle `0.62`,
  penumbra `0.58`, decay `1.6`.
- Key shadow map: `2048 x 2048`.

The room should combine warm practical light with restrained cyan spill. Avoid
flat global illumination and avoid making every object equally bright.

## Close-up camera and lighting

| Scene | Camera position | Target |
| --- | --- | --- |
| Bookshelf | `(0, 2.8, 9.4)` | `(0, 2.35, 0)` |
| Drawer | `(0, 4.75, 8.8)` | `(0, 1.45, -0.15)` |
| Research book | `(0, 5.7, 5.7)` | `(0, 0.45, 0)` |
| Note board | `(0, 3.0, 8.8)` | `(0, 2.65, 0)` |
| Field case | `(0, 6.2, 7.8)` | `(0, 0.62, 0)` |
| Printer | `(0, 4.25, 8.2)` | `(0, 1.25, 0.55)` |
| Contact | `(0, 4.25, 8.2)` | `(0, 1.25, 0.55)` |

Close-up lighting:

- Hemisphere: sky `#789892`, ground `#090D0C`, intensity `0.85`.
- Warm directional light: `#FFC889`, intensity `3.4`, position `(-4, 8, 6)`,
  shadow map `1536 x 1536`.
- Cyan point light: `#70C9C0`, intensity `8`, distance `14`, decay `1.8`,
  position `(4, 3, 4)`.
- Warm spotlight: `#FFD6A2`, intensity `10`, distance `16`, angle `0.68`,
  penumbra `0.55`, decay `1.5`, position `(-2, 8, 5)`.

## Motion and interaction constants

- Room drag orbit range: `-0.42` to `0.42` radians.
- Close-up horizontal orbit range: `-0.32` to `0.32` radians.
- Close-up vertical orbit range: `-0.12` to `0.12` radians.
- Click-versus-drag threshold: less than `7px` accumulated movement.
- Room camera transition handoff: `720ms` before opening the destination.
- Drawer motion smoothing: linear interpolation factor `0.055` per frame.
- Drawer travel: `2.7` scene units along Z.
- Drawer workspace rotation while open: `-0.15` radians.
- Drawer contents become clickable after open progress exceeds `0.72`.
- Fax printing duration: `4600ms`; paper becomes clickable after progress
  exceeds `0.96`.
- Contact card 3D damping: lambda `7.2`, nominal delta `0.016`.
- Contact auto-pickup delay: `620ms`; lift-to-reading handoff: `850ms`;
  return-to-table duration: `780ms`.
- Monitor entrance: `700ms`.
- Standard object close-up entrance: `520-550ms`.
- Detail focus fade: `380ms`.
- Book pull: `700ms`; cover opening: `1150ms` after a `220ms` delay.
- CSS fax sheet print: `5800ms` for the full reading-sheet animation.

Use eased motion with visible acceleration and settling. Object state must be
real, not simulated by abruptly hiding one layer: the card returns before its
reading overlay unmounts, the drawer can be pushed closed, and the fax persists
after printing.

Under `prefers-reduced-motion: reduce`, animations and transitions must collapse
to near-instant behavior without blocking access to any content.

## Interface behavior and accessibility

- All scene canvases support pointer input and disable browser touch gestures
  only on the canvas itself.
- Interactive objects receive a visible lime highlight and a textual readout.
- Keyboard users can open computer files with Enter; project files visually
  behave like desktop files and open on double-click for pointer users.
- Dialogs close through a visible return button, Escape, or the backdrop.
- Focus-visible controls use a `2px` lime outline with `3px` offset.
- Every canvas and dialog has a content-specific English ARIA label.
- Do not make required information depend solely on color, hover, drag, or the
  mystery sequence; the Room Index provides a direct route.

## Content voice

Use factual project titles, roles, tools, teams, and dates. Narrative writing is
observant, concise, and slightly mysterious without implying danger. The final
fax reports a credible stage of off-site work; it must not say "I am not
missing."

All editable copy belongs in `content/*.json`. Do not hardcode portfolio copy in
components or CSS. Follow `content/CONTENT_GUIDE.md` when adding or rearranging
content.

## Change checklist

Before accepting a visual or modeling change:

1. Compare it with Room View and its neighboring objects.
2. Confirm the semantic colors still mean the same thing.
3. Check closed, opening, open, returning, and persisted states where relevant.
4. Verify desktop, `850px`, and `620px` layouts.
5. Run the production build and interaction tests.
6. Update this file whenever a canonical token, camera, light, material rule,
   or interaction timing changes.
