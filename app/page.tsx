"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { StationId } from "./_components/LabGame";

const LabGame = dynamic(() => import("./_components/LabGame"), {
  ssr: false,
  loading: () => <div className="lab-loading"><i /><span>INITIALIZING LAB 17</span></div>,
});

type Station = {
  index: string;
  short: string;
  type: string;
  title: string;
  summary: string;
  meta: [string, string][];
  log: string;
};

const stationOrder: StationId[] = ["terminal", "route", "hardware", "notebook", "fieldcase"];

const stations: Record<StationId, Station> = {
  terminal: {
    index: "01",
    short: "TERMINAL",
    type: "PROJECT / WEB + URBAN RESEARCH",
    title: "Quality of Life in Shanghai",
    summary: "An interactive neighborhood map shaped by questionnaires and interviews, built to help residents find useful facilities within walking distance.",
    meta: [["ROLE", "Team lead + developer"], ["TEAM", "8 people"], ["PERIOD", "Sep 2023 — May 2024"]],
    log: "The terminal contains a usable map—and a bulletin that was not part of the portfolio.",
  },
  route: {
    index: "02",
    short: "ROUTE TABLE",
    type: "PROJECT / PYTHON + NUMPY",
    title: "Automatic and Satisfactory Course Assignment",
    summary: "An allocation system designed around satisfaction and efficiency using Simultaneous Eating and Birkhoff Decomposition.",
    meta: [["LANGUAGE", "Python"], ["METHOD", "Allocation algorithms"], ["STATE", "Tested + documented"]],
    log: "Repeated route corrections suggest she treats uncertainty as information, not failure.",
  },
  hardware: {
    index: "03",
    short: "DEVICE BENCH",
    type: "PROJECT / ARDUINO + C/C++ + FUSION",
    title: "Muscle Usage & Behavior Monitor",
    summary: "A multi-device system that collects EMG signals over Bluetooth, classifies them on ESP32 microcontrollers, and sends exercise data to a mobile interface.",
    meta: [["CORE", "ESP32"], ["SIGNAL", "EMG + Bluetooth"], ["OUTPUT", "Mobile interface"]],
    log: "The hardware is unfinished but alive. She appears to understand ideas by making them respond.",
  },
  notebook: {
    index: "04",
    short: "RESEARCH NOTES",
    type: "EXPERIENCE / UW SOCIAL FUTURES LAB",
    title: "How do principles shape perceived relevance?",
    summary: "Undergraduate research analyzing how agreement on principles affects perceived relevance between cases, using surveys and structured data analysis.",
    meta: [["ROLE", "Research assistant"], ["TOOLS", "Pandas + CSV pipelines"], ["PERIOD", "Apr 2026 — present"]],
    log: "The notebook never pretends the answer is finished. 'I do not know yet' is underlined twice.",
  },
  fieldcase: {
    index: "05",
    short: "FIELD CASE",
    type: "EXPERIENCE / THERMO FISHER SCIENTIFIC",
    title: "Vision, motion, and laboratory workflows",
    summary: "Software engineering work across robot-arm automation, scientific-software testing, workflow analysis, and technical onboarding in Shanghai.",
    meta: [["FOCUS", "YOLO26 + ROS2"], ["SYSTEM", "3500Dx + QANTIS"], ["PERIOD", "Jun 2026 — present"]],
    log: "A field case is missing from its shelf. The remaining ticket has a Plan B written on the reverse.",
  },
};

export default function VersionThree() {
  const [started, setStarted] = useState(false);
  const [near, setNear] = useState<StationId | null>(null);
  const [active, setActive] = useState<StationId | null>(null);
  const [discovered, setDiscovered] = useState<StationId[]>([]);
  const [indexOpen, setIndexOpen] = useState(false);
  const [bulletinVisible, setBulletinVisible] = useState(false);
  const [allocationRun, setAllocationRun] = useState(false);
  const [deviceOn, setDeviceOn] = useState(false);
  const [noteTurned, setNoteTurned] = useState(false);
  const [workflowTraced, setWorkflowTraced] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);

  const inspect = useCallback((station: StationId) => {
    setActive(station);
    setDiscovered((current) => current.includes(station) ? current : [...current, station]);
  }, []);

  useEffect(() => {
    if (active !== "terminal") return;
    const timer = window.setTimeout(() => setBulletinVisible(true), 950);
    return () => window.clearTimeout(timer);
  }, [active]);

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActive(null);
        setIndexOpen(false);
        setMessageOpen(false);
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  const solved = discovered.length === stationOrder.length;
  const clueStatus = [
    "WORKSPACE QUIET / SYSTEMS NORMAL",
    "UNEXPECTED BULLETIN RECOVERED",
    "TWO TRACES POINT OFF-SITE",
    "PATTERN FORMING / KEEP MOVING",
    "FIELD CASE ABSENT / SIGNAL DETECTED",
    "INCOMING MESSAGE / SOURCE: AW",
  ][discovered.length];
  const nextStation = active ? stationOrder[(stationOrder.indexOf(active) + 1) % stationOrder.length] : "terminal";

  return (
    <main className={`world-shell ${started ? "is-entered" : ""}`}>
      <header className="world-nav">
        <button className="world-brand" onClick={() => setIndexOpen(true)}>ALINA.WU <span>/ LAB 17</span></button>
        <nav aria-label="Portfolio controls">
          <button onClick={() => setIndexOpen(true)}>PROJECT INDEX</button>
          <a href="mailto:hello@example.com">CONTACT</a>
        </nav>
        <div className="world-progress"><i /> {String(discovered.length).padStart(2, "0")}/05 TRACES</div>
      </header>

      <section className="game-viewport" aria-label="Alina's interactive portfolio laboratory">
        <LabGame active={started && !active && !indexOpen && !messageOpen} discovered={discovered} onNearChange={setNear} onInspect={inspect} />
        <div className="cinematic-grain" aria-hidden="true" />
        <div className="cinematic-vignette" aria-hidden="true" />

        {!started && (
          <div className="arrival">
            <div className="arrival-shade" />
            <div className="arrival-copy">
              <p>ALINA.WU / PERSONAL LABORATORY</p>
              <h1>A workspace<br />still <em>thinking.</em></h1>
              <p className="arrival-intro">
                Computer science, human curiosity, and several unfinished experiments.
                Drive the inspection unit through the room to explore Alina&apos;s projects,
                research, and the details she forgot to file.
              </p>
              <button onClick={() => setStarted(true)}>LAUNCH INSPECTION UNIT <span>→</span></button>
              <div className="arrival-profile">
                <span>WENRUI (ALINA) WU</span>
                <strong>Computer Science / University of Washington</strong>
              </div>
            </div>
            <div className="arrival-case">
              <span>LAB ACCESS / GUEST</span>
              <div><b>01</b><p>DRIVE<br /><small>WASD / ARROWS</small></p></div>
              <div><b>02</b><p>APPROACH<br /><small>FOLLOW SIGNALS</small></p></div>
              <div><b>03</b><p>INSPECT<br /><small>PRESS E / CLICK</small></p></div>
              <em>No biography required. The room has evidence.</em>
            </div>
          </div>
        )}

        {started && (
          <>
            <div className="world-hud hud-left">
              <span>LAB TELEMETRY</span>
              <strong>{clueStatus}</strong>
              <p>CLICK FLOOR TO DRIVE<br />CLICK A SIGNAL TO AUTO-NAVIGATE</p>
            </div>
            <div className="world-hud hud-right">
              <span>INSPECTION UNIT / ONLINE</span>
              <strong>{near ? `NEAR ${stations[near].short}` : "ROAMING LAB 17"}</strong>
              <p>W / S DRIVE · A / D STEER · E INSPECT</p>
            </div>

            <div className="trace-feed" aria-live="polite">
              {discovered.slice(-3).map((id) => (
                <button key={id} onClick={() => inspect(id)}><b>{stations[id].index}</b><span>{stations[id].short}</span><i>LOGGED</i></button>
              ))}
            </div>

            {near && !active && (
              <button className="proximity-prompt" onClick={() => inspect(near)}>
                <span>E</span><div><small>SIGNAL WITHIN RANGE</small><strong>INSPECT {stations[near].short}</strong></div>
              </button>
            )}

            {solved && !messageOpen && (
              <button className="incoming-message" onClick={() => setMessageOpen(true)}>
                <i /> INCOMING MESSAGE <strong>AW / OPEN →</strong>
              </button>
            )}
          </>
        )}
      </section>

      {indexOpen && (
        <div className="overlay" onMouseDown={() => setIndexOpen(false)}>
          <aside className="portfolio-index" role="dialog" aria-modal="true" aria-labelledby="index-title" onMouseDown={(event) => event.stopPropagation()}>
            <header><div><span>ALINA.WU</span><strong id="index-title">PORTFOLIO INDEX</strong></div><button onClick={() => setIndexOpen(false)} aria-label="Close portfolio index">×</button></header>
            <div className="profile-summary">
              <small>SUBJECT / PRESENT</small>
              <h2>Wenrui (Alina) Wu</h2>
              <p>Computer Science at the University of Washington. I build with code, investigate how systems meet people, and prefer evidence to confident-sounding guesses.</p>
            </div>
            <div className="index-list">
              {stationOrder.map((id) => (
                <button key={id} onClick={() => { setIndexOpen(false); inspect(id); }}>
                  <span>{stations[id].index}</span><div><small>{stations[id].type}</small><strong>{stations[id].title}</strong></div><i>{discovered.includes(id) ? "LOGGED" : "OPEN"} →</i>
                </button>
              ))}
            </div>
            <footer><span>DIRECT ACCESS / FOR VISITORS WHO DO NOT DRIVE</span><a href="mailto:hello@example.com">EMAIL ALINA ↗</a></footer>
          </aside>
        </div>
      )}

      {active && (
        <div className="overlay" onMouseDown={() => setActive(null)}>
          <aside className={`station-file file-${active}`} role="dialog" aria-modal="true" aria-labelledby="station-title" onMouseDown={(event) => event.stopPropagation()}>
            <header className="file-head">
              <div><span>{stations[active].index}</span><small>{stations[active].type}</small></div>
              <button onClick={() => setActive(null)} aria-label="Return to the laboratory">RETURN TO LAB ×</button>
            </header>
            <div className="file-body">
              <p className="file-kicker">RECOVERED PORTFOLIO TRACE / {stations[active].short}</p>
              <h2 id="station-title">{stations[active].title}</h2>
              <p className="file-lede">{stations[active].summary}</p>

              {active === "terminal" && (
                <div className="terminal-evidence">
                  <div className="browser-top"><i /><i /><i /><span>alina.local / shanghai-quality-of-life</span></div>
                  <div className="map-interface">
                    <div className="map-copy"><small>WALKING-RADIUS SEARCH</small><strong>Find useful places<br />within reach.</strong><button>MAP PROTOTYPE / ONLINE</button></div>
                    <div className="map-grid"><i /><i /><i /><i /><i /><i /><b className="radius" /></div>
                    <div className={`lab-bulletin ${bulletinVisible ? "visible" : ""}`}>
                      <header><span>LAB BULLETIN</span><b>UNREAD / 4 DAYS</b></header>
                      <strong>Researcher has not checked in.</strong>
                      <p>Wenrui “Alina” Wu has not responded for four days. Her Lab 17 terminal continues to sync. No departure note was filed.</p>
                      <small>This alert was not part of the portfolio.</small>
                    </div>
                  </div>
                </div>
              )}

              {active === "route" && (
                <div className={`allocation-demo ${allocationRun ? "running" : ""}`}>
                  <div className="allocation-board"><span>INPUT</span><i /><span>EAT</span><i /><span>DECOMP</span><i /><span>ASSIGN</span><b /></div>
                  <div><p>{allocationRun ? "ALLOCATION COMPLETE / PREFERENCE LOSS MINIMIZED" : "STUDENT PREFERENCES LOADED / ROUTE UNRESOLVED"}</p><button onClick={() => setAllocationRun((value) => !value)}>{allocationRun ? "RESET STUDY" : "RUN ALLOCATION"}</button></div>
                </div>
              )}

              {active === "hardware" && (
                <div className={`emg-demo ${deviceOn ? "powered" : ""}`}>
                  <div className="emg-device"><span>EMG</span><i /><strong>ESP32</strong><i /><span>APP</span></div>
                  <div className="emg-wave">{Array.from({ length: 28 },(_,index) => <i key={index} style={{ height: `${deviceOn ? 12 + ((index * 17) % 48) : 4}px` }} />)}</div>
                  <footer><p>&gt; {deviceOn ? "signal classified / repetition detected" : "sensor ready / no stream"}</p><button onClick={() => setDeviceOn((value) => !value)}>{deviceOn ? "STOP STREAM" : "START EMG STREAM"}</button></footer>
                </div>
              )}

              {active === "notebook" && (
                <button className={`research-note ${noteTurned ? "turned" : ""}`} onClick={() => setNoteTurned((value) => !value)}>
                  <small>{noteTurned ? "BACK OF PAGE / PERSONAL MARGIN" : "SOCIAL FUTURES LAB / PAGE 17"}</small>
                  <strong>{noteTurned ? "Sounding certain is not the same as understanding." : "Does agreement on principles change which cases feel relevant?"}</strong>
                  <p>{noteTurned ? "Underlined twice. A second note adds: research first, ask people next." : "Survey responses → normalized data → principle vectors → case relevance."}</p>
                  <span>{noteTurned ? "TURN TO RESEARCH ↺" : "TURN PAGE / READ MARGIN ↻"}</span>
                </button>
              )}

              {active === "fieldcase" && (
                <div className={`workflow-demo ${workflowTraced ? "traced" : ""}`}>
                  <div className="workflow-line"><span><b>01</b>YOLO26 VISION</span><i /><span><b>02</b>ROS2 MOTION</span><i /><span><b>03</b>3500Dx TEST</span><i /><span><b>04</b>QANTIS UI</span><em /></div>
                  <div className="field-note"><small>FOUND UNDER TICKET / HANDWRITTEN</small><strong>“Plan B is not pessimism. It is permission to keep moving.”</strong></div>
                  <button onClick={() => setWorkflowTraced((value) => !value)}>{workflowTraced ? "CLEAR WORKFLOW" : "TRACE THE WORKFLOW"}</button>
                </div>
              )}

              <div className="file-meta">{stations[active].meta.map(([label,value]) => <div key={label}><small>{label}</small><strong>{value}</strong></div>)}</div>
              <div className="investigation-log"><span>ROVER OBSERVATION / AUTO-LOGGED</span><p>{stations[active].log}</p></div>
            </div>
            <div className="file-next"><span>{discovered.length}/5 TRACES RECOVERED</span><button onClick={() => inspect(nextStation)}>NEXT SIGNAL / {stations[nextStation].short} →</button></div>
          </aside>
        </div>
      )}

      {messageOpen && (
        <div className="overlay message-overlay" onMouseDown={() => setMessageOpen(false)}>
          <section className="final-message" role="dialog" aria-modal="true" aria-labelledby="message-title" onMouseDown={(event) => event.stopPropagation()}>
            <header><span>INCOMING / AW</span><button onClick={() => setMessageOpen(false)} aria-label="Close message">×</button></header>
            <div className="message-screen">
              <small>RECEIVED AFTER 05 CONNECTED TRACES</small>
              <h2 id="message-title">If this reached the lab,<br />the rover works.</h2>
              <p>I&apos;m not missing. I followed a question farther than expected, took the field case, and forgot that “back soon” is not a useful status update.</p>
              <p>The projects are real. The dramatic bulletin is technically accurate. The detailed Plan B is in the side pocket.</p>
              <strong>— Alina</strong>
            </div>
            <footer><span>STATUS / SUBJECT LOCATED SOMEWHERE INTERESTING</span><a href="mailto:hello@example.com">REPLY TO ALINA →</a></footer>
          </section>
        </div>
      )}
    </main>
  );
}
