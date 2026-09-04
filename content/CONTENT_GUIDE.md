# Website Copy Editing Guide

All visitor-facing copy is stored in the JSON files in this directory. Edit the text, save the file, and restart or rebuild the site. You should not need to change the React or Three.js components.

## Content categories

- `site.json`: Site title, social description, brand labels, shared buttons, and loading messages.
- `intro.json`: Cover copy and the opening exploration guide.
- `room.json`: Room navigation, discovery states, quick index, and the six exploration zones.
- `computer.json`: User profile, desktop labels, README, Lab Log entries, projects, experience, reference-browser labels, and system bulletin.
- `references.json`: The project-reference website opened inside the computer, including filters, citations, annotations, provenance, and external links.
- `releases.json`: Public release summaries shown in `SYSTEM_UPDATES.app`; the current version number still comes only from `package.json`.
- `books.json`: Personal bookshelf labels, empty state, and future books or films with Alina's own notes.
- `drawer.json`: Drawer objects, hotspot labels, and expanded document copy.
- `notebook.json`: Research notebook pages, annotations, and page-turn prompts.
- `board.json`: Pinned notes, headings, and detail copy.
- `field-case.json`: Field Case objects, future planning, and item descriptions.
- `fax-contact.json`: Printer messages, final fax, contact card, email address, and reply link.

## Scene content responsibilities

Use each scene for a distinct kind of personal material. Together, the scenes should reveal more than a conventional résumé without repeating the same information everywhere.

### Computer — Formal Work

Use the computer for clear, structured material that could also appear on a résumé or professional portfolio.

- **Profile:** A concise personal introduction opened from the user avatar.
- **Projects:** Complete case files for finished or substantial projects.
- **Experience:** Research, internships, employment, and other formal roles.
- **README:** Workspace notes written for collaborators who may use the lab, not an explanation of the website.
- **Lab Log:** Dated professional updates written as authentic log entries. These may cover a new role, project milestone, release, lesson, or change in direction.
- **About:** Do not add a separate About file. Profile, README, and the physical scenes reveal this information more naturally.

### Books — Personal Reading and Film

Use the bookshelf for books Alina has read, films she has watched, and her personal response to each work. Do not use it as a project bibliography or fill it with generic summaries. Project papers, sourcebooks, and implementation dependencies belong in `REFERENCES.web` on the computer.

### Notebook — Process Notes

Use the notebook for project thinking, development process, experiments, design decisions, failed attempts, annotations, and unresolved questions. It should show how the work changed over time.

### Board — Principles and Plans

Use the board for working principles, methods, future plans, priorities, hypotheses, and open TODOs. Its content should feel active and provisional rather than like finished project documentation.

### Drawer — Physical Artifacts

Use the drawer for tangible traces of making: prototypes, sketches, components, test materials, discarded versions, printed documents, and small artifacts connected to real work. These objects should add physical evidence that is not already explained by the computer.

### Field Case — Life Outside the Lab

Use the Field Case only for experiences gathered away from the workstation: observations, activities, travel, photographs, and ideas brought back from the outside world. Formal project findings, presentations, deployments, and evaluation metrics belong in their Computer case files or evidence packets. The current entries cover confirmed travel, cooking and baking, archery, and laser-shooting interests. Do not invent specific achievements or personal stories that have not been confirmed.

### Fax — A Continuing Investigation

Use the final fax as a message sent back by Alina from work outside the lab. It should report a preliminary finding or meaningful stage of an ongoing investigation. It should not directly announce that Alina was never missing; the content itself should let the visitor infer that she is still working elsewhere.

## Content shapes by scene

The scenes intentionally use different data shapes so the website does not reduce every object to the same title-and-paragraph card.

- **Computer projects and experience:** `details` contains labeled case-file sections. Keep each section evidence-specific. Project pages link to the internal reference browser instead of repeating citations in the case file.
- **References:** `project`, `citation`, `summary`, `annotation`, `provenance`, and `url` separate the source from Alina's project note.
- **Releases:** Keep newest public releases first. Each record requires `version`, `date`, `title`, `type`, `summary`, `highlights`, and categorized `details`; never add ordinary commits, drafts, or failed deployments.
- **Books:** `title` supplies the hover label, `author` groups the dedicated author row, and `isReading` controls the bookmark. Detailed notes are not stored until open-book interaction is enabled.
- **Notebook:** `lead` introduces the problem, `steps` records a process, and the `reverse*` fields hold the later finding or correction. A `title` or `reverseTitle` may be `null` when the page reads better without one.
- **Drawer:** `facts` stores artifact labels and values. Use it for measurements, versions, evidence status, and physical contents.
- **Board:** Notes deliberately have no separate title. `label` is the handwritten principle, `copy` gives the evidence, and `detail` is the short margin line.
- **Field Case:** The travel map always remains interactive. `items` preserves the three personal-interest detail records. While `personalDetailsOpeningEnabled` is `false`, Recipe Cards, Archery, and Laser Shooting expose only their hover labels; change it to `true` to restore their existing detail routes after the personal stories are ready.

External project sources belong in `references.json` only when they have a stable citation and URL. Use `provenance` to distinguish original project references, implementation dependencies, and contextual background reading.

## Safe editing rules

1. Edit only the text inside quotation marks on the right side of a colon.
2. Keep field names, braces, brackets, commas, and quotation marks in place.
3. To include quotation marks inside a sentence, write them as `\"quoted text\"`.
4. Arrays control display order, including `references`, `books`, `notes`, and `status.messages`. Edit their text freely, but avoid removing required fields.
5. The `email` field controls both the displayed address and every `mailto:` link, so it only needs to be changed once.
6. Keys such as `map`, `folder`, and `research` are stable program identifiers. Do not rename them unless the corresponding component logic is also updated.

## Why this project uses JSON

This site contains short controls, status messages, structured project records, and 3D hotspot labels rather than only long-form articles. JSON can be read directly by both the interface and the 3D scenes without an additional Markdown compiler, while still keeping every content category in a separate file. `index.ts` is only the shared import point and normally does not need to be edited.
