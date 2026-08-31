# Repository Working Agreement

This repository is currently maintained as a solo-developed portfolio project. Keep the workflow lightweight, practical, and proportional to risk. Do not add process for its own sake.

## Project Context

- This is an interactive portfolio built as a lightweight 3D laboratory exploration experience.
- Preserve the existing project structure, visual language, interaction model, and content architecture unless the requested change explicitly calls for restructuring them.
- When `.openai/hosting.json` is present, read and follow the available Sites building and hosting instructions for site work.
- Treat the primary agent as the owner of the Site checkout. A delegated agent must not initialize, publish, deploy, or otherwise take ownership of the Site.
- Keep all public-facing website copy and repository documentation in English unless the user explicitly requests otherwise.

## Scope and Autonomy

- Make reasonable, low-risk implementation decisions without creating unnecessary clarification loops.
- Do not expand a request into materially different product work without permission.
- Do not create a GitHub Issue, branch, Pull Request, deployment, or release unless the user requests it or the action is already clearly part of the requested workflow. Commit and push authority is governed by the branch-specific rules below.
- Never spawn or delegate to another agent without the user's explicit approval. This applies even when delegation might be faster, because agent usage consumes additional tokens.
- If the user approves a product-manager/SWE-agent workflow, the coordinating agent owns scope and acceptance, the SWE agent implements only the assigned work, and the coordinating agent reviews the diff and test results before accepting it.
- Work locally in the primary agent by default.

### Manager/SWE Workflow Decision

Before beginning work that is large, uncertain, or likely to benefit materially from implementation and review being separated, pause and ask the user whether to use a manager/SWE-agent workflow. Good reasons to offer this workflow include:

- a substantial 3D modeling pass involving several objects or scenes;
- a room-wide or cross-closeup visual consistency overhaul;
- a broad interaction, state-management, content-schema, or architectural refactor;
- a change with several interdependent implementation phases;
- work with a high chance of rework, regressions, or difficult visual review; and
- a large diff for which an independent implementation review would meaningfully improve safety.

The request for permission should be brief and explain why delegation may help and that it will use additional agent tokens. Do not spawn either the manager or SWE agent until the user explicitly agrees. If the user declines, continue locally with the primary agent.

Do not propose or use this workflow for routine, isolated work such as:

- editing copy in one or more JSON content files;
- moving a single object or adjusting one coordinate;
- refining one small prop or one localized model;
- making a small CSS, spacing, typography, or label adjustment;
- updating a narrow test expectation; or
- applying another obvious, low-risk fix that the primary agent can implement and verify directly.

When the workflow is approved, the manager defines scope and acceptance criteria, the SWE agent implements only that scope, and the manager reviews the resulting diff and validation evidence before recommending acceptance. The primary Site owner retains control of the checkout, Sites workflow, browser handoff, deployment, Git operations, and final user communication. No participating agent may spawn additional agents without separate user approval.

## Git Workflow

### `main`

- Keep `main` stable and deployable.
- Small, obvious, low-risk changes may be made directly on `main` without a dedicated branch or Pull Request.
- Avoid unnecessary branch and PR overhead for trivial changes.
- Before editing `main`, confirm that the worktree is clean and synchronize it safely with the current remote state when needed.
- Never commit or push from `main` without the user's explicit approval for that action. Associate the work with an Issue when appropriate, but do not create or link an Issue unless the user authorizes it.

### `fix-issue`

Use the existing `fix-issue` branch as the normal working branch when isolation from `main` is valuable. Typical examples include:

- modeling-related bugs;
- changes likely to require significant rework;
- changes with uncertain behavior or side effects;
- larger or riskier fixes;
- changes that may need an easy rollback point; and
- work best reviewed as one complete diff before entering `main`.

Not every bug, improvement, or GitHub Issue needs a new branch. Multiple related fixes may share `fix-issue` when appropriate. Do not automatically create a branch per Issue.

Before reusing `fix-issue`, confirm that it does not contain unrelated unmerged work. If it does, ask before mixing scopes or create a separate branch only when isolation is genuinely necessary.

- On `fix-issue`, once a focused change has been reviewed and validated, the agent may commit and push it without a separate user approval. A commit or push does not require an Issue number.
- Do not open, merge, or otherwise approve a Pull Request without the user's explicit approval. Pull Requests should normally link the relevant Issue when one exists; do not invent an Issue solely to satisfy this convention.

When `fix-issue` is ready:

1. Review the complete diff.
2. Run the relevant checks.
3. Open a Pull Request from `fix-issue` into `main`.
4. Use the PR as the final review and safety checkpoint.
5. Merge only after the change is stable.

Merging still requires the user's explicit approval, even for a solo project.

### Working Tree Safety

- Treat existing uncommitted changes as user-owned unless they are known to belong to the current task.
- Stage and commit only files and hunks changed for the current task.
- Never include logs, local runtime files, dossiers, generated output, unrelated edits, or another worktree's changes in a commit.
- Do not discard, reset, overwrite, or reformat unrelated work.
- After committing or pushing, report the branch, commit, validation status, and any remaining uncommitted changes.

## GitHub Issues and Project

- Treat the GitHub Project as a general backlog for features, improvements, bugs, technical debt, and future ideas.
- A newly discovered idea may remain a draft or backlog item until it is concrete enough to implement.
- Do not create Issues for trivial work unless the user asks.
- When a PR resolves an existing Issue, link it in the PR body with a closing keyword when appropriate, for example `Closes #23` or `Fixes #23`.
- Do not assume that one Issue requires one branch. Branch boundaries should follow risk and review needs, not Issue numbers.

## Commits

Use concise, descriptive commit messages, preferably following Conventional Commits:

- `feat:` for new functionality;
- `fix:` for bug fixes;
- `refactor:` for internal restructuring without intended behavior changes;
- `docs:` for documentation;
- `test:` for tests;
- `chore:` for maintenance, dependencies, or configuration; and
- `perf:` for performance improvements.

Examples:

- `feat: add project search`
- `fix: align printer model across closeups`
- `refactor: simplify model initialization`
- `test: avoid locking scene tests to coordinates`
- `chore: update dependencies`

Avoid vague messages such as `update`, `changes`, `fix stuff`, `final`, or `work`.

Prefer logically focused commits. Do not commit every tiny edit separately, and do not combine unrelated changes into one commit.

## Versioning and Releases

- Use Semantic Versioning (`MAJOR.MINOR.PATCH`). A version identifies an externally testable or released build; it does not count commits, branches, or daily development progress.
- `package.json`'s `version` is the single source of truth. Use the package versioning tool so `package-lock.json` stays synchronized; derive the site's displayed version from that source rather than maintaining duplicate values.
- Ordinary commits, pushes, and feedback fixes do not change the product version, create a Git tag or GitHub Release, or deploy production. During the early public `0.8.0` period, distinguish testing builds by Git SHA and Cloudflare version/deployment ID instead.
- The planned progression is `0.8.0` for the early public build, `0.9.0-beta.N` for beta candidates, `1.0.0-rc.N` for release candidates, and `1.0.0` for the first stable public release.
- After `1.0.0`, use MINOR for new public projects, scenes, or substantial 3D improvements; use PATCH for fixes only; use MAJOR only when a core visitor experience changes materially. Reset lower-order numbers when incrementing MAJOR or MINOR.
- A formal release must synchronize the package version, lockfile, CHANGELOG, site display, Git tag `vX.Y.Z`, GitHub Release, and Cloudflare deployment message/version tag. Production deployment remains subject to the user's explicit manual approval.

## Pull Requests

Use PRs primarily as a safety, review, and rollback checkpoint for significant work. A PR should clearly state:

- what changed;
- why it changed;
- important risks or side effects;
- how it was tested; and
- which Issue it resolves, when applicable.

Review the complete diff before opening or approving a PR. A passing build alone is not sufficient when the CI workflow also runs lint and tests.

- Opening a Pull Request requires the user's explicit approval. When it resolves an existing Issue, use a closing reference such as `Closes #23` or `Fixes #23`.

## Content Architecture

- Keep editable website copy in the appropriate files under `content/` rather than hardcoding prose in React or Three.js components.
- Preserve the existing scene-based content categories and import content through the repository's content layer.
- New experiences or projects should normally be added through JSON when the existing schema and renderer support the entry type.
- Change application code only when the new content requires a new structure, interaction, layout, or data shape.
- Keep JSON valid and maintain the established field shape for each category.
- Do not add Chinese copy, Chinese editing instructions, or full-width Chinese punctuation to public content or English documentation.
- Use ordinary ASCII apostrophes and quotation marks in English copy unless typography explicitly requires something else.

## 3D and Interaction Conventions

- Treat Room View as the spatial baseline for corresponding closeups unless a closeup intentionally presents a different camera framing.
- Keep relative object placement, scale, orientation, and state consistent across Room View, Printer Closeup, Drawer Closeup, Contact, and other shared scenes.
- A closeup may crop an object, but it should not silently rearrange the workspace or change object proportions.
- Keep objects physically plausible: place items on surfaces, avoid visible intersections, preserve believable gravity, and prevent handles, cables, paper, cards, and props from floating or clipping.
- When an object appears in more than one scene, compare the scenes directly rather than adjusting each one independently by eye.
- Preserve existing interaction state across closeups. For example, printed fax paper should remain visible wherever the same printer is shown.
- Match pointer-drag direction across Room View and all closeups unless an interaction has a documented reason to differ.
- Preserve deliberate interaction rules such as double-clicking desktop files, layered draggable computer windows, gradual reveals, and natural pickup/return animations.

## Tests and Validation

- For a small, isolated change, run the narrowest relevant check plus a production build when compilation or rendering may be affected.
- Before a significant commit or PR, reproduce the repository CI workflow:
  - `npm run lint`
  - `npm test`
- `npm test` performs the production build and rendered-site tests. Do not report CI readiness after running only the build.
- Fix actual failures before handing off unless the user requested diagnosis only.
- Tests should validate behavior, structure, connectivity, accessibility, and stable product invariants.
- Do not lock tests to arbitrary 3D coordinates, dimensions, camera positions, font sizes, or editable prose unless that exact value is itself an intentional requirement.
- When a visual layout or content value is intentionally changed, update brittle tests to check the underlying behavior instead of replacing one hardcoded value with another.
- Keep content tests focused on valid schemas, required fields, supported feature flags, and prohibited stale placeholders rather than exact user-editable sentences.

## Local Preview and Visual QA

- Use the repository's existing development flow and local runtime; do not create a second project or move the checkout to another folder merely to preview it.
- Do not add runtime folders, build artifacts, stdout/stderr logs, local dossiers, or machine-specific files to Git.
- Choose the preview environment deliberately:
  - **Local runtime:** use the local method when the repository contains a working `.runtime` environment, when the user explicitly asks for localhost/local preview, or when the user says to use the local environment. On Windows, prepend `.runtime/node-v22.14.0-win-x64` to `PATH` and run the existing `npm run dev` script from the selected worktree. Reuse the retained server when possible and provide its exact `http://localhost:<port>` URL.
  - **Codex-managed preview:** when no usable local runtime is available and the user has not specifically requested local preview, use the Codex/Sites managed development and preview flow described by the applicable Sites instructions. Keep the managed process and browser handoff attached to the same selected worktree; do not copy the project to an ad hoc folder or silently fall back to a different checkout.
- Do not switch between local and Codex-managed preview in the middle of a debugging session without telling the user. The preview must run from the branch being discussed so the displayed result matches the intended code.
- When the user asks to open the website, start or reuse the appropriate development server and provide the exact local or managed preview URL.
- Perform browser interaction or screenshot-based visual QA when the user explicitly requests visual inspection, or when it is necessary to verify a reported visual defect and the appropriate browser tooling is available.

## Communication

- Lead with the outcome and keep progress updates concise.
- State whether changes were committed or pushed; never leave this ambiguous.
- If a test fails because the test is stale or overly specific, explain the distinction between a product failure and a test-contract failure.
- When choosing between the lightweight path and `fix-issue` plus a PR, use the simplest workflow that still provides appropriate isolation, reviewability, testing, and rollback safety.
