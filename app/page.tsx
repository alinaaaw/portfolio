"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import type { ZoneId } from "./_components/LabGame";
import {
  board as boardContent,
  books as booksContent,
  computer as computerContent,
  drawer as drawerContent,
  faxContact,
  fieldCase as fieldCaseContent,
  intro as introContent,
  notebook as notebookContent,
  room as roomContent,
  site as siteContent,
} from "@/content";

const LabGame = dynamic(() => import("./_components/LabGame"), {
  ssr: false,
  loading: () => <div className="lab-loading"><i /><span>{siteContent.loading.lab}</span></div>,
});

const ZoneCloseup3D = dynamic(() => import("./_components/ZoneCloseup3D"), {
  ssr: false,
  loading: () => <div className="lab-loading"><i /><span>{siteContent.loading.closeup}</span></div>,
});

type ProjectFileId = "map" | "allocation" | "emg";
type ComputerFile = "desktop" | "about" | "projects" | ProjectFileId | "experience" | "research" | "internship";

const zoneOrder: ZoneId[] = ["computer","drawer","notebook","books","board","fieldcase"];

const zoneInfo = roomContent.zones as Record<ZoneId,{ index:string; label:string; hint:string; log:string; sceneLabel:string }>;

const projectFiles = (["map","allocation","emg"] as const).map((id) => ({id,...computerContent.projects[id]}));

const shelfBooks = booksContent.books;

type ShelfBook = (typeof shelfBooks)[number];
type DrawerFile = "folder" | "notebook" | "components" | "envelope";

function BookshelfScene({ onClose }:{ onClose:()=>void }) {
  const [selected,setSelected] = useState<ShelfBook|null>(null);
  const [reverse,setReverse] = useState(false);
  return <div className="modal-layer tactile-layer bookshelf-layer" onMouseDown={onClose}>
    <section className="tactile-scene" role="dialog" aria-modal="true" aria-label={booksContent.ariaLabel} onMouseDown={(event) => event.stopPropagation()}>
      <header><div><span>{zoneInfo.books.index}</span><strong>{booksContent.header}</strong></div><button onClick={onClose}>{siteContent.shared.returnToRoom}</button></header>
      <ZoneCloseup3D zone="books" onSelect={(item) => { const book=shelfBooks[Number(item)]; if(book){setSelected(book);setReverse(false);} }} />
      {selected&&<div className="book-zoom" onMouseDown={() => setSelected(null)}>
        <div className={`physical-book ${reverse?"reverse":""}`} onMouseDown={(event) => event.stopPropagation()}>
          <div className="book-pages">
            <article className="book-page book-page-left"><small>{selected.meta}</small><h2>{selected.heading}</h2><p>{selected.copy}</p><i className="page-lines" /></article>
            <article className="book-page book-page-right book-page-under"><small>{booksContent.page.reference}</small><h2>{selected.title}</h2><p>{selected.copy}</p><blockquote>{selected.note}</blockquote></article>
            <div className="book-turning-sheet" aria-hidden="true">
              <div className="turn-face turn-front book-page"><span className="sticky-tab">{booksContent.page.tab}</span><small>{booksContent.page.frontMeta}</small><blockquote>{selected.note}</blockquote></div>
              <div className="turn-face turn-back book-page"><small>{booksContent.page.backMeta}</small><h2>{selected.title}</h2><p>{selected.note}</p><p>{booksContent.page.backCopy}</p></div>
            </div>
            <div className="book-spine" />
          </div>
          <button className="book-page-control" onClick={() => setReverse((value) => !value)} aria-label={reverse?booksContent.page.turnBackAria:booksContent.page.turnAria}>{reverse?booksContent.page.turnBack:booksContent.page.turn}</button>
          <button className="close-book" onClick={() => setSelected(null)}>{booksContent.page.return}</button>
        </div>
      </div>}
    </section>
  </div>;
}

function DrawerScene({ onClose }:{ onClose:()=>void }) {
  const [selected,setSelected] = useState<DrawerFile|null>(null);
  const fileCopy = drawerContent.items as Record<DrawerFile,{meta:string;title:string;copy:string;note:string}>;
  const item = selected ? fileCopy[selected] : null;
  return <div className="modal-layer tactile-layer drawer-layer" onMouseDown={onClose}>
    <section className="tactile-scene" role="dialog" aria-modal="true" aria-label={drawerContent.ariaLabel} onMouseDown={(event) => event.stopPropagation()}>
      <header><div><span>{zoneInfo.drawer.index}</span><strong>{drawerContent.header}</strong></div><button onClick={onClose}>{siteContent.shared.returnToRoom}</button></header>
      <ZoneCloseup3D zone="drawer" onSelect={(item) => { if(["folder","notebook","components","envelope"].includes(item))setSelected(item as DrawerFile); }} />
      {item&&<div className={`drawer-document document-${selected}`} onMouseDown={() => setSelected(null)}><article onMouseDown={(event) => event.stopPropagation()}><small>{item.meta}</small><h2>{item.title}</h2><p>{item.copy}</p><blockquote>{item.note}</blockquote><button onClick={() => setSelected(null)}>{drawerContent.returnItem}</button></article></div>}
    </section>
  </div>;
}

type NotebookItem = "research"|"margin"|"diagram";

function NotebookScene({onClose}:{onClose:()=>void}) {
  const [selected,setSelected]=useState<NotebookItem|null>(null);
  const [reverse,setReverse]=useState(false);
  const pages=notebookContent.items as Record<NotebookItem,{meta:string;title:string;copy:string;note:string}>;
  const page=selected?pages[selected]:null;
  return <div className="modal-layer tactile-layer" onMouseDown={onClose}><section className="tactile-scene" role="dialog" aria-modal="true" aria-label={notebookContent.ariaLabel} onMouseDown={(event)=>event.stopPropagation()}>
    <header><div><span>{zoneInfo.notebook.index}</span><strong>{notebookContent.header}</strong></div><button onClick={onClose}>{siteContent.shared.returnToRoom}</button></header>
    <ZoneCloseup3D zone="notebook" onSelect={(item)=>{if(["research","margin","diagram"].includes(item)){setSelected(item as NotebookItem);setReverse(false);}}}/>
    {page&&<div className="model-detail" onMouseDown={()=>setSelected(null)}><button className={`notebook-closeup ${reverse?"turned":""}`} onMouseDown={(event)=>event.stopPropagation()} onClick={()=>setReverse((value)=>!value)}><small>{reverse?notebookContent.page.reverseMeta:page.meta}</small><h2>{reverse?page.note:page.title}</h2><p>{reverse?notebookContent.page.reverseCopy:page.copy}</p><span>{reverse?notebookContent.page.turnBack:notebookContent.page.turn}</span></button></div>}
  </section></div>;
}

const boardNotes=boardContent.notes;

function BoardScene({onClose}:{onClose:()=>void}) {
  const [selected,setSelected]=useState<number|null>(null);
  const note=selected===null?null:boardNotes[selected];
  return <div className="modal-layer tactile-layer" onMouseDown={onClose}><section className="tactile-scene" role="dialog" aria-modal="true" aria-label={boardContent.ariaLabel} onMouseDown={(event)=>event.stopPropagation()}>
    <header><div><span>{zoneInfo.board.index}</span><strong>{boardContent.header}</strong></div><button onClick={onClose}>{siteContent.shared.returnToRoom}</button></header>
    <ZoneCloseup3D zone="board" onSelect={(item)=>{const index=Number(item);if(boardNotes[index])setSelected(index);}}/>
    {note&&<div className="model-detail" onMouseDown={()=>setSelected(null)}><article className="evidence-card note-card" onMouseDown={(event)=>event.stopPropagation()}><small>{boardContent.detailMeta} {String((selected??0)+1).padStart(2,"0")}</small><h2>{note.title}</h2><blockquote>{note.label}</blockquote><p>{note.copy}</p><button onClick={()=>setSelected(null)}>{boardContent.returnItem}</button></article></div>}
  </section></div>;
}

type FieldItem="internship"|"target"|"ticket"|"draft";
const fieldItems=fieldCaseContent.items as Record<FieldItem,{meta:string;title:string;copy:string;tags?:string[]}>;

function FieldCaseScene({onClose}:{onClose:()=>void}) {
  const [selected,setSelected]=useState<FieldItem|null>(null);
  const item=selected?fieldItems[selected]:null;
  return <div className="modal-layer tactile-layer" onMouseDown={onClose}><section className="tactile-scene" role="dialog" aria-modal="true" aria-label={fieldCaseContent.ariaLabel} onMouseDown={(event)=>event.stopPropagation()}>
    <header><div><span>{zoneInfo.fieldcase.index}</span><strong>{fieldCaseContent.header}</strong></div><button onClick={onClose}>{siteContent.shared.returnToRoom}</button></header>
    <ZoneCloseup3D zone="fieldcase" onSelect={(value)=>{if(["internship","target","ticket","draft"].includes(value))setSelected(value as FieldItem);}}/>
    {item&&<div className="model-detail" onMouseDown={()=>setSelected(null)}><article className="evidence-card field-card" onMouseDown={(event)=>event.stopPropagation()}><small>{item.meta}</small><h2>{item.title}</h2><p>{item.copy}</p>{item.tags&&<div className="object-tags">{item.tags.map((tag)=><span key={tag}>{tag}</span>)}</div>}<button onClick={()=>setSelected(null)}>{fieldCaseContent.returnItem}</button></article></div>}
  </section></div>;
}

function PrinterScene({onClose}:{onClose:()=>void}) {
  const [reportOpen,setReportOpen]=useState(false);
  return <div className="modal-layer tactile-layer printer-layer" onMouseDown={onClose}>
    <section className="tactile-scene" role="dialog" aria-modal="true" aria-label={faxContact.printer.ariaLabel} onMouseDown={(event)=>event.stopPropagation()}>
      <header><div><span>{faxContact.printer.headerCode}</span><strong>{faxContact.printer.header}</strong></div><button onClick={onClose}>{siteContent.shared.returnToRoom}</button></header>
      <ZoneCloseup3D zone="printer" onSelect={(item)=>{if(item==="fax")setReportOpen(true);}} />
      {reportOpen&&<div className="fax-reading" onMouseDown={()=>setReportOpen(false)}><article className="fax-paper fax-reading-paper" onMouseDown={(event)=>event.stopPropagation()}><small>{faxContact.printer.report.meta}</small><h2 id="fax-title">{faxContact.printer.report.title}</h2>{faxContact.printer.report.paragraphs.map((paragraph)=><p key={paragraph}>{paragraph}</p>)}<strong>{faxContact.printer.report.signature}</strong><footer><span>{faxContact.printer.report.status}</span><a href={`mailto:${faxContact.contact.email}`}>{faxContact.printer.report.reply}</a></footer><button className="fax-return" onClick={()=>setReportOpen(false)}>{faxContact.printer.report.return}</button></article></div>}
    </section>
  </div>;
}

function ContactScene({onClose}:{onClose:()=>void}) {
  const [cardOpen,setCardOpen]=useState(true);
  return <div className="modal-layer tactile-layer contact-layer" onMouseDown={onClose}>
    <section className="tactile-scene" role="dialog" aria-modal="true" aria-label={faxContact.contact.ariaLabel} onMouseDown={(event)=>event.stopPropagation()}>
      <header><div><span>{faxContact.contact.headerCode}</span><strong>{faxContact.contact.header}</strong></div><button onClick={onClose}>{siteContent.shared.returnToRoom}</button></header>
      <ZoneCloseup3D zone="contact" onSelect={(item)=>{if(item==="contact")setCardOpen(true);}} />
      {cardOpen&&<div className="contact-reading" onMouseDown={()=>setCardOpen(false)}><article className="contact-card-detail" onMouseDown={(event)=>event.stopPropagation()}><small>{faxContact.contact.name}</small><h2>{faxContact.contact.headline[0]}<br />{faxContact.contact.headline[1]}</h2><p>{faxContact.contact.role}</p><a href={`mailto:${faxContact.contact.email}`}>{faxContact.contact.email} <span>{siteContent.shared.arrow}</span></a><button onClick={()=>setCardOpen(false)}>{faxContact.contact.return}</button></article></div>}
    </section>
  </div>;
}

export default function VersionThree() {
  const [entered,setEntered] = useState(false);
  const [hovered,setHovered] = useState<ZoneId|null>(null);
  const [active,setActive] = useState<ZoneId|null>(null);
  const [discovered,setDiscovered] = useState<ZoneId[]>([]);
  const [indexOpen,setIndexOpen] = useState(false);
  const [computerFile,setComputerFile] = useState<ComputerFile>("desktop");
  const [selectedComputerFile,setSelectedComputerFile] = useState<ComputerFile|null>(null);
  const [profileOpen,setProfileOpen] = useState(false);
  const [bulletin,setBulletin] = useState(false);
  const [faxOpen,setFaxOpen] = useState(false);
  const [contactOpen,setContactOpen] = useState(false);

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
      setActive(null); setIndexOpen(false); setFaxOpen(false); setContactOpen(false); setProfileOpen(false);
    };
    window.addEventListener("keydown",close);
    return () => window.removeEventListener("keydown",close);
  },[]);

  const openComputerFile = (file: ComputerFile) => {
    setComputerFile(file);
    setSelectedComputerFile(null);
    setProfileOpen(false);
  };

  const solved = discovered.length===zoneOrder.length;
  const desktopFile = projectFiles.find((file) => file.id===computerFile);
  const status = roomContent.status.messages[discovered.length];

  return (
    <main className={`room-shell ${entered?"room-entered":""}`}>
      <header className="room-nav">
        <button className="room-brand" onClick={() => setIndexOpen(true)}>{siteContent.brand.name} <span>{siteContent.brand.lab}</span></button>
        <nav><button onClick={() => setIndexOpen(true)}>{roomContent.navigation.index}</button><button onClick={() => setContactOpen(true)}>{roomContent.navigation.contact}</button></nav>
        <div className="room-count"><i /> {String(discovered.length).padStart(2,"0")}{roomContent.navigation.foundSuffix}</div>
      </header>

      <section className="room-viewport" aria-label={roomContent.ariaLabel}>
        <LabGame active={entered&&!active&&!indexOpen&&!faxOpen&&!contactOpen} viewing={active} discovered={discovered} faxReady={solved} onHover={setHovered} onInspect={inspect} onPrinterInspect={()=>setFaxOpen(true)} />
        <div className="room-grain" aria-hidden="true" />
        <div className="room-vignette" aria-hidden="true" />

        {!entered&&(
          <div className="room-intro">
            <div className="intro-copy">
              <p>{introContent.eyebrow}</p>
              <h1>{introContent.headline[0]}<br />{introContent.headline[1]}<br /><em>{introContent.headline[2]}</em></h1>
              <p className="intro-text">{introContent.description}</p>
              <button onClick={() => setEntered(true)}>{introContent.enterButton} <span>{siteContent.shared.arrow}</span></button>
              <div className="intro-identity"><span>{introContent.identity.name}</span><strong>{introContent.identity.role}</strong></div>
            </div>
            <div className="intro-guide">
              <span>{introContent.guide.title}</span>
              {introContent.guide.steps.map((step)=><div key={step.number}><b>{step.number}</b><p>{step.title}<small>{step.detail}</small></p></div>)}
              <em>{introContent.guide.note}</em>
            </div>
          </div>
        )}

        {entered&&(
          <>
            <div className="room-status"><span>{roomContent.status.label}</span><strong>{status}</strong><p>{roomContent.status.instruction}</p></div>
            <div className="hover-readout" aria-live="polite"><span>{hovered?`${roomContent.hover.signalPrefix} ${zoneInfo[hovered].index}`:roomContent.hover.defaultMeta}</span><strong>{hovered?zoneInfo[hovered].label:roomContent.hover.defaultTitle}</strong><p>{hovered?zoneInfo[hovered].hint:roomContent.hover.defaultHint}</p></div>
            <div className="explore-dock">
              {zoneOrder.map((zone) => <button className={discovered.includes(zone)?"found":""} key={zone} onClick={() => inspect(zone)}><span>{zoneInfo[zone].index}</span><i>{zoneInfo[zone].label}</i></button>)}
            </div>
            {solved&&!faxOpen&&<button className="fax-alert" onClick={() => setFaxOpen(true)}><i /> {roomContent.faxAlert.title} <strong>{roomContent.faxAlert.action}</strong></button>}
          </>
        )}
      </section>

      {indexOpen&&(
        <div className="modal-layer" onMouseDown={() => setIndexOpen(false)}>
          <aside className="quick-index" role="dialog" aria-modal="true" aria-label={roomContent.quickIndex.ariaLabel} aria-labelledby="quick-title" onMouseDown={(event) => event.stopPropagation()}>
            <header><div><span>{siteContent.brand.name}</span><strong id="quick-title">{roomContent.quickIndex.title}</strong></div><button onClick={() => setIndexOpen(false)} aria-label={roomContent.quickIndex.closeAria}>{siteContent.shared.close}</button></header>
            <section><small>{roomContent.quickIndex.eyebrow}</small><h2>{roomContent.quickIndex.headline[0]}<br />{roomContent.quickIndex.headline[1]}</h2><p>{roomContent.quickIndex.description}</p></section>
            <div className="quick-list">{zoneOrder.map((zone) => <button key={zone} onClick={() => { setIndexOpen(false); inspect(zone); }}><span>{zoneInfo[zone].index}</span><div><small>{zoneInfo[zone].hint}</small><strong>{zoneInfo[zone].label}</strong></div><i>{discovered.includes(zone)?roomContent.quickIndex.found:roomContent.quickIndex.open} {siteContent.shared.arrow}</i></button>)}</div>
          </aside>
        </div>
      )}

      {active==="computer"&&(
        <div className="computer-view" role="dialog" aria-modal="true" aria-label={computerContent.ariaLabel}>
          <div className="monitor-bezel">
            <header className="os-bar"><span>{computerContent.topBar.title}</span><div><b>{computerContent.topBar.sync}</b><i />{computerContent.topBar.time}</div><button onClick={() => { setProfileOpen(false); setActive(null); }}>{computerContent.topBar.leave}</button></header>
            <div className="os-screen">
              <aside className="os-sidebar"><button className="os-profile-trigger" onClick={() => setProfileOpen(true)} aria-label={computerContent.profile.triggerAria}>{siteContent.brand.initials}</button><button onClick={() => openComputerFile("desktop")}>{computerContent.sidebar.desktop}</button><button onClick={() => openComputerFile("projects")}>{computerContent.sidebar.projects}</button><button onClick={() => openComputerFile("experience")}>{computerContent.sidebar.experience}</button><button onClick={() => openComputerFile("about")}>{computerContent.sidebar.about}</button><span>{computerContent.sidebar.location}</span></aside>
              <main className="os-workspace">
                {computerFile==="desktop"&&<div className="desktop-icons">
                  <button className={selectedComputerFile==="about"?"selected":""} onClick={() => setSelectedComputerFile("about")} onDoubleClick={() => openComputerFile("about")} onKeyDown={(event) => { if(event.key==="Enter") openComputerFile("about"); }}><i className="file-icon" /><span>{computerContent.desktop.icons.about}</span></button>
                  <button className={selectedComputerFile==="projects"?"selected":""} onClick={() => setSelectedComputerFile("projects")} onDoubleClick={() => openComputerFile("projects")} onKeyDown={(event) => { if(event.key==="Enter") openComputerFile("projects"); }}><i className="folder-icon" /><span>{computerContent.desktop.icons.projects}</span></button>
                  <button className={selectedComputerFile==="experience"?"selected":""} onClick={() => setSelectedComputerFile("experience")} onDoubleClick={() => openComputerFile("experience")} onKeyDown={(event) => { if(event.key==="Enter") openComputerFile("experience"); }}><i className="folder-icon" /><span>{computerContent.desktop.icons.experience}</span></button>
                  <button className={selectedComputerFile==="research"?"selected":""} onClick={() => setSelectedComputerFile("research")} onDoubleClick={() => openComputerFile("research")} onKeyDown={(event) => { if(event.key==="Enter") openComputerFile("research"); }}><i className="file-icon" /><span>{computerContent.desktop.icons.research}</span></button>
                  <div className="desktop-welcome"><small>{computerContent.desktop.welcome.eyebrow}</small><h2>{computerContent.desktop.welcome.title}</h2><p>{computerContent.desktop.welcome.description}</p></div>
                </div>}

                {computerFile==="about"&&<article className="os-window text-file"><header><span>{computerContent.about.filename}</span><button onClick={() => setComputerFile("desktop")}>{siteContent.shared.minimize}</button></header><div><small>{computerContent.about.meta}</small><h2>{computerContent.about.headline.map((line,index)=><span key={line}>{line}{index<computerContent.about.headline.length-1&&<br />}</span>)}</h2><p>{computerContent.about.description}</p><blockquote>{computerContent.about.quote}</blockquote></div></article>}

                {computerFile==="projects"&&<article className="os-window folder-window"><header><span>{computerContent.projectsFolder.title}</span><button onClick={() => openComputerFile("desktop")}>{siteContent.shared.minimize}</button></header><div className="file-list">{projectFiles.map((file) => <button className={selectedComputerFile===file.id?"selected":""} key={file.id} onClick={() => setSelectedComputerFile(file.id)} onDoubleClick={() => openComputerFile(file.id)} onKeyDown={(event) => { if(event.key==="Enter") openComputerFile(file.id); }}><i className="document-icon" /><span><strong>{file.name}</strong><small>{file.meta}</small></span></button>)}</div></article>}

                {desktopFile&&<article className="os-window project-window"><header><button onClick={() => setComputerFile("projects")}>{computerContent.projectsFolder.back}</button><span>{desktopFile.name}</span><button onClick={() => setComputerFile("desktop")}>{siteContent.shared.minimize}</button></header><div><small>{desktopFile.meta}</small><h2>{desktopFile.title}</h2><p>{desktopFile.copy}</p><div>{desktopFile.facts.map((fact) => <span key={fact}>{fact}</span>)}</div><button className="run-file">{computerContent.projectsFolder.verified}</button></div></article>}

                {computerFile==="experience"&&<article className="os-window experience-window"><header><span>{computerContent.experience.folderTitle}</span><button onClick={() => openComputerFile("desktop")}>{siteContent.shared.minimize}</button></header><div><button className={selectedComputerFile==="research"?"selected":""} onClick={() => setSelectedComputerFile("research")} onDoubleClick={() => openComputerFile("research")}><span>{computerContent.experience.research.listMeta}</span><strong>{computerContent.experience.research.organization}</strong><small>{computerContent.experience.research.date}</small></button><button className={selectedComputerFile==="internship"?"selected":""} onClick={() => setSelectedComputerFile("internship")} onDoubleClick={() => openComputerFile("internship")}><span>{computerContent.experience.internship.listMeta}</span><strong>{computerContent.experience.internship.organization}</strong><small>{computerContent.experience.internship.date}</small></button></div></article>}

                {computerFile==="research"&&<article className="os-window text-file"><header><button onClick={() => setComputerFile("experience")}>{computerContent.experience.back}</button><span>{computerContent.experience.research.filename}</span><button onClick={() => setComputerFile("desktop")}>{siteContent.shared.minimize}</button></header><div><small>{computerContent.experience.research.meta}</small><h2>{computerContent.experience.research.title}</h2><p>{computerContent.experience.research.copy}</p><blockquote>{computerContent.experience.research.quote}</blockquote></div></article>}

                {computerFile==="internship"&&<article className="os-window text-file"><header><button onClick={() => setComputerFile("experience")}>{computerContent.experience.back}</button><span>{computerContent.experience.internship.filename}</span><button onClick={() => setComputerFile("desktop")}>{siteContent.shared.minimize}</button></header><div><small>{computerContent.experience.internship.meta}</small><h2>{computerContent.experience.internship.title}</h2><p>{computerContent.experience.internship.copy}</p><blockquote>{computerContent.experience.internship.quote}</blockquote></div></article>}

                {profileOpen&&<article className="os-window profile-window" role="dialog" aria-modal="true" aria-label={computerContent.profile.windowTitle}>
                  <header><span>{computerContent.profile.windowTitle}</span><button onClick={() => setProfileOpen(false)} aria-label={computerContent.profile.closeAria}>{siteContent.shared.close}</button></header>
                  <div className="profile-window-body">
                    <section className="profile-identity">
                      <div className="profile-avatar" aria-hidden="true">{siteContent.brand.initials}</div>
                      <small>{computerContent.profile.status}</small>
                      <h2>{computerContent.profile.name}</h2>
                      <p>{computerContent.profile.fullName}</p>
                      <strong>{computerContent.profile.role}</strong>
                    </section>
                    <section className="profile-details">
                      <div><small>{computerContent.profile.summaryLabel}</small><p>{computerContent.profile.summary}</p></div>
                      <div className="profile-location"><small>{computerContent.profile.locationLabel}</small><strong>{computerContent.profile.location}</strong></div>
                      <div><small>{computerContent.profile.focusLabel}</small><div className="profile-tags">{computerContent.profile.focus.map((item)=><span key={item}>{item}</span>)}</div></div>
                      <div><small>{computerContent.profile.contactLabel}</small><a href={`mailto:${computerContent.profile.email}`}>{computerContent.profile.email} <span>{siteContent.shared.arrow}</span></a></div>
                    </section>
                  </div>
                </article>}

                <div className={`news-popup ${bulletin?"visible":""}`}><header><span>{computerContent.bulletin.header}</span><button onClick={() => setBulletin(false)}>{siteContent.shared.close}</button></header><strong>{computerContent.bulletin.title}</strong><p>{computerContent.bulletin.copy}</p></div>
              </main>
              <footer className="os-taskbar"><button onClick={() => openComputerFile("desktop")}>{siteContent.brand.initials}</button><span>{computerContent.taskbar.files}</span><span>{bulletin?computerContent.taskbar.unread:computerContent.taskbar.clear}</span></footer>
            </div>
          </div>
        </div>
      )}

      {active==="drawer"&&<DrawerScene onClose={() => setActive(null)} />}
      {active==="notebook"&&<NotebookScene onClose={() => setActive(null)} />}
      {active==="books"&&<BookshelfScene onClose={() => setActive(null)} />}
      {active==="board"&&<BoardScene onClose={() => setActive(null)} />}
      {active==="fieldcase"&&<FieldCaseScene onClose={() => setActive(null)} />}

      {faxOpen&&<PrinterScene onClose={()=>setFaxOpen(false)} />}
      {contactOpen&&<ContactScene onClose={()=>setContactOpen(false)} />}
    </main>
  );
}
