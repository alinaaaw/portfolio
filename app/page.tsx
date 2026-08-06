"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useArcheryEngine } from "./_components/focus-field/useArcheryEngine";
import type { LaunchSpec, ZoneId } from "./_components/focus-field/archery-physics";

type DrawState = { x: number; y: number; clientX: number; clientY: number; zone: ZoneId | null };

const zoneLabels: Record<ZoneId, string> = {
  web: "WEB / SMALL SYSTEMS",
  algorithm: "ALGORITHM / PATH STUDY",
  hardware: "HARDWARE / SIGNAL TEST",
  notes: "MIND / FIELD NOTES",
  travel: "TRAVEL / OPEN ROUTE",
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
  const [shotCount, setShotCount] = useState(0);
  const [feedback, setFeedback] = useState("AIM · HOLD · PULL · RELEASE");
  const fieldRef = useRef<HTMLElement>(null);
  const drawRef = useRef<DrawState | null>(null);
  const tensionRef = useRef(0);
  const impactTimerRef = useRef<number | null>(null);

  const handleImpact = useCallback((shot: LaunchSpec) => {
    setShotCount((count) => count + 1);
    if (!shot.zone) {
      setFeedback("MISS · OBSERVE · RECALCULATE");
      return;
    }

    setUnlocked((current) => current.includes(shot.zone!) ? current : [...current, shot.zone!]);
    setImpactZone(shot.zone);
    setFeedback(`IMPACT · ${zoneLabels[shot.zone]} · SIGNAL UNLOCKED`);
    if (impactTimerRef.current) window.clearTimeout(impactTimerRef.current);
    impactTimerRef.current = window.setTimeout(() => setImpactZone(null), 900);
  }, []);

  const { canvasRef, launch, setActive, setAim, setDraw } = useArcheryEngine(handleImpact);

  const openZone = (zone: ZoneId) => {
    setEntered(true);
    setActiveZone(zone);
    setDiscovered((current) => current.includes(zone) ? current : [...current, zone]);
  };

  useEffect(() => {
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveZone(null);
    };
    window.addEventListener("keydown", closeWithEscape);
    return () => {
      window.removeEventListener("keydown", closeWithEscape);
      if (impactTimerRef.current) window.clearTimeout(impactTimerRef.current);
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
    if (drawRef.current) {
      const pull = Math.hypot(event.clientX - drawRef.current.clientX, event.clientY - drawRef.current.clientY);
      const nextTension = Math.min(1, pull / Math.min(190, rect.width * 0.22));
      tensionRef.current = nextTension;
      setTension(nextTension);
      setDraw(true, nextTension);
      field.style.setProperty("--pull-x", `${event.clientX - drawRef.current.clientX}px`);
      field.style.setProperty("--pull-y", `${event.clientY - drawRef.current.clientY}px`);
      return;
    }
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

    const zoneRect = zoneElement?.getBoundingClientRect();
    const x = zoneRect ? (zoneRect.left + zoneRect.width * 0.5 - rect.left) / rect.width : (event.clientX - rect.left) / rect.width;
    const y = zoneRect ? (zoneRect.top + zoneRect.height * 0.43 - rect.top) / rect.height : (event.clientY - rect.top) / rect.height;
    drawRef.current = {
      x,
      y,
      clientX: event.clientX,
      clientY: event.clientY,
      zone,
    };
    field.style.setProperty("--pointer-x", `${drawRef.current.x * 100}%`);
    field.style.setProperty("--pointer-y", `${drawRef.current.y * 100}%`);
    field.setPointerCapture(event.pointerId);
    setDrawing(true);
    setTension(0);
    tensionRef.current = 0;
    setAim(x, y);
    setDraw(true, 0);
    setFeedback("PULL BACK TO BUILD TENSION");
  };

  const releaseShot = (event: React.PointerEvent<HTMLElement>) => {
    const aim = drawRef.current;
    if (!aim) return;
    const power = tensionRef.current;
    if (power < .12) {
      setFeedback("PULL FARTHER · THEN RELEASE");
      setDrawing(false);
      setTension(0);
      tensionRef.current = 0;
      drawRef.current = null;
      setDraw(false, 0);
      if (fieldRef.current?.hasPointerCapture(event.pointerId)) fieldRef.current.releasePointerCapture(event.pointerId);
      return;
    }
    launch({ id: Date.now(), x: aim.x, y: aim.y, zone: aim.zone, power });
    setDrawing(false);
    setTension(0);
    tensionRef.current = 0;
    drawRef.current = null;
    if (fieldRef.current?.hasPointerCapture(event.pointerId)) fieldRef.current.releasePointerCapture(event.pointerId);
    setFeedback("ARROW IN FLIGHT · HOLD THE LINE");
  };

  const cancelShot = () => {
    drawRef.current = null;
    tensionRef.current = 0;
    setDrawing(false);
    setTension(0);
    setDraw(false, 0);
    setFeedback("AIM · HOLD · PULL · RELEASE");
  };

  return (
    <main id="top" className={`v2-shell ${entered ? "field-entered" : ""}`}>
      <header className="v2-header">
        <a href="#top" className="v2-brand" aria-label="Back to top">
          ALINA.WU <span>/ FOCUS FIELD / V2</span>
        </a>
        <nav className="v2-nav" aria-label="Portfolio sections">
          <a href="/about">ABOUT</a>
          <a href="/projects">PROJECTS</a>
          <a href="/notes">NOTES</a>
          <a href="/away">AWAY</a>
        </nav>
        <div className="v2-status">
          <span><i /> FIELD ONLINE</span>
          <span>{unlocked.length}/5 FOUND</span>
        </div>
      </header>

      <section
        className={`focus-field ${drawing ? "is-drawing" : ""} ${impactZone ? `has-impact impact-${impactZone}` : ""}`}
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
        <div className="field-sky" aria-hidden="true">
          <span className="sky-glow" />
          <span className="cloud cloud-one" />
          <span className="cloud cloud-two" />
          <span className="signal-star star-one" />
          <span className="signal-star star-two" />
          <span className="signal-star star-three" />
        </div>
        <div className="ridge ridge-far" aria-hidden="true" />
        <div className="ridge ridge-near" aria-hidden="true" />
        <div className="field-plane" aria-hidden="true">
          <span className="field-grid" />
          <span className="route-line route-line-one" />
          <span className="route-line route-line-two" />
          <span className="route-pulse pulse-one" />
          <span className="route-pulse pulse-two" />
        </div>
        <div className="range-world" aria-hidden="true">
          <span className="range-sun" />
          <span className="range-cloud cloud-a" /><span className="range-cloud cloud-b" />
          <span className="range-tree tree-a" /><span className="range-tree tree-b" /><span className="range-tree tree-c" />
          <span className="range-flag flag-a" /><span className="range-flag flag-b" />
          <span className="range-grass grass-a" /><span className="range-grass grass-b" /><span className="range-grass grass-c" />
          <span className="wind-line wind-a" /><span className="wind-line wind-b" />
        </div>
        <div className="v2-intro">
          <p>COMPUTER SCIENCE × HUMAN CURIOSITY</p>
          <h1>Follow<br />your <em>focus.</em></h1>
          <div className="v2-intro-copy">
            <span>HELLO, I AM ALINA.</span>
            <p>
              I build with code and study the human complexity it cannot fully
              contain. Move to look around, or start with the person behind it.
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
          <strong>WEB</strong>
          <small>things made usable</small>
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
          <strong>PATH</strong>
          <small>reason, test, recalculate</small>
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
          <strong>SIGNAL</strong>
          <small>code beyond the screen</small>
        </button>

        <button data-zone="notes"
          className={`field-marker marker-notes ${discovered.includes("notes") ? "is-found" : ""} ${unlocked.includes("notes") ? "is-unlocked" : ""} ${impactZone === "notes" ? "is-impacting" : ""}`}
          onClick={(event) => { if (event.detail === 0 || unlocked.includes("notes")) openZone("notes"); }}
          onPointerEnter={() => setHovered("notes")}
          onPointerLeave={() => setHovered(null)}
          aria-label="Explore personal field notes"
        >
          <span className="marker-index">04</span>
          <span className="target-beacon" aria-hidden="true">
            <i className="target-ring ring-one" />
            <i className="target-ring ring-two" />
            <i className="target-ring ring-three" />
            <i className="target-center" />
            <i className="target-arrow" />
          </span>
          <strong>FOCUS</strong>
          <small>thoughts, not conclusions</small>
        </button>

        <button data-zone="travel"
          className={`field-marker marker-travel ${discovered.includes("travel") ? "is-found" : ""} ${unlocked.includes("travel") ? "is-unlocked" : ""} ${impactZone === "travel" ? "is-impacting" : ""}`}
          onClick={(event) => { if (event.detail === 0 || unlocked.includes("travel")) openZone("travel"); }}
          onPointerEnter={() => setHovered("travel")}
          onPointerLeave={() => setHovered(null)}
          aria-label="Explore the travel route"
        >
          <span className="marker-index">05</span>
          <span className="travel-beacon"><i /><i /><i /></span>
          <strong>ROUTE</strong>
          <small>planned entry into the unknown</small>
        </button>

        {entered && shotCount === 0 && !drawing && <div className="shot-coach"><i /> AIM · HOLD · PULL · RELEASE</div>}
        <div className={`field-readout ${hovered || drawing || impactZone ? "has-signal" : ""}`} aria-live="polite">
          <span>{drawing ? `DRAW ${Math.round(tension * 100)}%` : feedback}</span>
          <strong>{drawing ? "RELEASE TO FIRE" : hovered ? (unlocked.includes(hovered) ? "SIGNAL UNLOCKED · CLICK TO OPEN" : zoneLabels[hovered]) : unlocked.length ? "IMPACT LEAVES A TRACE" : "THE FIELD IS WAITING"}</strong>
        </div>

        <div className="field-compass" aria-hidden="true">
          <span>N</span><i /><small>NOT TO SCALE</small>
        </div>
      </section>

      {activeZone && (
        <div className="v2-overlay" onMouseDown={() => setActiveZone(null)}>
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
              <button onClick={() => setActiveZone(null)} aria-label="Close field signal">CLOSE ×</button>
            </header>

            {activeZone === "web" && (
              <div className="v2-panel-body">
                <p className="panel-sequence">SIGNAL 01 / WEB</p>
                <h2 id="v2-panel-title">Small sites for real decisions.</h2>
                <p className="panel-lede">
                  I like turning a concrete problem into something another person
                  can actually use. The final page will let each website run here,
                  not sit behind a screenshot.
                </p>
                <div className="v2-web-demo">
                  <div className="v2-web-tabs"><span>LIVE PREVIEW</span><span>NOTES</span><span>CODE</span></div>
                  <div className="v2-web-screen">
                    <p>DECISION TOOL / 01</p>
                    <strong>Make the next step<br />easier to choose.</strong>
                    <button>TRY PROJECT →</button>
                  </div>
                </div>
                <div className="v2-facts"><span>ROLE <b>Design + code</b></span><span>PRIORITY <b>Useful first</b></span><span>STATE <b>Iterating</b></span></div>
                <a className="panel-link" href="/projects#web">CONTINUE INTO PROJECTS →</a>
              </div>
            )}

            {activeZone === "algorithm" && (
              <div className="v2-panel-body">
                <p className="panel-sequence">SIGNAL 02 / ALGORITHM</p>
                <h2 id="v2-panel-title">Find one route that holds.</h2>
                <p className="panel-lede">Collect information, test a path, then recalculate when reality changes.</p>
                <div className={`v2-path-demo ${algorithmRun ? "is-running" : ""}`}>
                  <div className="path-map">
                    <span className="path-node path-start">START</span>
                    <span className="path-node path-check">CHECK</span>
                    <span className="path-node path-adjust">ADJUST</span>
                    <span className="path-node path-goal">GOAL</span>
                    <i className="path-segment segment-a" />
                    <i className="path-segment segment-b" />
                    <i className="path-segment segment-c" />
                    <i className="path-runner" />
                  </div>
                  <div className="path-controls">
                    <span>{algorithmRun ? "PATH HOLDS / 3 CHECKS" : "WAITING FOR A TEST"}</span>
                    <button onClick={() => setAlgorithmRun((value) => !value)}>{algorithmRun ? "RESET" : "RUN PATH"}</button>
                  </div>
                </div>
                <a className="panel-link" href="/projects#algorithm">CONTINUE INTO THE CASE STUDY →</a>
              </div>
            )}

            {activeZone === "hardware" && (
              <div className="v2-panel-body">
                <p className="panel-sequence">SIGNAL 03 / HARDWARE</p>
                <h2 id="v2-panel-title">A thought, made physical.</h2>
                <p className="panel-lede">Hardware is where an abstract instruction has to survive contact with voltage, timing, noise, and the real world.</p>
                <div className={`v2-device ${deviceOn ? "is-powered" : ""}`}>
                  <div className="device-visual">
                    <span className="device-module module-input">IN</span>
                    <span className="device-module module-core">CORE</span>
                    <span className="device-module module-output">OUT</span>
                    <i className="device-wire wire-a" /><i className="device-wire wire-b" />
                    <i className="device-packet packet-a" /><i className="device-packet packet-b" />
                  </div>
                  <div className="device-readout">
                    <p>&gt; signal.status</p>
                    <strong>{deviceOn ? "RECEIVING" : "STANDBY"}</strong>
                    <button onClick={() => setDeviceOn((value) => !value)}>{deviceOn ? "POWER OFF" : "POWER ON"}</button>
                  </div>
                </div>
                <a className="panel-link" href="/projects#hardware">CONTINUE INTO THE CASE STUDY →</a>
              </div>
            )}

            {activeZone === "notes" && (
              <div className="v2-panel-body">
                <p className="panel-sequence">SIGNAL 04 / FIELD NOTES</p>
                <h2 id="v2-panel-title">Focus is not certainty.</h2>
                <p className="panel-lede">A target helps direct attention. It does not make the answer appear.</p>
                <div className="v2-note-stack">
                  <article><span>OBSERVATION / 01</span><p>I distrust confidence that arrives before understanding.</p><small>Still true. Still checking.</small></article>
                  <article><span>LEARNING / NOW</span><p>How can interaction feel alive without turning a person into a data point?</p><small>No conclusion yet.</small></article>
                  <article><span>PERSONAL / TRACE</span><p>I used to practice laser shooting. Now I shoot arrows. The pause before release is part of the shot.</p><small>Maybe that belongs here.</small></article>
                </div>
                <a className="panel-link" href="/notes">OPEN ALL THOUGHT TRACES →</a>
              </div>
            )}

            {activeZone === "travel" && (
              <div className="v2-panel-body">
                <p className="panel-sequence">SIGNAL 05 / TRAVEL</p>
                <h2 id="v2-panel-title">Plan carefully. Enter anyway.</h2>
                <p className="panel-lede">I plan routes in detail, keep backup options, and leave enough space for a different life to surprise me.</p>
                <div className={`v2-route-demo ${routeChanged ? "route-b" : "route-a"}`}>
                  <div className="route-stops">
                    <span><b>08:10</b> DEPART</span>
                    <span><b>11:40</b> WANDER</span>
                    <span><b>16:20</b> OPEN TIME</span>
                    <span><b>?</b> LAUGH IN THE STREET</span>
                  </div>
                  <button onClick={() => setRouteChanged((value) => !value)}>{routeChanged ? "RETURN TO PLAN A" : "RECALCULATE ROUTE"}</button>
                  <p>{routeChanged ? "PLAN B FOUND / LESS DIRECT / MORE INTERESTING" : "PLAN A READY / 38 MINUTES OF MARGIN"}</p>
                </div>
                <a className="panel-link" href="/away">FOLLOW THE ROUTE OFF SCREEN →</a>
              </div>
            )}
          </aside>
        </div>
      )}

      <section className="field-afterword">
        <div className="afterword-intro">
          <span>THE FIELD WAS ONLY THE DOOR.</span>
          <h2>A portfolio about<br />a person, not a stack.</h2>
          <p>
            The signals show what I make. The rooms beyond them show how I
            think, what I notice, and who I am when the laptop closes.
          </p>
        </div>
        <div className="afterword-grid">
          <a href="/about"><span>01 / HUMAN SYSTEM</span><strong>Meet the person behind the work.</strong><i>ABOUT →</i></a>
          <a href="/projects"><span>02 / WORK</span><strong>See how I approach different kinds of problems.</strong><i>PROJECTS →</i></a>
          <a href="/notes"><span>03 / THOUGHT TRACES</span><strong>Read selected questions before they become conclusions.</strong><i>NOTES →</i></a>
          <a href="/away"><span>04 / OFF SCREEN</span><strong>Follow the plans, detours, and ordinary life outside code.</strong><i>AWAY →</i></a>
        </div>
      </section>
    </main>
  );
}
