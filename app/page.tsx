"use client";

import { useEffect, useState } from "react";

type ClueId = "terminal" | "route" | "device" | "notebook" | "fieldbag";

type Clue = {
  code: string;
  label: string;
  object: string;
  title: string;
  finding: string;
  deduction: string;
  project: string;
  fragment: string;
  tags: string[];
};

const clueOrder: ClueId[] = ["terminal", "route", "device", "notebook", "fieldbag"];

const clues: Record<ClueId, Clue> = {
  terminal: {
    code: "E-01",
    label: "DIGITAL TRACE",
    object: "UNLOCKED TERMINAL",
    title: "She makes small websites for real decisions.",
    finding: "A browser remained open to a working prototype. The polished screen was surrounded by notes about confusing labels, hesitant clicks, and what a person might need next.",
    deduction: "The subject treats code as a way to remove friction, not as an object to admire from a distance.",
    project: "SMALL WEB SYSTEMS / DESIGN + DEVELOPMENT",
    fragment: "make it useful before making it impressive",
    tags: ["WEB", "INTERACTION", "ITERATION"],
  },
  route: {
    code: "E-02",
    label: "ROUTE STUDY",
    object: "MARKED PATH BOARD",
    title: "She does not wait for the route to reveal itself.",
    finding: "The same path was tested, crossed out, and calculated again. A second route is labelled 'not failure — new information.'",
    deduction: "Algorithms appeal to her because they make reasoning visible: choose, test, revise, continue.",
    project: "PATHFINDING STUDY / SEARCH + REASONING",
    fragment: "certainty is optional; a next step is not",
    tags: ["ALGORITHM", "SEARCH", "TEST"],
  },
  device: {
    code: "E-03",
    label: "PHYSICAL EVIDENCE",
    object: "LIVE PROTOTYPE",
    title: "A thought was wired into the physical world.",
    finding: "A sensor, microcontroller, and output are connected on the bench. The enclosure is unfinished. The signal path is carefully labelled.",
    deduction: "The subject needs ideas to leave the screen eventually. She understands by making systems respond.",
    project: "PHYSICAL COMPUTING / SENSOR → LOGIC → RESPONSE",
    fragment: "if it cannot respond, it is still only a diagram",
    tags: ["HARDWARE", "PROTOTYPE", "SYSTEMS"],
  },
  notebook: {
    code: "E-04",
    label: "MARGIN NOTES",
    object: "UNFINISHED NOTEBOOK",
    title: "Her strongest conclusion is sometimes: not yet.",
    finding: "Pages combine computer science, psychology, questions about human behaviour, and repeated warnings against sounding certain too early.",
    deduction: "Curiosity is not decoration here. It is a working method: research first, ask people next, preserve the unresolved parts.",
    project: "FIELD NOTES / COMPUTING + HUMAN CURIOSITY",
    fragment: "I do not know yet is a valid research state",
    tags: ["PSYCHOLOGY", "RESEARCH", "QUESTIONS"],
  },
  fieldbag: {
    code: "E-05",
    label: "OFF-SITE TRACE",
    object: "FIELD BAG + TARGET",
    title: "She plans carefully, then enters the unknown anyway.",
    finding: "The bag contains a detailed itinerary, a backup route, a marked target, and a blank page titled 'what the plan could not predict.'",
    deduction: "Travel and archery share a pattern for her: prepare, focus, commit, observe the result, adjust.",
    project: "FIELD PRACTICE / TRAVEL + ARCHERY",
    fragment: "leave enough margin for a life not yet experienced",
    tags: ["TRAVEL", "FOCUS", "PLAN B"],
  },
};

export default function Home() {
  const [entered, setEntered] = useState(false);
  const [activeClue, setActiveClue] = useState<ClueId | null>(null);
  const [discovered, setDiscovered] = useState<ClueId[]>([]);
  const [algorithmRun, setAlgorithmRun] = useState(false);
  const [deviceOn, setDeviceOn] = useState(false);
  const [noteTurned, setNoteTurned] = useState(false);
  const [routeChanged, setRouteChanged] = useState(false);

  const openClue = (id: ClueId) => {
    setActiveClue(id);
    setDiscovered((current) => current.includes(id) ? current : [...current, id]);
  };

  const enterLab = () => {
    setEntered(true);
    window.setTimeout(() => document.querySelector("#lab")?.scrollIntoView({ behavior: "smooth" }), 120);
  };

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveClue(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const nextClue = activeClue
    ? clueOrder[(clueOrder.indexOf(activeClue) + 1) % clueOrder.length]
    : "terminal";
  const solved = discovered.length === clueOrder.length;

  return (
    <main className={entered ? "case-open" : ""}>
      <header className="case-nav">
        <a href="#top" className="case-brand">AW / CASE FILE 03</a>
        <div className="case-state"><i /> {solved ? "SUBJECT LOCATED" : entered ? "INVESTIGATION ACTIVE" : "AWAITING ENTRY"}</div>
        <a href="#evidence">EVIDENCE {String(discovered.length).padStart(2, "0")}/05</a>
      </header>

      <section className="intake" id="top">
        <div className="intake-copy">
          <p className="kicker">CONFIDENTIAL / PERSON OF INTEREST</p>
          <h1>A person is<br /><em>missing.</em><br />The work is not.</h1>
          <p className="case-summary">
            Alina Wu left no biography, only an unlocked laboratory full of
            prototypes, questions, routes, and notes written in the margins.
            Your task is to reconstruct the person from what she left behind.
          </p>
          <button className="enter-button" onClick={enterLab}>
            {entered ? "RETURN TO THE LAB" : "ACCEPT CASE / ENTER LAB"}<span>→</span>
          </button>
        </div>

        <div className="missing-file" aria-label="Case intake document">
          <div className="file-tab">CASE 03</div>
          <div className="file-stamp">MISSING?</div>
          <div className="subject-card">
            <div className="subject-mark"><span>AW</span><i /><i /><i /></div>
            <div>
              <small>SUBJECT</small>
              <strong>ALINA WU</strong>
              <p>COMPUTER SCIENCE<br />HUMAN CURIOSITY</p>
            </div>
          </div>
          <dl className="case-facts">
            <div><dt>LAST SEEN</dt><dd>AT THE EDGE OF A QUESTION</dd></div>
            <div><dt>KNOWN HABIT</dt><dd>LEAVES A PLAN B</dd></div>
            <div><dt>RISK LEVEL</dt><dd>LIKELY TO KEEP EXPLORING</dd></div>
          </dl>
          <p className="handwritten intake-note">Do not trust the résumé.<br />Trust the evidence.</p>
        </div>

        <div className="scroll-note">SCROLL AFTER ACCEPTING CASE <span>↓</span></div>
      </section>

      <section className="lab-section" id="lab">
        <header className="section-head">
          <div>
            <p className="kicker">LOCATION 01 / PRIVATE WORKSPACE</p>
            <h2>The lab was left<br />exactly like this.</h2>
          </div>
          <div className="investigator-note">
            <span>INVESTIGATOR NOTE</span>
            Five objects appear relevant. Open them in any order. Every object changes the working theory.
          </div>
        </header>

        <div className="lab-shell">
          <div className="lab-status">
            <span><i /> POWER STILL ON</span>
            <strong>{discovered.length === 0 ? "NO EVIDENCE LOGGED" : `${discovered.length} OF 5 OBJECTS LOGGED`}</strong>
            <span>02:17 AM / RECORDED</span>
          </div>
          <div className="lab-grid" aria-hidden="true" />
          <div className="window-light" aria-hidden="true"><i /><i /><i /></div>
          <div className="cable cable-a" aria-hidden="true" />
          <div className="cable cable-b" aria-hidden="true" />

          <button className={`clue-object terminal-object ${discovered.includes("terminal") ? "logged" : ""}`} onClick={() => openClue("terminal")}>
            <span className="evidence-marker">E-01</span>
            <span className="terminal-bar"><i /><i /><i /><b>localhost / unfinished</b></span>
            <span className="terminal-screen">
              <small>&gt; last_session.log</small>
              <strong>Build for the<br />person using it.</strong>
              <i className="cursor" />
            </span>
            <span className="inspect-label">INSPECT TERMINAL ↗</span>
          </button>

          <button className={`clue-object route-object ${discovered.includes("route") ? "logged" : ""}`} onClick={() => openClue("route")}>
            <span className="evidence-marker">E-02</span>
            <span className="route-paper">
              <small>ROUTE STUDY / REV. 7</small>
              <i className="route-line one" /><i className="route-line two" /><i className="route-line three" />
              <b className="route-node a">A</b><b className="route-node b">?</b><b className="route-node c">B</b>
              <em>recalculate ≠ restart</em>
            </span>
            <span className="inspect-label">TRACE THE LOGIC ↗</span>
          </button>

          <button className={`clue-object device-object ${discovered.includes("device") ? "logged" : ""}`} onClick={() => openClue("device")}>
            <span className="evidence-marker">E-03</span>
            <span className="device-plate">
              <i className="chip">MCU</i><i className="sensor">IN</i><i className="output">OUT</i>
              <b className="wire in" /><b className="wire out" /><em />
            </span>
            <strong>PROTOTYPE / 04</strong>
            <span className="inspect-label">TEST THE SIGNAL ↗</span>
          </button>

          <button className={`clue-object notebook-object ${discovered.includes("notebook") ? "logged" : ""}`} onClick={() => openClue("notebook")}>
            <span className="evidence-marker">E-04</span>
            <span className="clip" />
            <small>FIELD NOTE / UNDERSIDE OF PAGE</small>
            <strong>“Does good interaction make people feel more human—or systems look more human?”</strong>
            <em>conclusion: not yet.</em>
            <span className="inspect-label">READ THE MARGINS ↗</span>
          </button>

          <button className={`clue-object fieldbag-object ${discovered.includes("fieldbag") ? "logged" : ""}`} onClick={() => openClue("fieldbag")}>
            <span className="evidence-marker">E-05</span>
            <span className="target-disc"><i /><i /><i /><b /></span>
            <span className="bag-ticket"><small>FIELD ROUTE 04</small><strong>PLAN A</strong><em>PLAN B →</em></span>
            <span className="inspect-label">OPEN FIELD BAG ↗</span>
          </button>

          <span className="lab-annotation annotation-a">coffee cold / screen warm</span>
          <span className="lab-annotation annotation-b">why five versions?</span>
          <span className="lab-annotation annotation-c">subject works in questions</span>
        </div>
      </section>

      <section className="evidence-section" id="evidence">
        <header className="section-head evidence-heading">
          <div>
            <p className="kicker">LOCATION 02 / EVIDENCE WALL</p>
            <h2>Build a theory.<br />Expect corrections.</h2>
          </div>
          <div className="evidence-count"><strong>{String(discovered.length).padStart(2, "0")}</strong><span>OF 05<br />CONNECTED</span></div>
        </header>

        <div className={`evidence-board ${solved ? "solved" : ""}`}>
          <span className="thread thread-a" aria-hidden="true" /><span className="thread thread-b" aria-hidden="true" />
          <span className="thread thread-c" aria-hidden="true" /><span className="thread thread-d" aria-hidden="true" />
          {clueOrder.map((id, index) => {
            const clue = clues[id];
            const found = discovered.includes(id);
            return (
              <button
                className={`evidence-card evidence-card-${index + 1} ${found ? "found" : "sealed"}`}
                key={id}
                onClick={() => openClue(id)}
              >
                <i className="pin" />
                <small>{clue.code} / {found ? clue.label : "UNEXAMINED"}</small>
                <strong>{found ? clue.title : "Evidence remains sealed."}</strong>
                <p>{found ? clue.deduction : "Return to the laboratory and inspect this object."}</p>
                <span>{found ? "REOPEN FILE ↗" : "GO TO OBJECT ↗"}</span>
              </button>
            );
          })}

          <div className={`working-theory ${solved ? "unlocked" : ""}`}>
            <span className="theory-label">WORKING THEORY / {solved ? "CONFIRMED" : "LOCKED"}</span>
            {solved ? (
              <>
                <div className="located-stamp">LOCATED</div>
                <h3>She was never missing.<br />She followed the next question.</h3>
                <p>
                  The evidence describes a builder who turns uncertainty into experiments:
                  code when the problem needs structure, hardware when an idea needs a body,
                  research when people make the answer more complicated, and a Plan B when
                  the route changes.
                </p>
                <a href="mailto:hello@example.com">CONTACT THE SUBJECT →</a>
              </>
            ) : (
              <>
                <h3>Insufficient evidence.</h3>
                <p>Connect all five traces before filing a conclusion. Current confidence: {discovered.length * 20}%.</p>
                <a href="#lab">RETURN TO THE LAB →</a>
              </>
            )}
          </div>
        </div>
      </section>

      <footer>
        <div><span>CASE FILE 03</span><strong>ALINA.WU / THE MISSING RESEARCHER</strong></div>
        <p>No trait labels were used in this investigation.<br />Only evidence, working theories, and one suspiciously detailed Plan B.</p>
        <a href="#top">REOPEN CASE ↑</a>
      </footer>

      {activeClue && (
        <div className="clue-backdrop" onMouseDown={() => setActiveClue(null)}>
          <aside className="clue-drawer" role="dialog" aria-modal="true" aria-labelledby="clue-title" onMouseDown={(event) => event.stopPropagation()}>
            <header className="drawer-head">
              <div><small>{clues[activeClue].code}</small><strong>{clues[activeClue].object}</strong></div>
              <button onClick={() => setActiveClue(null)} aria-label="Close evidence file">×</button>
            </header>
            <div className="drawer-body">
              <p className="kicker">{clues[activeClue].label} / LOGGED</p>
              <h2 id="clue-title">{clues[activeClue].title}</h2>

              {activeClue === "terminal" && (
                <div className="evidence-demo terminal-demo">
                  <div>CASE_TERMINAL — SESSION RECOVERED</div>
                  <p><span>09:12</span> simplify the first decision</p>
                  <p><span>11:40</span> test with someone who did not build it</p>
                  <p><span>15:06</span> answer the hesitation, not only the click</p>
                  <strong>&gt; status: still iterating_</strong>
                </div>
              )}

              {activeClue === "route" && (
                <div className={`evidence-demo algorithm-demo ${algorithmRun ? "running" : ""}`}>
                  <div className="mini-path">
                    {Array.from({ length: 30 }, (_, index) => <i className={[2, 8, 9, 15, 21, 22].includes(index) ? "wall" : ""} key={index} />)}
                    <b className="start">A</b><b className="finish">B</b>
                  </div>
                  <button onClick={() => setAlgorithmRun((value) => !value)}>{algorithmRun ? "CLEAR ROUTE" : "RUN SEARCH"}</button>
                </div>
              )}

              {activeClue === "device" && (
                <div className={`evidence-demo hardware-demo ${deviceOn ? "powered" : ""}`}>
                  <div className="hardware-stage"><span>INPUT</span><i /><strong>CORE</strong><i /><span>OUTPUT</span></div>
                  <div className="hardware-console">&gt; {deviceOn ? "signal received / response confirmed" : "waiting for physical input..."}</div>
                  <button onClick={() => setDeviceOn((value) => !value)}>{deviceOn ? "POWER OFF" : "POWER ON"}</button>
                </div>
              )}

              {activeClue === "notebook" && (
                <button className={`evidence-demo note-demo ${noteTurned ? "turned" : ""}`} onClick={() => setNoteTurned((value) => !value)}>
                  <small>{noteTurned ? "REVERSE / PRIVATE MARGIN" : "PAGE 17 / RESEARCH NOTE"}</small>
                  <strong>{noteTurned ? "Sounding certain is not the same as understanding." : "Code can solve problems. Who decides what counts as a human problem?"}</strong>
                  <span>{noteTurned ? "TURN BACK ↺" : "TURN THE PAGE ↻"}</span>
                </button>
              )}

              {activeClue === "fieldbag" && (
                <div className={`evidence-demo travel-demo ${routeChanged ? "changed" : ""}`}>
                  <div><b>08:10</b><span>DEPART / MAIN ROUTE</span></div>
                  <div><b>11:40</b><span>{routeChanged ? "RAIN / ROUTE B" : "WANDER / UNSCHEDULED"}</span></div>
                  <div><b>?</b><span>ENTER SOMEONE ELSE&apos;S EVERYDAY</span></div>
                  <button onClick={() => setRouteChanged((value) => !value)}>{routeChanged ? "RESTORE PLAN A" : "RECALCULATE / PLAN B"}</button>
                </div>
              )}

              <div className="evidence-copy">
                <div><span>OBSERVATION</span><p>{clues[activeClue].finding}</p></div>
                <div><span>DEDUCTION</span><p>{clues[activeClue].deduction}</p></div>
              </div>
              <div className="project-strip"><small>RELATED PROJECT TRACE</small><strong>{clues[activeClue].project}</strong></div>
              <blockquote>“{clues[activeClue].fragment}”</blockquote>
              <div className="tag-row">{clues[activeClue].tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            </div>
            <div className="drawer-next">
              <span>{discovered.length}/5 EVIDENCE LOGGED</span>
              <button onClick={() => openClue(nextClue)}>NEXT FILE / {clues[nextClue].code} →</button>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}
