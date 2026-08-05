"use client";

import { useEffect, useState } from "react";
import V2Nav from "../_components/V2Nav";

const projects = {
  web: {
    index: "01—WEB",
    title: "Small websites that remove a real annoyance.",
    kind: "A COLLECTION OF WEB PROJECTS",
    thought: "The interface is not decoration. It is the part where the solution meets another person.",
    steps: ["Notice a repeated decision or friction", "Reduce it to the useful core", "Build a small working answer", "Watch where a person hesitates"],
    color: "blue",
  },
  algorithm: {
    index: "02—ALGORITHM",
    title: "A path through incomplete information.",
    kind: "ALGORITHM PROJECT / CASE STUDY",
    thought: "I enjoy the search: gather evidence, test a route, learn from failure, and keep the reasoning visible.",
    steps: ["Define what success actually means", "Map states and constraints", "Test more than one route", "Explain why the final route holds"],
    color: "orange",
  },
  hardware: {
    index: "03—HARDWARE",
    title: "Code that has to survive the physical world.",
    kind: "HARDWARE PROJECT / PROTOTYPE",
    thought: "Hardware makes an idea honest. Timing, signals, noise, and physical limits all get a vote.",
    steps: ["Translate intent into signals", "Prototype the smallest loop", "Observe the real response", "Debug across code and hardware"],
    color: "mint",
  },
} as const;

type ProjectKey = keyof typeof projects;

export default function ProjectsPage() {
  const [active, setActive] = useState<ProjectKey>("web");
  const project = projects[active];

  useEffect(() => {
    const requested = window.location.hash.slice(1) as ProjectKey;
    if (requested in projects) setActive(requested);
  }, []);

  const selectProject = (key: ProjectKey) => {
    setActive(key);
    window.history.replaceState(null, "", `#${key}`);
  };

  return (
    <main className="inner-shell projects-shell">
      <V2Nav active="projects" label="PROJECT OBSERVATORY" />

      <section className="inner-hero projects-hero">
        <p className="inner-kicker">WORK / THREE WAYS OF MAKING</p>
        <h1>Problems become<br />interesting when<br /><em>they can move.</em></h1>
        <div className="hero-aside">
          <span>MY WORK IS STILL GROWING.</span>
          <p>
            I have small website projects, an algorithm project, and a hardware
            project. This space focuses on how I think through them—not inflated
            claims or a wall of technology logos.
          </p>
        </div>
      </section>

      <section className="project-observatory content-section" id={active}>
        <div className="project-selector" role="tablist" aria-label="Project areas">
          {(Object.keys(projects) as ProjectKey[]).map((key) => (
            <button key={key} role="tab" aria-selected={active === key} className={active === key ? "is-active" : ""} onClick={() => selectProject(key)}>
              <span>{projects[key].index}</span>
              <strong>{key}</strong>
            </button>
          ))}
        </div>

        <article className={`project-stage stage-${project.color}`} aria-live="polite">
          <div className="project-radar" aria-hidden="true">
            <i className="radar-ring radar-one" /><i className="radar-ring radar-two" /><i className="radar-ring radar-three" />
            <span>{active === "web" ? "www" : active === "algorithm" ? "PATH" : "MCU"}</span>
          </div>
          <div className="project-story">
            <span>{project.kind}</span>
            <h2>{project.title}</h2>
            <blockquote>{project.thought}</blockquote>
          </div>
          <ol className="project-method">
            {project.steps.map((step, index) => <li key={step}><span>0{index + 1}</span>{step}</li>)}
          </ol>
          <div className="project-honesty">
            <span>DETAILS STATUS</span>
            <p>Project names, screenshots, repositories, and outcomes will be added when each case study is ready. No invented metrics.</p>
          </div>
        </article>
      </section>

      <section className="build-principles content-section">
        <header className="section-heading light-heading">
          <span>04 / WHAT STAYS CONSTANT</span>
          <h2>Useful. Explainable.<br />Open to revision.</h2>
        </header>
        <div className="principle-grid">
          <article><span>USEFUL</span><h3>Start with the friction.</h3><p>A clever solution is not enough if it does not help someone move forward.</p></article>
          <article><span>EXPLAINABLE</span><h3>Show the reasoning.</h3><p>I trust a path more when its assumptions and tradeoffs can be inspected.</p></article>
          <article><span>HUMAN</span><h3>Notice the person using it.</h3><p>Behavior, emotion, and context are part of the technical problem.</p></article>
          <article><span>HONEST</span><h3>Confidence follows evidence.</h3><p>I would rather say “still testing” than pretend an unfinished answer is certain.</p></article>
        </div>
      </section>

      <footer className="inner-next">
        <span>NEXT SIGNAL</span>
        <a href="/notes">Read the thought traces <b>→</b></a>
      </footer>
    </main>
  );
}
