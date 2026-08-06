"use client";

import { useEffect, useRef, useState } from "react";

type PanelId = "web" | "algorithm" | "hardware" | "notes" | "travel";
type FocusId = "now" | "build" | "learn" | "explore";
type Shot = { id: number; x: number; y: number; focus: FocusId };

const panelNames: Record<PanelId, string> = {
  web: "WEB / SMALL SITES",
  algorithm: "ALGORITHM / SEARCH & REASON",
  hardware: "HARDWARE / PHYSICAL SYSTEMS",
  notes: "NOTES / THOUGHT FRAGMENTS",
  travel: "TRAVEL / OFF THE ROUTE",
};

const panelOrder: PanelId[] = ["web", "algorithm", "hardware", "notes", "travel"];

const focusProfiles: Record<FocusId, {
  index: string;
  label: string;
  title: string;
  summary: string;
  center: string;
  detail: [string, string][];
  panel: PanelId;
}> = {
  now: {
    index: "00",
    label: "CURRENT FOCUS",
    title: "Ship the next useful thing.",
    summary: "A stage becomes real when I can experience it, share it, and turn it into the next plan.",
    center: "NOW",
    detail: [["STAGE", "IN PROGRESS"], ["MODE", "BUILD / TEST"], ["BIAS", "KEEP MOVING"]],
    panel: "algorithm",
  },
  build: {
    index: "01",
    label: "THINGS I BUILD",
    title: "Code, then a real result.",
    summary: "Small websites, algorithms, and hardware are different ways to move a problem from idea to use.",
    center: "MAKE",
    detail: [["FIELD", "WEB"], ["LOGIC", "ALGORITHM"], ["OUTPUT", "HARDWARE"]],
    panel: "web",
  },
  learn: {
    index: "02",
    label: "THINGS I LEARN",
    title: "Questions before conclusions.",
    summary: "Computer science gives me structure. Psychology keeps the human parts complex, uncertain, and worth studying.",
    center: "LEARN",
    detail: [["METHOD", "RESEARCH"], ["STATE", "UNFINISHED"], ["RULE", "ASK NEXT"]],
    panel: "notes",
  },
  explore: {
    index: "03",
    label: "THINGS I EXPLORE",
    title: "A planned route into the unknown.",
    summary: "I plan carefully, keep a backup, and still leave enough room to enter a life I have not experienced before.",
    center: "GO",
    detail: [["ROUTE", "PLANNED"], ["MARGIN", "PRESERVED"], ["NEXT", "UNKNOWN"]],
    panel: "travel",
  },
};

export default function Home() {
  const [panel, setPanel] = useState<PanelId | null>(null);
  const [visited, setVisited] = useState<PanelId[]>([]);
  const [algorithmRunning, setAlgorithmRunning] = useState(false);
  const [hardwareOn, setHardwareOn] = useState(false);
  const [focus, setFocus] = useState<FocusId>("now");
  const [shots, setShots] = useState<Shot[]>([]);
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
    setShots((current) => [
      ...current.slice(-5),
      { id: Date.now(), x, y, focus: next },
    ]);
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
      lockFocus("now", 50, 50);
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.max(3, Math.min(97, ((event.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(3, Math.min(97, ((event.clientY - rect.top) / rect.height) * 100));
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    const distance = Math.sqrt(dx * dx + dy * dy) / (Math.min(rect.width, rect.height) / 2);
    const next: FocusId = distance <= 0.24 ? "now" : distance <= 0.48 ? "build" : distance <= 0.72 ? "learn" : "explore";
    lockFocus(next, x, y);
  };

  const discoveryMessage = [
    "Nothing opened yet. Start anywhere.",
    "One trace found. The workbench is listening.",
    "Two traces found. A pattern is beginning.",
    "Three traces found. Projects and questions are connecting.",
    "Four traces found. One part of the picture remains.",
    "Surface complete. You have seen how the pieces connect.",
  ][visited.length];

  const activeFocus = focusProfiles[focus];
  const nextPanel = panel ? panelOrder[(panelOrder.indexOf(panel) + 1) % panelOrder.length] : "web";

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
            <span>FOCUS MAP / LIVE</span>
            <span>{shots.length === 0 ? "NO MARKS YET" : `${shots.length} MARK${shots.length === 1 ? "" : "S"}`}</span>
          </div>

          <button
            className={`focus-target focus-${focus}`}
            ref={targetRef}
            onPointerMove={handleTargetPointerMove}
            onPointerLeave={() => {
              targetRef.current?.style.setProperty("--target-x", "50%");
              targetRef.current?.style.setProperty("--target-y", "50%");
            }}
            onClick={handleTargetClick}
            aria-label="Aim at a ring and click to select a focus area"
          >
            <span className="target-axis axis-horizontal" aria-hidden="true" />
            <span className="target-axis axis-vertical" aria-hidden="true" />
            <span className="target-ring ring-explore"><i>EXPLORE</i></span>
            <span className="target-ring ring-learn"><i>LEARN</i></span>
            <span className="target-ring ring-build"><i>BUILD</i></span>
            <span className="target-core">
              <small>{activeFocus.index}</small>
              <strong>{activeFocus.center}</strong>
              <i>LOCKED</i>
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
            <span className="target-instruction">MOVE / AIM / CLICK</span>
          </button>

          <span className="thought thought-a">travel route</span>
          <span className="thought thought-b">why would someone choose that?</span>
          <span className="thought thought-c">unverified</span>
          <span className="thought thought-d">next step →</span>

          <div className="focus-readout" aria-live="polite">
            <div className="focus-readout-heading">
              <span>{activeFocus.index} / {activeFocus.label}</span>
              <i>FOCUS LOCKED</i>
            </div>
            <h2>{activeFocus.title}</h2>
            <p>{activeFocus.summary}</p>
            <div className="focus-data">
              {activeFocus.detail.map(([label, value]) => (
                <span key={label}><small>{label}</small><b>{value}</b></span>
              ))}
            </div>
            <button className="focus-follow" onClick={() => openPanel(activeFocus.panel)}>
              FOLLOW THIS TRACE →
            </button>
          </div>

          <div className="focus-legend" aria-label="Focus map controls">
            {(Object.keys(focusProfiles) as FocusId[]).map((id) => (
              <button
                className={focus === id ? "active" : ""}
                key={id}
                onClick={() => setFocus(id)}
              >
                <span>{focusProfiles[id].index}</span>
                {focusProfiles[id].label}
              </button>
            ))}
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
            <span className="bench-guidance">{discoveryMessage}</span>
            <span>{visited.length}/5 DISCOVERED</span>
          </div>

          <button
            className="object browser-object"
            onClick={() => openPanel("web")}
            aria-label="Open the small website project"
          >
            <span className="object-tag">PROJECT 01</span>
            <span className="browser-chrome"><i /><i /><i /></span>
            <span className="browser-screen">
              <strong>small web things</strong>
              <span className="mini-layout"><i /><i /><i /></span>
              <small>open preview ↗</small>
            </span>
          </button>

          <button
            className="object algorithm-object"
            onClick={() => openPanel("algorithm")}
            aria-label="Open the algorithm project"
          >
            <span className="object-tag light">PROJECT 02</span>
            <span className="route route-a" />
            <span className="route route-b" />
            <span className="node node-a">A</span>
            <span className="node node-b">?</span>
            <span className="node node-c">B</span>
            <strong>find a path</strong>
            <small>reason · test · recalculate</small>
          </button>

          <button
            className={`object hardware-object ${hardwareOn ? "is-on" : ""}`}
            onClick={() => openPanel("hardware")}
            aria-label="Open the hardware project"
          >
            <span className="object-tag">PROJECT 03</span>
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
            className="object notes-object"
            onClick={() => openPanel("notes")}
            aria-label="Open recent thoughts and learning notes"
          >
            <span className="paper-clip" />
            <span className="hand-note">still learning</span>
            <strong>thinking lately</strong>
            <p>Does good interaction make people feel more human—or systems look more human?</p>
            <small>conclusion: not yet.</small>
          </button>

          <button
            className="object travel-object"
            onClick={() => openPanel("travel")}
            aria-label="Open the travel route"
          >
            <span className="ticket-edge">FIELD TRIP · 04</span>
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
            <strong>{visited.length === 5 ? "SURFACE COMPLETE" : "STILL EXPLORING"}</strong>
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
          <p>{discoveryMessage}</p>
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
