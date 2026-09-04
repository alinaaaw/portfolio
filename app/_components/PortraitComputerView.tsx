"use client";

import { useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import {
  computer as computerContent,
  currentVersion,
  references as referencesContent,
  releases as releasesContent,
  site as siteContent,
} from "@/content";

export type ProjectFileId = "map" | "allocation" | "emg";
export type ComputerFile = "desktop" | "readme" | "lablog" | "projects" | ProjectFileId | "experience" | "research" | "internship" | "references" | "updates";
export type ComputerWindowId = Exclude<ComputerFile,"desktop"> | "profile";
export type ReferenceFilter = "all" | ProjectFileId;
export type PortraitComputerRoot = "desktop" | "projects" | "experience" | "references" | "lablog" | "updates";

type ProjectReference = {id:string;project:ProjectFileId;title:string;meta:string;citation:string;summary:string;annotation:string;provenance:string;url:string};
type PublicRelease = {version:string;date:string;title:string;summary:string;highlights:string[];details:Record<string,string[]>};
type PhoneAppIconKind = "profile" | "notes" | "projects" | "experience" | "references" | "lablog" | "settings";
type LabLogFilter = "all" | "program" | "role";
type NotesToolIconKind = "lock" | "checklist" | "format" | "camera" | "draw";

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
const publicReleases=releasesContent.releases as PublicRelease[];
const referenceGroups=referencesContent.groups as {id:ReferenceFilter;label:string}[];
const rootWindows:ComputerWindowId[]=["projects","experience","references","lablog","updates"];
const labLogFilters:{id:LabLogFilter;label:string}[]=[{id:"all",label:"ALL"},{id:"program",label:"PROGRAM"},{id:"role",label:"ROLE"}];
const NOTIFICATION_DISMISS_DISTANCE=52;
const notesTools=(["checklist","format","camera","draw"] as const).map((kind)=>({kind,label:computerContent.readme.mobileToolLabels[kind]}));

function PhoneAppIcon({kind,badge=false}:{kind:PhoneAppIconKind;badge?:boolean}) {
  return <span className={`portrait-app-icon portrait-app-icon-${kind}`} aria-hidden="true">{kind==="settings"?<svg className="portrait-settings-gear" viewBox="0 0 32 32"><path d="M13.2 3.5h5.6l.8 3.1 2.1 1.2 3-.9 2.8 4.8-2.3 2.2v2.4l2.3 2.2-2.8 4.8-3-.9-2.1 1.2-.8 3.1h-5.6l-.8-3.1-2.1-1.2-3 .9-2.8-4.8 2.3-2.2v-2.4l-2.3-2.2 2.8-4.8 3 .9 2.1-1.2.8-3.1Z"/><circle cx="16" cy="15.1" r="4.2"/></svg>:<i />}{badge&&<b>1</b>}</span>;
}

function NotesToolIcon({kind}:{kind:NotesToolIconKind}) {
  if(kind==="lock")return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6.5" y="10" width="11" height="9" rx="2"/><path d="M9 10V7.5a3 3 0 0 1 6 0V10"/></svg>;
  if(kind==="checklist")return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="m8.5 12 2.3 2.3 4.9-5"/></svg>;
  if(kind==="format")return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 18 9.3 6h1.9L16 18M6.6 13.2h7.3M17 11v7m-2.5-3.5h5"/></svg>;
  if(kind==="camera")return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 8.5h3L9.2 6h5.6l1.7 2.5h3v10h-15z"/><circle cx="12" cy="13.5" r="3.2"/></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 18 1.1-4.2 8.8-8.8 3.1 3.1-8.8 8.8zM14.5 6.5l3 3M5.5 19h13"/></svg>;
}

function versionStatus(version:string){
  if(version.includes("-rc."))return releasesContent.statusLabels.releaseCandidate;
  if(version.includes("-"))return releasesContent.statusLabels.prerelease;
  if(version.startsWith("0."))return releasesContent.statusLabels.preview;
  return releasesContent.statusLabels.stable;
}

function PortraitSystemSettings(){
  const currentRelease=publicReleases.find((release)=>release.version===currentVersion)??publicReleases[0];
  return <section className="portrait-ios-settings">
    <header className="portrait-settings-hero"><PhoneAppIcon kind="settings" /><small>{releasesContent.product}</small><h2>{releasesContent.mobile.aboutTitle}</h2><p>{releasesContent.currentStatus}</p></header>
    <section className="portrait-settings-section"><h3>{releasesContent.generalLabel}</h3><dl className="portrait-settings-group">
      <div><dt>{releasesContent.mobile.nameLabel}</dt><dd>{releasesContent.product}</dd></div>
      <div><dt>{releasesContent.mobile.softwareVersionLabel}</dt><dd>{currentVersion}</dd></div>
      <div><dt>{releasesContent.mobile.statusLabel}</dt><dd>{versionStatus(currentVersion)}</dd></div>
      {currentRelease&&<div><dt>{releasesContent.mobile.releaseDateLabel}</dt><dd><time dateTime={currentRelease.date}>{currentRelease.date}</time></dd></div>}
    </dl></section>
    <details className="portrait-settings-history">
      <summary><span><strong>{releasesContent.mobile.historyTitle}</strong><small>{publicReleases.length} {releasesContent.releaseCountLabel}</small></span><i aria-hidden="true">›</i></summary>
      <div className="portrait-settings-releases">{publicReleases.map((release)=><article key={release.version}><header><strong>v{release.version}</strong><time dateTime={release.date}>{release.date}</time></header><h3>{release.title}</h3>{release.summary&&<p>{release.summary}</p>}<ul>{release.highlights.map((highlight)=><li key={highlight}>{highlight}</li>)}</ul></article>)}</div>
    </details>
  </section>;
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
  const notesOpen=activeWindow==="readme";
  const settingsOpen=activeWindow==="updates";
  const screenTitle=activeWindow==="profile"?"Profile"
    :activeWindow==="readme"?"Notes"
    :activeWindow==="updates"?releasesContent.mobile.screenTitle
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
  return <section className={`portrait-computer-view ${notesOpen?"is-notes-active":""} ${settingsOpen?"is-settings-active":""}`} role="dialog" aria-modal="true" aria-label={computerContent.ariaLabel}>
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
          <button type="button" onClick={()=>onOpenRoot("updates")} aria-label={releasesContent.openAriaLabel}><PhoneAppIcon kind="settings" /><span>{releasesContent.mobile.appLabel}</span></button>
        </div>

        <nav className="portrait-phone-dock" aria-label="Favorite applications">
          <button type="button" onClick={()=>onOpenRoot("projects")} aria-label={computerContent.sidebar.projects}><PhoneAppIcon kind="projects" /></button>
          <button type="button" onClick={()=>onOpenRoot("references")} aria-label={computerContent.sidebar.references}><PhoneAppIcon kind="references" /></button>
          <button type="button" onClick={()=>onOpenRoot("lablog")} aria-label={computerContent.sidebar.labLog}><PhoneAppIcon kind="lablog" /></button>
        </nav>
      </main>}

      {activeWindow&&<div className={`portrait-phone-app ${notesOpen?"is-notes":""} ${settingsOpen?"is-settings":""}`}>
        <header className="portrait-phone-navbar">
          <button type="button" onClick={canGoBack?onBack:()=>onOpenRoot("desktop")} aria-label={canGoBack?"Back":"Home"}><i aria-hidden="true" /><span>{notesOpen?"Notes":canGoBack?"Back":"Home"}</span></button>
          <strong>{screenTitle}</strong>
          <span className={notesOpen?"portrait-notes-access":""} aria-hidden="true">{notesOpen&&computerContent.readme.mobileAccess}</span>
        </header>

        <main className="portrait-phone-app-content">
          {activeWindow==="readme"&&<section className="portrait-document portrait-apple-note">
            <header><small>{computerContent.readme.mobileMeta}</small><h2>{computerContent.readme.mobileTitle}</h2></header>
            <div className="portrait-notes-body">{computerContent.readme.paragraphs.map((paragraph)=><p key={paragraph}>{paragraph}</p>)}</div>
            <footer className="portrait-notes-toolbar" aria-label={computerContent.readme.mobileReadOnly}>
              <div className="portrait-notes-readonly"><NotesToolIcon kind="lock" /><span><strong>{computerContent.readme.mobileAccess}</strong><small>{computerContent.readme.mobileReadOnly}</small></span></div>
              <div className="portrait-notes-tools">{notesTools.map((tool)=><button type="button" key={tool.kind} disabled aria-label={tool.label} title={computerContent.readme.mobileReadOnly}><NotesToolIcon kind={tool.kind} /></button>)}</div>
            </footer>
          </section>}

          {activeWindow==="updates"&&<PortraitSystemSettings />}

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
    <aside className="landscape-phone-rotate" role="status" aria-live="polite" aria-label={computerContent.rotatePrompt.ariaLabel}>
      <button type="button" className="landscape-phone-rotate-leave" onClick={onLeave}><i aria-hidden="true" /> LAB 17</button>
      <div className="landscape-phone-rotate-graphic" aria-hidden="true">
        <span className="landscape-phone-outline"><i /></span>
        <svg className="landscape-phone-rotate-arrow" viewBox="0 0 100 82" focusable="false">
          <path d="M84 62C84 22 16 22 16 62" />
          <polyline points="25 55 16 62 10 53" />
        </svg>
      </div>
      <small>{computerContent.rotatePrompt.eyebrow}</small>
      <h2>{computerContent.rotatePrompt.title}</h2>
      <p>{computerContent.rotatePrompt.copy}</p>
      <strong>{computerContent.rotatePrompt.hint}</strong>
    </aside>
  </section>;
}
