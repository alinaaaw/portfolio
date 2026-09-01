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

export default function PortraitComputerView({computerWindows,referenceFilter,bulletin,onOpenFile,onOpenRoot,onFocusWindow,onBack,onOpenReferences,onSetReferenceFilter,onDismissBulletin,onLeave}:Props) {
  const activeWindow=computerWindows.at(-1)??null;
  const project=projectFiles.find((file)=>file.id===activeWindow);
  const experience=activeWindow==="research"||activeWindow==="internship"?computerContent.experience[activeWindow]:null;
  const visibleReferences=referenceFilter==="all"?projectReferences:projectReferences.filter((reference)=>reference.project===referenceFilter);
  const currentTab:PortraitComputerRoot=activeWindow==="projects"||Boolean(project)?"projects"
    :activeWindow==="experience"||Boolean(experience)?"experience"
    :activeWindow==="references"?"references"
    :activeWindow==="lablog"?"lablog"
    :"desktop";
  const canGoBack=Boolean(activeWindow)&&(!rootWindows.includes(activeWindow as ComputerWindowId)||computerWindows.length>1);
  const screenTitle=activeWindow==="profile"?computerContent.profile.windowTitle
    :activeWindow==="readme"?computerContent.readme.filename
    :activeWindow==="lablog"?computerContent.labLog.filename
    :activeWindow==="projects"?computerContent.projectsFolder.title
    :activeWindow==="experience"?computerContent.experience.folderTitle
    :activeWindow==="references"?referencesContent.browser.filename
    :project?.name??experience?.filename??computerContent.desktop.welcome.title;

  const tabs:{id:PortraitComputerRoot;label:string;icon:string}[]=[
    {id:"desktop",label:computerContent.sidebar.desktop,icon:"home"},
    {id:"projects",label:computerContent.sidebar.projects,icon:"projects"},
    {id:"experience",label:computerContent.sidebar.experience,icon:"experience"},
    {id:"references",label:computerContent.sidebar.references,icon:"references"},
    {id:"lablog",label:computerContent.sidebar.labLog,icon:"log"},
  ];

  return <section className="portrait-computer-view" role="dialog" aria-modal="true" aria-label={computerContent.ariaLabel}>
    <header className="portrait-mobile-appbar">
      <div className="portrait-appbar-leading">
        {canGoBack?<button type="button" onClick={onBack} aria-label="Back"><span aria-hidden="true">←</span></button>:<span className="portrait-app-symbol" aria-hidden="true">{siteContent.brand.initials}</span>}
      </div>
      <div className="portrait-appbar-title"><small>{computerContent.topBar.title}</small><strong>{screenTitle}</strong></div>
      <div className="portrait-appbar-actions"><span className="portrait-mobile-sync" aria-label={computerContent.topBar.sync}><i /></span><button type="button" onClick={onLeave} aria-label={computerContent.topBar.leave}>{siteContent.shared.close}</button></div>
    </header>

    {bulletin&&<aside className="portrait-mobile-notification" role="status" aria-live="polite">
      <i aria-hidden="true" />
      <div><small>{computerContent.bulletin.header}</small><strong>{computerContent.bulletin.title}</strong><p>{computerContent.bulletin.copy}</p></div>
      <button type="button" onClick={onDismissBulletin} aria-label={`Close ${computerContent.bulletin.header}`}>{siteContent.shared.close}</button>
    </aside>}

    <div className="portrait-mobile-screen" role="main">
      {!activeWindow&&<div className="portrait-computer-home">
        <button type="button" className="portrait-profile-card" onClick={()=>onFocusWindow("profile")}>
          <span>{siteContent.brand.initials}</span><small>{computerContent.profile.status}</small><strong>{computerContent.profile.name}</strong><em>{computerContent.profile.role}</em>
        </button>
        <section className="portrait-welcome"><small>{computerContent.desktop.welcome.eyebrow}</small><h1>{computerContent.desktop.welcome.title}</h1><p>{computerContent.desktop.welcome.description}</p></section>
        <div className="portrait-file-grid">
          <button type="button" onClick={()=>onOpenFile("readme")}><i className="file-icon" /><span>{computerContent.desktop.icons.readme}</span></button>
          <button type="button" onClick={()=>onOpenRoot("lablog")}><i className="file-icon log-file-icon" /><span>{computerContent.desktop.icons.labLog}</span></button>
          <button type="button" onClick={()=>onOpenRoot("projects")}><i className="folder-icon" /><span>{computerContent.desktop.icons.projects}</span></button>
          <button type="button" onClick={()=>onOpenRoot("experience")}><i className="folder-icon" /><span>{computerContent.desktop.icons.experience}</span></button>
          <button type="button" onClick={()=>onOpenRoot("references")}><i className="file-icon web-file-icon" /><span>{computerContent.desktop.icons.references}</span></button>
        </div>
      </div>}

      {activeWindow==="readme"&&<section className="portrait-document"><small>{computerContent.readme.meta}</small><h2>{computerContent.readme.title}</h2>{computerContent.readme.paragraphs.map((paragraph)=><p key={paragraph}>{paragraph}</p>)}</section>}

      {activeWindow==="lablog"&&<section className="portrait-lab-log"><small>{computerContent.labLog.meta}</small>{computerContent.labLog.entries.map((entry)=><article key={`${entry.date}-${entry.title}`}><small>[{entry.date}] {entry.type}</small><h2>{entry.title}</h2>{entry.body.map((paragraph)=><p key={paragraph}>{paragraph}</p>)}</article>)}</section>}

      {activeWindow==="projects"&&<section className="portrait-list portrait-root-list"><header><small>{computerContent.projectsFolder.title}</small><h2>{computerContent.sidebar.projects}</h2></header>{projectFiles.map((file)=><button type="button" key={file.id} onClick={()=>onOpenFile(file.id)}><i className="document-icon" /><span><strong>{file.name}</strong><small>{file.meta}</small></span><b>{siteContent.shared.arrow}</b></button>)}</section>}

      {project&&<section className="portrait-document portrait-project"><small>{project.meta}</small><h2>{project.title}</h2><p className="portrait-lead">{project.copy}</p><div className="portrait-tags">{project.facts.map((fact)=><span key={fact}>{fact}</span>)}</div><dl>{project.details.map((detail)=><div key={detail.label}><dt>{detail.label}</dt><dd>{detail.copy}</dd></div>)}</dl><div className="portrait-panel-actions"><button type="button" onClick={()=>onOpenReferences(project.id)}>{referencesContent.browser.projectLink}</button><span>{computerContent.projectsFolder.verified}</span></div></section>}

      {activeWindow==="experience"&&<section className="portrait-list portrait-experience-list portrait-root-list"><header><small>{computerContent.experience.folderTitle}</small><h2>{computerContent.sidebar.experience}</h2></header>{(["research","internship"] as const).map((id)=>{const item=computerContent.experience[id];return <button type="button" key={id} onClick={()=>onOpenFile(id)}><span><small>{item.listMeta}</small><strong>{item.organization}</strong><em>{item.date}</em></span><b>{siteContent.shared.arrow}</b></button>;})}</section>}

      {experience&&<section className="portrait-document"><small>{experience.meta}</small><h2>{experience.title}</h2><p className="portrait-lead">{experience.copy}</p><div className="portrait-tags">{experience.quote.split(" / ").map((skill)=><span key={skill}>{skill}</span>)}</div><dl>{experience.details.map((detail)=><div key={detail.label}><dt>{detail.label}</dt><dd>{detail.copy}</dd></div>)}</dl></section>}

      {activeWindow==="references"&&<section className="portrait-references"><header><small>{referencesContent.browser.meta}</small><h2>{referencesContent.browser.title}</h2><p>{referencesContent.browser.intro}</p></header><nav aria-label="Filter project references">{referenceGroups.map((group)=><button type="button" className={referenceFilter===group.id?"active":""} key={group.id} onClick={()=>onSetReferenceFilter(group.id)}>{group.label}</button>)}</nav><div>{visibleReferences.map((reference)=><article key={reference.id}><small>{reference.meta}</small><h3>{reference.title}</h3><p className="portrait-citation">{reference.citation}</p><p>{reference.summary}</p><blockquote>{reference.annotation}</blockquote><footer><span>{reference.provenance}</span><a href={reference.url} target="_blank" rel="noreferrer">{referencesContent.browser.openSource}</a></footer></article>)}</div></section>}

      {activeWindow==="profile"&&<section className="portrait-profile"><header><span>{siteContent.brand.initials}</span><small>{computerContent.profile.status}</small><h2>{computerContent.profile.name}</h2><p>{computerContent.profile.fullName}</p><strong>{computerContent.profile.role}</strong></header><div><section><small>{computerContent.profile.summaryLabel}</small><p>{computerContent.profile.summary}</p></section><section><small>{computerContent.profile.locationLabel}</small><strong>{computerContent.profile.location}</strong></section><section><small>{computerContent.profile.focusLabel}</small><div className="portrait-tags">{computerContent.profile.focus.map((item)=><span key={item}>{item}</span>)}</div></section><section><small>{computerContent.profile.contactLabel}</small><a href={`mailto:${computerContent.profile.email}`}>{computerContent.profile.email} {siteContent.shared.arrow}</a></section></div></section>}
    </div>

    <nav className="portrait-mobile-tabs" aria-label={computerContent.sidebar.location}>
      {tabs.map((tab)=><button type="button" className={currentTab===tab.id?"active":""} key={tab.id} onClick={()=>onOpenRoot(tab.id)} aria-current={currentTab===tab.id?"page":undefined}><i className={`portrait-tab-icon portrait-tab-${tab.icon}`} aria-hidden="true" />{tab.id==="desktop"&&bulletin&&<span className="portrait-tab-badge" aria-hidden="true" />}<span>{tab.label}</span></button>)}
    </nav>
  </section>;
}
