"use client";

import { useRef, useState } from "react";

type ProjectId = "web" | "algorithm" | "hardware";
type ExperimentStep = "intro" | "first" | "second" | "result";

const projects: Record<ProjectId, {
  number: string;
  category: string;
  title: string;
  summary: string;
  question: string;
  role: string;
  status: string;
  className: string;
}> = {
  web: {
    number: "01",
    category: "WEB / PRODUCT THINKING",
    title: "Small tools for real decisions.",
    summary: "I like turning a fuzzy everyday problem into a clear, useful interface—then watching where people still hesitate.",
    question: "How little interface is enough to help someone move?",
    role: "DESIGN + DEVELOPMENT",
    status: "ITERATING",
    className: "project-coral",
  },
  algorithm: {
    number: "02",
    category: "ALGORITHMS / REASONING",
    title: "Finding a path without pretending it was obvious.",
    summary: "Search becomes interesting when the first route fails. I build visual studies that make the reasoning, trade-offs, and recalculation visible.",
    question: "What does the system do after its best guess is wrong?",
    role: "RESEARCH + CODE",
    status: "PROTOTYPE",
    className: "project-blue",
  },
  hardware: {
    number: "03",
    category: "HARDWARE / PHYSICAL SYSTEMS",
    title: "When code has to touch the real world.",
    summary: "Sensors, boards, and physical feedback make assumptions impossible to hide. I enjoy the moment software becomes something you can hold.",
    question: "Can a physical response make invisible data easier to understand?",
    role: "BUILD + TEST",
    status: "BENCH NOTES",
    className: "project-yellow",
  },
};

const firstChoices = {
  map: { label: "A MAP", note: "You orient yourself through structure." },
  people: { label: "THE PEOPLE", note: "You orient yourself through human signals." },
  corner: { label: "A QUIET CORNER", note: "You orient yourself by finding space to observe." },
} as const;

const secondChoices = {
  plan: { label: "MAKE A PLAN", note: "You prefer a shared frame before momentum." },
  prototype: { label: "TRY SOMETHING SMALL", note: "You prefer evidence before a perfect frame." },
} as const;

export default function Home() {
  const [selectedProject, setSelectedProject] = useState<ProjectId>("web");
  const [experimentStep, setExperimentStep] = useState<ExperimentStep>("intro");
  const [firstChoice, setFirstChoice] = useState<keyof typeof firstChoices | null>(null);
  const [secondChoice, setSecondChoice] = useState<keyof typeof secondChoices | null>(null);
  const [decisionTime, setDecisionTime] = useState(0);
  const experimentStarted = useRef(0);
  const activeProject = projects[selectedProject];

  const startExperiment = () => {
    setFirstChoice(null);
    setSecondChoice(null);
    setDecisionTime(0);
    experimentStarted.current = performance.now();
    setExperimentStep("first");
  };

  const chooseFirst = (choice: keyof typeof firstChoices) => {
    setFirstChoice(choice);
    setDecisionTime(performance.now() - experimentStarted.current);
    setExperimentStep("second");
  };

  const chooseSecond = (choice: keyof typeof secondChoices) => {
    setSecondChoice(choice);
    setExperimentStep("result");
  };

  return (
    <main>
      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="Back to the top">
          ALINA.WU <span>/ PERSONAL FIELD NOTES</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#about">ABOUT</a>
          <a href="#work">WORK</a>
          <a href="#experiment">A SMALL EXPERIMENT</a>
        </nav>
        <a className="say-hi" href="mailto:hello@example.com">SAY HI ↗</a>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span /> COMPUTER SCIENCE · HUMAN CURIOSITY</p>
          <h1>
            Hi, I&apos;m Alina.
            <br />
            I build with <em>code</em>
            <br />
            and stay curious
            <br />
            about <i>people.</i>
          </h1>
          <p className="hero-intro">
            I make small websites, study algorithms, and connect software to physical things.
            Psychology keeps me asking what happens on the human side of every system.
          </p>
          <div className="hero-actions">
            <a className="primary-action" href="#work">SEE WHAT I&apos;M MAKING <span>↓</span></a>
            <a className="quiet-action" href="#about">A little more about me →</a>
          </div>
        </div>

        <div className="portrait-board" aria-label="A visual introduction to Alina">
          <div className="paper-shadow paper-one" aria-hidden="true" />
          <div className="paper-shadow paper-two" aria-hidden="true" />
          <div className="hello-card">
            <span className="tape" aria-hidden="true" />
            <div className="sun-stamp" aria-hidden="true"><i /><i /><i /><i /></div>
            <p>HELLO FROM MY DESK</p>
            <strong>Thoughtful systems.<br />Unfinished questions.<br />A very detailed Plan B.</strong>
            <small>SHANGHAI · CURRENTLY LEARNING</small>
          </div>
          <span className="orbit-tag tag-code">CODE</span>
          <span className="orbit-tag tag-psych">PSYCHOLOGY</span>
          <span className="orbit-tag tag-archery">ARCHERY</span>
          <div className="question-card">
            <span>TODAY&apos;S QUESTION</span>
            <p>Can an interface feel warm without pretending to be human?</p>
          </div>
          <span className="scribble-note">still testing →</span>
        </div>
      </section>

      <section className="now-strip" aria-label="Current status">
        <span>RIGHT NOW</span>
        <p>Building useful little things · learning how attention works · planning the next trip</p>
        <i>AVAILABLE FOR A GOOD CONVERSATION</i>
      </section>

      <section className="about-section" id="about">
        <div className="section-index">01</div>
        <div className="about-heading">
          <p className="eyebrow">A WORKING PROFILE</p>
          <h2>I like clear systems.<br />People are wonderfully<br /><em>less clear.</em></h2>
        </div>
        <div className="about-copy">
          <p>
            Computer science taught me to break a problem into parts. Psychology taught me
            to be careful about assuming those parts explain the whole person.
          </p>
          <p>
            That tension is where I like to work: between logic and lived experience,
            between the plan and what actually happens.
          </p>
          <div className="about-margin-note">
            <span>NOTE TO SELF</span>
            Research first. Ask people next. Stay ready to be wrong.
          </div>
        </div>
      </section>

      <section className="work-section" id="work">
        <div className="section-heading">
          <div>
            <p className="eyebrow">02 / SELECTED WORK</p>
            <h2>Things I make to<br />understand things better.</h2>
          </div>
          <p className="section-note">Choose a project card. The details will meet you on the right.</p>
        </div>

        <div className="project-workspace">
          <div className="project-list" role="tablist" aria-label="Project areas">
            {(Object.keys(projects) as ProjectId[]).map((id) => {
              const project = projects[id];
              return (
                <button
                  className={"project-tab " + project.className + (selectedProject === id ? " active" : "")}
                  key={id}
                  role="tab"
                  aria-selected={selectedProject === id}
                  onClick={() => setSelectedProject(id)}
                >
                  <span>{project.number}</span>
                  <div><small>{project.category}</small><strong>{project.title}</strong></div>
                  <i>{selectedProject === id ? "OPEN" : "VIEW"} ↗</i>
                </button>
              );
            })}
          </div>

          <article className={"project-detail " + activeProject.className} aria-live="polite">
            <div className="detail-top">
              <span>{activeProject.number} / PROJECT NOTE</span>
              <i>{activeProject.status}</i>
            </div>
            <h3>{activeProject.title}</h3>
            <p>{activeProject.summary}</p>
            <blockquote>
              <span>THE QUESTION BEHIND IT</span>
              {activeProject.question}
            </blockquote>
            <dl>
              <div><dt>MY PART</dt><dd>{activeProject.role}</dd></div>
              <div><dt>CURRENT STATE</dt><dd>{activeProject.status}</dd></div>
            </dl>
          </article>
        </div>
      </section>

      <section className="life-section">
        <div className="life-intro">
          <p className="eyebrow">03 / AWAY FROM THE KEYBOARD</p>
          <h2>The rest of the picture.</h2>
          <p>Not everything needs to become a project. Some things simply change how I notice.</p>
        </div>
        <div className="life-cards">
          <article className="life-card travel-card">
            <span>TRAVEL / FIELD NOTES</span>
            <strong>I plan the route carefully—then leave room for a different day to happen.</strong>
            <small>BACKUP ROUTE: ALWAYS PRESENT</small>
          </article>
          <article className="life-card archery-card">
            <div className="target-mark" aria-hidden="true"><i /><i /><i /></div>
            <span>ARCHERY / PRACTICE</span>
            <strong>Focus is less about holding still and more about returning.</strong>
            <small>ONE ARROW · THEN ANOTHER</small>
          </article>
          <article className="life-card people-card">
            <span>PSYCHOLOGY / CURIOSITY</span>
            <strong>Why did that feel easy to one person and impossible to another?</strong>
            <small>CONCLUSION: NOT YET</small>
          </article>
        </div>
      </section>

      <section className="experiment-section" id="experiment">
        <div className="experiment-intro">
          <p className="eyebrow">04 / A SMALL EXPERIMENT</p>
          <h2>Let me learn one tiny thing about how you explore.</h2>
          <p>
            Two choices, about twenty seconds. This is a playful observation—not a test,
            score, or diagnosis. Nothing is saved.
          </p>
        </div>

        <div className={"experiment-card step-" + experimentStep} aria-live="polite">
          {experimentStep === "intro" && (
            <div className="experiment-welcome">
              <span className="experiment-number">20<small>SEC</small></span>
              <div>
                <p>READY WHEN YOU ARE</p>
                <h3>There is no correct way to begin.</h3>
                <button onClick={startExperiment}>START THE SMALL EXPERIMENT <span>→</span></button>
              </div>
            </div>
          )}

          {experimentStep === "first" && (
            <div className="question-step">
              <div className="experiment-progress"><span>01 / 02</span><i><b /></i></div>
              <h3>When you arrive somewhere new, what do you look for first?</h3>
              <div className="warm-choices three">
                {(Object.keys(firstChoices) as (keyof typeof firstChoices)[]).map((id) => (
                  <button key={id} onClick={() => chooseFirst(id)}>
                    <span>{id === "map" ? "⌖" : id === "people" ? "☺" : "◡"}</span>
                    <strong>{firstChoices[id].label}</strong>
                  </button>
                ))}
              </div>
            </div>
          )}

          {experimentStep === "second" && firstChoice && (
            <div className="question-step">
              <div className="experiment-progress"><span>02 / 02</span><i><b /></i></div>
              <p className="first-observation">{firstChoices[firstChoice].note}</p>
              <h3>And when an idea is still unclear, how do you prefer to begin?</h3>
              <div className="warm-choices">
                {(Object.keys(secondChoices) as (keyof typeof secondChoices)[]).map((id) => (
                  <button key={id} onClick={() => chooseSecond(id)}>
                    <span>{id === "plan" ? "≡" : "✦"}</span>
                    <strong>{secondChoices[id].label}</strong>
                  </button>
                ))}
              </div>
            </div>
          )}

          {experimentStep === "result" && firstChoice && secondChoice && (
            <div className="experiment-result">
              <div>
                <p>YOUR LITTLE TRACE</p>
                <h3>You entered through <em>{firstChoices[firstChoice].label.toLowerCase()}</em>, then chose to <em>{secondChoices[secondChoice].label.toLowerCase()}</em>.</h3>
                <p className="result-copy">
                  {firstChoices[firstChoice].note} {secondChoices[secondChoice].note}
                  That is a description of two moments—not a definition of you.
                </p>
              </div>
              <aside>
                <span>FIRST DECISION</span>
                <strong>{(decisionTime / 1000).toFixed(1)}s</strong>
                <small>RECORDED HERE · SAVED NOWHERE</small>
              </aside>
              <button className="restart-button" onClick={startExperiment}>TRY A DIFFERENT PATH ↻</button>
            </div>
          )}
        </div>
      </section>

      <footer id="contact">
        <div>
          <p className="eyebrow">ONE MORE THING</p>
          <h2>If something here made you curious,<br /><em>come say hello.</em></h2>
        </div>
        <div className="footer-links">
          <a href="mailto:hello@example.com">EMAIL ME <span>↗</span></a>
          <a href="https://github.com/alinaaaw" target="_blank" rel="noreferrer">GITHUB <span>↗</span></a>
          <a href="#top">BACK TO TOP <span>↑</span></a>
        </div>
        <p className="footer-note">BUILT WITH CODE, QUESTIONS, AND A FAIRLY DETAILED PLAN B.</p>
      </footer>
    </main>
  );
}
