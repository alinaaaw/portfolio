"use client";

import { useEffect, useRef, useState } from "react";

type PanelId = "web" | "algorithm" | "hardware" | "notes" | "travel";
type FocusId = "notice" | "research" | "decide" | "act";
type Shot = { id: number; x: number; y: number; focus: FocusId };

const panelNames: Record<PanelId, string> = {
  web: "WEB / SMALL SITES",
  algorithm: "ALGORITHM / SEARCH & REASON",
  hardware: "HARDWARE / PHYSICAL SYSTEMS",
  notes: "NOTES / THOUGHT FRAGMENTS",
  travel: "TRAVEL / OFF THE ROUTE",
};

const panelOrder: PanelId[] = ["web", "algorithm", "hardware", "notes", "travel"];

const ringPositions: Record<FocusId, string> = {
  notice: "OUTER ZONE",
  research: "MIDDLE ZONE",
  decide: "INNER ZONE",
  act: "BULLSEYE",
};

const panelHints: Record<PanelId, string> = {
  web: "WEB — small tools shaped around a real use.",
  algorithm: "ALGORITHM — gather evidence, test a route, recalculate.",
  hardware: "HARDWARE — code becomes a signal you can touch.",
  notes: "NOTES — unfinished questions about people and interaction.",
  travel: "TRAVEL — plan carefully, then enter someone else’s everyday.",
};

const focusProfiles: Record<FocusId, {
  index: string;
  label: string;
  question: string;
  title: string;
  summary: string;
  noteLabel: string;
  note: string;
}> = {
  notice: {
    index: "04",
    label: "NOTICE",
    question: "What is actually happening?",
    title: "Start with signals, not certainty.",
    summary: "I look for context, behavior, and the part of a problem that has not been named yet.",
    noteLabel: "STATUS I TRUST",
    note: "Unverified is more useful than confidently wrong.",
  },
  research: {
    index: "03",
    label: "RESEARCH",
    question: "What do I know, and what am I assuming?",
    title: "Collect evidence before asking for certainty.",
    summary: "I search first, compare what I find, and then ask people when the human part needs a human answer.",
    noteLabel: "DEFAULT MOVE",
    note: "Search first. Ask people next.",
  },
  decide: {
    index: "02",
    label: "DECIDE",
    question: "Which route is best with what I know now?",
    title: "Choose a line without pretending it is perfect.",
    summary: "I plan carefully, keep a backup, and preserve enough margin to respond when reality changes the route.",
    noteLabel: "ROUTE RULE",
    note: "Plan A. Backup B. Leave breathing room.",
  },
  act: {
    index: "01",
    label: "ACT",
    question: "Can I make the next step real?",
    title: "Build, test, experience, share.",
    summary: "A stage is complete when I can use the result, show it to someone else, and see what the next step should be.",
    noteLabel: "DONE MEANS",
    note: "A real result, then a new question.",
  },
};

export default function Home() {
  const [panel, setPanel] = useState<PanelId | null>(null);
  const [visited, setVisited] = useState<PanelId[]>([]);
  const [algorithmRunning, setAlgorithmRunning] = useState(false);
  const [hardwareOn, setHardwareOn] = useState(false);
  const [focus, setFocus] = useState<FocusId>("notice");
  const [shots, setShots] = useState<Shot[]>([]);
  const [targetTouched, setTargetTouched] = useState(false);
  const [activeObject, setActiveObject] = useState<PanelId | null>(null);
  const deskRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLButtonElement>(null);

  const openPanel = (next: PanelId) => {
    setPanel(next);
    setVisited((current) =>
      current.includes(next) ? current : [...current, next],
    );
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPanel(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const desk = deskRef.current;
    if (!desk) return;
    const rect = desk.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    desk.style.setProperty("--mx", `${x * 12}px`);
    desk.style.setProperty("--my", `${y * 12}px`);
    desk.style.setProperty("--nx", `${x * -12}px`);
    desk.style.setProperty("--ny", `${y * -12}px`);
  };

  const lockFocus = (next: FocusId, x: number, y: number) => {
    setFocus(next);
    setTargetTouched(true);
    setShots((current) => [
      ...current.slice(-5),
      { id: Date.now(), x, y, focus: next },
    ]);
  };

  const selectFocus = (next: FocusId) => {
    const marks: Record<FocusId, [number, number]> = {
      notice: [93, 50],
      research: [80, 50],
      decide: [67, 50],
      act: [50, 50],
    };
    lockFocus(next, ...marks[next]);
  };

  const handleTargetPointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const target = targetRef.current;
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    target.style.setProperty("--target-x", `${x}%`);
    target.style.setProperty("--target-y", `${y}%`);
  };

  const handleTargetClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (event.detail === 0) {
      lockFocus("act", 50, 50);
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.max(3, Math.min(97, ((event.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(3, Math.min(97, ((event.clientY - rect.top) / rect.height) * 100));
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    const distance = Math.sqrt(dx * dx + dy * dy) / (Math.min(rect.width, rect.height) / 2);
    const next: FocusId = distance <= 0.22 ? "act" : distance <= 0.46 ? "decide" : distance <= 0.74 ? "research" : "notice";
    lockFocus(next, x, y);
  };

  const discoveryMessage = [
    "Nothing opened yet. Start with the object that makes you curious.",
    "One trace found. Open another object to look for a connection.",
    "Two traces found. The workbench is beginning to explain itself.",
    "Three traces found. Technical work and human questions are crossing.",
    "Four traces found. One part of the working profile remains.",
    "Surface complete. You have seen the technical and human sides together.",
  ][visited.length];

  const traceInsight = visited.includes("web") && visited.includes("notes")
    ? "Connection found: interface decisions lead back to questions about people."
    : visited.includes("algorithm") && visited.includes("travel")
      ? "Connection found: both routes begin with research, a choice, and a backup plan."
      : visited.includes("hardware") && visited.includes("web")
        ? "Connection found: the medium changes, but the goal stays useful and tangible."
        : discoveryMessage;

  const activeFocus = focusProfiles[focus];
  const nextPanel = panel ? panelOrder[(panelOrder.indexOf(panel) + 1) % panelOrder.length] : "web";
  const benchGuidance = activeObject
    ? panelHints[activeObject]
    : discoveryMessage;

  const objectClass = (id: PanelId, base: string) => [
    "object",
    base,
    visited.includes(id) ? "is-visited" : "",
  ].filter(Boolean).join(" ");

  const objectPreviewProps = (id: PanelId) => ({
    onPointerEnter: () => setActiveObject(id),
    onPointerLeave: () => setActiveObject(null),
    onFocus: () => setActiveObject(id),
    onBlur: () => setActiveObject(null),
  });

  return (
    <main>
      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="Back to the top">
          ALINA.WU <span>/ FIELD NOTES</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#workbench">WORKBENCH</a>
          <a href="#about">ABOUT</a>
          <a href="#contact">CONTACT</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">COMPUTER SCIENCE × HUMAN CURIOSITY</p>
          <h1>
            I solve problems with code,
            <br />
            and stay curious about the
            <span className="circled">people</span>{" "}beyond it.
          </h1>
          <p className="intro">
            I build small sites, study algorithms, and connect ideas to physical
            hardware. This is not a résumé compressed into a few lines. It is a
            workbench that stays in motion.
          </p>
          <a className="primary-action" href="#workbench">
            COME IN <span aria-hidden="true">↓</span>
          </a>
        </div>

        <div className="focus-map-shell">
          <div className="target-label-row">
            <span>DECISION TARGET / FOUR ZONES</span>
            <span>OUTSIDE → CENTER</span>
          </div>

          <div className="target-explainer">
            <strong>This is how I move from uncertainty to action.</strong>
            <p>Begin at the edge: notice, research, decide, then act. Every zone is the full space between two boundary lines.</p>
          </div>

          <div className="target-stage">
            <button
              className={`focus-target ${targetTouched ? `focus-${focus}` : "focus-idle"}`}
              ref={targetRef}
              onPointerMove={handleTargetPointerMove}
              onPointerLeave={() => {
                targetRef.current?.style.setProperty("--target-x", "50%");
                targetRef.current?.style.setProperty("--target-y", "50%");
              }}
              onClick={handleTargetClick}
              aria-label="Decision target with four zones: notice at the edge, then research, decide, and act at the bullseye"
            >
              <span className="target-axis axis-horizontal" aria-hidden="true" />
              <span className="target-axis axis-vertical" aria-hidden="true" />
              <span className="target-zone-label zone-notice">NOTICE</span>
              <span className="target-zone-label zone-research">RESEARCH</span>
              <span className="target-zone-label zone-decide">DECIDE</span>
              <span className="target-core">
                <small>BULLSEYE</small>
                <strong>ACT</strong>
              </span>
              {shots.map((shot) => (
                <span
                  className={`target-shot shot-${shot.focus}`}
                  key={shot.id}
                  style={{ left: `${shot.x}%`, top: `${shot.y}%` }}
                  aria-hidden="true"
                />
              ))}
              <span className="target-crosshair" aria-hidden="true"><i /><i /></span>
              <span className="target-instruction">AIM / CLICK A ZONE</span>
            </button>

            <div className="focus-legend" aria-label="Choose what to learn about Alina">
              {(Object.keys(focusProfiles) as FocusId[]).map((id) => (
                <button
                  className={focus === id && targetTouched ? "active" : ""}
                  key={id}
                  onClick={() => selectFocus(id)}
                  aria-pressed={focus === id && targetTouched}
                >
                  <span><b>{ringPositions[id]}</b>{focusProfiles[id].label}</span>
                  <small>{focusProfiles[id].question}</small>
                </button>
              ))}
            </div>
          </div>

          <div className="focus-readout" aria-live="polite">
            <div className="focus-readout-heading">
              <span>{targetTouched ? "YOU HIT" : "START AT THE EDGE"}</span>
              <i>{targetTouched ? `${ringPositions[focus]} / ${activeFocus.index}` : "NOTICE → RESEARCH → DECIDE → ACT"}</i>
            </div>
            <strong className="focus-question">{activeFocus.label}</strong>
            <h2>{activeFocus.question}</h2>
            <p><b>{activeFocus.title}</b> {activeFocus.summary}</p>
            <div className="aim-note">
              <small>{activeFocus.noteLabel}</small>
              <span>{activeFocus.note}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bench-section" id="workbench">
        <div className="section-heading">
          <div>
            <p className="eyebrow">01 / THE WORKBENCH</p>
            <h2>Look around. No order required.</h2>
          </div>
          <div className="guest-note">
            <span>FOR THE GUEST</span>
            Everything here can be touched.
            <br />It probably will not break.
          </div>
        </div>

        <div
          className="workbench"
          ref={deskRef}
          onPointerMove={handlePointerMove}
        >
          <div className="bench-grid" aria-hidden="true" />
          <div className="bench-status">
            <span><i /> WORKSPACE ONLINE</span>
            <span className="bench-guidance" aria-live="polite">{benchGuidance}</span>
            <span>{visited.length}/5 DISCOVERED</span>
          </div>

          <button
            className={objectClass("web", "browser-object")}
            onClick={() => openPanel("web")}
            aria-label="Open the small website project"
            {...objectPreviewProps("web")}
          >
            <span className="object-tag">PROJECT 01</span>
            <span className="object-cue">OPEN CASE NOTE →</span>
            {visited.includes("web") && <span className="visited-stamp">VISITED</span>}
            <span className="browser-chrome"><i /><i /><i /></span>
            <span className="browser-screen">
              <strong>small web things</strong>
              <span className="mini-layout"><i /><i /><i /></span>
              <small>open preview ↗</small>
            </span>
          </button>

          <button
            className={objectClass("algorithm", "algorithm-object")}
            onClick={() => openPanel("algorithm")}
            aria-label="Open the algorithm project"
            {...objectPreviewProps("algorithm")}
          >
            <span className="object-tag light">PROJECT 02</span>
            <span className="object-cue light">OPEN CASE NOTE →</span>
            {visited.includes("algorithm") && <span className="visited-stamp light">VISITED</span>}
            <span className="route route-a" />
            <span className="route route-b" />
            <span className="node node-a">A</span>
            <span className="node node-b">?</span>
            <span className="node node-c">B</span>
            <strong>find a path</strong>
            <small>reason · test · recalculate</small>
          </button>

          <button
            className={`${objectClass("hardware", "hardware-object")} ${hardwareOn ? "is-on" : ""}`}
            onClick={() => openPanel("hardware")}
            aria-label="Open the hardware project"
            {...objectPreviewProps("hardware")}
          >
            <span className="object-tag">PROJECT 03</span>
            <span className="object-cue">OPEN CASE NOTE →</span>
            {visited.includes("hardware") && <span className="visited-stamp">VISITED</span>}
            <span className="board-chip">MCU</span>
            <span className="board-line line-one" />
            <span className="board-line line-two" />
            <span className="board-port port-one" />
            <span className="board-port port-two" />
            <span className="board-led" />
            <strong>physical computing</strong>
            <small>tap to inspect</small>
          </button>

          <button
            className={objectClass("notes", "notes-object")}
            onClick={() => openPanel("notes")}
            aria-label="Open recent thoughts and learning notes"
            {...objectPreviewProps("notes")}
          >
            <span className="paper-clip" />
            <span className="object-cue">OPEN NOTE →</span>
            {visited.includes("notes") && <span className="visited-stamp">VISITED</span>}
            <span className="hand-note">still learning</span>
            <strong>thinking lately</strong>
            <p>Does good interaction make people feel more human—or systems look more human?</p>
            <small>conclusion: not yet.</small>
          </button>

          <button
            className={objectClass("travel", "travel-object")}
            onClick={() => openPanel("travel")}
            aria-label="Open the travel route"
            {...objectPreviewProps("travel")}
          >
            <span className="ticket-edge">FIELD TRIP · 04</span>
            <span className="object-cue">OPEN ROUTE →</span>
            {visited.includes("travel") && <span className="visited-stamp">VISITED</span>}
            <strong>Next stop: someone else&apos;s everyday.</strong>
            <span className="travel-path"><i /><i /><i /></span>
            <small>A detailed plan, with room for the unexpected.</small>
          </button>

          <span className="loose-note note-one">TODO: overthink less</span>
          <span className="loose-note note-two">backup route B</span>
          <span className="loose-note note-three">research first, ask people next</span>
        </div>

        <div className={`discovery-ledger ${visited.length === 5 ? "complete" : ""}`}>
          <div className="ledger-heading">
            <span>VISITOR TRACE / {String(visited.length).padStart(2, "0")}</span>
            <strong>{visited.length === 5 ? "SURFACE COMPLETE" : visited.length >= 2 ? "CONNECTION FOUND" : "STILL EXPLORING"}</strong>
          </div>
          <div className="ledger-items">
            {panelOrder.map((id, index) => (
              <button
                className={visited.includes(id) ? "found" : ""}
                key={id}
                onClick={() => openPanel(id)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <b>{panelNames[id].split(" / ")[0]}</b>
                <i>{visited.includes(id) ? "FOUND" : "OPEN"}</i>
              </button>
            ))}
          </div>
          <p>{traceInsight}</p>
        </div>

        <p className="bench-caption">
          The workbench remembers what you opened. There is no required order, only a route you leave behind.
        </p>
      </section>

      <section className="about-section" id="about">
        <div className="about-index">02</div>
        <div className="about-copy">
          <p className="eyebrow">A WORKING PROFILE</p>
          <h2>I believe answers are worth looking for,<br />not pretending to have.</h2>
        </div>
        <div className="about-notes">
          <p>
            I gather information before choosing a route. Computer science
            teaches me how to break down problems; psychology reminds me that
            people are not systems waiting to be reduced.
          </p>
          <p className="margin-note">I may be less serious once you know me.</p>
        </div>
      </section>

      <footer id="contact">
        <div>
          <p className="eyebrow">END OF THIS PAGE / NOT THE NOTES</p>
          <h2>If an idea made you pause,<br />let&apos;s talk.</h2>
        </div>
        <div className="footer-links">
          <a href="mailto:hello@example.com">EMAIL ↗</a>
          <a href="#top">GITHUB ↗</a>
          <a href="#top">BACK TO TOP ↑</a>
        </div>
      </footer>

      {panel && (
        <div className="panel-backdrop" onMouseDown={() => setPanel(null)}>
          <aside
            className="detail-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="panel-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="panel-head">
              <span>{panelNames[panel]}</span>
              <button onClick={() => setPanel(null)} aria-label="Close details">×</button>
            </div>

            {panel === "web" && (
              <div className="panel-body">
                <p className="panel-kicker">SELECTED WEB EXPERIMENT</p>
                <h3 id="panel-title">Turn a real problem into something people can use.</h3>
                <div className="live-browser">
                  <div className="live-browser-bar">localhost / small-website</div>
                  <div className="live-site">
                    <span>A SMALL WEBSITE PROJECT</span>
                    <strong>Not just a screenshot.<br />Try it here.</strong>
                    <button>TRY THE DEMO →</button>
                  </div>
                </div>
                <div className="project-meta">
                  <span>ROLE<br /><b>Design & development</b></span>
                  <span>STATUS<br /><b>Still iterating</b></span>
                  <span>LESSON<br /><b>Make it useful first</b></span>
                </div>
              </div>
            )}

            {panel === "algorithm" && (
              <div className="panel-body">
                <p className="panel-kicker">INTERACTIVE ALGORITHM NOTE</p>
                <h3 id="panel-title">A route will not reveal itself. Try one.</h3>
                <div className={`algo-demo ${algorithmRunning ? "running" : ""}`}>
                  <div className="algo-grid">
                    {Array.from({ length: 24 }, (_, index) => (
                      <i key={index} className={[2, 8, 9, 15, 21].includes(index) ? "wall" : ""} />
                    ))}
                    <span className="algo-start">S</span>
                    <span className="algo-end">E</span>
                  </div>
                  <div className="algo-control">
                    <span>{algorithmRunning ? "PATH FOUND · 17 STEPS" : "READY TO SEARCH"}</span>
                    <button onClick={() => setAlgorithmRunning((value) => !value)}>
                      {algorithmRunning ? "RESET" : "RUN SEARCH"}
                    </button>
                  </div>
                </div>
                <p className="panel-copy">The finished project page can run the real algorithm here, letting visitors change the input, step through execution, and see how you approach the problem.</p>
              </div>
            )}

            {panel === "hardware" && (
              <div className="panel-body">
                <p className="panel-kicker">HARDWARE PROTOTYPE / BENCH TEST</p>
                <h3 id="panel-title">When code leaves the screen.</h3>
                <div className={`device-demo ${hardwareOn ? "powered" : ""}`}>
                  <div className="device-board">
                    <span className="device-core">CORE</span>
                    <span className="device-sensor">SENSOR</span>
                    <span className="device-output">OUT</span>
                    <i className="signal signal-one" />
                    <i className="signal signal-two" />
                  </div>
                  <div className="device-console">
                    <p>&gt; device.status</p>
                    <p>{hardwareOn ? "signal received" : "waiting for input..."}</p>
                    <button onClick={() => setHardwareOn((value) => !value)}>
                      {hardwareOn ? "POWER OFF" : "POWER ON"}
                    </button>
                  </div>
                </div>
                <p className="panel-copy">The final version can use real photographs, signal flow, debugging notes, and a live sample of device data.</p>
              </div>
            )}

            {panel === "notes" && (
              <div className="panel-body notes-panel">
                <p className="panel-kicker">THOUGHTS IN PROGRESS</p>
                <h3 id="panel-title">Not a wall of opinions. Traces of thinking.</h3>
                <blockquote>
                  “Sounding certain without understanding” may be the state I distrust most.
                  <span>NOTE: “I do not know yet” is allowed here.</span>
                </blockquote>
                <div className="learning-list">
                  <span>LEARNING NOW</span>
                  <p>How to make interaction interesting without letting it steal attention from the content.</p>
                  <span>RECENT QUESTION</span>
                  <p>Code can solve problems—but what counts as a human problem?</p>
                </div>
              </div>
            )}

            {panel === "travel" && (
              <div className="panel-body">
                <p className="panel-kicker">A WELL-PLANNED ESCAPE</p>
                <h3 id="panel-title">Enter an unfamiliar place. Try another everyday.</h3>
                <div className="itinerary">
                  <div><b>08:10</b><span>Departure</span><small>main route</small></div>
                  <div><b>11:40</b><span>Wander</span><small>deliberately left open</small></div>
                  <div><b>16:20</b><span>Plan B</span><small>in case it rains</small></div>
                  <div><b>?</b><span>Laughing in the street with friends</span><small>impossible to schedule, worth expecting</small></div>
                </div>
                <p className="panel-copy">Travel is more than an interest tag. It is another way of thinking: plan carefully, preserve some margin, then actually enter the unknown.</p>
              </div>
            )}

            <div className="panel-route">
              <div>
                <span>NEXT TRACE</span>
                <small>{visited.length}/5 AREAS DISCOVERED</small>
              </div>
              <button onClick={() => openPanel(nextPanel)}>
                {panelNames[nextPanel]} →
              </button>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}
