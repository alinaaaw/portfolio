"use client";

import { useEffect, useState } from "react";
import V2Nav from "../_components/V2Nav";
import InteractiveModel from "../_components/three/InteractiveModel";

const workOrders = {
  web: {
    index: "01 / WEB + FIELD STUDY",
    tag: "QUALITY OF LIFE IN SHANGHAI",
    title: "A neighborhood map built from what residents said they needed.",
    benchNote: "I led a team of eight through questionnaires, interviews, analysis, and implementation. The resulting website lets residents locate nearby facilities inside a walking-distance radius they choose.",
    checks: ["Collected and analyzed 20+ questionnaires and interviews", "Translated community findings into map requirements", "Built the interactive map with HTML, CSS, and JavaScript", "Organized food-safety and anti-fraud publicity campaigns"],
    part: "grip",
    status: "DELIVERED / MAY 2024",
    period: "SEP 2023 - MAY 2024",
    stack: "HTML/CSS · JAVASCRIPT",
    evidence: "Team of 8 · 20+ questionnaires and interviews · custom walking-radius search",
  },
  algorithm: {
    index: "02 / ALLOCATION ALGORITHM",
    tag: "AUTOMATIC AND SATISFACTORY COURSE ASSIGNMENT",
    title: "Satisfaction became an optimization problem with inspectable choices.",
    benchNote: "I researched assignment methods, implemented Simultaneous Eating and Birkhoff Decomposition, then extended the system into a parent-teacher meeting scheduler.",
    checks: ["Evaluated algorithms for satisfaction and allocation efficiency", "Implemented allocation methods in Python and NumPy", "Collected feedback from 30+ professors and peers", "Improved runtime by more than 200%"],
    part: "sight",
    status: "EXTENDED / MAR 2025",
    period: "JAN 2024 - MAR 2025",
    stack: "PYTHON · NUMPY",
    evidence: "30+ reviewers · 200+% runtime improvement · scheduler extension",
  },
  hardware: {
    index: "03 / HARDWARE + SIGNALS",
    tag: "MONITORING DEVICE FOR MUSCLE USAGE & BEHAVIOR",
    title: "Muscle activity moves from the body to an interface.",
    benchNote: "The system combines a designed physical enclosure, multiple Bluetooth-connected EMG devices, ESP32 signal classification, and a mobile interface for post-exercise visualization.",
    checks: ["Designed hardware structures and prototyped 3D models", "Collected and processed multi-device EMG signals", "Built ESP32 classification pipelines with Arduino", "Refined the mobile interface for usability and accessibility"],
    part: "sensor",
    status: "IN DEVELOPMENT",
    period: "JUL 2025 - PRESENT",
    stack: "FUSION · AUTOCAD · ARDUINO · C/C++",
    evidence: "Bluetooth EMG collection · ESP32 classification · mobile visualization",
  },
} as const;

type ProjectKey = keyof typeof workOrders;
const projectKeys = Object.keys(workOrders) as ProjectKey[];

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

      <section className="inner-hero workshop-hero has-3d-hero">
        <p className="inner-kicker">REPAIR SHED / LIGHT STILL ON</p>
        <h1>Nothing leaves<br />the bench on<br /><em>confidence alone.</em></h1>
        <div className="hero-aside">
          <span>THREE PROJECT RECORDS</span>
          <p>
            Each tag belongs to a different kind of build. Select one to see
            what was built, what changed, and what was measured.
          </p>
        </div>
        <InteractiveModel kind="workbench" className="hero-3d-model" activeIndex={projectKeys.indexOf(active)} onSelect={(index) => selectProject(projectKeys[index])} title="REPAIR BENCH" hint="MOVE TO INSPECT · CLICK A PART" />
      </section>

      <section className="repair-floor content-section" id="workbench">
        <header className="section-heading">
          <span>WORK ORDER RACK</span>
          <h2>Choose what is<br />on the bench.</h2>
        </header>

        <div className="work-order-rack" role="tablist" aria-label="Project work orders">
          {projectKeys.map((key) => (
            <button key={key} role="tab" aria-selected={active === key} className={active === key ? "is-active" : ""} onClick={() => selectProject(key)}>
              <span>{workOrders[key].index}</span>
              <strong>{workOrders[key].tag}</strong>
              <i>{workOrders[key].status}</i>
            </button>
          ))}
        </div>

        <article className={`repair-bench bench-${project.part}`} aria-live="polite">
          <InteractiveModel kind="workbench" className="bench-3d-model" activeIndex={projectKeys.indexOf(active)} onSelect={(index) => selectProject(projectKeys[index])} title="LIVE BENCH" hint="SELECT A PART OR WORK ORDER" />
          <div className="work-order-copy">
            <span>{project.tag}</span>
            <h2>{project.title}</h2>
            <p>{project.benchNote}</p>
            <ol>
              {project.checks.map((check, index) => <li key={check}><b>0{index + 1}</b><span>{check}</span></li>)}
            </ol>
          </div>
          <footer className="bench-status">
            <div><span>PERIOD</span><strong>{project.period}</strong></div>
            <div><span>TOOLS</span><strong>{project.stack}</strong></div>
            <p>{project.evidence}</p>
          </footer>
        </article>
      </section>

      <section className="repair-wall content-section">
        <header className="section-heading light-heading">
          <span>PINNED ABOVE THE BENCH</span>
          <h2>Evidence pinned above<br />the workbench.</h2>
        </header>
        <div className="repair-notes">
          <article><span>01 / COMMUNITY</span><p>20+ questionnaires and interviews shaped the Shanghai map.</p></article>
          <article><span>02 / FEEDBACK</span><p>30+ professors and peers helped refine the allocation algorithm.</p></article>
          <article><span>03 / PERFORMANCE</span><p>Algorithm revisions improved runtime by more than 200%.</p></article>
          <article><span>04 / PHYSICAL LOOP</span><p>EMG signals travel through Bluetooth devices, ESP32 classification, and a mobile app.</p></article>
        </div>
      </section>

      <footer className="inner-next workshop-next">
        <span>USED TARGETS / CABINET B</span>
        <a href="/notes">Open the target archive <b>→</b></a>
      </footer>
    </main>
  );
}
