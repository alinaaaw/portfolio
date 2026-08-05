"use client";

import { useEffect, useRef, useState } from "react";

type ZoneId = "web" | "algorithm" | "hardware" | "notes" | "travel";

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
  const fieldRef = useRef<HTMLElement>(null);

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
    return () => window.removeEventListener("keydown", closeWithEscape);
  }, []);

  const lookAround = (event: React.PointerEvent<HTMLElement>) => {
    const field = fieldRef.current;
    if (!field) return;
    const rect = field.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
    field.style.setProperty("--pointer-x", `${x * 100}%`);
    field.style.setProperty("--pointer-y", `${y * 100}%`);
    field.style.setProperty("--look-x", `${(x - 0.5) * -24}px`);
    field.style.setProperty("--look-y", `${(y - 0.5) * -16}px`);
    field.style.setProperty("--look-x-near", `${(x - 0.5) * -42}px`);
    field.style.setProperty("--look-y-near", `${(y - 0.5) * -24}px`);
  };

  return (
    <main id="top" className={`v2-shell ${entered ? "field-entered" : ""}`}>
      <header className="v2-header">
        <a href="#top" className="v2-brand" aria-label="Back to top">
          ALINA.WU <span>/ FOCUS FIELD / V2</span>
        </a>
        <div className="v2-status">
          <span><i /> FIELD ONLINE</span>
          <span>{discovered.length}/5 FOUND</span>
        </div>
      </header>

      <section
        className="focus-field"
        ref={fieldRef}
        onPointerMove={lookAround}
        onPointerLeave={() => setHovered(null)}
        aria-label="An interactive field containing five portfolio markers"
      >
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

        <div className="v2-intro">
          <p>COMPUTER SCIENCE × HUMAN CURIOSITY</p>
          <h1>Follow<br />your <em>focus.</em></h1>
          <div className="v2-intro-copy">
            <span>One field. Five signals.</span>
            <p>
              Move to look around. Click anything that catches your attention.
              No driving, no map to memorize, no correct order.
            </p>
          </div>
          <button onClick={() => setEntered(true)}>
            ENTER THE FIELD <span>→</span>
          </button>
        </div>

        <button
          className={`field-marker marker-web ${discovered.includes("web") ? "is-found" : ""}`}
          onClick={() => openZone("web")}
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

        <button
          className={`field-marker marker-algorithm ${discovered.includes("algorithm") ? "is-found" : ""}`}
          onClick={() => openZone("algorithm")}
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

        <button
          className={`field-marker marker-hardware ${discovered.includes("hardware") ? "is-found" : ""}`}
          onClick={() => openZone("hardware")}
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

        <button
          className={`field-marker marker-notes ${discovered.includes("notes") ? "is-found" : ""}`}
          onClick={() => openZone("notes")}
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

        <button
          className={`field-marker marker-travel ${discovered.includes("travel") ? "is-found" : ""}`}
          onClick={() => openZone("travel")}
          onPointerEnter={() => setHovered("travel")}
          onPointerLeave={() => setHovered(null)}
          aria-label="Explore the travel route"
        >
          <span className="marker-index">05</span>
          <span className="travel-beacon"><i /><i /><i /></span>
          <strong>ROUTE</strong>
          <small>planned entry into the unknown</small>
        </button>

        <div className={`field-readout ${hovered ? "has-signal" : ""}`} aria-live="polite">
          <span>{hovered ? "SIGNAL DETECTED" : "MOVE TO LOOK"}</span>
          <strong>{hovered ? zoneLabels[hovered] : "CLICK A MARKER"}</strong>
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
              </div>
            )}
          </aside>
        </div>
      )}
    </main>
  );
}
