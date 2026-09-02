"use client";

import { useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import {
  computer as computerContent,
  references as referencesContent,
  site as siteContent,
} from "@/content";

export type ProjectFileId = "map" | "allocation" | "emg";
export type ComputerFile = "desktop" | "readme" | "lablog" | "projects" | ProjectFileId | "experience" | "research" | "internship" | "references";
export type ComputerWindowId = Exclude<ComputerFile,"desktop"> | "profile";
export type ReferenceFilter = "all" | ProjectFileId;
export type PortraitComputerRoot = "desktop" | "projects" | "experience" | "references" | "lablog";

type ProjectReference = {id:string;project:ProjectFileId;title:string;meta:string;citation:string;summary:string;annotation:string;provenance:string;url:string};
type PhoneAppIconKind = "profile" | "notes" | "projects" | "experience" | "references" | "lablog";
type LabLogFilter = "all" | "program" | "role";

type Props = {
  computerWindows: ComputerWindowId[];
  referenceFilter: ReferenceFilter;
  bulletin: boolean;
  onOpenFile: (file: ComputerFile) => void;
  onOpenRoot: (file: PortraitComputerRoot) => void;
  onFocusWindow: (windowId: ComputerWindowId) => void;
  onBack: () => void;
  onOpenReferences: (filter: ReferenceFilter) => void;
  onSetReferenceFilter: (filter: ReferenceFilter) => void;
  onDismissBulletin: () => void;
  onLeave: () => void;
};

const projectFiles = (["map","allocation","emg"] as const).map((id)=>({id,...computerContent.projects[id]}));
const projectReferences=referencesContent.references as ProjectReference[];
const referenceGroups=referencesContent.groups as {id:ReferenceFilter;label:string}[];
const rootWindows:ComputerWindowId[]=["projects","experience","references","lablog"];
const labLogFilters:{id:LabLogFilter;label:string}[]=[{id:"all",label:"ALL"},{id:"program",label:"PROGRAM"},{id:"role",label:"ROLE"}];
const NOTIFICATION_DISMISS_DISTANCE=52;

function PhoneAppIcon({kind,badge=false}:{kind:PhoneAppIconKind;badge?:boolean}) {
  return <span className={`portrait-app-icon portrait-app-icon-${kind}`} aria-hidden="true"><i />{badge&&<b>1</b>}</span>;
}

export default function PortraitComputerView({computerWindows,referenceFilter,bulletin,onOpenFile,onOpenRoot,onFocusWindow,onBack,onOpenReferences,onSetReferenceFilter,onDismissBulletin,onLeave}:Props) {
  const [labLogFilter,setLabLogFilter]=useState<LabLogFilter>("all");
  const [notificationOffset,setNotificationOffset]=useState(0);
  const [notificationDragging,setNotificationDragging]=useState(false);
  const notificationGestureRef=useRef({pointerId:-1,startY:0,offset:0});
  const activeWindow=computerWindows.at(-1)??null;
  const project=projectFiles.find((file)=>file.id===activeWindow);
  const experience=activeWindow==="research"||activeWindow==="internship"?computerContent.experience[activeWindow]:null;
  const visibleReferences=referenceFilter==="all"?projectReferences:projectReferences.filter((reference)=>reference.project===referenceFilter);
  const visibleLabLogEntries=labLogFilter==="all"?computerContent.labLog.entries:computerContent.labLog.entries.filter((entry)=>entry.type.toLowerCase().includes(labLogFilter));
  const canGoBack=Boolean(activeWindow)&&(!rootWindows.includes(activeWindow as ComputerWindowId)||computerWindows.length>1);
  const screenTitle=activeWindow==="profile"?"Profile"
    :activeWindow==="readme"?"Notes"
    :activeWindow==="lablog"?"Lab Log"
    :activeWindow==="projects"?"Projects"
    :activeWindow==="experience"?"Experience"
    :activeWindow==="references"?"References"
    :project?.name??experience?.filename??computerContent.desktop.welcome.title;

  const startNotificationGesture=(event:ReactPointerEvent<HTMLElement>)=>{
    notificationGestureRef.current={pointerId:event.pointerId,startY:event.clientY,offset:0};
    setNotificationDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const moveNotificationGesture=(event:ReactPointerEvent<HTMLElement>)=>{
    if(notificationGestureRef.current.pointerId!==event.pointerId)return;
    const offset=Math.min(0,event.clientY-notificationGestureRef.current.startY);
    notificationGestureRef.current.offset=offset;
    setNotificationOffset(offset);
  };
  const endNotificationGesture=(event:ReactPointerEvent<HTMLElement>)=>{
    if(notificationGestureRef.current.pointerId!==event.pointerId)return;
    if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId);
    const shouldDismiss=notificationGestureRef.current.offset<=-NOTIFICATION_DISMISS_DISTANCE;
    notificationGestureRef.current={pointerId:-1,startY:0,offset:0};
    setNotificationDragging(false);
    setNotificationOffset(0);
    if(shouldDismiss)onDismissBulletin();
  };
  return <section className="portrait-computer-view" role="dialog" aria-modal="true" aria-label={computerContent.ariaLabel}>
    <header className="portrait-phone-statusbar">
      <button type="button" className="portrait-room-return" onClick={onLeave} aria-label={computerContent.topBar.leave}><i aria-hidden="true" /> LAB 17</button>
      <span className="portrait-phone-island" aria-hidden="true"><i /></span>
      <div className="portrait-phone-status" aria-label={`${computerContent.topBar.sync}, ${computerContent.topBar.time}`}><span>{computerContent.topBar.time}</span><i className="portrait-cellular" /><i className="portrait-wifi" /><i className="portrait-battery" /></div>
    </header>

    {bulletin&&<aside className={`portrait-phone-notification ${notificationDragging?"is-dragging":""}`} role="status" aria-live="polite" aria-label={computerContent.bulletin.notificationHeader} style={{transform:`translateY(${notificationOffset}px)`,opacity:Math.max(.45,1+notificationOffset/160)}} onPointerDown={startNotificationGesture} onPointerMove={moveNotificationGesture} onPointerUp={endNotificationGesture} onPointerCancel={endNotificationGesture}>
      <div className="portrait-notification-content">
        <span className="portrait-notification-system-icon" aria-hidden="true"><i /></span>
        <span><small>{computerContent.bulletin.notificationHeader} <em>NOW</em></small><strong>{computerContent.bulletin.title}</strong><span>{computerContent.bulletin.copy}</span></span>
      </div>
    </aside>}

    <div className={`portrait-phone-stage ${activeWindow?"is-app":"is-home"}`}>
      {!activeWindow&&<main className="portrait-phone-home">
        <section className="portrait-phone-widget">
          <div><span>{siteContent.brand.initials}</span><i /></div>
          <small>{computerContent.desktop.welcome.eyebrow}</small>
          <h1>{computerContent.desktop.welcome.title}</h1>
          <p>{computerContent.desktop.welcome.description}</p>
        </section>

        <div className="portrait-home-apps" aria-label="Applications">
          <button type="button" onClick={()=>onFocusWindow("profile")}><PhoneAppIcon kind="profile" /><span>Profile</span></button>
          <button type="button" onClick={()=>onOpenFile("readme")}><PhoneAppIcon kind="notes" /><span>Notes</span></button>
          <button type="button" onClick={()=>onOpenRoot("experience")}><PhoneAppIcon kind="experience" /><span>Experience</span></button>
        </div>

        <nav className="portrait-phone-dock" aria-label="Favorite applications">
          <button type="button" onClick={()=>onOpenRoot("projects")} aria-label={computerContent.sidebar.projects}><PhoneAppIcon kind="projects" /></button>
          <button type="button" onClick={()=>onOpenRoot("references")} aria-label={computerContent.sidebar.references}><PhoneAppIcon kind="references" /></button>
          <button type="button" onClick={()=>onOpenRoot("lablog")} aria-label={computerContent.sidebar.labLog}><PhoneAppIcon kind="lablog" /></button>
        </nav>
      </main>}

      {activeWindow&&<div className="portrait-phone-app">
        <header className="portrait-phone-navbar">
          <button type="button" onClick={canGoBack?onBack:()=>onOpenRoot("desktop")} aria-label={canGoBack?"Back":"Home"}><i aria-hidden="true" /><span>{canGoBack?"Back":"Home"}</span></button>
          <strong>{screenTitle}</strong>
          <span aria-hidden="true" />
        </header>

        <main className="portrait-phone-app-content">
          {activeWindow==="readme"&&<section className="portrait-document"><small>{computerContent.readme.meta}</small><h2>{computerContent.readme.title}</h2>{computerContent.readme.paragraphs.map((paragraph)=><p key={paragraph}>{paragraph}</p>)}</section>}

          {activeWindow==="lablog"&&<section className="portrait-lab-log">
            <header className="portrait-log-overview"><small>{computerContent.labLog.meta}</small><span><i />{computerContent.topBar.sync}</span></header>
            <nav className="portrait-log-filters" aria-label="Filter lab log entries">{labLogFilters.map((filter)=><button type="button" className={labLogFilter===filter.id?"active":""} key={filter.id} onClick={()=>setLabLogFilter(filter.id)} aria-pressed={labLogFilter===filter.id}>{filter.label}</button>)}</nav>
            <div className="portrait-log-timeline">{visibleLabLogEntries.map((entry,entryIndex)=><article key={`${entry.date}-${entry.title}`}>
              <i className="portrait-log-marker" aria-hidden="true" />
              <header><small>{entry.date} / {entry.type}</small><h2>{entry.title}</h2><span aria-hidden="true">└─ --------------------------------</span></header>
              <div>{entry.body.map((paragraph,paragraphIndex)=><p key={paragraph}><span>[LOG.{String(entryIndex*10+paragraphIndex+1).padStart(2,"0")}]</span>{paragraph}</p>)}</div>
            </article>)}</div>
          </section>}

          {activeWindow==="projects"&&<section className="portrait-list portrait-root-list"><header><small>{computerContent.projectsFolder.title}</small><h2>{computerContent.sidebar.projects}</h2></header>{projectFiles.map((file)=><button type="button" key={file.id} onClick={()=>onOpenFile(file.id)}><i className="document-icon" /><span><strong>{file.name}</strong><small>{file.meta}</small></span><b>{siteContent.shared.arrow}</b></button>)}</section>}

          {project&&<section className="portrait-document portrait-project"><small>{project.meta}</small><h2>{project.title}</h2><p className="portrait-lead">{project.copy}</p><div className="portrait-tags">{project.facts.map((fact)=><span key={fact}>{fact}</span>)}</div><dl>{project.details.map((detail)=><div key={detail.label}><dt>{detail.label}</dt><dd>{detail.copy}</dd></div>)}</dl><div className="portrait-panel-actions"><button type="button" onClick={()=>onOpenReferences(project.id)}>{referencesContent.browser.projectLink}</button><span>{computerContent.projectsFolder.verified}</span></div></section>}

          {activeWindow==="experience"&&<section className="portrait-list portrait-experience-list portrait-root-list"><header><small>{computerContent.experience.folderTitle}</small><h2>{computerContent.sidebar.experience}</h2></header>{(["research","internship"] as const).map((id)=>{const item=computerContent.experience[id];return <button type="button" key={id} onClick={()=>onOpenFile(id)}><span><small>{item.listMeta}</small><strong>{item.organization}</strong><em>{item.date}</em></span><b>{siteContent.shared.arrow}</b></button>;})}</section>}

          {experience&&<section className="portrait-document"><small>{experience.meta}</small><h2>{experience.title}</h2><p className="portrait-lead">{experience.copy}</p><div className="portrait-tags">{experience.quote.split(" / ").map((skill)=><span key={skill}>{skill}</span>)}</div><dl>{experience.details.map((detail)=><div key={detail.label}><dt>{detail.label}</dt><dd>{detail.copy}</dd></div>)}</dl></section>}

          {activeWindow==="references"&&<section className="portrait-references"><header><small>{referencesContent.browser.meta}</small><h2>{referencesContent.browser.title}</h2><p>{referencesContent.browser.intro}</p></header><nav aria-label="Filter project references">{referenceGroups.map((group)=><button type="button" className={referenceFilter===group.id?"active":""} key={group.id} onClick={()=>onSetReferenceFilter(group.id)}>{group.label}</button>)}</nav><div>{visibleReferences.map((reference)=><article key={reference.id}><small>{reference.meta}</small><h3>{reference.title}</h3><p className="portrait-citation">{reference.citation}</p><p>{reference.summary}</p><blockquote>{reference.annotation}</blockquote><footer><span>{reference.provenance}</span><a href={reference.url} target="_blank" rel="noreferrer">{referencesContent.browser.openSource}</a></footer></article>)}</div></section>}

          {activeWindow==="profile"&&<section className="portrait-profile"><header><span>{siteContent.brand.initials}</span><small>{computerContent.profile.status}</small><h2>{computerContent.profile.name}</h2><p>{computerContent.profile.fullName}</p><strong>{computerContent.profile.role}</strong></header><div><section><small>{computerContent.profile.summaryLabel}</small><p>{computerContent.profile.summary}</p></section><section><small>{computerContent.profile.locationLabel}</small><strong>{computerContent.profile.location}</strong></section><section><small>{computerContent.profile.focusLabel}</small><div className="portrait-tags">{computerContent.profile.focus.map((item)=><span key={item}>{item}</span>)}</div></section><section><small>{computerContent.profile.contactLabel}</small><a href={`mailto:${computerContent.profile.email}`}>{computerContent.profile.email} {siteContent.shared.arrow}</a></section></div></section>}
        </main>
      </div>}
    </div>

    <footer className="portrait-phone-systembar"><button type="button" onClick={()=>onOpenRoot("desktop")} aria-label="Go to Home Screen"><i /></button></footer>
  </section>;
}
