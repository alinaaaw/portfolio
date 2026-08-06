"use client";

import { useState } from "react";
import Link from "next/link";
import V2Nav from "../_components/V2Nav";

export default function AwayPage() {
  const [planB, setPlanB] = useState(false);

  return (
    <main className="inner-shell routes-shell">
      <V2Nav active="away" label="CLUBHOUSE EXIT / ROUTE BOARD" />

      <section className="inner-hero routes-hero">
        <p className="inner-kicker">OUTSIDE THE CLUBHOUSE / DEPARTURES</p>
        <h1>The route is pinned.<br />The gate is<br /><em>still open.</em></h1>
        <div className="hero-aside">
          <span>NEXT DEPARTURE / 08:10</span>
          <p>
            Plan A is clipped to the board. Plan B is already folded underneath.
            A blank block in the afternoon has been protected from scheduling.
          </p>
        </div>
        <div className="route-signpost" aria-hidden="true"><i /><span>RANGE</span><span>STATION</span></div>
      </section>

      <section className="route-lab content-section">
        <header className="section-heading">
          <span>01 / PINNED BEFORE DEPARTURE</span>
          <h2>Detailed enough to leave.<br />Loose enough to change.</h2>
        </header>
        <div className={`route-board timber-route-board ${planB ? "is-plan-b" : ""}`}>
          <div className="route-board-head">
            <div><span>ROUTE MODE</span><strong>{planB ? "PLAN B / RECALCULATED" : "PLAN A / READY"}</strong></div>
            <button onClick={() => setPlanB((value) => !value)}>{planB ? "RESTORE PLAN A" : "WEATHER CHANGED"}</button>
          </div>
          <div className="route-map">
            <div className="route-city" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
            <span className="route-point point-one"><b>08:10</b>DEPART</span>
            <span className="route-point point-two"><b>{planB ? "11:20" : "10:40"}</b>{planB ? "NEW STREET" : "FIRST STOP"}</span>
            <span className="route-point point-three"><b>{planB ? "15:00" : "14:30"}</b>{planB ? "LATE LUNCH" : "WANDER"}</span>
            <span className="route-point point-four"><b>OPEN</b>{planB ? "BETTER VIEW" : "MARGIN"}</span>
            <i className="route-drawn route-drawn-a" /><i className="route-drawn route-drawn-b" /><i className="route-drawn route-drawn-c" />
          </div>
          <footer><span>{planB ? "NEW INFORMATION RECEIVED / ROUTE STILL GOOD" : "PRIMARY ROUTE / BACKUP FOLDED BEHIND"}</span><strong>{planB ? "+ 1 UNPLANNED STORY" : "38 MIN MARGIN"}</strong></footer>
        </div>
      </section>

      <section className="departure-shelf content-section">
        <header className="section-heading light-heading">
          <span>02 / PACKED BY THE DOOR</span>
          <h2>The bag explains<br />the rest of the day.</h2>
        </header>
        <div className="packed-objects">
          <article className="packed-shoes"><i aria-hidden="true" /><span>09:00 / MOVE</span><strong>Training shoes</strong><small>A clean beginning before the route gets crowded.</small></article>
          <article className="packed-book"><i aria-hidden="true" /><span>11:30 / READ</span><strong>Book + pencil</strong><small>One sentence marked. Two questions added.</small></article>
          <article className="packed-game"><i aria-hidden="true" /><span>15:00 / PLAY</span><strong>Five possible endings</strong><small>The obvious choice has already been crossed out.</small></article>
          <article className="packed-blank"><i aria-hidden="true" /><span>19:20 / RESERVED</span><strong>Nothing scheduled</strong><small>Sofa, film, street, or a better suggestion.</small></article>
        </div>
      </section>

      <section className="return-board content-section">
        <div className="return-stamp">72<span>HRS</span></div>
        <div>
          <span>RETURN LOG / FOUND IN A JACKET POCKET</span>
          <h2>The plan came back<br />with pencil marks.</h2>
          <p>One stop moved. Lunch was late. The blank block disappeared into an unfamiliar street. Plan B is now annotated and worth keeping.</p>
        </div>
        <blockquote>“The route worked. Just not for the reason written on the first page.”</blockquote>
      </section>

      <footer className="inner-next routes-next">
        <span>RANGE OPEN / ANOTHER TARGET WAITING</span>
        <Link href="/">Return to the outdoor range <b>↗</b></Link>
      </footer>
    </main>
  );
}
