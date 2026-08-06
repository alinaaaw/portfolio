"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import type { ZoneId } from "./_components/LabGame";

const LabGame = dynamic(() => import("./_components/LabGame"), {
  ssr: false,
  loading: () => <div className="lab-loading"><i /><span>PREPARING LAB 17</span></div>,
});

const ZoneCloseup3D = dynamic(() => import("./_components/ZoneCloseup3D"), {
  ssr: false,
  loading: () => <div className="lab-loading"><i /><span>FOCUSING LOCAL VIEW</span></div>,
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

const shelfBooks = [
  { id:"algorithms",index:"01",title:"Fair Allocation",meta:"ALGORITHMS / BOOKMARK 42",heading:"Automatic and Satisfactory Course Assignment",copy:"Simultaneous Eating and Birkhoff Decomposition, annotated with the points where efficiency and student preference stop agreeing cleanly.",note:"Re-run with the preference ties preserved." },
  { id:"city",index:"02",title:"Walking Distance",meta:"FIELD MAP / SHANGHAI",heading:"Quality of Life in Shanghai",copy:"Interview notes, questionnaire patterns, and an early neighborhood map folded together before they became an interactive website.",note:"A useful map begins with somebody's ordinary Tuesday." },
  { id:"signals",index:"03",title:"Signals in Motion",meta:"HARDWARE / EMG",heading:"Muscle Usage & Behavior Monitor",copy:"Signal sketches for the ESP32 system, including the noisy readings that were more useful than the clean demonstrations.",note:"Test outside the clean bench." },
  { id:"human",index:"04",title:"Human Systems",meta:"PSYCHOLOGY / MARGIN",heading:"People are not systems waiting to be reduced.",copy:"Computer science supplies structure. Psychology supplies the warning label: a model can be useful without becoming the whole person.",note:"Ask what the model leaves out." },
  { id:"research",index:"05",title:"Relevance",meta:"UW SOCIAL FUTURES LAB",heading:"How do principles shape perceived relevance?",copy:"Survey questions, normalized case data, and a working set of principle vectors. Several conclusions remain deliberately unfinished.",note:"Sounding certain is not the same as understanding." },
  { id:"routes",index:"06",title:"Field Routes",meta:"MAPS / PLAN B",heading:"A route is a hypothesis.",copy:"Careful itineraries, alternative paths, and the reminder that preparation is permission to adapt rather than proof that nothing will change.",note:"Leave the return line open." },
] as const;

type ShelfBook = (typeof shelfBooks)[number];
type DrawerFile = "folder" | "notebook" | "components" | "envelope";

function BookshelfScene({ onClose }:{ onClose:()=>void }) {
  const [selected,setSelected] = useState<ShelfBook|null>(null);
  const [reverse,setReverse] = useState(false);
  return <div className="modal-layer tactile-layer bookshelf-layer" onMouseDown={onClose}>
    <section className="tactile-scene" role="dialog" aria-modal="true" aria-label="Bookshelf close-up" onMouseDown={(event) => event.stopPropagation()}>
      <header><div><span>04</span><strong>BOOKSHELF / SELECT A BOOK</strong></div><button onClick={onClose}>RETURN TO ROOM ×</button></header>
      <ZoneCloseup3D zone="books" onSelect={(item) => { const book=shelfBooks[Number(item)]; if(book){setSelected(book);setReverse(false);} }} />
      {selected&&<div className="book-zoom" onMouseDown={() => setSelected(null)}>
        <div className={`physical-book ${reverse?"reverse":""}`} onMouseDown={(event) => event.stopPropagation()}>
          <div className="book-pages">
            <article className="book-page book-page-left"><small>{selected.meta}</small><h2>{reverse?selected.note:selected.heading}</h2><p>{reverse?"A note in the back margin, written after the rest of the page.":selected.copy}</p><i className="page-lines" /></article>
            <button className="book-page book-page-right" onClick={() => setReverse((value) => !value)} aria-label="Turn book page"><span className="sticky-tab">FIELD NOTE</span><small>{reverse?"RETURN / PAGE 42":"ANNOTATION / PAGE 41"}</small><blockquote>{reverse?selected.copy:selected.note}</blockquote><b>{reverse?"TURN BACK ↶":"TURN PAGE ↷"}</b></button>
            <div className="book-spine" />
          </div>
          <button className="close-book" onClick={() => setSelected(null)}>RETURN BOOK TO SHELF ×</button>
        </div>
      </div>}
    </section>
  </div>;
}

function DrawerScene({ onClose }:{ onClose:()=>void }) {
  const [selected,setSelected] = useState<DrawerFile|null>(null);
  const fileCopy: Record<DrawerFile,{meta:string;title:string;copy:string;note:string}> = {
    folder:{meta:"PROJECT FOLDER / 2023—2024",title:"Shanghai, at walking distance.",copy:"Questionnaires, interview summaries, and printed facility maps from the eight-person Quality of Life in Shanghai project.",note:"Ask residents before drawing the route."},
    notebook:{meta:"FIELD LOG / SOCIAL FUTURES LAB",title:"Cases, principles, relevance.",copy:"Small observations recorded before the survey responses were normalized and moved into the Pandas pipeline.",note:"Do not smooth away disagreement."},
    components:{meta:"HARDWARE POUCH / REV. 04",title:"The prototype left the clean bench.",copy:"ESP32 board, EMG sensor leads, spare headers, and the component set used for the current outdoor movement tests.",note:"Noise after fatigue may be useful."},
    envelope:{meta:"SEALED NOTE / RETURN CHANNEL",title:"For the printer, after six traces.",copy:"A routing envelope with the Lab 17 printer address and a field-transmission schedule written inside the flap.",note:"Next report: after Phase 02."},
  };
  const item = selected ? fileCopy[selected] : null;
  return <div className="modal-layer tactile-layer drawer-layer" onMouseDown={onClose}>
    <section className="tactile-scene" role="dialog" aria-modal="true" aria-label="Desk drawer close-up" onMouseDown={(event) => event.stopPropagation()}>
      <header><div><span>02</span><strong>DESK DRAWER / PULL TO OPEN</strong></div><button onClick={onClose}>RETURN TO ROOM ×</button></header>
      <ZoneCloseup3D zone="drawer" onSelect={(item) => { if(["folder","notebook","components","envelope"].includes(item))setSelected(item as DrawerFile); }} />
      {item&&<div className={`drawer-document document-${selected}`} onMouseDown={() => setSelected(null)}><article onMouseDown={(event) => event.stopPropagation()}><small>{item.meta}</small><h2>{item.title}</h2><p>{item.copy}</p><blockquote>{item.note}</blockquote><button onClick={() => setSelected(null)}>PUT IT BACK ×</button></article></div>}
    </section>
  </div>;
}

type NotebookItem = "research"|"margin"|"diagram";

function NotebookScene({onClose}:{onClose:()=>void}) {
  const [selected,setSelected]=useState<NotebookItem|null>(null);
  const [reverse,setReverse]=useState(false);
  const pages:Record<NotebookItem,{meta:string;title:string;copy:string;note:string}>={
    research:{meta:"UW SOCIAL FUTURES LAB / PAGE 17",title:"How do principles shape perceived relevance?",copy:"Survey responses → normalized data → principle vectors → case relevance. The relationship is still under investigation.",note:"Research first. Ask people next. Leave room for the answer to stay complicated."},
    margin:{meta:"PERSONAL MARGIN / IN RED",title:"Sounding certain is not the same as understanding.",copy:"A reminder written sideways beside the analysis: uncertainty can be an honest result, not an unfinished performance.",note:"Do not smooth away disagreement."},
    diagram:{meta:"FIELD INSERT / SIGNAL PATH",title:"A diagram made before the clean version.",copy:"Question, observation, model, test, correction. The arrows loop backward because the first answer is rarely the last useful one.",note:"Ask what the model leaves out."},
  };
  const page=selected?pages[selected]:null;
  return <div className="modal-layer tactile-layer" onMouseDown={onClose}><section className="tactile-scene" role="dialog" aria-modal="true" aria-label="Research notebook close-up" onMouseDown={(event)=>event.stopPropagation()}>
    <header><div><span>03</span><strong>RESEARCH BOOK / INSPECT A PAGE</strong></div><button onClick={onClose}>RETURN TO ROOM ×</button></header>
    <ZoneCloseup3D zone="notebook" onSelect={(item)=>{if(["research","margin","diagram"].includes(item)){setSelected(item as NotebookItem);setReverse(false);}}}/>
    {page&&<div className="model-detail" onMouseDown={()=>setSelected(null)}><button className={`notebook-closeup ${reverse?"turned":""}`} onMouseDown={(event)=>event.stopPropagation()} onClick={()=>setReverse((value)=>!value)}><small>{reverse?"REVERSE / PERSONAL MARGIN":page.meta}</small><h2>{reverse?page.note:page.title}</h2><p>{reverse?"A note added after the rest of the page, once the neat explanation had stopped being enough.":page.copy}</p><span>{reverse?"TURN BACK ↶":"TURN THE PAGE ↷"}</span></button></div>}
  </section></div>;
}

const boardNotes=[
  {label:"research first, ask people next",title:"Questions before conclusions.",copy:"Collect context, then talk to the people inside the problem."},
  {label:"TODO: overthink less",title:"Momentum is also evidence.",copy:"Thinking carefully matters. So does eventually testing the thought."},
  {label:"backup route B",title:"Preparation creates freedom.",copy:"A Plan B is not pessimism; it is permission to continue."},
  {label:"I do not know yet",title:"Uncertainty is a valid state.",copy:"Not every question needs to be converted into a confident answer."},
  {label:"make it useful before impressive",title:"Usefulness before spectacle.",copy:"The interface should help a person do something—not only prove it was difficult to build."},
];

function BoardScene({onClose}:{onClose:()=>void}) {
  const [selected,setSelected]=useState<number|null>(null);
  const note=selected===null?null:boardNotes[selected];
  return <div className="modal-layer tactile-layer" onMouseDown={onClose}><section className="tactile-scene" role="dialog" aria-modal="true" aria-label="Bulletin board close-up" onMouseDown={(event)=>event.stopPropagation()}>
    <header><div><span>05</span><strong>NOTE BOARD / FOLLOW THE THREADS</strong></div><button onClick={onClose}>RETURN TO ROOM ×</button></header>
    <ZoneCloseup3D zone="board" onSelect={(item)=>{const index=Number(item);if(boardNotes[index])setSelected(index);}}/>
    {note&&<div className="model-detail" onMouseDown={()=>setSelected(null)}><article className="evidence-card note-card" onMouseDown={(event)=>event.stopPropagation()}><small>PINNED MARGIN / {String((selected??0)+1).padStart(2,"0")}</small><h2>{note.title}</h2><blockquote>{note.label}</blockquote><p>{note.copy}</p><button onClick={()=>setSelected(null)}>PIN IT BACK ×</button></article></div>}
  </section></div>;
}

type FieldItem="internship"|"target"|"ticket"|"draft";
const fieldItems:Record<FieldItem,{meta:string;title:string;copy:string;tags?:string[]}>={
  internship:{meta:"THERMO FISHER SCIENTIFIC / SHANGHAI",title:"Vision, motion, and laboratory workflows.",copy:"Software engineering across YOLO26 vision, ROS2 robot-arm motion, 3500Dx testing, QANTIS workflow analysis, and technical onboarding.",tags:["JUN 2026 — PRESENT","SOFTWARE ENGINEERING"]},
  target:{meta:"ARCHERY / GROUPING STUDY",title:"Prepare. Focus. Release. Adjust.",copy:"The same pattern appears in the project notes, usually with fewer holes in the paper."},
  ticket:{meta:"DESTINATION / SMEARED",title:"Outbound confirmed. Return left blank.",copy:"A detailed Plan A is folded behind it. Plan B is written on the reverse. Neither explains four quiet days."},
  draft:{meta:"FIELD DESK / WORKFLOW DRAFTS",title:"The clean diagram came later.",copy:"Three rough workflow sheets connect camera input, robot motion, instrument checks, and the points where a person needs to intervene."},
};

function FieldCaseScene({onClose}:{onClose:()=>void}) {
  const [selected,setSelected]=useState<FieldItem|null>(null);
  const item=selected?fieldItems[selected]:null;
  return <div className="modal-layer tactile-layer" onMouseDown={onClose}><section className="tactile-scene" role="dialog" aria-modal="true" aria-label="Field case close-up" onMouseDown={(event)=>event.stopPropagation()}>
    <header><div><span>06</span><strong>FIELD CASE / INSPECT THE DESK</strong></div><button onClick={onClose}>RETURN TO ROOM ×</button></header>
    <ZoneCloseup3D zone="fieldcase" onSelect={(value)=>{if(["internship","target","ticket","draft"].includes(value))setSelected(value as FieldItem);}}/>
    {item&&<div className="model-detail" onMouseDown={()=>setSelected(null)}><article className="evidence-card field-card" onMouseDown={(event)=>event.stopPropagation()}><small>{item.meta}</small><h2>{item.title}</h2><p>{item.copy}</p>{item.tags&&<div className="object-tags">{item.tags.map((tag)=><span key={tag}>{tag}</span>)}</div>}<button onClick={()=>setSelected(null)}>RETURN TO CASE ×</button></article></div>}
  </section></div>;
}

export default function VersionThree() {
  const [entered,setEntered] = useState(false);
  const [hovered,setHovered] = useState<ZoneId|null>(null);
  const [active,setActive] = useState<ZoneId|null>(null);
  const [discovered,setDiscovered] = useState<ZoneId[]>([]);
  const [indexOpen,setIndexOpen] = useState(false);
  const [computerFile,setComputerFile] = useState<ComputerFile>("desktop");
  const [selectedComputerFile,setSelectedComputerFile] = useState<ComputerFile|null>(null);
  const [bulletin,setBulletin] = useState(false);
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

  const openComputerFile = (file: ComputerFile) => {
    setComputerFile(file);
    setSelectedComputerFile(null);
  };

  const solved = discovered.length===zoneOrder.length;
  const desktopFile = projectFiles.find((file) => file.id===computerFile);
  const status = [
    "ROOM ONLINE / NOTHING UNUSUAL",
    "ONE OBJECT EXAMINED",
    "AN UNFILED BULLETIN WAS FOUND",
    "THREE TRACES CONNECT",
    "OFF-SITE PATTERN FORMING",
    "PRINTER RECEIVING DATA",
    "FIELD REPORT READY / SOURCE AW",
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
            {solved&&!faxOpen&&<button className="fax-alert" onClick={() => setFaxOpen(true)}><i /> PRINTER ACTIVE <strong>OPEN FIELD REPORT →</strong></button>}
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
              <aside className="os-sidebar"><strong>AW</strong><button onClick={() => openComputerFile("desktop")}>DESKTOP</button><button onClick={() => openComputerFile("projects")}>PROJECTS</button><button onClick={() => openComputerFile("experience")}>EXPERIENCE</button><button onClick={() => openComputerFile("about")}>ABOUT.TXT</button><span>LAB-17 / LOCAL</span></aside>
              <main className="os-workspace">
                {computerFile==="desktop"&&<div className="desktop-icons">
                  <button className={selectedComputerFile==="about"?"selected":""} onClick={() => setSelectedComputerFile("about")} onDoubleClick={() => openComputerFile("about")} onKeyDown={(event) => { if(event.key==="Enter") openComputerFile("about"); }}><i className="file-icon" /><span>ABOUT.txt</span></button>
                  <button className={selectedComputerFile==="projects"?"selected":""} onClick={() => setSelectedComputerFile("projects")} onDoubleClick={() => openComputerFile("projects")} onKeyDown={(event) => { if(event.key==="Enter") openComputerFile("projects"); }}><i className="folder-icon" /><span>PROJECTS</span></button>
                  <button className={selectedComputerFile==="experience"?"selected":""} onClick={() => setSelectedComputerFile("experience")} onDoubleClick={() => openComputerFile("experience")} onKeyDown={(event) => { if(event.key==="Enter") openComputerFile("experience"); }}><i className="folder-icon" /><span>EXPERIENCE</span></button>
                  <button className={selectedComputerFile==="research"?"selected":""} onClick={() => setSelectedComputerFile("research")} onDoubleClick={() => openComputerFile("research")} onKeyDown={(event) => { if(event.key==="Enter") openComputerFile("research"); }}><i className="file-icon" /><span>FIELD_NOTES.md</span></button>
                  <div className="desktop-welcome"><small>WELCOME / GUEST</small><h2>Alina</h2><p>Computer Science at the University of Washington. Code, physical systems, and questions about the people around them.</p></div>
                </div>}

                {computerFile==="about"&&<article className="os-window text-file"><header><span>ABOUT.txt</span><button onClick={() => setComputerFile("desktop")}>—</button></header><div><small>PROFILE / LAST SAVED RECENTLY</small><h2>I build with code,<br />then look closely at<br />what it meets.</h2><p>Computer science gives me a way to break problems apart. Psychology keeps the human parts from becoming too simple. I collect information before choosing a route, but I try not to confuse preparation with certainty.</p><blockquote>“I do not know yet” is allowed here.</blockquote></div></article>}

                {computerFile==="projects"&&<article className="os-window folder-window"><header><span>PROJECTS / 3 ITEMS</span><button onClick={() => openComputerFile("desktop")}>—</button></header><div className="file-list">{projectFiles.map((file) => <button className={selectedComputerFile===file.id?"selected":""} key={file.id} onClick={() => setSelectedComputerFile(file.id)} onDoubleClick={() => openComputerFile(file.id)} onKeyDown={(event) => { if(event.key==="Enter") openComputerFile(file.id); }}><i className="document-icon" /><span><strong>{file.name}</strong><small>{file.meta}</small></span></button>)}</div></article>}

                {desktopFile&&<article className="os-window project-window"><header><button onClick={() => setComputerFile("projects")}>← PROJECTS</button><span>{desktopFile.name}</span><button onClick={() => setComputerFile("desktop")}>—</button></header><div><small>{desktopFile.meta}</small><h2>{desktopFile.title}</h2><p>{desktopFile.copy}</p><div>{desktopFile.facts.map((fact) => <span key={fact}>{fact}</span>)}</div><button className="run-file">CASE FILE / VERIFIED</button></div></article>}

                {computerFile==="experience"&&<article className="os-window experience-window"><header><span>EXPERIENCE / 2 ITEMS</span><button onClick={() => openComputerFile("desktop")}>—</button></header><div><button className={selectedComputerFile==="research"?"selected":""} onClick={() => setSelectedComputerFile("research")} onDoubleClick={() => openComputerFile("research")}><span>01 / RESEARCH</span><strong>UW Social Futures Lab</strong><small>APR 2026 — PRESENT</small></button><button className={selectedComputerFile==="internship"?"selected":""} onClick={() => setSelectedComputerFile("internship")} onDoubleClick={() => openComputerFile("internship")}><span>02 / INTERNSHIP</span><strong>Thermo Fisher Scientific</strong><small>JUN 2026 — PRESENT</small></button></div></article>}

                {computerFile==="research"&&<article className="os-window text-file"><header><button onClick={() => setComputerFile("experience")}>← EXPERIENCE</button><span>SOCIAL_FUTURES_LAB.md</span><button onClick={() => setComputerFile("desktop")}>—</button></header><div><small>UNDERGRADUATE RESEARCH / UW</small><h2>How do principles shape perceived relevance?</h2><p>Analyzing how agreement on principles affects perceived relevance between cases through surveys, normalized data, and Pandas-based CSV pipelines.</p><blockquote>STATUS: the relationship is still under investigation.</blockquote></div></article>}

                {computerFile==="internship"&&<article className="os-window text-file"><header><button onClick={() => setComputerFile("experience")}>← EXPERIENCE</button><span>THERMO_FISHER.log</span><button onClick={() => setComputerFile("desktop")}>—</button></header><div><small>SOFTWARE ENGINEERING INTERNSHIP / SHANGHAI</small><h2>Vision, motion, and laboratory workflows.</h2><p>Work across YOLO26 computer vision, ROS2 robot-arm motion, 3500Dx scientific-software testing, QANTIS workflow analysis, and technical onboarding.</p><blockquote>JUNE 2026 — PRESENT</blockquote></div></article>}

                <div className={`news-popup ${bulletin?"visible":""}`}><header><span>LAB BULLETIN</span><button onClick={() => setBulletin(false)}>×</button></header><strong>No new check-in from Alina.</strong><p>This workstation is still syncing, but no new lab entry has been recorded here for four days.</p><small>Why is this appearing on a portfolio computer?</small></div>
              </main>
              <footer className="os-taskbar"><button onClick={() => setComputerFile("desktop")}>AW</button><span>LOCAL FILES</span><span>{bulletin?"1 UNREAD BULLETIN":"NO NEW ALERTS"}</span></footer>
            </div>
          </div>
        </div>
      )}

      {active==="drawer"&&<DrawerScene onClose={() => setActive(null)} />}
      {active==="notebook"&&<NotebookScene onClose={() => setActive(null)} />}
      {active==="books"&&<BookshelfScene onClose={() => setActive(null)} />}
      {active==="board"&&<BoardScene onClose={() => setActive(null)} />}
      {active==="fieldcase"&&<FieldCaseScene onClose={() => setActive(null)} />}

      {faxOpen&&(
        <div className="modal-layer fax-layer" onMouseDown={() => setFaxOpen(false)}>
          <section className="fax-machine" role="dialog" aria-modal="true" aria-labelledby="fax-title" onMouseDown={(event) => event.stopPropagation()}>
            <header><span>LAB 17 PRINTER / INCOMING</span><button onClick={() => setFaxOpen(false)}>×</button></header>
            <div className="fax-slot"><i /></div>
            <div className="fax-output"><article className="fax-paper"><small>FIELD REPORT / SOURCE: AW / PHASE 02</small><h2 id="fax-title">The signal holds outside the lab.</h2><p>Quick update from the field: the EMG classifier is separating intentional contraction from drift across repeated movement sets. Fatigue adds noise, but the pattern is staying consistent.</p><p>I moved the test outside because the clean bench was hiding the interesting failures. I am collecting one more night of data, then bringing the hardware and full logs back to Lab 17.</p><strong>More when I return. — Alina</strong><footer><span>STATUS / PHASE 02 COMPLETE</span><a href="mailto:hello@example.com">SEND A REPLY →</a></footer></article></div>
          </section>
        </div>
      )}
    </main>
  );
}
