"use client";

import { useState } from "react";
import V2Nav from "../_components/V2Nav";
import InteractiveModel from "../_components/three/InteractiveModel";

const lockerItems = {
  route: {
    label: "ROUTE FOLDER",
    code: "A / 08:10",
    title: "A plan with an exit route.",
    note: "08:10 depart. 11:20 first stop. 14:00 deliberately empty. Plan B is folded behind the page; it is shorter, quieter, and ready if the weather changes.",
    trace: "Margin left: 38 minutes.",
  },
  book: {
    label: "BOOK + PENCIL",
    code: "B / P.143",
    title: "The sentence in the margin.",
    note: "A technically correct answer can still fail at the moment it meets a person. Underlined once. Question mark added later.",
    trace: "Next search: behavior behind the interface.",
  },
  choices: {
    label: "CHOICE MAP",
    code: "C / RUN 06",
    title: "Five endings, one saved route.",
    note: "Three branches are crossed out. One says ‘insufficient information.’ Another says ‘confident, unfortunately wrong.’ The surviving path has more notes than certainty.",
    trace: "Current state: still testing.",
  },
  receipt: {
    label: "POCKET RECEIPT",
    code: "D / 19:42",
    title: "The planned route ended here.",
    note: "Four drinks, the wrong street, and a handwritten reminder that nobody could finish the story because everyone kept laughing.",
    trace: "No optimization required.",
  },
  range: {
    label: "RANGE LOG",
    code: "E / 18 M",
    title: "The grouping moved left.",
    note: "Not a bad bow. Not bad luck. Stance adjusted, sight moved two clicks, shoulders reset. Try the same distance again on Friday.",
    trace: "Correction recorded before conclusion.",
  },
} as const;

type LockerKey = keyof typeof lockerItems;
const lockerKeys = Object.keys(lockerItems) as LockerKey[];

export default function AboutPage() {
  const [opened, setOpened] = useState<LockerKey>("route");
  const evidence = lockerItems[opened];

  return (
    <main className="inner-shell clubhouse-shell">
      <V2Nav active="about" label="CLUBHOUSE / LOCKER 17" />

      <section className="inner-hero clubhouse-hero has-3d-hero">
        <p className="inner-kicker">CLUBHOUSE / SOMEONE LEFT THE LOCKER OPEN</p>
        <h1>No biography<br />on the door.<br /><em>Look closer.</em></h1>
        <div className="hero-aside">
          <span>LOCKER 17 / OCCUPIED</span>
          <p>
            Nothing here was arranged as a personality test. Open what catches
            your attention and decide what the evidence suggests.
          </p>
        </div>
        <InteractiveModel kind="locker" className="hero-3d-model" activeIndex={lockerKeys.indexOf(opened)} onSelect={(index) => setOpened(lockerKeys[index])} title="LOCKER 17" hint="DRAG TO LOOK · CLICK A DOOR" />
      </section>

      <section className="locker-room content-section" id="locker">
        <header className="section-heading">
          <span>01 / PERSONAL STORAGE</span>
          <h2>Five objects.<br />No trait labels.</h2>
        </header>

        <div className="locker-explorer">
          <div className="locker-model-panel" role="tablist" aria-label="Objects found in locker 17">
            <InteractiveModel kind="locker" activeIndex={lockerKeys.indexOf(opened)} onSelect={(index) => setOpened(lockerKeys[index])} title="FULL LOCKER MODEL" hint="CLICK A DOOR TO OPEN IT" />
            <div className="model-selector locker-model-selector">
              {lockerKeys.map((key, index) => (
                <button key={key} role="tab" aria-selected={opened === key} className={opened === key ? "is-active" : ""} onClick={() => setOpened(key)}>
                  <b>0{index + 1}</b><span>{lockerItems[key].label}</span>
                </button>
              ))}
            </div>
          </div>

          <article className="locker-evidence" aria-live="polite">
            <header><span>EVIDENCE / {evidence.code}</span><i>FOUND IN LOCKER 17</i></header>
            <h2>{evidence.title}</h2>
            <p>{evidence.note}</p>
            <footer><span>PENCIL NOTE</span><strong>{evidence.trace}</strong></footer>
          </article>
        </div>
      </section>

      <section className="clubhouse-worktable content-section">
        <header className="section-heading light-heading">
          <span>02 / BESIDE THE LAPTOP</span>
          <h2>A transcript, a summer,<br />and the tools in use.</h2>
        </header>
        <div className="table-evidence">
          <article className="debug-sheet">
            <span>UNIVERSITY OF WASHINGTON / SEATTLE</span>
            <ol>
              <li><b>DEGREE</b> B.S. in Computer Science</li>
              <li><b>DATE</b> Expected June 2028</li>
              <li><b>GPA</b> 4.0 cumulative</li>
              <li><b>SCHOOL</b> Paul G. Allen School</li>
            </ol>
          </article>
          <article className="split-notebook">
            <div><span>UW COURSEWORK</span><p>Databases, linear algebra, foundations of computing, and software design.</p></div>
            <div><span>HARVARD SUMMER 2024</span><p>Artificial Intelligence with Python and multivariable calculus.</p></div>
            <small>The technical route is still widening.</small>
          </article>
          <article className="completion-slip">
            <span>TOOLS / CURRENT KIT</span>
            <p>Python · Java · JavaScript · C/C++</p>
            <p>pandas · NumPy · Matplotlib · YOLO</p>
            <p>Docker · Arduino · Fusion · AutoCAD</p>
            <strong>BUILD → TEST → REVISE</strong>
          </article>
        </div>
      </section>

      <section className="clubhouse-corkboard content-section">
        <header className="section-heading">
          <span>03 / AFTER THE RANGE CLOSES</span>
          <h2>A few things escaped<br />the filing system.</h2>
        </header>
        <div className="corkboard-traces">
          <article><span>TRAIN TICKET</span><strong>Window seat / backup route saved</strong><small>Departure: too early, apparently worth it.</small></article>
          <article><span>BOOKMARK</span><strong>Return to the question on page 143.</strong><small>The answer was less interesting.</small></article>
          <article><span>GAME NOTE</span><strong>Do not choose the suspiciously confident option.</strong><small>Previous ending: avoidable disaster.</small></article>
          <article><span>MESSAGE DRAFT</span><strong>“We are definitely not lost.”</strong><small>Sent with a photo proving otherwise.</small></article>
        </div>
      </section>

      <footer className="inner-next cabin-next">
        <span>THE REPAIR SHED IS STILL LIT</span>
        <a href="/projects">Follow the workbench light <b>→</b></a>
      </footer>
    </main>
  );
}
