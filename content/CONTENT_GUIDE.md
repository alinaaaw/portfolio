# Website Copy Editing Guide

All visitor-facing copy is stored in the JSON files in this directory. Edit the text, save the file, and restart or rebuild the site. You should not need to change the React or Three.js components.

## Content categories

- `site.json`: Site title, social description, brand labels, shared buttons, and loading messages.
- `intro.json`: Cover copy and the opening exploration guide.
- `room.json`: Room navigation, discovery states, quick index, and the six exploration zones.
- `computer.json`: User profile, desktop labels, README, Lab Log entries, projects, experience, and system bulletin.
- `books.json`: Bookshelf labels, all six books, and page-turning interface copy.
- `drawer.json`: Drawer objects, hotspot labels, and expanded document copy.
- `notebook.json`: Research notebook pages, annotations, and page-turn prompts.
- `board.json`: Pinned notes, headings, and detail copy.
- `field-case.json`: Field Case objects, future planning, and item descriptions.
- `fax-contact.json`: Printer messages, final fax, contact card, email address, and reply link.

## Safe editing rules

1. Edit only the text inside quotation marks on the right side of a colon.
2. Keep field names, braces, brackets, commas, and quotation marks in place.
3. To include quotation marks inside a sentence, write them as `\"quoted text\"`.
4. Arrays control display order, including `books`, `notes`, and `status.messages`. Edit their text freely, but avoid removing required fields.
5. The `email` field controls both the displayed address and every `mailto:` link, so it only needs to be changed once.
6. Keys such as `map`, `folder`, and `research` are stable program identifiers. Do not rename them unless the corresponding component logic is also updated.

## Why this project uses JSON

This site contains short controls, status messages, structured project records, and 3D hotspot labels rather than only long-form articles. JSON can be read directly by both the interface and the 3D scenes without an additional Markdown compiler, while still keeping every content category in a separate file. `index.ts` is only the shared import point and normally does not need to be edited.
