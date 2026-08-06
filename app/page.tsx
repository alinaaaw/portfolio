"use client";

import { useEffect, useRef, useState } from "react";

type PanelId = "web" | "algorithm" | "hardware" | "internship" | "research";
type FocusId = "notice" | "research" | "decide" | "act";
type Shot = { id: number; x: number; y: number; focus: FocusId };

const panelNames: Record<PanelId, string> = {
  web: "PROJECT / QUALITY OF LIFE IN SHANGHAI",
  algorithm: "PROJECT / COURSE ASSIGNMENT",
  hardware: "PROJECT / MUSCLE USAGE MONITOR",
  internship: "EXPERIENCE / SOFTWARE ENGINEERING",
  research: "RESEARCH / SOCIAL FUTURES LAB",
};

const panelShortNames: Record<PanelId, string> = {
  web: "WEB MAP",
  algorithm: "ALLOCATION",
  hardware: "EMG DEVICE",
  internship: "INTERNSHIP",
  research: "RESEARCH",
};

const panelOrder: PanelId[] = ["web", "algorithm", "hardware", "internship", "research"];

const ringPositions: Record<FocusId, string> = {
  notice: "OUTER ZONE",
  research: "MIDDLE ZONE",
  decide: "INNER ZONE",
  act: "BULLSEYE",
};

const panelHints: Record<PanelId, string> = {
  web: "WEB — an interactive Shanghai neighborhood map built from community research.",
  algorithm: "ALGORITHM — allocation methods optimized for satisfaction and efficiency.",
  hardware: "HARDWARE — EMG signals, ESP32 classification, and mobile visualization.",
  internship: "INTERNSHIP — machine vision, software testing, and workflow analysis.",
  research: "RESEARCH — how shared principles change perceived relevance between cases.",
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
  const [mapRadius, setMapRadius] = useState(10);
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

  const traceInsight = visited.includes("web") && visited.includes("research")
    ? "Connection found: community data becomes useful when analysis turns into an interface."
    : visited.includes("algorithm") && visited.includes("research")
      ? "Connection found: both projects ask how people judge a choice as fair or relevant."
      : visited.includes("hardware") && visited.includes("web")
        ? "Connection found: physical signals and neighborhood data both need a readable human output."
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
          WENRUI (ALINA) WU <span>/ FIELD NOTES</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#workbench">WORKBENCH</a>
          <a href="#about">ABOUT</a>
          <a href="#contact">CONTACT</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">UW COMPUTER SCIENCE × HUMAN CURIOSITY</p>
          <h1>
            I solve problems with code,
            <br />
            and stay curious about the
            <span className="circled">people</span>{" "}beyond it.
          </h1>
          <p className="intro">
            I am a computer science student at the University of Washington,
            a software engineering intern at Thermo Fisher Scientific, and an
            undergraduate researcher studying how people judge relevance and
            shared principles.
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
            aria-label="Open the Quality of Life in Shanghai web project"
            {...objectPreviewProps("web")}
          >
            <span className="object-tag">PROJECT 01</span>
            <span className="object-cue">OPEN CASE NOTE →</span>
            {visited.includes("web") && <span className="visited-stamp">VISITED</span>}
            <span className="browser-chrome"><i /><i /><i /></span>
            <span className="browser-screen">
              <strong>Quality of Life in Shanghai</strong>
              <span className="mini-layout"><i /><i /><i /></span>
              <small>HTML/CSS · JavaScript · community research</small>
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
            <strong>course assignment</strong>
            <small>Python · NumPy · satisfaction</small>
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
            <strong>muscle usage monitor</strong>
            <small>EMG · ESP32 · mobile visualization</small>
          </button>

          <button
            className={objectClass("internship", "notes-object experience-object")}
            onClick={() => openPanel("internship")}
            aria-label="Open the software engineering internship"
            {...objectPreviewProps("internship")}
          >
            <span className="paper-clip" />
            <span className="object-cue">OPEN FIELD LOG →</span>
            {visited.includes("internship") && <span className="visited-stamp">VISITED</span>}
            <span className="hand-note">JUN 2026 — PRESENT</span>
            <strong>software engineering</strong>
            <p>Machine vision, localization testing, and workflow analysis.</p>
            <small>Thermo Fisher Scientific / Shanghai</small>
          </button>

          <button
            className={objectClass("research", "travel-object research-object")}
            onClick={() => openPanel("research")}
            aria-label="Open the undergraduate research experience"
            {...objectPreviewProps("research")}
          >
            <span className="ticket-edge">RESEARCH FILE · 05</span>
            <span className="object-cue">OPEN STUDY →</span>
            {visited.includes("research") && <span className="visited-stamp">VISITED</span>}
            <strong>How do shared principles change perceived relevance?</strong>
            <span className="travel-path"><i /><i /><i /></span>
            <small>Social Futures Lab / University of Washington</small>
          </button>

          <span className="loose-note note-one">black-box test: observe before assuming</span>
          <span className="loose-note note-two">30+ rounds of feedback</span>
          <span className="loose-note note-three">principles → perceived relevance</span>
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
                <b>{panelShortNames[id]}</b>
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
          <p className="eyebrow">EDUCATION / A WORKING PROFILE</p>
          <h2>I study systems,<br />then ask what the system means for people.</h2>
        </div>
        <div className="about-notes">
          <div className="education-note">
            <span>UNIVERSITY OF WASHINGTON</span>
            <strong>B.S. in Computer Science</strong>
            <small>Paul G. Allen School · Expected June 2028 · GPA 4.0</small>
          </div>
          <div className="education-note">
            <span>HARVARD SUMMER SCHOOL / 2024</span>
            <strong>AI with Python & Multivariable Calculus</strong>
            <small>Boston, Massachusetts</small>
          </div>
          <p className="margin-note">Computer science gives me structure. Human behavior keeps the questions complicated.</p>
        </div>
      </section>

      <section className="skills-section" aria-labelledby="skills-title">
        <div className="skills-heading">
          <p className="eyebrow">03 / TECHNICAL TOOLKIT</p>
          <h2 id="skills-title">Tools I have actually used.</h2>
        </div>
        <div className="skills-grid">
          <div><span>LANGUAGES</span><p>Python, Java, JavaScript, HTML/CSS, SQLite, C/C++</p></div>
          <div><span>TOOLS</span><p>GitHub, VS Code, Fusion, AutoCAD, Arduino IDE, LaTeX, PyCharm, IntelliJ, Docker</p></div>
          <div><span>LIBRARIES</span><p>pandas, NumPy, Matplotlib, LangGraph, LangChain, Ultralytics YOLO</p></div>
        </div>
      </section>

      <footer id="contact">
        <div>
          <p className="eyebrow">END OF THIS PAGE / NOT THE NOTES</p>
          <h2>If an idea made you pause,<br />let&apos;s talk.</h2>
        </div>
        <div className="footer-links">
          <a href="mailto:awu78@uw.edu">AWU78@UW.EDU ↗</a>
          <a href="https://www.linkedin.com/in/wenrui-wu/" target="_blank" rel="noreferrer">LINKEDIN ↗</a>
          <a href="https://github.com/alina" target="_blank" rel="noreferrer">GITHUB ↗</a>
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
                <p className="panel-kicker">PROJECT / SEP 2023 — MAY 2024</p>
                <h3 id="panel-title">Quality of Life in Shanghai</h3>
                <div className="live-browser">
                  <div className="live-browser-bar">neighborhood-map / walking radius</div>
                  <div className="map-demo">
                    <span className="map-road road-one" /><span className="map-road road-two" />
                    <i className="map-home">YOU</i>
                    <i className="map-place place-one">FOOD</i>
                    <i className="map-place place-two">CARE</i>
                    <i className="map-place place-three">PARK</i>
                    <span className={`map-radius radius-${mapRadius}`} />
                    <button onClick={() => setMapRadius((value) => value === 30 ? 10 : value + 10)}>
                      RADIUS / {mapRadius} MIN →
                    </button>
                  </div>
                </div>
                <div className="project-meta">
                  <span>ROLE<br /><b>Team lead · 8 students</b></span>
                  <span>RESEARCH<br /><b>20+ questionnaires & interviews</b></span>
                  <span>STACK<br /><b>HTML/CSS · JavaScript</b></span>
                </div>
                <p className="panel-copy">I led a mixed-methods study, turned community findings into an interactive map for locating nearby facilities, and helped organize food-safety and anti-fraud campaigns.</p>
              </div>
            )}

            {panel === "algorithm" && (
              <div className="panel-body">
                <p className="panel-kicker">PROJECT / JAN 2024 — MAR 2025</p>
                <h3 id="panel-title">Automatic and Satisfactory Course Assignment</h3>
                <div className={`allocation-demo ${algorithmRunning ? "running" : ""}`}>
                  <div className="allocation-table">
                    <span>STUDENT A</span><b>{algorithmRunning ? "COURSE 2 / 1ST CHOICE" : "WAITING"}</b>
                    <span>STUDENT B</span><b>{algorithmRunning ? "COURSE 1 / 2ND CHOICE" : "WAITING"}</b>
                    <span>STUDENT C</span><b>{algorithmRunning ? "COURSE 3 / 1ST CHOICE" : "WAITING"}</b>
                  </div>
                  <div className="algo-control">
                    <span>{algorithmRunning ? "SATISFACTION / OPTIMIZED" : "ALLOCATION / READY"}</span>
                    <button onClick={() => setAlgorithmRunning((value) => !value)}>
                      {algorithmRunning ? "RESET" : "RUN ALLOCATION"}
                    </button>
                  </div>
                </div>
                <div className="project-meta">
                  <span>METHODS<br /><b>Simultaneous Eating</b></span>
                  <span>DECOMPOSITION<br /><b>Birkhoff</b></span>
                  <span>FEEDBACK<br /><b>30+ professors & peers</b></span>
                </div>
                <p className="panel-copy">I researched allocation efficiency, implemented the methods in Python and NumPy, improved runtime by 200+% through feedback, and extended the work into a parent-teacher meeting scheduler.</p>
              </div>
            )}

            {panel === "hardware" && (
              <div className="panel-body">
                <p className="panel-kicker">PROJECT / JUL 2025 — PRESENT</p>
                <h3 id="panel-title">Monitoring Device for Muscle Usage & Behavior</h3>
                <div className={`device-demo ${hardwareOn ? "powered" : ""}`}>
                  <div className="device-board">
                    <span className="device-core">ESP32</span>
                    <span className="device-sensor">EMG</span>
                    <span className="device-output">APP</span>
                    <i className="signal signal-one" />
                    <i className="signal signal-two" />
                  </div>
                  <div className="device-console">
                    <p>&gt; emg.stream</p>
                    <p>{hardwareOn ? "bluetooth signals classified" : "waiting for muscle input..."}</p>
                    <button onClick={() => setHardwareOn((value) => !value)}>
                      {hardwareOn ? "POWER OFF" : "POWER ON"}
                    </button>
                  </div>
                </div>
                <div className="project-meta">
                  <span>DESIGN<br /><b>Fusion · AutoCAD</b></span>
                  <span>FIRMWARE<br /><b>Arduino · C/C++</b></span>
                  <span>SIGNAL<br /><b>EMG · Bluetooth</b></span>
                </div>
                <p className="panel-copy">I designed and modeled the hardware, processed EMG signals from multiple Bluetooth devices, built ESP32 classification pipelines, and connected the results to a mobile visualization after exercise.</p>
              </div>
            )}

            {panel === "internship" && (
              <div className="panel-body experience-panel">
                <p className="panel-kicker">SOFTWARE ENGINEER INTERN / JUN 2026 — PRESENT</p>
                <h3 id="panel-title">Thermo Fisher Scientific, Shanghai</h3>
                <div className="experience-log">
                  <div><b>01 / MACHINE VISION</b><p>Integrated YOLO26 object detection with ROS2 robot-arm motion control for repetitive laboratory sample handling.</p></div>
                  <div><b>02 / SOFTWARE TESTING</b><p>Performed black-box workflow testing for Chinese localization of 3500Dx DNA-sequencing software.</p></div>
                  <div><b>03 / WORKFLOW ANALYSIS</b><p>Reverse-engineered Qantis EDXRF workflows to clarify page transitions and structures for UI designers.</p></div>
                  <div><b>04 / ONBOARDING</b><p>Trained a new intern, configured a virtual machine, and troubleshot the path toward independent testing.</p></div>
                </div>
              </div>
            )}

            {panel === "research" && (
              <div className="panel-body research-panel">
                <p className="panel-kicker">UNDERGRADUATE RESEARCH ASSISTANT / APR 2026 — PRESENT</p>
                <h3 id="panel-title">Social Futures Lab, University of Washington</h3>
                <div className="research-flow">
                  <div><b>01</b><span>PARTICIPANT SURVEYS</span><small>case similarity · relevance · principle agreement</small></div>
                  <i>→</i>
                  <div><b>02</b><span>NORMALIZED VECTORS</span><small>CSV processing · pandas · case analysis</small></div>
                  <i>→</i>
                  <div><b>03</b><span>RESEARCH QUESTION</span><small>how shared principles affect perceived relevance</small></div>
                </div>
                <p className="panel-copy">I analyze survey data and construct normalized principle vectors while investigating how agreement on principles changes the way people perceive relevance between cases.</p>
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
