"use client";

import { useEffect, useRef, useState } from "react";

type PanelId = "web" | "algorithm" | "hardware" | "notes" | "travel";

const panelNames: Record<PanelId, string> = {
  web: "WEB / SMALL SITES",
  algorithm: "ALGORITHM / SEARCH & REASON",
  hardware: "HARDWARE / PHYSICAL SYSTEMS",
  notes: "NOTES / THOUGHT FRAGMENTS",
  travel: "TRAVEL / OFF THE ROUTE",
};

export default function Home() {
  const [panel, setPanel] = useState<PanelId | null>(null);
  const [visited, setVisited] = useState<PanelId[]>([]);
  const [algorithmRunning, setAlgorithmRunning] = useState(false);
  const [hardwareOn, setHardwareOn] = useState(false);
  const deskRef = useRef<HTMLDivElement>(null);

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

        <div className="thought-map" aria-label="An animated map of plans and floating thoughts">
          <div className="map-orbit orbit-one" />
          <div className="map-orbit orbit-two" />
          <div className="map-center">
            <span>NOW</span>
            <strong>building</strong>
            <small>one step at a time</small>
          </div>
          <span className="thought thought-a">travel route</span>
          <span className="thought thought-b">why would someone choose that?</span>
          <span className="thought thought-c">unverified</span>
          <span className="thought thought-d">next step →</span>
          <span className="thought-dot dot-one" />
          <span className="thought-dot dot-two" />
          <p className="map-note">Some thoughts form a plan. Others are still floating.</p>
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

        <p className="bench-caption">
          An interaction study: the content is provisional, but the space already has a point of view.
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
          </aside>
        </div>
      )}
    </main>
  );
}
