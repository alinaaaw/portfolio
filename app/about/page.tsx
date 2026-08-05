"use client";

import { useState } from "react";
import V2Nav from "../_components/V2Nav";

export default function AboutPage() {
  const [distance, setDistance] = useState<"far" | "near">("far");

  return (
    <main className="inner-shell about-shell">
      <V2Nav active="about" label="ABOUT / HUMAN SYSTEM" />

      <section className="inner-hero about-hero">
        <p className="inner-kicker">PERSONAL PROFILE / NOT A SHORT BIO</p>
        <h1>I build systems.<br />I do not mistake<br /><em>people</em> for systems.</h1>
        <div className="hero-aside">
          <span>HELLO, I AM ALINA.</span>
          <p>
            I study computer science because code can turn a problem into a
            working solution. I study people because the parts of life that
            matter most rarely fit inside a clean function.
          </p>
        </div>
        <div className="scroll-cue">SCROLL TO GET CLOSER <i /></div>
      </section>

      <section className="impression-lab content-section">
        <header className="section-heading">
          <span>01 / DISTANCE CHANGES THE READ</span>
          <h2>First impression<br />is incomplete data.</h2>
        </header>
        <div className={`impression-card impression-${distance}`}>
          <div className="impression-controls" role="group" aria-label="Change social distance">
            <button className={distance === "far" ? "is-active" : ""} onClick={() => setDistance("far")}>FROM A DISTANCE</button>
            <button className={distance === "near" ? "is-active" : ""} onClick={() => setDistance("near")}>AFTER A WHILE</button>
          </div>
          <div className="impression-stage">
            <div className="portrait-orbit" aria-hidden="true"><i /><i /><i /><span>AW</span></div>
            <div className="impression-copy" aria-live="polite">
              <span>{distance === "far" ? "INITIAL READ / LOW CONTEXT" : "UPDATED READ / MORE EVIDENCE"}</span>
              <strong>{distance === "far" ? "Serious. Reserved. Maybe a little distant." : "Funny. Energetic. Occasionally delightfully absurd."}</strong>
              <p>
                {distance === "far"
                  ? "I do not always reveal the lively parts of myself immediately. Quiet is easy to misread when there is not enough context."
                  : "With friends, I share ideas, notice how people feel, and laugh easily—sometimes in the middle of the street."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="two-minds content-section">
        <header className="section-heading light-heading">
          <span>02 / THE USEFUL TENSION</span>
          <h2>Logic gives structure.<br />Psychology keeps it human.</h2>
        </header>
        <div className="mind-columns">
          <article>
            <span>COMPUTER SCIENCE</span>
            <h3>Make the problem executable.</h3>
            <p>I like the moment when scattered constraints become a system that can actually help someone do something.</p>
            <ul><li>Break down the problem</li><li>Collect evidence</li><li>Build and test</li><li>Iterate toward useful</li></ul>
          </article>
          <div className="mind-bridge" aria-hidden="true"><span>+</span><i /></div>
          <article>
            <span>PSYCHOLOGY</span>
            <h3>Ask what the model leaves out.</h3>
            <p>I am curious about why people act as they do, how personality forms, and why a technically correct answer can still fail a human being.</p>
            <ul><li>Read the emotional context</li><li>Question easy explanations</li><li>Respect complexity</li><li>Design for actual people</li></ul>
          </article>
        </div>
      </section>

      <section className="decision-protocol content-section">
        <header className="section-heading">
          <span>03 / HOW I MOVE</span>
          <h2>Careful is not the<br />same as motionless.</h2>
        </header>
        <ol className="protocol-track">
          <li><span>01</span><strong>Look first</strong><p>I research before asking. Confidence should arrive after understanding.</p></li>
          <li><span>02</span><strong>Choose a route</strong><p>I gather enough information to make a reasoned decision—then I commit.</p></li>
          <li><span>03</span><strong>Leave margin</strong><p>A detailed plan works better when it includes rest, alternatives, and room for reality.</p></li>
          <li><span>04</span><strong>Recalculate fast</strong><p>When the route breaks, I look again and find the best next move from here.</p></li>
        </ol>
      </section>

      <section className="offscreen content-section">
        <div className="offscreen-title">
          <span>04 / OFF SCREEN</span>
          <h2>There is a life<br />outside the interface.</h2>
          <p>Travel is how I enter an unfamiliar life for a while. The rest is a mix of movement, stories, quiet, and people I can laugh with.</p>
        </div>
        <div className="life-grid">
          <article className="life-travel"><b>TRAVEL</b><span>Detailed plans.<br />Backup routes.<br />Unknown streets.</span></article>
          <article className="life-archery"><b>ARCHERY</b><div className="mini-target"><i /><i /><i /></div><span>The pause before release matters.</span></article>
          <article><b>RESET</b><span>Gym / books / games / films / an unhurried sofa.</span></article>
          <article className="life-friends"><b>WITH FRIENDS</b><span>More energy.<br />More ideas.<br />Much more laughter.</span></article>
        </div>
      </section>

      <footer className="inner-next">
        <span>NEXT SIGNAL</span>
        <a href="/projects">See what I build <b>→</b></a>
      </footer>
    </main>
  );
}
