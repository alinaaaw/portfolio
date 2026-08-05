"use client";

import { useState } from "react";
import V2Nav from "../_components/V2Nav";

export default function AwayPage() {
  const [planB, setPlanB] = useState(false);

  return (
    <main className="inner-shell away-shell">
      <V2Nav active="away" label="AWAY / OPEN ROUTE" />
      <section className="inner-hero away-hero">
        <p className="inner-kicker">LIFE OUTSIDE THE SCREEN / TRAVEL</p>
        <h1>Plan the route.<br />Keep a door open<br /><em>for surprise.</em></h1>
        <div className="hero-aside">
          <span>WHY I LEAVE</span>
          <p>
            Travel lets me enter an unfamiliar environment and experience a
            different version of daily life. Going with friends is even better:
            a new street, a shared plan, and usually a lot of laughter.
          </p>
        </div>
      </section>

      <section className="route-lab content-section">
        <header className="section-heading">
          <span>01 / A TYPICAL PLAN</span>
          <h2>Detailed enough to move.<br />Flexible enough to survive.</h2>
        </header>
        <div className={`route-board ${planB ? "is-plan-b" : ""}`}>
          <div className="route-board-head">
            <div><span>ROUTE MODE</span><strong>{planB ? "PLAN B / RECALCULATED" : "PLAN A / READY"}</strong></div>
            <button onClick={() => setPlanB((value) => !value)}>{planB ? "RESTORE PLAN A" : "DISRUPT THE PLAN"}</button>
          </div>
          <div className="route-map">
            <div className="route-city" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
            <span className="route-point point-one"><b>08:10</b>DEPART</span>
            <span className="route-point point-two"><b>{planB ? "11:20" : "10:40"}</b>{planB ? "NEW STREET" : "FIRST STOP"}</span>
            <span className="route-point point-three"><b>{planB ? "15:00" : "14:30"}</b>{planB ? "LATE LUNCH" : "WANDER"}</span>
            <span className="route-point point-four"><b>OPEN</b>{planB ? "BETTER VIEW" : "MARGIN"}</span>
            <i className="route-drawn route-drawn-a" /><i className="route-drawn route-drawn-b" /><i className="route-drawn route-drawn-c" />
          </div>
          <footer><span>{planB ? "NEW INFORMATION RECEIVED / ROUTE STILL GOOD" : "PRIMARY ROUTE / BACKUP OPTIONS SAVED"}</span><strong>{planB ? "+ 1 UNPLANNED STORY" : "38 MIN MARGIN"}</strong></footer>
        </div>
      </section>

      <section className="travel-philosophy content-section">
        <div className="travel-number">72<span>HRS</span></div>
        <div>
          <span>02 / SPECIAL-FORCES TOURISM, WITH MARGINS</span>
          <h2>I can fit a lot into a trip.</h2>
          <p>I plan closely, move quickly, and still protect enough time to rest or change direction. If something breaks, I immediately collect the new information and rebuild the best route from the present moment.</p>
        </div>
        <blockquote>“The plan is a tool for entering the unknown—not a reason to avoid it.”</blockquote>
      </section>

      <section className="ordinary-day content-section">
        <header className="section-heading light-heading">
          <span>03 / AN IDEAL ORDINARY DAY</span>
          <h2>Not every good route<br />needs a destination.</h2>
        </header>
        <div className="day-timeline">
          <article><time>09:00</time><strong>MOVE</strong><span>Gym, energy, a clean beginning.</span></article>
          <article><time>11:30</time><strong>READ</strong><span>A book and a thought worth keeping.</span></article>
          <article><time>15:00</time><strong>PLAY</strong><span>A game with choices, clues, and another route to test.</span></article>
          <article><time>19:20</time><strong>PAUSE</strong><span>A sofa, a film, and no optimization required.</span></article>
          <article><time>21:10</time><strong>WANDER</strong><span>Go outside. See what the street is doing.</span></article>
        </div>
      </section>

      <footer className="inner-next">
        <span>FIELD COMPLETE / FOR NOW</span>
        <a href="/">Return to the Focus Field <b>↗</b></a>
      </footer>
    </main>
  );
}
