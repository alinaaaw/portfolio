"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useArcheryEngine } from "./_components/focus-field/useArcheryEngine";
import type { LaunchSpec, ZoneId } from "./_components/focus-field/archery-physics";
import InteractiveModel from "./_components/three/InteractiveModel";

type AimState = { x: number; y: number; clientX: number; clientY: number; zone: ZoneId | null };

const zoneLabels: Record<ZoneId, string> = {
  web: "PROJECT / QUALITY OF LIFE IN SHANGHAI",
  algorithm: "PROJECT / COURSE ASSIGNMENT",
  hardware: "PROJECT / MUSCLE MONITOR",
  notes: "EXPERIENCE / SOCIAL FUTURES LAB",
  travel: "EXPERIENCE / THERMO FISHER SCIENTIFIC",
};

export default function VersionTwo() {
  const [entered, setEntered] = useState(false);
  const [activeZone, setActiveZone] = useState<ZoneId | null>(null);
  const [discovered, setDiscovered] = useState<ZoneId[]>([]);
  const [hovered, setHovered] = useState<ZoneId | null>(null);
  const [algorithmRun, setAlgorithmRun] = useState(false);
  const [deviceOn, setDeviceOn] = useState(false);
  const [routeChanged, setRouteChanged] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [tension, setTension] = useState(0);
  const [unlocked, setUnlocked] = useState<ZoneId[]>([]);
  const [impactZone, setImpactZone] = useState<ZoneId | null>(null);
  const [approachedZone, setApproachedZone] = useState<ZoneId | null>(null);
  const [shotCount, setShotCount] = useState(0);
  const [feedback, setFeedback] = useState("MOVE TO AIM · HOLD TO DRAW · RELEASE");
  const fieldRef = useRef<HTMLElement>(null);
  const aimRef = useRef<AimState>({ x: 0.5, y: 0.35, clientX: 0, clientY: 0, zone: null });
  const drawStartedRef = useRef<number | null>(null);
  const drawFrameRef = useRef<number | null>(null);
  const tensionRef = useRef(0);
  const impactTimerRef = useRef<number | null>(null);
  const focusTimerRef = useRef<number | null>(null);

  const handleImpact = useCallback((shot: LaunchSpec) => {
    setShotCount((count) => count + 1);
    if (!shot.zone) {
      setFeedback("MISS · OBSERVE · RECALCULATE");
      return;
    }

    setUnlocked((current) => current.includes(shot.zone!) ? current : [...current, shot.zone!]);
    setImpactZone(shot.zone);
    setApproachedZone(shot.zone);
    setFeedback(`IMPACT · CLOSING IN ON ${zoneLabels[shot.zone]}`);
    if (impactTimerRef.current) window.clearTimeout(impactTimerRef.current);
    impactTimerRef.current = window.setTimeout(() => setImpactZone(null), 900);
    if (focusTimerRef.current) window.clearTimeout(focusTimerRef.current);
    focusTimerRef.current = window.setTimeout(() => {
      setActiveZone(shot.zone);
      setDiscovered((current) => current.includes(shot.zone!) ? current : [...current, shot.zone!]);
    }, 520);
  }, []);

  const { canvasRef, launch, setActive, setAim, setDraw } = useArcheryEngine(handleImpact);

  const openZone = (zone: ZoneId) => {
    setEntered(true);
    setApproachedZone(zone);
    setActiveZone(zone);
    setDiscovered((current) => current.includes(zone) ? current : [...current, zone]);
  };

  const closeZone = () => {
    setActiveZone(null);
    setApproachedZone(null);
    setFeedback("MOVE TO AIM · HOLD TO DRAW · RELEASE");
  };

  useEffect(() => {
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveZone(null);
        setApproachedZone(null);
      }
    };
    window.addEventListener("keydown", closeWithEscape);
    return () => {
      window.removeEventListener("keydown", closeWithEscape);
      if (impactTimerRef.current) window.clearTimeout(impactTimerRef.current);
      if (focusTimerRef.current) window.clearTimeout(focusTimerRef.current);
      if (drawFrameRef.current) window.cancelAnimationFrame(drawFrameRef.current);
    };
  }, []);

  useEffect(() => {
    setActive(entered);
  }, [entered, setActive]);

  const lookAround = (event: React.PointerEvent<HTMLElement>) => {
    const field = fieldRef.current;
    if (!field) return;
    const rect = field.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
    const zoneElement = document.elementsFromPoint(event.clientX, event.clientY)
      .find((element) => element instanceof HTMLElement && element.dataset.zone) as HTMLElement | undefined;
    const zone = (zoneElement?.dataset.zone as ZoneId | undefined) ?? null;
    aimRef.current = { x, y, clientX: event.clientX, clientY: event.clientY, zone };
    field.style.setProperty("--pointer-x", `${x * 100}%`);
    field.style.setProperty("--pointer-y", `${y * 100}%`);
    field.style.setProperty("--look-x", `${(x - 0.5) * -24}px`);
    field.style.setProperty("--look-y", `${(y - 0.5) * -16}px`);
    field.style.setProperty("--look-x-near", `${(x - 0.5) * -42}px`);
    field.style.setProperty("--look-y-near", `${(y - 0.5) * -24}px`);
    setAim(x, y);
  };

  const beginShot = (event: React.PointerEvent<HTMLElement>) => {
    const source = event.target as HTMLElement;
    if (!entered || source.closest(".v2-intro, .v2-header, a")) return;
    const field = fieldRef.current;
    if (!field) return;
    const rect = field.getBoundingClientRect();
    const zoneElement = source.closest<HTMLElement>("[data-zone]");
    const zone = (zoneElement?.dataset.zone as ZoneId | undefined) ?? null;
    if (zone && unlocked.includes(zone)) return;
    event.preventDefault();

    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    aimRef.current = {
      x,
      y,
      clientX: event.clientX,
      clientY: event.clientY,
      zone,
    };
    field.style.setProperty("--pointer-x", `${x * 100}%`);
    field.style.setProperty("--pointer-y", `${y * 100}%`);
    field.setPointerCapture(event.pointerId);
    setDrawing(true);
    setTension(0);
    tensionRef.current = 0;
    setAim(x, y);
    setDraw(true, 0);
    drawStartedRef.current = performance.now();
    setFeedback("HOLD STEADY · RELEASE WHEN READY");

    const charge = (now: number) => {
      if (drawStartedRef.current === null) return;
      const nextTension = Math.min(1, (now - drawStartedRef.current) / 900);
      if (nextTension !== tensionRef.current) {
        tensionRef.current = nextTension;
        setTension(nextTension);
        setDraw(true, nextTension);
      }
      drawFrameRef.current = nextTension < 1 ? window.requestAnimationFrame(charge) : null;
    };
    drawFrameRef.current = window.requestAnimationFrame(charge);
  };

  const releaseShot = (event: React.PointerEvent<HTMLElement>) => {
    if (drawStartedRef.current === null) return;
    const aim = aimRef.current;
    drawStartedRef.current = null;
    if (drawFrameRef.current) window.cancelAnimationFrame(drawFrameRef.current);
    const power = tensionRef.current;
    if (power < .12) {
      setFeedback("HOLD A LITTLE LONGER · THEN RELEASE");
      setDrawing(false);
      setTension(0);
      tensionRef.current = 0;
      setDraw(false, 0);
      if (fieldRef.current?.hasPointerCapture(event.pointerId)) fieldRef.current.releasePointerCapture(event.pointerId);
      return;
    }
    launch({ id: Date.now(), x: aim.x, y: aim.y, zone: aim.zone, power });
    setDrawing(false);
    setTension(0);
    tensionRef.current = 0;
    if (fieldRef.current?.hasPointerCapture(event.pointerId)) fieldRef.current.releasePointerCapture(event.pointerId);
    setFeedback("ARROW IN FLIGHT · HOLD THE LINE");
  };

  const cancelShot = () => {
    drawStartedRef.current = null;
    if (drawFrameRef.current) window.cancelAnimationFrame(drawFrameRef.current);
    tensionRef.current = 0;
    setDrawing(false);
    setTension(0);
    setDraw(false, 0);
    setFeedback("MOVE TO AIM · HOLD TO DRAW · RELEASE");
  };

  return (
    <main id="top" className={`v2-shell ${entered ? "field-entered" : ""}`}>
      <header className="v2-header">
        <a href="#top" className="v2-brand" aria-label="Back to top">
          ALINA.WU <span>/ FOCUS FIELD / V2</span>
        </a>
        <nav className="v2-nav" aria-label="Portfolio sections">
          <a href="/about">LOCKER</a>
          <a href="/projects">WORKSHOP</a>
          <a href="/notes">ARCHIVE</a>
          <a href="/away">ROUTES</a>
        </nav>
        <div className="v2-status">
          <span><i /> FIELD ONLINE</span>
          <span>3 PROJECTS · 2 EXPERIENCES</span>
          <span>{unlocked.length}/5 FOUND</span>
        </div>
      </header>

      <section
        className={`focus-field ${drawing ? "is-drawing" : ""} ${impactZone ? `has-impact impact-${impactZone}` : ""} ${approachedZone ? `is-focused focus-${approachedZone}` : ""}`}
        ref={fieldRef}
        onPointerMove={lookAround}
        onPointerDown={beginShot}
        onPointerUp={releaseShot}
        onPointerCancel={cancelShot}
        onPointerLeave={() => setHovered(null)}
        style={{ "--tension": tension } as React.CSSProperties}
        aria-label="An interactive field containing five portfolio markers"
      >
        <canvas ref={canvasRef} className="archery-canvas" aria-hidden="true" />
        <div className="focus-cursor" aria-hidden="true"><i /></div>
        <div className="range-atmosphere" aria-hidden="true">
          <span className="range-light-leak" />
          <span className="range-vignette" />
          <span className="range-grain" />
        </div>
        <InteractiveModel kind="range" className="range-three-stage" interactive={false} />
        <div className="v2-intro">
          <p>COMPUTER SCIENCE × HUMAN CURIOSITY</p>
          <h1>Follow<br />your <em>focus.</em></h1>
          <div className="v2-intro-copy">
            <span>WENRUI (ALINA) WU</span>
            <p>
              Computer Science at the University of Washington. I build with
              code, then look closely at the people and systems it meets.
            </p>
          </div>
          <div className="v2-intro-actions">
            <button onClick={() => setEntered(true)}>ENTER THE FIELD <span>→</span></button>
            <a href="/about">MEET ALINA</a>
          </div>
        </div>

        <button data-zone="web"
          className={`field-marker marker-web ${discovered.includes("web") ? "is-found" : ""} ${unlocked.includes("web") ? "is-unlocked" : ""} ${impactZone === "web" ? "is-impacting" : ""}`}
          onClick={(event) => { if (event.detail === 0 || unlocked.includes("web")) openZone("web"); }}
          onPointerEnter={() => setHovered("web")}
          onPointerLeave={() => setHovered(null)}
          aria-label="Explore web projects"
        >
          <span className="marker-index">01</span>
          <span className="web-beacon">
            <i /><i /><i />
            <b>www</b>
          </span>
          <strong>SHANGHAI MAP</strong>
          <small>web project · team of 8</small>
        </button>

        <button data-zone="algorithm"
          className={`field-marker marker-algorithm ${discovered.includes("algorithm") ? "is-found" : ""} ${unlocked.includes("algorithm") ? "is-unlocked" : ""} ${impactZone === "algorithm" ? "is-impacting" : ""}`}
          onClick={(event) => { if (event.detail === 0 || unlocked.includes("algorithm")) openZone("algorithm"); }}
          onPointerEnter={() => setHovered("algorithm")}
          onPointerLeave={() => setHovered(null)}
          aria-label="Explore the algorithm project"
        >
          <span className="marker-index">02</span>
          <span className="algorithm-beacon">
            <i /><i /><i /><i />
          </span>
          <strong>ASSIGNMENT</strong>
          <small>algorithm project · Python</small>
        </button>

        <button data-zone="hardware"
          className={`field-marker marker-hardware ${discovered.includes("hardware") ? "is-found" : ""} ${unlocked.includes("hardware") ? "is-unlocked" : ""} ${impactZone === "hardware" ? "is-impacting" : ""}`}
          onClick={(event) => { if (event.detail === 0 || unlocked.includes("hardware")) openZone("hardware"); }}
          onPointerEnter={() => setHovered("hardware")}
          onPointerLeave={() => setHovered(null)}
          aria-label="Explore the hardware project"
        >
          <span className="marker-index">03</span>
          <span className="hardware-beacon">
            <i className="hardware-core">MCU</i>
            <i className="hardware-pin pin-a" />
            <i className="hardware-pin pin-b" />
            <i className="hardware-led" />
          </span>
          <strong>EMG MONITOR</strong>
          <small>hardware project · ESP32</small>
        </button>

        <button data-zone="notes"
          className={`field-marker marker-notes ${discovered.includes("notes") ? "is-found" : ""} ${unlocked.includes("notes") ? "is-unlocked" : ""} ${impactZone === "notes" ? "is-impacting" : ""}`}
          onClick={(event) => { if (event.detail === 0 || unlocked.includes("notes")) openZone("notes"); }}
          onPointerEnter={() => setHovered("notes")}
          onPointerLeave={() => setHovered(null)}
          aria-label="Explore undergraduate research experience"
        >
          <span className="marker-index">04</span>
          <span className="target-beacon" aria-hidden="true">
            <i className="target-ring ring-one" />
            <i className="target-ring ring-two" />
            <i className="target-ring ring-three" />
            <i className="target-center" />
            <i className="target-arrow" />
          </span>
          <strong>RESEARCH</strong>
          <small>Social Futures Lab · UW</small>
        </button>

        <button data-zone="travel"
          className={`field-marker marker-travel ${discovered.includes("travel") ? "is-found" : ""} ${unlocked.includes("travel") ? "is-unlocked" : ""} ${impactZone === "travel" ? "is-impacting" : ""}`}
          onClick={(event) => { if (event.detail === 0 || unlocked.includes("travel")) openZone("travel"); }}
          onPointerEnter={() => setHovered("travel")}
          onPointerLeave={() => setHovered(null)}
          aria-label="Explore the software engineering internship"
        >
          <span className="marker-index">05</span>
          <span className="travel-beacon"><i /><i /><i /></span>
          <strong>INTERNSHIP</strong>
          <small>Thermo Fisher Scientific</small>
        </button>

        {entered && shotCount === 0 && !drawing && <div className="shot-coach"><i /> MOVE TO AIM · HOLD TO DRAW · RELEASE</div>}
        <div className={`field-readout ${hovered || drawing || impactZone ? "has-signal" : ""}`} aria-live="polite">
          <span>{drawing ? `DRAW ${Math.round(tension * 100)}%` : feedback}</span>
          <strong>{drawing ? "RELEASE TO FIRE" : hovered ? (unlocked.includes(hovered) ? "SIGNAL UNLOCKED · CLICK TO OPEN" : zoneLabels[hovered]) : unlocked.length ? "IMPACT LEAVES A TRACE" : "THE FIELD IS WAITING"}</strong>
        </div>

        <div className="field-compass" aria-hidden="true">
          <span>N</span><i /><small>NOT TO SCALE</small>
        </div>
      </section>

      {activeZone && (
        <div className={`v2-overlay range-clue-layer clue-${activeZone}`} onMouseDown={closeZone}>
          <aside
            className={`v2-panel panel-${activeZone}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="v2-panel-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header className="v2-panel-header">
              <div>
                <span>FIELD SIGNAL</span>
                <strong>{zoneLabels[activeZone]}</strong>
              </div>
              <button onClick={closeZone} aria-label="Close field signal">RETURN TO RANGE ×</button>
            </header>

            {activeZone === "web" && (
              <div className="v2-panel-body">
                <p className="panel-sequence">PROJECT 01 / HTML · CSS · JAVASCRIPT</p>
                <h2 id="v2-panel-title">Quality of Life in Shanghai.</h2>
                <p className="panel-lede">
                  An interactive neighborhood map shaped by a mixed-methods study
                  of urban quality of life, built to help residents find nearby
                  facilities within a walking-distance radius.
                </p>
                <div className="v2-web-demo">
                  <div className="v2-web-tabs"><span>NEIGHBORHOOD MAP</span><span>20+ RESPONSES</span><span>8-PERSON TEAM</span></div>
                  <div className="v2-web-screen">
                    <p>WALKING-RADIUS SEARCH</p>
                    <strong>Find useful places<br />within reach.</strong>
                    <button>VIEW CASE STUDY →</button>
                  </div>
                </div>
                <div className="v2-facts"><span>ROLE <b>Team lead + developer</b></span><span>METHOD <b>Questionnaires + interviews</b></span><span>PERIOD <b>Sep 2023 - May 2024</b></span></div>
                <a className="panel-link" href="/projects#web">CONTINUE INTO PROJECTS →</a>
              </div>
            )}

            {activeZone === "algorithm" && (
              <div className="v2-panel-body">
                <p className="panel-sequence">PROJECT 02 / PYTHON · NUMPY</p>
                <h2 id="v2-panel-title">Automatic and Satisfactory Course Assignment.</h2>
                <p className="panel-lede">An allocation system built around satisfaction and efficiency, using Simultaneous Eating and Birkhoff Decomposition.</p>
                <div className={`v2-path-demo ${algorithmRun ? "is-running" : ""}`}>
                  <div className="path-map">
                    <span className="path-node path-start">INPUT</span>
                    <span className="path-node path-check">EAT</span>
                    <span className="path-node path-adjust">DECOMP</span>
                    <span className="path-node path-goal">ASSIGN</span>
                    <i className="path-segment segment-a" />
                    <i className="path-segment segment-b" />
                    <i className="path-segment segment-c" />
                    <i className="path-runner" />
                  </div>
                  <div className="path-controls">
                    <span>{algorithmRun ? "ALLOCATION COMPLETE / SCHEDULE READY" : "PREFERENCES READY"}</span>
                    <button onClick={() => setAlgorithmRun((value) => !value)}>{algorithmRun ? "RESET" : "RUN ALLOCATION"}</button>
                  </div>
                </div>
                <a className="panel-link" href="/projects#algorithm">CONTINUE INTO THE CASE STUDY →</a>
              </div>
            )}

            {activeZone === "hardware" && (
              <div className="v2-panel-body">
                <p className="panel-sequence">PROJECT 03 / ARDUINO · C/C++ · FUSION</p>
                <h2 id="v2-panel-title">Monitoring Device for Muscle Usage &amp; Behavior.</h2>
                <p className="panel-lede">A multi-device system that collects EMG signals over Bluetooth, classifies them on ESP32 microcontrollers, and sends exercise data to a mobile interface.</p>
                <div className={`v2-device ${deviceOn ? "is-powered" : ""}`}>
                  <div className="device-visual">
                    <span className="device-module module-input">EMG</span>
                    <span className="device-module module-core">ESP32</span>
                    <span className="device-module module-output">APP</span>
                    <i className="device-wire wire-a" /><i className="device-wire wire-b" />
                    <i className="device-packet packet-a" /><i className="device-packet packet-b" />
                  </div>
                  <div className="device-readout">
                    <p>&gt; emg.pipeline</p>
                    <strong>{deviceOn ? "SIGNAL CLASSIFIED" : "DEVICE READY"}</strong>
                    <button onClick={() => setDeviceOn((value) => !value)}>{deviceOn ? "STOP STREAM" : "START STREAM"}</button>
                  </div>
                </div>
                <a className="panel-link" href="/projects#hardware">CONTINUE INTO THE CASE STUDY →</a>
              </div>
            )}

            {activeZone === "notes" && (
              <div className="v2-panel-body">
                <p className="panel-sequence">EXPERIENCE 01 / UNDERGRADUATE RESEARCH</p>
                <h2 id="v2-panel-title">How do principles shape perceived relevance?</h2>
                <p className="panel-lede">At UW&apos;s Social Futures Lab, I analyze how agreement on principles affects perceived relevance between cases.</p>
                <div className="v2-note-stack">
                  <article><span>DATA / SURVEYS</span><p>Case similarity, relevance, and principle agreement.</p><small>Participant responses retained as evidence.</small></article>
                  <article><span>PIPELINE / PANDAS</span><p>CSV datasets become normalized principle vectors.</p><small>Structured for case analysis.</small></article>
                  <article><span>STATUS / APR 2026 - PRESENT</span><p>The relationship between agreement and relevance is still under investigation.</p><small>Research assistant · Seattle</small></article>
                </div>
                <a className="panel-link" href="/notes">OPEN THE THOUGHT ARCHIVE →</a>
              </div>
            )}

            {activeZone === "travel" && (
              <div className="v2-panel-body">
                <p className="panel-sequence">EXPERIENCE 02 / SOFTWARE ENGINEERING INTERNSHIP</p>
                <h2 id="v2-panel-title">Vision, motion, and laboratory workflows.</h2>
                <p className="panel-lede">At Thermo Fisher Scientific in Shanghai, I work across robot-arm automation, scientific-software testing, workflow analysis, and technical onboarding.</p>
                <div className={`v2-route-demo ${routeChanged ? "route-b" : "route-a"}`}>
                  <div className="route-stops">
                    <span><b>01</b> YOLO26 VISION</span>
                    <span><b>02</b> ROS2 MOTION</span>
                    <span><b>03</b> 3500Dx TESTING</span>
                    <span><b>04</b> QANTIS WORKFLOWS</span>
                  </div>
                  <button onClick={() => setRouteChanged((value) => !value)}>{routeChanged ? "RESET WORKFLOW" : "TRACE THE WORKFLOW"}</button>
                  <p>{routeChanged ? "VISION → MOTION → VALIDATION → UI STRUCTURE" : "JUNE 2026 - PRESENT / SHANGHAI"}</p>
                </div>
                <a className="panel-link" href="/projects">INSPECT THE TECHNICAL WORK →</a>
              </div>
            )}
          </aside>
        </div>
      )}

      <section className="field-afterword">
        <div className="afterword-intro">
          <span>THE CLUBHOUSE IS OPEN.</span>
          <h2>The range was<br />only the entrance.</h2>
          <p>
            The signals show what I make. The rooms beyond them show how I
            think, what I notice, and who I am when the laptop closes.
          </p>
        </div>
        <div className="afterword-grid">
          <a href="/about"><span>01 / LOCKER 17</span><strong>Open the objects that were left behind.</strong><i>LOCKER →</i></a>
          <a href="/projects"><span>02 / REPAIR SHED</span><strong>Inspect three builds on the workbench.</strong><i>WORKSHOP →</i></a>
          <a href="/notes"><span>03 / TARGET ARCHIVE</span><strong>Turn used targets over and read the pencil marks.</strong><i>ARCHIVE →</i></a>
          <a href="/away"><span>04 / ROUTE BOARD</span><strong>Unfold Plan B and leave through the clubhouse gate.</strong><i>ROUTES →</i></a>
        </div>
      </section>
    </main>
  );
}
