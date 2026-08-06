"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import type { ZoneId } from "./_components/LabGame";

const LabGame = dynamic(() => import("./_components/LabGame"), {
  ssr: false,
  loading: () => <div className="lab-loading"><i /><span>PREPARING LAB 17</span></div>,
});

type ComputerFile = "desktop" | "about" | "projects" | "map" | "allocation" | "emg" | "experience" | "research" | "internship";

const zoneOrder: ZoneId[] = ["computer","drawer","notebook","books","board","fieldcase"];

const zoneInfo: Record<ZoneId,{ index:string; label:string; hint:string; log:string }> = {
  computer: { index:"01",label:"COMPUTER",hint:"OPEN FILE SYSTEM",log:"An active desktop contains projects, experience records, and one bulletin that does not belong." },
  drawer: { index:"02",label:"DESK DRAWER",hint:"INSPECT PROTOTYPE",log:"The drawer contains an EMG prototype, spare components, and labels written before the enclosure existed." },
  notebook: { index:"03",label:"RESEARCH BOOK",hint:"TURN THE PAGE",log:"The research notebook separates observations from conclusions and leaves several conclusions unfinished." },
  books: { index:"04",label:"BOOKSHELF",hint:"PULL A BOOK",log:"The shelf connects algorithms, psychology, and travel—the subjects do not stay in separate categories." },
  board: { index:"05",label:"NOTE BOARD",hint:"READ THE MARGINS",log:"The board records how she works: research first, test the route, preserve a Plan B, then keep moving." },
  fieldcase: { index:"06",label:"FIELD CASE",hint:"OPEN THE CASE",log:"The field case connects laboratory software, travel, and archery. One compartment is conspicuously empty." },
};

const projectFiles = [
  { id:"map" as const,name:"shanghai-map.case",meta:"HTML · CSS · JAVASCRIPT",title:"Quality of Life in Shanghai",copy:"An interactive neighborhood map informed by questionnaires and interviews, helping residents locate useful facilities within walking distance.",facts:["TEAM LEAD + DEVELOPER","8-PERSON TEAM","SEP 2023 — MAY 2024"] },
  { id:"allocation" as const,name:"course-allocation.py",meta:"PYTHON · NUMPY",title:"Automatic and Satisfactory Course Assignment",copy:"An allocation system designed around satisfaction and efficiency using Simultaneous Eating and Birkhoff Decomposition.",facts:["ALLOCATION ALGORITHM","PREFERENCE-BASED","TESTED + DOCUMENTED"] },
  { id:"emg" as const,name:"emg-monitor.device",meta:"ARDUINO · C/C++ · FUSION",title:"Muscle Usage & Behavior Monitor",copy:"A multi-device system that collects EMG signals over Bluetooth, classifies them on ESP32 microcontrollers, and sends exercise data to a mobile interface.",facts:["ESP32","EMG + BLUETOOTH","MOBILE INTERFACE"] },
];

export default function VersionThree() {
  const [entered,setEntered] = useState(false);
  const [hovered,setHovered] = useState<ZoneId|null>(null);
  const [active,setActive] = useState<ZoneId|null>(null);
  const [discovered,setDiscovered] = useState<ZoneId[]>([]);
  const [indexOpen,setIndexOpen] = useState(false);
  const [computerFile,setComputerFile] = useState<ComputerFile>("desktop");
  const [bulletin,setBulletin] = useState(false);
  const [drawerItem,setDrawerItem] = useState<"device"|"components"|"label">("device");
  const [noteTurned,setNoteTurned] = useState(false);
  const [activeBook,setActiveBook] = useState<"algorithm"|"human"|"travel">("algorithm");
  const [activeNote,setActiveNote] = useState(0);
  const [fieldItem,setFieldItem] = useState<"internship"|"target"|"ticket">("internship");
  const [faxOpen,setFaxOpen] = useState(false);

  const inspect = useCallback((zone: ZoneId) => {
    setActive(zone);
    setDiscovered((current) => current.includes(zone)?current:[...current,zone]);
  },[]);

  useEffect(() => {
    if (active!=="computer") return;
    const timer = window.setTimeout(() => setBulletin(true),1300);
    return () => window.clearTimeout(timer);
  },[active]);

  useEffect(() => {
    const close = (event:KeyboardEvent) => {
      if (event.key!=="Escape") return;
      setActive(null); setIndexOpen(false); setFaxOpen(false);
    };
    window.addEventListener("keydown",close);
    return () => window.removeEventListener("keydown",close);
  },[]);

  const solved = discovered.length===zoneOrder.length;
  const desktopFile = projectFiles.find((file) => file.id===computerFile);
  const status = [
    "ROOM ONLINE / NOTHING UNUSUAL",
    "ONE OBJECT EXAMINED",
    "AN UNFILED BULLETIN WAS FOUND",
    "THREE TRACES CONNECT",
    "OFF-SITE PATTERN FORMING",
    "PRINTER RECEIVING DATA",
    "FAX READY / SOURCE UNKNOWN",
  ][discovered.length];

  return (
    <main className={`room-shell ${entered?"room-entered":""}`}>
      <header className="room-nav">
        <button className="room-brand" onClick={() => setIndexOpen(true)}>ALINA.WU <span>/ LAB 17</span></button>
        <nav><button onClick={() => setIndexOpen(true)}>QUICK INDEX</button><a href="mailto:hello@example.com">CONTACT</a></nav>
        <div className="room-count"><i /> {String(discovered.length).padStart(2,"0")}/06 FOUND</div>
      </header>

      <section className="room-viewport" aria-label="Interactive personal laboratory">
        <LabGame active={entered&&!active&&!indexOpen&&!faxOpen} viewing={active} discovered={discovered} faxReady={solved} onHover={setHovered} onInspect={inspect} />
        <div className="room-grain" aria-hidden="true" />
        <div className="room-vignette" aria-hidden="true" />

        {!entered&&(
          <div className="room-intro">
            <div className="intro-copy">
              <p>PERSONAL WORKSPACE / AFTER HOURS</p>
              <h1>Come in.<br />The lab is<br /><em>still awake.</em></h1>
              <p className="intro-text">This is where Wenrui (Alina) Wu keeps projects, research notes, physical prototypes, and questions that do not fit inside a résumé. Look around. Almost everything has a story.</p>
              <button onClick={() => setEntered(true)}>ENTER LAB 17 <span>→</span></button>
              <div className="intro-identity"><span>WENRUI (ALINA) WU</span><strong>Computer Science / University of Washington</strong></div>
            </div>
            <div className="intro-guide">
              <span>GUEST ACCESS / HOW TO EXPLORE</span>
              <div><b>01</b><p>LOOK AROUND<small>MOVE CURSOR / DRAG</small></p></div>
              <div><b>02</b><p>FIND A SIGNAL<small>HOVER AN OBJECT</small></p></div>
              <div><b>03</b><p>ENTER A VIEW<small>CLICK TO MOVE CLOSER</small></p></div>
              <em>Nothing is arranged in résumé order.</em>
            </div>
          </div>
        )}

        {entered&&(
          <>
            <div className="room-status"><span>LAB STATUS</span><strong>{status}</strong><p>DRAG TO LOOK · CLICK AN OBJECT TO MOVE CLOSER</p></div>
            <div className="hover-readout" aria-live="polite"><span>{hovered?`SIGNAL / ${zoneInfo[hovered].index}`:"ROOM VIEW"}</span><strong>{hovered?zoneInfo[hovered].label:"LOOK AROUND THE LAB"}</strong><p>{hovered?zoneInfo[hovered].hint:"Six objects can be explored in any order."}</p></div>
            <div className="explore-dock">
              {zoneOrder.map((zone) => <button className={discovered.includes(zone)?"found":""} key={zone} onClick={() => inspect(zone)}><span>{zoneInfo[zone].index}</span><i>{zoneInfo[zone].label}</i></button>)}
            </div>
            {solved&&!faxOpen&&<button className="fax-alert" onClick={() => setFaxOpen(true)}><i /> PRINTER ACTIVE <strong>OPEN INCOMING FAX →</strong></button>}
          </>
        )}
      </section>

      {indexOpen&&(
        <div className="modal-layer" onMouseDown={() => setIndexOpen(false)}>
          <aside className="quick-index" role="dialog" aria-modal="true" aria-labelledby="quick-title" onMouseDown={(event) => event.stopPropagation()}>
            <header><div><span>ALINA.WU</span><strong id="quick-title">ROOM INDEX</strong></div><button onClick={() => setIndexOpen(false)} aria-label="Close room index">×</button></header>
            <section><small>DIRECT ACCESS / OPTIONAL</small><h2>Everything in<br />the room.</h2><p>Use this index if you want the portfolio without the scavenger hunt. The room and the files contain the same work.</p></section>
            <div className="quick-list">{zoneOrder.map((zone) => <button key={zone} onClick={() => { setIndexOpen(false); inspect(zone); }}><span>{zoneInfo[zone].index}</span><div><small>{zoneInfo[zone].hint}</small><strong>{zoneInfo[zone].label}</strong></div><i>{discovered.includes(zone)?"FOUND":"OPEN"} →</i></button>)}</div>
          </aside>
        </div>
      )}

      {active==="computer"&&(
        <div className="computer-view" role="dialog" aria-modal="true" aria-label="Alina's computer desktop">
          <div className="monitor-bezel">
            <header className="os-bar"><span>ALINA.OS / LAB-17</span><div><b>SYNC ACTIVE</b><i />02:17</div><button onClick={() => setActive(null)}>LEAVE COMPUTER ×</button></header>
            <div className="os-screen">
              <aside className="os-sidebar"><strong>AW</strong><button onClick={() => setComputerFile("desktop")}>DESKTOP</button><button onClick={() => setComputerFile("projects")}>PROJECTS</button><button onClick={() => setComputerFile("experience")}>EXPERIENCE</button><button onClick={() => setComputerFile("about")}>ABOUT.TXT</button><span>LAB-17 / LOCAL</span></aside>
              <main className="os-workspace">
                {computerFile==="desktop"&&<div className="desktop-icons">
                  <button onClick={() => setComputerFile("about")}><i className="file-icon" /><span>ABOUT.txt</span></button>
                  <button onClick={() => setComputerFile("projects")}><i className="folder-icon" /><span>PROJECTS</span></button>
                  <button onClick={() => setComputerFile("experience")}><i className="folder-icon" /><span>EXPERIENCE</span></button>
                  <button onClick={() => setComputerFile("research")}><i className="file-icon" /><span>FIELD_NOTES.md</span></button>
                  <div className="desktop-welcome"><small>WELCOME / GUEST</small><h2>Wenrui<br />(Alina) Wu</h2><p>Computer Science at the University of Washington. Code, physical systems, and questions about the people around them.</p></div>
                </div>}

                {computerFile==="about"&&<article className="os-window text-file"><header><span>ABOUT.txt</span><button onClick={() => setComputerFile("desktop")}>—</button></header><div><small>PROFILE / LAST SAVED RECENTLY</small><h2>I build with code,<br />then look closely at<br />what it meets.</h2><p>Computer science gives me a way to break problems apart. Psychology keeps the human parts from becoming too simple. I collect information before choosing a route, but I try not to confuse preparation with certainty.</p><blockquote>“I do not know yet” is allowed here.</blockquote></div></article>}

                {computerFile==="projects"&&<article className="os-window folder-window"><header><span>PROJECTS / 3 ITEMS</span><button onClick={() => setComputerFile("desktop")}>—</button></header><div className="file-list">{projectFiles.map((file) => <button key={file.id} onClick={() => setComputerFile(file.id)}><i className="document-icon" /><span><strong>{file.name}</strong><small>{file.meta}</small></span><b>OPEN →</b></button>)}</div></article>}

                {desktopFile&&<article className="os-window project-window"><header><button onClick={() => setComputerFile("projects")}>← PROJECTS</button><span>{desktopFile.name}</span><button onClick={() => setComputerFile("desktop")}>—</button></header><div><small>{desktopFile.meta}</small><h2>{desktopFile.title}</h2><p>{desktopFile.copy}</p><div>{desktopFile.facts.map((fact) => <span key={fact}>{fact}</span>)}</div><button className="run-file">CASE FILE / VERIFIED</button></div></article>}

                {computerFile==="experience"&&<article className="os-window experience-window"><header><span>EXPERIENCE / 2 ITEMS</span><button onClick={() => setComputerFile("desktop")}>—</button></header><div><button onClick={() => setComputerFile("research")}><span>01 / RESEARCH</span><strong>UW Social Futures Lab</strong><small>APR 2026 — PRESENT</small></button><button onClick={() => setComputerFile("internship")}><span>02 / INTERNSHIP</span><strong>Thermo Fisher Scientific</strong><small>JUN 2026 — PRESENT</small></button></div></article>}

                {computerFile==="research"&&<article className="os-window text-file"><header><button onClick={() => setComputerFile("experience")}>← EXPERIENCE</button><span>SOCIAL_FUTURES_LAB.md</span><button onClick={() => setComputerFile("desktop")}>—</button></header><div><small>UNDERGRADUATE RESEARCH / UW</small><h2>How do principles shape perceived relevance?</h2><p>Analyzing how agreement on principles affects perceived relevance between cases through surveys, normalized data, and Pandas-based CSV pipelines.</p><blockquote>STATUS: the relationship is still under investigation.</blockquote></div></article>}

                {computerFile==="internship"&&<article className="os-window text-file"><header><button onClick={() => setComputerFile("experience")}>← EXPERIENCE</button><span>THERMO_FISHER.log</span><button onClick={() => setComputerFile("desktop")}>—</button></header><div><small>SOFTWARE ENGINEERING INTERNSHIP / SHANGHAI</small><h2>Vision, motion, and laboratory workflows.</h2><p>Work across YOLO26 computer vision, ROS2 robot-arm motion, 3500Dx scientific-software testing, QANTIS workflow analysis, and technical onboarding.</p><blockquote>JUNE 2026 — PRESENT</blockquote></div></article>}

                <div className={`news-popup ${bulletin?"visible":""}`}><header><span>LAB BULLETIN</span><button onClick={() => setBulletin(false)}>×</button></header><strong>Alina has not checked in.</strong><p>Wenrui “Alina” Wu has been offline for four days. Her computer continues to sync, but no new lab entry has been recorded.</p><small>Why is this appearing on a portfolio computer?</small></div>
              </main>
              <footer className="os-taskbar"><button onClick={() => setComputerFile("desktop")}>AW</button><span>LOCAL FILES</span><span>{bulletin?"1 UNREAD BULLETIN":"NO NEW ALERTS"}</span></footer>
            </div>
          </div>
        </div>
      )}

      {active&&active!=="computer"&&(
        <div className={`modal-layer object-layer object-${active}`} onMouseDown={() => setActive(null)}>
          <section className="object-view" role="dialog" aria-modal="true" aria-labelledby="object-title" onMouseDown={(event) => event.stopPropagation()}>
            <header><div><span>{zoneInfo[active].index}</span><strong id="object-title">{zoneInfo[active].label}</strong></div><button onClick={() => setActive(null)}>RETURN TO ROOM ×</button></header>

            {active==="drawer"&&<div className="drawer-closeup"><div className="drawer-tray"><button className={drawerItem==="device"?"selected":""} onClick={() => setDrawerItem("device")}><i className="mini-board" /><span>EMG PROTOTYPE</span></button><button className={drawerItem==="components"?"selected":""} onClick={() => setDrawerItem("components")}><i className="component-bag" /><span>SPARE PARTS</span></button><button className={drawerItem==="label"?"selected":""} onClick={() => setDrawerItem("label")}><i className="paper-label" /><span>HANDWRITTEN LABEL</span></button></div><article>{drawerItem==="device"&&<><small>PROJECT / ARDUINO · C/C++ · FUSION</small><h2>Muscle Usage &amp;<br />Behavior Monitor</h2><p>A multi-device system that collects EMG signals over Bluetooth, classifies them on ESP32 microcontrollers, and sends exercise data to a mobile interface.</p><div className="object-tags"><span>ESP32</span><span>EMG</span><span>BLUETOOTH</span></div></>}{drawerItem==="components"&&<><small>COMPONENT BAG / REV. 04</small><h2>Ideas eventually<br />need a body.</h2><p>Sensors, spare pins, and three abandoned enclosure ideas. The prototype changed shape before the signal path stopped changing.</p></>}{drawerItem==="label"&&<><small>PENCIL / BEFORE ASSEMBLY</small><h2>“If it cannot respond,<br />it is still a diagram.”</h2><p>The sentence appears again in two notebooks and once on the computer.</p></>}</article></div>}

            {active==="notebook"&&<button className={`notebook-closeup ${noteTurned?"turned":""}`} onClick={() => setNoteTurned((value) => !value)}><small>{noteTurned?"REVERSE / PERSONAL MARGIN":"UW SOCIAL FUTURES LAB / PAGE 17"}</small><h2>{noteTurned?"Sounding certain is not the same as understanding.":"How do principles shape perceived relevance?"}</h2><p>{noteTurned?"Research first. Ask people next. Leave room for the answer to stay complicated.":"Survey responses → normalized data → principle vectors → case relevance. The relationship is still under investigation."}</p><span>{noteTurned?"TURN BACK ↺":"TURN THE PAGE ↻"}</span></button>}

            {active==="books"&&<div className="books-closeup"><aside><button className={activeBook==="algorithm"?"selected":""} onClick={() => setActiveBook("algorithm")}>ALGORITHMS</button><button className={activeBook==="human"?"selected":""} onClick={() => setActiveBook("human")}>HUMAN SYSTEMS</button><button className={activeBook==="travel"?"selected":""} onClick={() => setActiveBook("travel")}>FIELD ROUTES</button></aside><article>{activeBook==="algorithm"&&<><small>BOOKMARK / COURSE PROJECT</small><h2>Automatic and Satisfactory Course Assignment</h2><p>Python and NumPy implementation using Simultaneous Eating and Birkhoff Decomposition to produce efficient allocations shaped by student preferences.</p></>}{activeBook==="human"&&<><small>MARGIN / CHAPTER UNFINISHED</small><h2>People are not systems waiting to be reduced.</h2><p>Computer science supplies structure. Psychology supplies the warning label: a model can be useful without being the whole person.</p></>}{activeBook==="travel"&&<><small>FOLDED MAP / PLAN B INCLUDED</small><h2>A route is a hypothesis.</h2><p>Plan carefully enough to begin, then update the route when the world supplies new information.</p></>}</article></div>}

            {active==="board"&&<div className="board-closeup"><div className="board-notes">{["research first, ask people next","TODO: overthink less","backup route B","I do not know yet","make it useful before impressive"].map((note,index) => <button className={activeNote===index?"selected":""} onClick={() => setActiveNote(index)} key={note}>{note}</button>)}</div><article><small>SELECTED MARGIN / {String(activeNote+1).padStart(2,"0")}</small><h2>{["Questions before conclusions.","Momentum is also evidence.","Preparation creates freedom.","Uncertainty is a valid state.","Usefulness before spectacle."][activeNote]}</h2><p>{["Collect context, then talk to the people inside the problem.","Thinking carefully matters. So does eventually testing the thought.","A Plan B is not pessimism; it is permission to continue.","Not every question needs to be converted into a confident answer.","The interface should help a person do something—not only prove it was difficult to build."][activeNote]}</p></article></div>}

            {active==="fieldcase"&&<div className="fieldcase-closeup"><div className="case-inventory"><button className={fieldItem==="internship"?"selected":""} onClick={() => setFieldItem("internship")}><i className="work-card" /><span>WORK CARD</span></button><button className={fieldItem==="target"?"selected":""} onClick={() => setFieldItem("target")}><i className="case-target" /><span>USED TARGET</span></button><button className={fieldItem==="ticket"?"selected":""} onClick={() => setFieldItem("ticket")}><i className="travel-ticket" /><span>RETURN TICKET?</span></button></div><article>{fieldItem==="internship"&&<><small>THERMO FISHER SCIENTIFIC / SHANGHAI</small><h2>Vision, motion, and laboratory workflows.</h2><p>Software engineering across YOLO26 vision, ROS2 robot-arm motion, 3500Dx testing, QANTIS workflow analysis, and technical onboarding.</p><div className="object-tags"><span>JUN 2026 — PRESENT</span><span>SOFTWARE ENGINEERING</span></div></>}{fieldItem==="target"&&<><small>ARCHERY / GROUPING STUDY</small><h2>Prepare. Focus.<br />Release. Adjust.</h2><p>The same pattern appears in the project notes, usually with fewer holes in the paper.</p></>}{fieldItem==="ticket"&&<><small>DESTINATION / SMEARED</small><h2>Outbound confirmed.<br />Return left blank.</h2><p>A detailed Plan A is folded behind it. Plan B is written on the reverse. Neither explains four quiet days.</p></>}</article></div>}

            <footer className="object-log"><span>ROOM LOG / RECOVERED</span><p>{zoneInfo[active].log}</p></footer>
          </section>
        </div>
      )}

      {faxOpen&&(
        <div className="modal-layer fax-layer" onMouseDown={() => setFaxOpen(false)}>
          <section className="fax-machine" role="dialog" aria-modal="true" aria-labelledby="fax-title" onMouseDown={(event) => event.stopPropagation()}>
            <header><span>LAB 17 PRINTER / INCOMING</span><button onClick={() => setFaxOpen(false)}>×</button></header>
            <div className="fax-slot"><i /></div>
            <article className="fax-paper"><small>FAX / SOURCE: AW / AFTER 06 CONNECTED TRACES</small><h2 id="fax-title">I am not missing.</h2><p>I followed a question farther than expected, took the field case, and forgot that “back soon” is not a useful status update.</p><p>The projects are real. The bulletin is technically accurate. The detailed Plan B is in the side pocket.</p><strong>— Alina</strong><footer><span>STATUS / SOMEWHERE INTERESTING</span><a href="mailto:hello@example.com">SEND A REPLY →</a></footer></article>
          </section>
        </div>
      )}
    </main>
  );
}
