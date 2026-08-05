"use client";

import { useState } from "react";
import V2Nav from "../_components/V2Nav";

const notes = [
  { id: "confidence", type: "OBSERVATION", date: "OPEN QUESTION / 01", title: "Confidence should arrive after understanding.", body: "I particularly dislike certainty that has not earned itself. My instinct is to research first, collect enough context, and only then ask or decide. I am learning that carefulness can be useful without turning into endless hesitation." },
  { id: "human", type: "INTERACTION", date: "OPEN QUESTION / 02", title: "What makes an interface feel human without pretending it is a person?", body: "Code can support communication, but it cannot replace the complexity of being with another human. I am interested in interactions that leave room for ambiguity, emotion, and a visitor's own pace." },
  { id: "focus", type: "PERSONAL TRACE", date: "OPEN QUESTION / 03", title: "A target directs attention. It does not guarantee the answer.", body: "I used to practice laser shooting and now practice archery. The visible target is only one part of it. The pause, the posture, the release, and the willingness to adjust are part of the shot too." },
  { id: "motion", type: "LEARNING", date: "OPEN QUESTION / 04", title: "How do I keep planning from becoming friction?", body: "I want more internal drive and less overthinking. I am better at this than before. A useful next step is often not a perfect plan; it is a plan with enough evidence, a margin, and permission to recalculate." },
] as const;

export default function NotesPage() {
  const [active, setActive] = useState(0);
  const note = notes[active];

  return (
    <main className="inner-shell notes-shell">
      <V2Nav active="notes" label="THOUGHT TRACES" />
      <section className="inner-hero notes-hero">
        <p className="inner-kicker">NOTES / CURATED, NOT A DIARY</p>
        <h1>Thoughts with<br />the pencil marks<br /><em>left in.</em></h1>
        <div className="hero-aside">
          <span>WHY NOTES?</span>
          <p>
            A polished introduction hides the route that produced it. These are
            selected traces—not raw private thoughts, but questions that show
            how my mind moves while an answer is still forming.
          </p>
        </div>
      </section>

      <section className="notes-desk content-section">
        <div className="note-index" role="tablist" aria-label="Select a thought trace">
          {notes.map((item, index) => (
            <button key={item.id} role="tab" aria-selected={active === index} className={active === index ? "is-active" : ""} onClick={() => setActive(index)}>
              <span>0{index + 1}</span><strong>{item.type}</strong><small>{item.title}</small>
            </button>
          ))}
        </div>
        <article className="active-note" aria-live="polite">
          <div className="note-pin" aria-hidden="true" />
          <span>{note.date}</span>
          <h2>{note.title}</h2>
          <p>{note.body}</p>
          <footer><span>STATUS / STILL THINKING</span><i>AW</i></footer>
        </article>
      </section>

      <section className="current-shelf content-section">
        <header className="section-heading light-heading">
          <span>CURRENT SHELF / SUBJECT TO CHANGE</span>
          <h2>Things pulling at<br />my attention now.</h2>
        </header>
        <div className="shelf-grid">
          <article><span>LEARNING</span><h3>Human-computer interaction</h3><p>How can a system be clear without flattening the person using it?</p></article>
          <article><span>PLAYING</span><h3>Choice-driven stories</h3><p>I like gathering clues, testing paths, and finding a route that reaches the ending.</p></article>
          <article><span>PRACTICING</span><h3>Archery</h3><p>Focus, correction, and the small silence before an irreversible release.</p></article>
          <article><span>WORKING ON</span><h3>Less internal friction</h3><p>More momentum, fewer loops, and a better relationship with imperfect next steps.</p></article>
        </div>
      </section>

      <footer className="inner-next">
        <span>NEXT SIGNAL</span>
        <a href="/away">Leave the screen for a while <b>→</b></a>
      </footer>
    </main>
  );
}
