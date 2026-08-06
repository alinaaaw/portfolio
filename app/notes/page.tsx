"use client";

import { useState, type CSSProperties } from "react";
import V2Nav from "../_components/V2Nav";
import InteractiveModel from "../_components/three/InteractiveModel";

const targets = [
  { id: "confidence", drawer: "A-01", type: "OBSERVATION", title: "Confidence should arrive after understanding.", body: "I particularly dislike certainty that has not earned itself. My instinct is to research first, collect enough context, and only then ask or decide. I am learning that carefulness can be useful without turning into endless hesitation.", annotation: "Do not confuse a clean grouping with complete information.", hit: [44, 38] },
  { id: "human", drawer: "A-02", type: "INTERACTION", title: "What makes an interface feel human without pretending it is a person?", body: "Code can support communication, but it cannot replace the complexity of being with another human. I am interested in interactions that leave room for ambiguity, emotion, and a visitor’s own pace.", annotation: "The user paused here. The metric did not explain why.", hit: [58, 47] },
  { id: "focus", drawer: "B-01", type: "RANGE NOTE", title: "A visible target is only one part of the shot.", body: "The pause, posture, release, and willingness to adjust belong to the result too. A center hit without a repeatable process is interesting evidence, not a conclusion.", annotation: "Two clicks left. Reset shoulders. Repeat Friday.", hit: [51, 52] },
  { id: "motion", drawer: "B-02", type: "OPEN QUESTION", title: "How do I keep planning from becoming friction?", body: "A useful next step is often not a perfect plan. It is a plan with enough evidence, a margin, and permission to recalculate once reality contributes new information.", annotation: "Movement is allowed before certainty.", hit: [63, 41] },
] as const;

export default function NotesPage() {
  const [active, setActive] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const target = targets[active];

  const selectTarget = (index: number) => {
    setActive(index);
    setFlipped(false);
  };

  return (
    <main className="inner-shell archive-shell">
      <V2Nav active="notes" label="TARGET ARCHIVE / CABINET B" />

      <section className="inner-hero archive-hero has-3d-hero">
        <p className="inner-kicker">TARGET ARCHIVE / USED PAPER KEPT</p>
        <h1>The reverse side<br />usually says<br /><em>more.</em></h1>
        <div className="hero-aside">
          <span>ARCHIVE RULE / DO NOT CLEAN THE EVIDENCE</span>
          <p>
            The holes stay visible. So do the corrections, crossed-out answers,
            and questions that have not earned a conclusion yet.
          </p>
        </div>
        <InteractiveModel kind="archive" className="hero-3d-model" activeIndex={active} onSelect={selectTarget} title="CABINET B" hint="MOVE TO INSPECT · CLICK A DRAWER" />
      </section>

      <section className="target-cabinet content-section" id="cabinet">
        <header className="section-heading">
          <span>CABINET B / FOUR TARGETS</span>
          <h2>Select a sheet.<br />Turn it over.</h2>
        </header>

        <div className="target-archive">
          <div className="archive-model-panel">
            <InteractiveModel kind="archive" activeIndex={active} onSelect={selectTarget} title="TARGET DRAWERS" hint="THE SELECTED DRAWER PULLS FORWARD" />
            <div className="target-drawers" role="tablist" aria-label="Archived thought targets">
              {targets.map((item, index) => (
                <button key={item.id} role="tab" aria-selected={active === index} className={active === index ? "is-active" : ""} onClick={() => selectTarget(index)}>
                  <span className="drawer-target" style={{ "--hit-x": `${item.hit[0]}%`, "--hit-y": `${item.hit[1]}%` } as CSSProperties}><i /></span>
                  <b>{item.drawer}</b>
                  <strong>{item.type}</strong>
                </button>
              ))}
            </div>
          </div>

          <div className={`archived-target ${flipped ? "is-flipped" : ""}`}>
            <div className="target-sheet target-front">
              <header><span>RANGE / {target.drawer}</span><i>{target.type}</i></header>
              <div className="paper-target" style={{ "--hit-x": `${target.hit[0]}%`, "--hit-y": `${target.hit[1]}%` } as CSSProperties}>
                <i className="paper-ring ring-a" /><i className="paper-ring ring-b" /><i className="paper-ring ring-c" /><i className="paper-hit" />
              </div>
              <p>{target.annotation}</p>
              <button onClick={() => setFlipped(true)}>TURN TARGET OVER →</button>
            </div>
            <article className="target-sheet target-back" aria-live="polite">
              <header><span>REVERSE / PENCIL NOTES</span><i>STILL THINKING</i></header>
              <h2>{target.title}</h2>
              <p>{target.body}</p>
              <blockquote>{target.annotation}</blockquote>
              <button onClick={() => setFlipped(false)}>← VIEW IMPACT SIDE</button>
            </article>
          </div>
        </div>
      </section>

      <section className="archive-shelf content-section">
        <header className="section-heading light-heading">
          <span>UNFILED / CURRENTLY IN USE</span>
          <h2>Four labels waiting<br />for more evidence.</h2>
        </header>
        <div className="shelf-tags">
          <article><span>LEARNING</span><strong>Human-computer interaction</strong><small>How much clarity is useful before it becomes flattening?</small></article>
          <article><span>PLAYING</span><strong>Choice-driven stories</strong><small>Route six survives. Route four looked more confident.</small></article>
          <article><span>PRACTICING</span><strong>Archery</strong><small>Same distance. New correction. Try again.</small></article>
          <article><span>WORKING ON</span><strong>Less internal friction</strong><small>The next imperfect step is marked in lime.</small></article>
        </div>
      </section>

      <footer className="inner-next archive-next">
        <span>CLUBHOUSE DOOR / ROUTE BOARD OUTSIDE</span>
        <a href="/away">See where the next route goes <b>→</b></a>
      </footer>
    </main>
  );
}
