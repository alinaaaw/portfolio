"use client";

import { useEffect, useState } from "react";
import V2Nav from "../_components/V2Nav";

const workOrders = {
  web: {
    index: "01 / WEB",
    tag: "SMALL SYSTEM / FIT CHECK",
    title: "The handoff caught on one small edge.",
    benchNote: "A repeated annoyance became a small website. The last adjustment was not visual; it removed the moment where a person had to guess what happened next.",
    checks: ["Name the actual friction", "Remove everything that does not help", "Put a working version in someone’s hands", "Mark the hesitation and adjust"],
    part: "grip",
    status: "READY FOR FIELD TEST",
  },
  algorithm: {
    index: "02 / ALGORITHM",
    tag: "ROUTE LOG / SIGHT ADJUSTMENT",
    title: "Three paths failed before this one held.",
    benchNote: "The discarded routes remain in the notebook. A final answer is more useful when the constraints, wrong turns, and reason for choosing it are still visible.",
    checks: ["Define the finish line", "Map states and constraints", "Stress more than one route", "Leave the reasoning inspectable"],
    part: "sight",
    status: "GROUPING CONSISTENT",
  },
  hardware: {
    index: "03 / HARDWARE",
    tag: "PHYSICAL SIGNAL / BENCH TEST",
    title: "The code passed. The signal did not.",
    benchNote: "Voltage, timing, noise, and a loose connection all entered the conversation. The prototype only became honest when the physical response matched the intended one.",
    checks: ["Translate intent into a signal", "Build the smallest closed loop", "Measure the real response", "Debug across both sides of the wire"],
    part: "sensor",
    status: "SIGNAL RECEIVED",
  },
} as const;

type ProjectKey = keyof typeof workOrders;

export default function ProjectsPage() {
  const [active, setActive] = useState<ProjectKey>("web");
  const project = workOrders[active];

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const requested = window.location.hash.slice(1) as ProjectKey;
      if (requested in workOrders) setActive(requested);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const selectProject = (key: ProjectKey) => {
    setActive(key);
    window.history.replaceState(null, "", `#${key}`);
  };

  return (
    <main className="inner-shell workshop-shell">
      <V2Nav active="projects" label="REPAIR SHED / WORK ORDERS" />

      <section className="inner-hero workshop-hero">
        <p className="inner-kicker">REPAIR SHED / LIGHT STILL ON</p>
        <h1>Nothing leaves<br />the bench on<br /><em>confidence alone.</em></h1>
        <div className="hero-aside">
          <span>THREE ITEMS WAITING</span>
          <p>
            Each tag belongs to a different kind of build. Select one to see
            what was checked, what resisted, and what remains unfinished.
          </p>
        </div>
        <div className="shed-lamp" aria-hidden="true"><i /></div>
      </section>

      <section className="repair-floor content-section" id={active}>
        <header className="section-heading">
          <span>WORK ORDER RACK</span>
          <h2>Choose what is<br />on the bench.</h2>
        </header>

        <div className="work-order-rack" role="tablist" aria-label="Project work orders">
          {(Object.keys(workOrders) as ProjectKey[]).map((key) => (
            <button key={key} role="tab" aria-selected={active === key} className={active === key ? "is-active" : ""} onClick={() => selectProject(key)}>
              <span>{workOrders[key].index}</span>
              <strong>{workOrders[key].tag}</strong>
              <i>{workOrders[key].status}</i>
            </button>
          ))}
        </div>

        <article className={`repair-bench bench-${project.part}`} aria-live="polite">
          <div className="bench-object" aria-hidden="true">
            <div className="bow-limb limb-top" /><div className="bow-limb limb-bottom" />
            <div className="bench-string" /><div className="bench-arrow" />
            <span className="part-marker marker-a">A</span><span className="part-marker marker-b">B</span><span className="part-marker marker-c">C</span>
            <i className="measurement-line line-a" /><i className="measurement-line line-b" />
          </div>
          <div className="work-order-copy">
            <span>{project.tag}</span>
            <h2>{project.title}</h2>
            <p>{project.benchNote}</p>
            <ol>
              {project.checks.map((check, index) => <li key={check}><b>0{index + 1}</b><span>{check}</span></li>)}
            </ol>
          </div>
          <footer className="bench-status">
            <div><span>STATUS</span><strong>{project.status}</strong></div>
            <p>Names, repositories, images, and measured outcomes stay blank until the real case material is ready.</p>
          </footer>
        </article>
      </section>

      <section className="repair-wall content-section">
        <header className="section-heading light-heading">
          <span>PINNED ABOVE THE BENCH</span>
          <h2>Four notes that survived<br />more than one project.</h2>
        </header>
        <div className="repair-notes">
          <article><span>01</span><p>Useful begins where the friction actually is.</p></article>
          <article><span>02</span><p>If the reasoning cannot be inspected, the adjustment becomes guesswork.</p></article>
          <article><span>03</span><p>A person pausing is also test output.</p></article>
          <article><span>04</span><p>“Still testing” is a valid status.</p></article>
        </div>
      </section>

      <footer className="inner-next workshop-next">
        <span>USED TARGETS / CABINET B</span>
        <a href="/notes">Open the target archive <b>→</b></a>
      </footer>
    </main>
  );
}
