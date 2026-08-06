"use client";

import { useEffect, useRef, useState } from "react";

type Mode = "intro" | "trial" | "reflection" | "result";
type RecordItem = { trial: number; choice: string; time: number };
type ClickMark = { id: number; x: number; y: number };

const trials = [
  {
    code: "THRESHOLD",
    prompt: "Two entrances. One tells you exactly where it leads.",
    context: "You can only open one.",
    options: [
      { id: "known", label: "THE LABELED DOOR", detail: "OBSERVATION ROOM →", mark: "A" },
      { id: "unknown", label: "THE UNMARKED DOOR", detail: "NO DESTINATION GIVEN", mark: "?" },
    ],
    observations: {
      known: "You chose definition before discovery. That may be caution—or simply efficient reading.",
      unknown: "You chose discovery before definition. Curiosity moved before certainty arrived.",
    },
  },
  {
    code: "INFORMATION",
    prompt: "The next decision has missing context.",
    context: "More information is available, but it may not make the choice easier.",
    options: [
      { id: "more", label: "READ THE FULL NOTE", detail: "ADD CONTEXT BEFORE CHOOSING", mark: "+" },
      { id: "enough", label: "I HAVE ENOUGH", detail: "DECIDE WITH WHAT IS HERE", mark: "—" },
    ],
    observations: {
      more: "You asked for context even after being warned it might not resolve the ambiguity.",
      enough: "You accepted an incomplete picture and protected momentum.",
    },
  },
  {
    code: "PACE",
    prompt: "A signal will appear. The interface does not say when.",
    context: "Waiting may reveal something. Continuing is also a valid decision.",
    options: [
      { id: "wait", label: "WAIT FOR THE SIGNAL", detail: "LET THE MOMENT ARRIVE", mark: "…" },
      { id: "continue", label: "CONTINUE NOW", detail: "DO NOT OUTSOURCE THE PACE", mark: ">" },
    ],
    observations: {
      wait: "You allowed the interface to set the pace—at least this once.",
      continue: "You reclaimed the pace instead of waiting for permission from the interface.",
    },
  },
  {
    code: "PROJECTION",
    prompt: "Keep one object. None of them has a stated use.",
    context: "The object will not appear again. The choice is still recorded.",
    options: [
      { id: "key", label: "THE KEY", detail: "POSSIBLE ACCESS", mark: "⌁" },
      { id: "compass", label: "THE COMPASS", detail: "POSSIBLE DIRECTION", mark: "✣" },
      { id: "card", label: "THE BLANK CARD", detail: "POSSIBLE MEANING", mark: "□" },
    ],
    observations: {
      key: "You kept the possibility of access: a way through something not yet visible.",
      compass: "You kept the possibility of direction: orientation before arrival.",
      card: "You kept the possibility of authorship: meaning left deliberately unfinished.",
    },
  },
] as const;

export default function Home() {
  const [mode, setMode] = useState<Mode>("intro");
  const [trialIndex, setTrialIndex] = useState(0);
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [switches, setSwitches] = useState(0);
  const [movement, setMovement] = useState(0);
  const [clicks, setClicks] = useState<ClickMark[]>([]);
  const [copied, setCopied] = useState(false);
  const trialStarted = useRef(0);
  const lastHover = useRef<string | null>(null);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const movementTotal = useRef(0);

  useEffect(() => {
    if (mode !== "trial") return;
    const timer = window.setInterval(() => {
      setElapsed(performance.now() - trialStarted.current);
    }, 100);
    return () => window.clearInterval(timer);
  }, [mode, trialIndex]);

  const begin = () => {
    setMode("trial");
    setTrialIndex(0);
    setRecords([]);
    setSwitches(0);
    setMovement(0);
    setClicks([]);
    setCopied(false);
    movementTotal.current = 0;
    lastPoint.current = null;
    lastHover.current = null;
    trialStarted.current = performance.now();
  };

  const choose = (choice: string) => {
    const time = Math.max(100, performance.now() - trialStarted.current);
    setRecords((current) => [...current, { trial: trialIndex, choice, time }]);
    setElapsed(time);
    setMode("reflection");
  };

  const continueExperiment = () => {
    if (trialIndex === trials.length - 1) {
      setMode("result");
      return;
    }
    setTrialIndex((current) => current + 1);
    lastHover.current = null;
    setElapsed(0);
    trialStarted.current = performance.now();
    setMode("trial");
  };

  const observeHover = (id: string) => {
    if (lastHover.current && lastHover.current !== id) {
      setSwitches((value) => value + 1);
    }
    lastHover.current = id;
  };

  const observePointer = (event: React.PointerEvent<HTMLElement>) => {
    if (lastPoint.current) {
      const dx = event.clientX - lastPoint.current.x;
      const dy = event.clientY - lastPoint.current.y;
      movementTotal.current += Math.sqrt(dx * dx + dy * dy);
      const next = Math.floor(movementTotal.current / 500);
      if (next !== movement) setMovement(next);
    }
    lastPoint.current = { x: event.clientX, y: event.clientY };
  };

  const markClick = (event: React.PointerEvent<HTMLElement>) => {
    if (mode === "intro") return;
    setClicks((current) => [
      ...current.slice(-8),
      {
        id: Date.now(),
        x: (event.clientX / window.innerWidth) * 100,
        y: (event.clientY / window.innerHeight) * 100,
      },
    ]);
  };

  const currentTrial = trials[trialIndex];
  const latestRecord = records[records.length - 1];
  const latestObservation = latestRecord
    ? currentTrial.observations[latestRecord.choice as keyof typeof currentTrial.observations]
    : "";
  const averageTime = records.length
    ? records.reduce((sum, item) => sum + item.time, 0) / records.length
    : 0;
  const first = records[0]?.choice;
  const information = records[1]?.choice;
  const pace = records[2]?.choice;
  const object = records[3]?.choice;
  const movementLabel = movement < 4 ? "CONTAINED" : movement < 10 ? "SEARCHING" : "EXPANSIVE";
  const summary =
    "Observation 04: " +
    (first === "unknown" ? "I entered through uncertainty" : "I entered through definition") +
    ", " +
    (information === "more" ? "asked for more context" : "accepted incomplete context") +
    ", and " +
    (pace === "wait" ? "waited for the interface" : "kept my own pace") +
    ".";

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <main
      className={"experiment mode-" + mode + " reveal-" + records.length}
      onPointerMove={observePointer}
      onPointerDown={markClick}
    >
      <header className="lab-header">
        <a href="#top" className="lab-mark" aria-label="Observation Room home">
          <span className="pulse-dot" /> OBSERVATION ROOM
        </a>
        <div className="session-meta">
          <span>SESSION 04</span>
          <span>{mode === "intro" ? "DORMANT" : mode === "result" ? "ARCHIVED" : "SIGNAL LIVE"}</span>
        </div>
      </header>

      <div className="room-grid" aria-hidden="true" />
      <div className="scanline" aria-hidden="true" />
      {clicks.map((click, index) => (
        <span
          className="click-mark"
          key={click.id}
          style={{
            left: click.x + "%",
            top: click.y + "%",
            opacity: (index + 2) / (clicks.length + 2),
          }}
          aria-hidden="true"
        />
      ))}

      <aside className="observer-rail" aria-label="Live observation status">
        <span>PASSIVE SIGNALS</span>
        <dl>
          <div><dt>CHOICES</dt><dd>{String(records.length).padStart(2, "0")}</dd></div>
          <div><dt>PATH CHANGES</dt><dd>{String(switches).padStart(2, "0")}</dd></div>
          <div><dt>MOVEMENT</dt><dd>{movementLabel}</dd></div>
          <div><dt>STORED</dt><dd>NO</dd></div>
        </dl>
      </aside>

      <section className="room" id="top" aria-live="polite">
        {mode === "intro" && (
          <div className="intro-panel">
            <p className="step-label">BEHAVIORAL STUDY / 04</p>
            <h1>You are not here<br />to answer questions.</h1>
            <p className="lead">
              Make four small decisions. The room will pay attention to how you move between them—not who you are.
            </p>
            <div className="consent-note">
              <span>BEFORE YOU ENTER</span>
              <p>No camera. No identity. No diagnosis. Interaction signals live only in this page and disappear when you leave.</p>
            </div>
            <button className="primary-button" onClick={begin}>
              ENTER THE ROOM <span>↗</span>
            </button>
          </div>
        )}

        {mode === "trial" && (
          <div className="trial-panel" key={trialIndex}>
            <div className="trial-head">
              <p className="step-label">{String(trialIndex + 1).padStart(2, "0")} / {currentTrial.code}</p>
              <span>{(elapsed / 1000).toFixed(1)} SEC</span>
            </div>
            <h2>{currentTrial.prompt}</h2>
            <p className="trial-context">{currentTrial.context}</p>
            <div className={"choice-field choice-count-" + currentTrial.options.length}>
              {currentTrial.options.map((option) => (
                <button
                  className="choice-card"
                  key={option.id}
                  onPointerEnter={() => observeHover(option.id)}
                  onFocus={() => observeHover(option.id)}
                  onClick={() => choose(option.id)}
                >
                  <span className="choice-mark">{option.mark}</span>
                  <span className="choice-copy"><strong>{option.label}</strong><small>{option.detail}</small></span>
                  <span className="choice-arrow">↗</span>
                </button>
              ))}
            </div>
            <p className="micro-note">There is no correct choice. The pause is part of the choice.</p>
          </div>
        )}

        {mode === "reflection" && latestRecord && (
          <div className="reflection-panel">
            <p className="step-label">OBSERVATION {String(trialIndex + 1).padStart(2, "0")} / REGISTERED</p>
            <div className="observation-number">{(latestRecord.time / 1000).toFixed(1)}<small>SECONDS</small></div>
            <h2>{latestObservation}</h2>
            <p className="caution">One action cannot explain a person. It can only describe this moment.</p>
            <button className="primary-button" onClick={continueExperiment}>
              {trialIndex === trials.length - 1 ? "SEE THE TRACE" : "NEXT OBSERVATION"} <span>→</span>
            </button>
          </div>
        )}

        {mode === "result" && (
          <div className="result-panel">
            <div className="result-heading">
              <div>
                <p className="step-label">SESSION 04 / BEHAVIORAL TRACE</p>
                <h1>This is what happened.<br /><em>Not who you are.</em></h1>
              </div>
              <span className="archive-stamp">OBSERVED<br />NOT DIAGNOSED</span>
            </div>

            <div className="trace-line" aria-label="Sequence of recorded decisions">
              {records.map((record, index) => (
                <div key={record.trial + "-" + record.choice}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <i />
                  <b>{record.choice.toUpperCase()}</b>
                </div>
              ))}
            </div>

            <div className="result-grid">
              <article className="result-card featured">
                <span>ENTRY</span>
                <strong>{first === "unknown" ? "UNCERTAINTY FIRST" : "DEFINITION FIRST"}</strong>
                <p>{first === "unknown" ? "You entered before the destination was explained." : "You used the available label to orient yourself."}</p>
              </article>
              <article className="result-card">
                <span>CONTEXT</span>
                <strong>{information === "more" ? "GATHER" : "PROCEED"}</strong>
                <p>{information === "more" ? "More context felt worth the extra step." : "Incomplete information did not stop the decision."}</p>
              </article>
              <article className="result-card">
                <span>PACE</span>
                <strong>{pace === "wait" ? "RECEPTIVE" : "SELF-DIRECTED"}</strong>
                <p>{pace === "wait" ? "You gave the signal time to arrive." : "You continued without waiting for a signal."}</p>
              </article>
              <article className="result-card">
                <span>PROJECTION</span>
                <strong>{object === "key" ? "ACCESS" : object === "compass" ? "DIRECTION" : "AUTHORSHIP"}</strong>
                <p>You assigned possibility to an object whose purpose was never stated.</p>
              </article>
            </div>

            <div className="result-stats">
              <div><span>AVERAGE DECISION</span><b>{(averageTime / 1000).toFixed(1)}s</b></div>
              <div><span>PATH CHANGES</span><b>{switches}</b></div>
              <div><span>POINTER MOVEMENT</span><b>{movementLabel}</b></div>
              <div><span>DATA TRANSMITTED</span><b>NONE</b></div>
            </div>

            <div className="result-actions">
              <button className="primary-button" onClick={begin}>RUN AGAIN <span>↻</span></button>
              <button className="text-button" onClick={copySummary}>{copied ? "TRACE COPIED ✓" : "COPY MY TRACE"}</button>
            </div>
            <p className="result-disclaimer">This experience is an interactive artwork, not a validated psychological assessment. Its interpretations are intentionally provisional.</p>
          </div>
        )}
      </section>

      <div className="reveal-feed" aria-hidden="true">
        <p>OBSERVATION DOES NOT BEGIN WHEN YOU CLICK.</p>
        <p>HESITATION IS ALSO A SIGNAL.</p>
        <p>THE INTERFACE CHANGES WHEN IT KNOWS YOU NOTICED.</p>
      </div>

      <footer className="lab-footer">
        <span>AN EXPERIMENT ABOUT UNCERTAINTY, ATTENTION & CONTROL</span>
        <span>LOCAL SESSION / NOTHING SAVED</span>
      </footer>
    </main>
  );
}
