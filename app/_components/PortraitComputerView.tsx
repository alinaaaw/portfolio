"use client";

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

function PhoneAppIcon({kind,badge=false}:{kind:PhoneAppIconKind;badge?:boolean}) {
  return <span className={`portrait-app-icon portrait-app-icon-${kind}`} aria-hidden="true"><i />{badge&&<b>1</b>}</span>;
}

export default function PortraitComputerView({computerWindows,referenceFilter,bulletin,onOpenFile,onOpenRoot,onFocusWindow,onBack,onOpenReferences,onSetReferenceFilter,onDismissBulletin,onLeave}:Props) {
  const activeWindow=computerWindows.at(-1)??null;
  const project=projectFiles.find((file)=>file.id===activeWindow);
  const experience=activeWindow==="research"||activeWindow==="internship"?computerContent.experience[activeWindow]:null;
  const visibleReferences=referenceFilter==="all"?projectReferences:projectReferences.filter((reference)=>reference.project===referenceFilter);
  const canGoBack=Boolean(activeWindow)&&(!rootWindows.includes(activeWindow as ComputerWindowId)||computerWindows.length>1);
  const screenTitle=activeWindow==="profile"?"Profile"
    :activeWindow==="readme"?"Notes"
    :activeWindow==="lablog"?"Lab Log"
    :activeWindow==="projects"?"Projects"
    :activeWindow==="experience"?"Experience"
    :activeWindow==="references"?"References"
    :project?.name??experience?.filename??computerContent.desktop.welcome.title;

  return <section className="portrait-computer-view" role="dialog" aria-modal="true" aria-label={computerContent.ariaLabel}>
    <header className="portrait-phone-statusbar">
      <button type="button" className="portrait-room-return" onClick={onLeave} aria-label={computerContent.topBar.leave}><span aria-hidden="true">&#8249;</span> LAB 17</button>
      <span className="portrait-phone-island" aria-hidden="true"><i /></span>
      <div className="portrait-phone-status" aria-label={`${computerContent.topBar.sync}, ${computerContent.topBar.time}`}><span>{computerContent.topBar.time}</span><i className="portrait-cellular" /><i className="portrait-wifi" /><i className="portrait-battery" /></div>
    </header>

    {bulletin&&<aside className="portrait-phone-notification" role="status" aria-live="polite">
      <button type="button" className="portrait-notification-open" onClick={()=>{onDismissBulletin();onOpenRoot("lablog");}} aria-label={`Open ${computerContent.bulletin.header}`}>
        <PhoneAppIcon kind="lablog" />
        <span><small>{computerContent.bulletin.header} <em>NOW</em></small><strong>{computerContent.bulletin.title}</strong><span>{computerContent.bulletin.copy}</span></span>
      </button>
      <button type="button" className="portrait-notification-dismiss" onClick={onDismissBulletin} aria-label={`Dismiss ${computerContent.bulletin.header}`}><span aria-hidden="true">&#215;</span></button>
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
          <button type="button" onClick={()=>onOpenRoot("lablog")} aria-label={computerContent.sidebar.labLog}><PhoneAppIcon kind="lablog" badge={bulletin} /></button>
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

          {activeWindow==="lablog"&&<section className="portrait-lab-log"><small>{computerContent.labLog.meta}</small>{computerContent.labLog.entries.map((entry)=><article key={`${entry.date}-${entry.title}`}><small>[{entry.date}] {entry.type}</small><h2>{entry.title}</h2>{entry.body.map((paragraph)=><p key={paragraph}>{paragraph}</p>)}</article>)}</section>}

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
