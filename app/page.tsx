"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";
import type { ZoneId } from "./_components/LabGame";
import { drawFieldCaseMapViewport, FIELD_CASE_MAP_VIEWS } from "./_components/fieldCaseMap";
import type { FieldCaseMapCamera, FieldCaseMapPinHit, FieldCaseMapView, FieldCaseTravelPin } from "./_components/fieldCaseMap";
import { travelPhotosForPin } from "./_components/travelPhotoLibrary";
import type { TravelPhoto } from "./_components/travelPhotoLibrary";
import {
  board as boardContent,
  books as booksContent,
  computer as computerContent,
  drawer as drawerContent,
  faxContact,
  fieldCase as fieldCaseContent,
  intro as introContent,
  notebook as notebookContent,
  references as referencesContent,
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
type ComputerFile = "desktop" | "readme" | "lablog" | "projects" | ProjectFileId | "experience" | "research" | "internship" | "references";
type ComputerWindowId = Exclude<ComputerFile,"desktop"> | "profile";
type WindowPosition = { x:number; y:number };
type ReferenceFilter = "all" | ProjectFileId;

const zoneOrder: ZoneId[] = ["computer","drawer","notebook","books","board","fieldcase"];

const zoneInfo = roomContent.zones as Record<ZoneId,{ index:string; label:string; hint:string; log:string; sceneLabel:string }>;

const projectFiles = (["map","allocation","emg"] as const).map((id) => ({id,...computerContent.projects[id]}));

type ShelfBook = {id:string;index:string;title:string;meta:string;citation:string;summary:string;excerptLabel:string;quoted:boolean;excerpt:string;annotation:string;provenance:string;url:string};
type ProjectReference = ShelfBook & {project:ProjectFileId};
const shelfBooks = booksContent.books as ShelfBook[];
const projectReferences = referencesContent.references as ProjectReference[];
const referenceGroups = referencesContent.groups as {id:ReferenceFilter;label:string}[];
type DrawerFile = "folder" | "notebook" | "components" | "envelope";
type DrawerArtifact = {meta:string;title:string|null;copy:string;facts:{label:string;value:string}[];note:string};
type NotebookPage = {meta:string;title:string|null;lead:string;steps:string[];reverseMeta:string;reverseTitle:string|null;reverseCopy:string;note:string};
type FieldRecord = {meta:string;title:string|null;copy:string;metrics:{value:string;label:string}[];tags:string[]};
type ContactCardPhase = "table" | "lifting" | "open" | "returning";

function DraggableComputerWindow({id,className,position,zIndex,onMove,onFocus,onClose,onToggleMaximize,isMaximized,ariaLabel,header,children}:{
  id:ComputerWindowId;
  className:string;
  position:WindowPosition;
  zIndex:number;
  onMove:(id:ComputerWindowId,position:WindowPosition)=>void;
  onFocus:(id:ComputerWindowId)=>void;
  onClose:(id:ComputerWindowId)=>void;
  onToggleMaximize?:(id:ComputerWindowId)=>void;
  isMaximized?:boolean;
  ariaLabel:string;
  header:ReactNode;
  children:ReactNode;
}) {
  const windowRef=useRef<HTMLElement>(null);
  const dragRef=useRef<null|{
    pointerId:number;
    startX:number;
    startY:number;
    origin:WindowPosition;
    rect:DOMRect;
    bounds:DOMRect;
  }>(null);

  const startDrag=(event:ReactPointerEvent<HTMLElement>)=>{
    if(isMaximized)return;
    if(window.matchMedia("(max-width: 620px)").matches)return;
    if((event.target as HTMLElement).closest("button,a"))return;
    const element=windowRef.current;
    const parent=element?.parentElement;
    if(!element||!parent)return;
    onFocus(id);
    dragRef.current={pointerId:event.pointerId,startX:event.clientX,startY:event.clientY,origin:position,rect:element.getBoundingClientRect(),bounds:parent.getBoundingClientRect()};
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const drag=(event:ReactPointerEvent<HTMLElement>)=>{
    const state=dragRef.current;
    if(!state||state.pointerId!==event.pointerId)return;
    const rawX=event.clientX-state.startX;
    const rawY=event.clientY-state.startY;
    const minX=state.bounds.left+8-state.rect.left;
    const maxX=state.bounds.right-8-state.rect.right;
    const minY=state.bounds.top+8-state.rect.top;
    const maxY=state.bounds.bottom-8-state.rect.bottom;
    onMove(id,{
      x:state.origin.x+Math.min(Math.max(rawX,Math.min(minX,maxX)),Math.max(minX,maxX)),
      y:state.origin.y+Math.min(Math.max(rawY,Math.min(minY,maxY)),Math.max(minY,maxY)),
    });
  };

  const endDrag=(event:ReactPointerEvent<HTMLElement>)=>{
    if(dragRef.current?.pointerId!==event.pointerId)return;
    dragRef.current=null;
    if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return <article ref={windowRef} className={`os-window draggable-window ${className}${isMaximized?" is-maximized":""}`} data-window={id} role="dialog" aria-label={ariaLabel} style={{zIndex,transform:isMaximized?undefined:`translate3d(${position.x}px,${position.y}px,0)`}} onPointerDown={()=>onFocus(id)}>
    <header className="window-titlebar" onPointerDown={startDrag} onPointerMove={drag} onPointerUp={endDrag} onPointerCancel={endDrag}>{header}<div className="window-controls">{onToggleMaximize&&<button className="window-maximize" type="button" onClick={()=>onToggleMaximize(id)} aria-label={isMaximized?"Restore window":"Maximize window"} aria-pressed={Boolean(isMaximized)}>{isMaximized?"↙":"□"}</button>}<button className="window-close" type="button" onClick={()=>onClose(id)} aria-label={`Close ${ariaLabel}`}>×</button></div></header>
    {children}
  </article>;
}

function useContactCard(autoPickup=false) {
  const [phase,setPhase]=useState<ContactCardPhase>("table");
  useEffect(()=>{
    if(!autoPickup)return;
    const timer=window.setTimeout(()=>setPhase((current)=>current==="table"?"lifting":current),620);
    return()=>window.clearTimeout(timer);
  },[autoPickup]);
  useEffect(()=>{
    if(phase!=="lifting"&&phase!=="returning")return;
    const timer=window.setTimeout(()=>setPhase(phase==="lifting"?"open":"table"),phase==="lifting"?850:780);
    return()=>window.clearTimeout(timer);
  },[phase]);
  const pickUp=useCallback(()=>setPhase((current)=>current==="table"?"lifting":current),[]);
  const returnToTable=useCallback(()=>setPhase((current)=>current==="open"?"returning":current),[]);
  return {phase,pickUp,returnToTable};
}

function BookshelfScene({ onClose }:{ onClose:()=>void }) {
  const [selected,setSelected] = useState<ShelfBook|null>(null);
  const [reverse,setReverse] = useState(false);
  return <div className="modal-layer tactile-layer bookshelf-layer" onMouseDown={onClose}>
    <section className="tactile-scene" role="dialog" aria-modal="true" aria-label={booksContent.ariaLabel} onMouseDown={(event) => event.stopPropagation()}>
      <header><div><span>{zoneInfo.books.index}</span><strong>{booksContent.header}</strong></div><button onClick={onClose}>{siteContent.shared.returnToRoom}</button></header>
      <ZoneCloseup3D zone="books" onSelect={(item) => { const book=shelfBooks[Number(item)]; if(book){setSelected(book);setReverse(false);} }} />
      {shelfBooks.length===0&&<article className="collection-empty-state shelf-empty-state"><small>{booksContent.emptyState.meta}</small><h2>{booksContent.emptyState.title}</h2><p>{booksContent.emptyState.copy}</p><em>{booksContent.emptyState.note}</em></article>}
      {selected&&<div className="book-zoom" onMouseDown={() => setSelected(null)}>
        <div className={`physical-book ${reverse?"reverse":""}`} onMouseDown={(event) => event.stopPropagation()}>
          <div className="book-pages">
            <article className="book-page book-page-left"><small>{selected.meta}</small><h2>{selected.title}</h2><p className="book-citation">{selected.citation}</p><p>{selected.summary}</p><a className="book-source-link" href={selected.url} target="_blank" rel="noreferrer">OPEN SOURCE ↗</a></article>
            <article className="book-page book-page-right book-page-under"><small>{booksContent.page.reference}</small><p className="book-annotation">{selected.annotation}</p><small className="book-excerpt-label">{selected.excerptLabel}</small><blockquote>{selected.quoted?`“${selected.excerpt}”`:selected.excerpt}</blockquote><span className="book-provenance">{selected.provenance}</span></article>
            <div className="book-turning-sheet" aria-hidden="true">
              <div className="turn-face turn-front book-page"><span className="sticky-tab">{booksContent.page.tab}</span><small>{selected.excerptLabel}</small><blockquote>{selected.quoted?`“${selected.excerpt}”`:selected.excerpt}</blockquote></div>
              <div className="turn-face turn-back book-page"><small>{booksContent.page.backMeta}</small><p className="book-annotation">{selected.annotation}</p><p>{booksContent.page.backCopy}</p></div>
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

function DrawerScene({ onClose,faxPrinted }:{ onClose:()=>void;faxPrinted:boolean }) {
  const [selected,setSelected] = useState<DrawerFile|null>(null);
  const fileCopy = drawerContent.items as Record<DrawerFile,DrawerArtifact>;
  const item = selected ? fileCopy[selected] : null;
  return <div className="modal-layer tactile-layer drawer-layer" onMouseDown={onClose}>
    <section className="tactile-scene" role="dialog" aria-modal="true" aria-label={drawerContent.ariaLabel} onMouseDown={(event) => event.stopPropagation()}>
      <header><div><span>{zoneInfo.drawer.index}</span><strong>{drawerContent.header}</strong></div><button onClick={onClose}>{siteContent.shared.returnToRoom}</button></header>
      <ZoneCloseup3D zone="drawer" faxPrinted={faxPrinted} onSelect={(item) => { if(["folder","notebook","components","envelope"].includes(item))setSelected(item as DrawerFile); }} />
      {item&&<div className={`drawer-document document-${selected}`} onMouseDown={() => setSelected(null)}><div className="drawer-document-paper" onMouseDown={(event) => event.stopPropagation()}><button className="drawer-document-return" onClick={() => setSelected(null)}>{drawerContent.returnItem}</button><article><small>{item.meta}</small>{item.title&&<h2>{item.title}</h2>}<p>{item.copy}</p><dl className="artifact-facts">{item.facts.map((fact)=><div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl><blockquote>{item.note}</blockquote></article></div></div>}
    </section>
  </div>;
}

type NotebookItem = "research"|"margin"|"diagram";

function NotebookScene({onClose}:{onClose:()=>void}) {
  const [selected,setSelected]=useState<NotebookItem|null>(null);
  const [reverse,setReverse]=useState(false);
  const pages=notebookContent.items as Record<NotebookItem,NotebookPage>;
  const page=selected?pages[selected]:null;
  const reverseSteps=selected==="research"&&page?.reverseCopy.includes(" → ")?page.reverseCopy.split(" → "):null;
  return <div className="modal-layer tactile-layer" onMouseDown={onClose}><section className="tactile-scene" role="dialog" aria-modal="true" aria-label={notebookContent.ariaLabel} onMouseDown={(event)=>event.stopPropagation()}>
    <header><div><span>{zoneInfo.notebook.index}</span><strong>{notebookContent.header}</strong></div><button onClick={onClose}>{siteContent.shared.returnToRoom}</button></header>
    <ZoneCloseup3D zone="notebook" onSelect={(item)=>{if(["research","margin","diagram"].includes(item)){setSelected(item as NotebookItem);setReverse(false);}}}/>
    {page&&<div className="model-detail" onMouseDown={()=>setSelected(null)}><article className={`notebook-closeup ${reverse?"turned":""}`} onMouseDown={(event)=>event.stopPropagation()}><div className="notebook-scroll"><small>{reverse?page.reverseMeta:page.meta}</small>{(reverse?page.reverseTitle:page.title)&&<h2>{reverse?page.reverseTitle:page.title}</h2>}{reverse?<>{reverseSteps?<div className="notebook-pipeline" aria-label={page.reverseCopy}>{reverseSteps.map((step,index)=><span className="notebook-pipeline-step" key={step}><mark>{step}</mark>{index<reverseSteps.length-1&&<b aria-hidden="true">→</b>}</span>)}</div>:<p className="notebook-reverse-copy">{page.reverseCopy}</p>}<blockquote>{page.note}</blockquote></>:<><p className="notebook-lead">{page.lead}</p><ol className="notebook-process">{page.steps.map((step)=><li key={step}>{step}</li>)}</ol></>}</div><button className="notebook-turn-control" onClick={()=>setReverse((value)=>!value)}>{reverse?notebookContent.page.turnBack:notebookContent.page.turn}</button><button className="paper-return-control" onClick={()=>setSelected(null)}>{notebookContent.returnItem}</button></article></div>}
  </section></div>;
}

const boardNotes=boardContent.notes;

function BoardScene({onClose}:{onClose:()=>void}) {
  const [selected,setSelected]=useState<number|null>(null);
  const note=selected===null?null:boardNotes[selected];
  return <div className="modal-layer tactile-layer" onMouseDown={onClose}><section className="tactile-scene" role="dialog" aria-modal="true" aria-label={boardContent.ariaLabel} onMouseDown={(event)=>event.stopPropagation()}>
    <header><div><span>{zoneInfo.board.index}</span><strong>{boardContent.header}</strong></div><button onClick={onClose}>{siteContent.shared.returnToRoom}</button></header>
    <ZoneCloseup3D zone="board" onSelect={(item)=>{const index=Number(item);if(boardNotes[index])setSelected(index);}}/>
    {note&&<div className="model-detail" onMouseDown={()=>setSelected(null)}><article className="evidence-card note-card" onMouseDown={(event)=>event.stopPropagation()}><small>{boardContent.detailMeta} {String((selected??0)+1).padStart(2,"0")} · {note.status}</small><blockquote>{note.label}</blockquote><p>{note.copy}</p><em>{note.detail}</em><button onClick={()=>setSelected(null)}>{boardContent.returnItem}</button></article></div>}
  </section></div>;
}

type FieldItem="travelMap"|"photos"|"archery"|"targetSports";
const fieldItems=fieldCaseContent.items as Record<FieldItem,FieldRecord>;
type TravelPhotoStatus="idle"|"loading"|"ready"|"lost";
const lostTravelMessages=[
  "FILM LOST IN THE ADVENTURE",
  "POSTCARD NEVER MADE IT HOME",
  "CAMERA ROLL WANDERED OFF",
  "MEMORY STILL OFF THE RECORD",
  "EVIDENCE LOST SOMEWHERE EN ROUTE",
] as const;

function randomLostTravelMessage(){return lostTravelMessages[Math.floor(Math.random()*lostTravelMessages.length)];}

function FieldMapReading({onClose}:{onClose:()=>void}) {
  const canvasRef=useRef<HTMLCanvasElement>(null);
  const pinHitsRef=useRef<readonly FieldCaseMapPinHit[]>([]);
  const pointersRef=useRef(new Map<number,{x:number;y:number}>());
  const gestureRef=useRef<{center:{x:number;y:number};distance:number}|null>(null);
  const pressRef=useRef<{id:number;x:number;y:number;moved:boolean}|null>(null);
  const [camera,setCamera]=useState<FieldCaseMapCamera>({...FIELD_CASE_MAP_VIEWS.world});
  const [activeView,setActiveView]=useState<FieldCaseMapView>("world");
  const [selectedPin,setSelectedPin]=useState<FieldCaseTravelPin|null>(null);
  const [photoStatus,setPhotoStatus]=useState<TravelPhotoStatus>("idle");
  const [photos,setPhotos]=useState<TravelPhoto[]>([]);
  const [photoIndex,setPhotoIndex]=useState(0);
  const [lostMessage,setLostMessage]=useState(lostTravelMessages[0]);

  const normalizeCamera=useCallback((next:FieldCaseMapCamera)=>{
    const canvas=canvasRef.current;
    const zoom=Math.min(10,Math.max(1,next.zoom));
    const width=canvas?.width??1400,height=canvas?.height??700;
    const scale=Math.min(width/360,height/180)*zoom;
    const latitudeLimit=Math.max(0,90-height/(2*scale));
    return {
      centerLon:((next.centerLon+540)%360)-180,
      centerLat:Math.min(latitudeLimit,Math.max(-latitudeLimit,next.centerLat)),
      zoom,
    };
  },[]);

  const chooseView=useCallback((view:FieldCaseMapView)=>{
    setSelectedPin(null);
    setActiveView(view);
    setCamera({...FIELD_CASE_MAP_VIEWS[view]});
  },[]);

  useEffect(()=>{
    if(!selectedPin){setPhotoStatus("idle");setPhotos([]);return;}
    setPhotoStatus("loading");
    setPhotos([]);
    setPhotoIndex(0);
    setLostMessage(randomLostTravelMessage());
    const nextPhotos=travelPhotosForPin(selectedPin);
    setPhotos(nextPhotos);
    setPhotoStatus(nextPhotos.length>0?"ready":"lost");
  },[selectedPin]);

  useEffect(()=>{
    if(!selectedPin)return;
    const onKeyDown=(event:KeyboardEvent)=>{
      if(event.key==="Escape")setSelectedPin(null);
      if(photoStatus==="ready"&&photos.length>1&&event.key==="ArrowLeft")setPhotoIndex((current)=>(current-1+photos.length)%photos.length);
      if(photoStatus==="ready"&&photos.length>1&&event.key==="ArrowRight")setPhotoIndex((current)=>(current+1)%photos.length);
    };
    window.addEventListener("keydown",onKeyDown);
    return ()=>window.removeEventListener("keydown",onKeyDown);
  },[photoStatus,photos.length,selectedPin]);

  const canvasPoint=useCallback((clientX:number,clientY:number)=>{
    const canvas=canvasRef.current;
    if(!canvas)return {x:0,y:0};
    const rect=canvas.getBoundingClientRect();
    return {x:(clientX-rect.left)*canvas.width/rect.width,y:(clientY-rect.top)*canvas.height/rect.height};
  },[]);

  const zoomAt=useCallback((point:{x:number;y:number},factor:number)=>{
    const canvas=canvasRef.current;
    if(!canvas)return;
    setCamera((current)=>{
      const oldScale=Math.min(canvas.width/360,canvas.height/180)*current.zoom;
      const zoom=Math.min(10,Math.max(1,current.zoom*factor));
      const newScale=Math.min(canvas.width/360,canvas.height/180)*zoom;
      const longitude=current.centerLon+(point.x-canvas.width/2)/oldScale;
      const latitude=current.centerLat-(point.y-canvas.height/2)/oldScale;
      return normalizeCamera({
        centerLon:longitude-(point.x-canvas.width/2)/newScale,
        centerLat:latitude+(point.y-canvas.height/2)/newScale,
        zoom,
      });
    });
  },[normalizeCamera]);

  useEffect(()=>{
    const canvas=canvasRef.current;
    const sheet=canvas?.parentElement;
    if(!canvas||!sheet)return;
    const draw=()=>{
      const ratio=Math.min(window.devicePixelRatio||1,2);
      const width=Math.max(1,Math.round(sheet.clientWidth*ratio));
      const height=Math.max(1,Math.round(sheet.clientHeight*ratio));
      if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}
      pinHitsRef.current=drawFieldCaseMapViewport(canvas,camera);
    };
    draw();
    const observer=new ResizeObserver(draw);
    observer.observe(sheet);
    return ()=>observer.disconnect();
  },[camera]);

  const beginPointer=(event:ReactPointerEvent<HTMLCanvasElement>)=>{
    if(event.pointerType==="mouse"&&event.button!==0)return;
    const point=canvasPoint(event.clientX,event.clientY);
    event.currentTarget.setPointerCapture(event.pointerId);
    pointersRef.current.set(event.pointerId,point);
    if(pointersRef.current.size===1)pressRef.current={id:event.pointerId,...point,moved:false};
    if(pointersRef.current.size===2){
      const [first,second]=Array.from(pointersRef.current.values());
      gestureRef.current={center:{x:(first.x+second.x)/2,y:(first.y+second.y)/2},distance:Math.hypot(second.x-first.x,second.y-first.y)};
      if(pressRef.current)pressRef.current.moved=true;
    }
  };
  const movePointer=(event:ReactPointerEvent<HTMLCanvasElement>)=>{
    const previous=pointersRef.current.get(event.pointerId);
    if(!previous)return;
    const point=canvasPoint(event.clientX,event.clientY);
    pointersRef.current.set(event.pointerId,point);
    if(pressRef.current&&Math.hypot(point.x-pressRef.current.x,point.y-pressRef.current.y)>6*(canvasRef.current?.width??1)/(canvasRef.current?.clientWidth||1))pressRef.current.moved=true;
    if(pointersRef.current.size===1){
      const canvas=canvasRef.current;if(!canvas)return;
      setCamera((current)=>{
        const scale=Math.min(canvas.width/360,canvas.height/180)*current.zoom;
        return normalizeCamera({...current,centerLon:current.centerLon-(point.x-previous.x)/scale,centerLat:current.centerLat+(point.y-previous.y)/scale});
      });
    }else if(pointersRef.current.size===2){
      const [first,second]=Array.from(pointersRef.current.values());
      const center={x:(first.x+second.x)/2,y:(first.y+second.y)/2};
      const distance=Math.max(1,Math.hypot(second.x-first.x,second.y-first.y));
      const prior=gestureRef.current;
      if(prior){
        const canvas=canvasRef.current;if(!canvas)return;
        setCamera((current)=>{
          const baseScale=Math.min(canvas.width/360,canvas.height/180);
          const oldScale=baseScale*current.zoom;
          const zoom=Math.min(10,Math.max(1,current.zoom*distance/prior.distance));
          const newScale=baseScale*zoom;
          const anchorLon=current.centerLon+(prior.center.x-canvas.width/2)/oldScale;
          const anchorLat=current.centerLat-(prior.center.y-canvas.height/2)/oldScale;
          return normalizeCamera({centerLon:anchorLon-(center.x-canvas.width/2)/newScale,centerLat:anchorLat+(center.y-canvas.height/2)/newScale,zoom});
        });
      }
      gestureRef.current={center,distance};
    }
  };
  const endPointer=(event:ReactPointerEvent<HTMLCanvasElement>,cancelled=false)=>{
    const point=canvasPoint(event.clientX,event.clientY);
    const press=pressRef.current;
    pointersRef.current.delete(event.pointerId);
    gestureRef.current=null;
    if(pointersRef.current.size===1){const remaining=Array.from(pointersRef.current.entries())[0];pressRef.current={id:remaining[0],...remaining[1],moved:true};}
    else if(pointersRef.current.size===0)pressRef.current=null;
    if(!cancelled&&press?.id===event.pointerId&&!press.moved){
      const hit=pinHitsRef.current.find((candidate)=>Math.hypot(candidate.x-point.x,candidate.y-point.y)<=candidate.radius);
      if(hit?.count&&hit.count>1&&camera.zoom<2.25)chooseView(hit.targetView);
      else if(hit?.pins.length===1)setSelectedPin(hit.pins[0]);
    }
  };

  return <article className="field-map-reading field-map-only" role="dialog" aria-label="Interactive travel map" onMouseDown={(event)=>event.stopPropagation()}>
    <div className="field-map-sheet">
      <canvas ref={canvasRef} aria-label="Interactive world map of places Alina has visited" onWheel={(event)=>{event.preventDefault();zoomAt(canvasPoint(event.clientX,event.clientY),Math.exp(-event.deltaY*.0015));}} onDoubleClick={(event)=>zoomAt(canvasPoint(event.clientX,event.clientY),1.8)} onPointerDown={beginPointer} onPointerMove={movePointer} onPointerUp={(event)=>endPointer(event)} onPointerCancel={(event)=>endPointer(event,true)}/>
      <nav className="field-map-views" aria-label="Map views">{(["world","usa","asia"] as const).map((view)=><button key={view} className={activeView===view?"active":""} onClick={()=>chooseView(view)}>{view.toUpperCase()}</button>)}</nav>
      <div className="field-map-zoom"><button aria-label="Zoom out" onClick={()=>{const canvas=canvasRef.current;if(canvas)zoomAt({x:canvas.width/2,y:canvas.height/2},.72);}}>−</button><button aria-label="Zoom in" onClick={()=>{const canvas=canvasRef.current;if(canvas)zoomAt({x:canvas.width/2,y:canvas.height/2},1.4);}}>+</button></div>
      <button className="field-map-return" aria-label="Close map" onClick={onClose}>×</button>
      {selectedPin&&<aside className="field-map-memory" aria-label={`${selectedPin.name} travel photos`}>
        <header><div><small>{selectedPin.country} · FIELD FILE</small><h2>{selectedPin.name}</h2></div><button aria-label="Return to map" onClick={()=>setSelectedPin(null)}>×</button></header>
        <div className="field-map-photo-stage">
          {photoStatus==="loading"&&<div className="field-map-photo-message"><i/><strong>DEVELOPING FILM...</strong></div>}
          {photoStatus==="lost"&&<div className="field-map-photo-message lost"><span>?</span><strong>{lostMessage}</strong></div>}
          {photoStatus==="ready"&&photos[photoIndex]&&<img key={photos[photoIndex].src} src={photos[photoIndex].src} alt={photos[photoIndex].alt} onError={()=>{setLostMessage(randomLostTravelMessage());setPhotoStatus("lost");}}/>}
        </div>
        {photoStatus==="ready"&&photos[photoIndex]&&<footer>
          <div><strong>{String(photoIndex+1).padStart(2,"0")} / {String(photos.length).padStart(2,"0")}</strong><span>{photos[photoIndex].caption||"FIELD MEMORY"}</span></div>
          {photos.length>1&&<nav aria-label="Photo controls"><button aria-label="Previous photo" onClick={()=>setPhotoIndex((current)=>(current-1+photos.length)%photos.length)}>←</button><button aria-label="Next photo" onClick={()=>setPhotoIndex((current)=>(current+1)%photos.length)}>→</button></nav>}
        </footer>}
      </aside>}
    </div>
  </article>;
}

function FieldCaseScene({onClose}:{onClose:()=>void}) {
  const [selected,setSelected]=useState<FieldItem|null>(null);
  const item=selected?fieldItems[selected]:null;
  return <div className="modal-layer tactile-layer" onMouseDown={onClose}><section className="tactile-scene" role="dialog" aria-modal="true" aria-label={fieldCaseContent.ariaLabel} onMouseDown={(event)=>event.stopPropagation()}>
    <header><div><span>{zoneInfo.fieldcase.index}</span><strong>{fieldCaseContent.header}</strong></div><button onClick={onClose}>{siteContent.shared.returnToRoom}</button></header>
      <ZoneCloseup3D zone="fieldcase" onSelect={(value)=>{if(value in fieldItems)setSelected(value as FieldItem);}}/>
    {Object.keys(fieldItems).length===0&&<article className="collection-empty-state field-empty-state"><small>{fieldCaseContent.emptyState.meta}</small><h2>{fieldCaseContent.emptyState.title}</h2><p>{fieldCaseContent.emptyState.copy}</p><em>{fieldCaseContent.emptyState.note}</em></article>}
    {item&&selected==="travelMap"&&<div className="model-detail field-detail" onMouseDown={()=>setSelected(null)}><FieldMapReading onClose={()=>setSelected(null)}/></div>}
    {item&&selected!=="travelMap"&&<div className="model-detail field-detail" onMouseDown={()=>setSelected(null)}><article className="evidence-card field-card" onMouseDown={(event)=>event.stopPropagation()}><small>{item.meta}</small>{item.title&&<h2>{item.title}</h2>}<p>{item.copy}</p>{item.metrics.length>0&&<div className="field-metrics">{item.metrics.map((metric)=><div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}</div>}<div className="object-tags">{item.tags.map((tag)=><span key={tag}>{tag}</span>)}</div><button onClick={()=>setSelected(null)}>{fieldCaseContent.returnItem}</button></article></div>}
  </section></div>;
}

function PrinterScene({onClose,faxPrinted,onFaxPrinted}:{onClose:()=>void;faxPrinted:boolean;onFaxPrinted:()=>void}) {
  const [reportOpen,setReportOpen]=useState(false);
  const card=useContactCard();
  return <div className="modal-layer tactile-layer printer-layer" onMouseDown={onClose}>
    <section className="tactile-scene" role="dialog" aria-modal="true" aria-label={faxContact.printer.ariaLabel} onMouseDown={(event)=>event.stopPropagation()}>
      <header><div><span>{faxContact.printer.headerCode}</span><strong>{faxContact.printer.header}</strong></div><button onClick={onClose}>{siteContent.shared.returnToRoom}</button></header>
      <ZoneCloseup3D zone="printer" faxPrinted={faxPrinted} onFaxPrinted={onFaxPrinted} contactCardRaised={card.phase==="lifting"||card.phase==="open"} onSelect={(item)=>{if(item==="fax")setReportOpen(true);if(item==="contact"){setReportOpen(false);card.pickUp();}}} />
      {reportOpen&&<div className="fax-reading" onMouseDown={()=>setReportOpen(false)}><article className="fax-paper fax-reading-paper" onMouseDown={(event)=>event.stopPropagation()}><div className="fax-reading-scroll"><small>{faxContact.printer.report.meta}</small><h2 id="fax-title">{faxContact.printer.report.title}</h2>{faxContact.printer.report.paragraphs.map((paragraph)=><p key={paragraph}>{paragraph}</p>)}<strong>{faxContact.printer.report.signature}</strong><footer><span>{faxContact.printer.report.status}</span><a href={`mailto:${faxContact.contact.email}`}>{faxContact.printer.report.reply}</a></footer></div><button className="fax-return" onClick={()=>setReportOpen(false)}>{faxContact.printer.report.return}</button></article></div>}
      {(card.phase==="open"||card.phase==="returning")&&<ContactCardReading returning={card.phase==="returning"} onReturn={card.returnToTable} />}
    </section>
  </div>;
}

function ContactCardReading({returning,onReturn}:{returning:boolean;onReturn:()=>void}) {
  return <div className={`contact-reading ${returning?"returning":""}`} onMouseDown={onReturn}><article className="contact-card-detail" onMouseDown={(event)=>event.stopPropagation()}><small>{faxContact.contact.name}</small><h2>{faxContact.contact.headline[0]}<br />{faxContact.contact.headline[1]}</h2><p>{faxContact.contact.role}</p><a href={`mailto:${faxContact.contact.email}`}>{faxContact.contact.email} <span>{siteContent.shared.arrow}</span></a><button onClick={onReturn}>{faxContact.contact.return}</button></article></div>;
}

function ContactScene({onClose,faxPrinted}:{onClose:()=>void;faxPrinted:boolean}) {
  const card=useContactCard(true);
  return <div className="modal-layer tactile-layer contact-layer" onMouseDown={onClose}>
    <section className="tactile-scene" role="dialog" aria-modal="true" aria-label={faxContact.contact.ariaLabel} onMouseDown={(event)=>event.stopPropagation()}>
      <header><div><span>{faxContact.contact.headerCode}</span><strong>{faxContact.contact.header}</strong></div><button onClick={onClose}>{siteContent.shared.returnToRoom}</button></header>
      <ZoneCloseup3D zone="contact" faxPrinted={faxPrinted} contactCardRaised={card.phase==="lifting"||card.phase==="open"} onSelect={(item)=>{if(item==="contact")card.pickUp();}} />
      {(card.phase==="open"||card.phase==="returning")&&<ContactCardReading returning={card.phase==="returning"} onReturn={card.returnToTable} />}
    </section>
  </div>;
}

export default function VersionThree() {
  const [entered,setEntered] = useState(false);
  const [hovered,setHovered] = useState<ZoneId|null>(null);
  const [active,setActive] = useState<ZoneId|null>(null);
  const [discovered,setDiscovered] = useState<ZoneId[]>([]);
  const [indexOpen,setIndexOpen] = useState(false);
  const [selectedComputerFile,setSelectedComputerFile] = useState<ComputerFile|null>(null);
  const [computerWindows,setComputerWindows] = useState<ComputerWindowId[]>([]);
  const [windowPositions,setWindowPositions] = useState<Partial<Record<ComputerWindowId,WindowPosition>>>({});
  const [maximizedWindow,setMaximizedWindow] = useState<ComputerWindowId|null>(null);
  const [referenceFilter,setReferenceFilter] = useState<ReferenceFilter>("all");
  const [bulletin,setBulletin] = useState(false);
  const [faxOpen,setFaxOpen] = useState(false);
  const [faxPrinted,setFaxPrinted] = useState(false);
  const [contactOpen,setContactOpen] = useState(false);

  const inspect = useCallback((zone: ZoneId) => {
    setActive(zone);
    setDiscovered((current) => current.includes(zone)?current:[...current,zone]);
  },[]);

  useEffect(() => {
    if (active!=="computer") return;
    const timer = window.setTimeout(() => setBulletin(true),2300);
    return () => window.clearTimeout(timer);
  },[active]);

  useEffect(() => {
    const close = (event:KeyboardEvent) => {
      if (event.key!=="Escape") return;
      if(active==="computer"&&computerWindows.length){const closing=computerWindows.at(-1); setComputerWindows((current)=>current.slice(0,-1)); setMaximizedWindow((current)=>current===closing?null:current); return;}
      setActive(null); setIndexOpen(false); setFaxOpen(false); setContactOpen(false);
    };
    window.addEventListener("keydown",close);
    return () => window.removeEventListener("keydown",close);
  },[active,computerWindows]);

  const focusComputerWindow = useCallback((windowId:ComputerWindowId) => {
    setComputerWindows((current)=>current.at(-1)===windowId?current:[...current.filter((item)=>item!==windowId),windowId]);
  },[]);

  const openComputerFile = (file: ComputerFile) => {
    if(file==="desktop"){
      setComputerWindows([]);
      setMaximizedWindow(null);
      setSelectedComputerFile(null);
      return;
    }
    if(file==="references")setReferenceFilter("all");
    focusComputerWindow(file);
    setSelectedComputerFile(null);
  };

  const openReferences = (filter:ReferenceFilter) => {
    setReferenceFilter(filter);
    focusComputerWindow("references");
    setSelectedComputerFile(null);
  };

  const closeComputerWindow=(windowId:ComputerWindowId)=>{
    setComputerWindows((current)=>current.filter((item)=>item!==windowId));
    setMaximizedWindow((current)=>current===windowId?null:current);
  };
  const moveComputerWindow=(windowId:ComputerWindowId,position:WindowPosition)=>setWindowPositions((current)=>({...current,[windowId]:position}));
  const toggleMaximizedWindow=(windowId:ComputerWindowId)=>setMaximizedWindow((current)=>current===windowId?null:windowId);
  const showComputerWindow=(windowId:ComputerWindowId)=>computerWindows.includes(windowId);
  const computerWindowZ=(windowId:ComputerWindowId)=>6+computerWindows.indexOf(windowId);
  const computerWindowPosition=(windowId:ComputerWindowId)=>windowPositions[windowId]??{x:0,y:0};
  const computerTaskbarItem=(windowId:ComputerWindowId)=>{
    if(windowId==="references")return {icon:"◉",label:"REFERENCES"};
    if(windowId==="projects")return {icon:"▰",label:"PROJECTS"};
    if(windowId==="experience")return {icon:"▰",label:"EXPERIENCE"};
    if(windowId==="profile")return {icon:"●",label:"PROFILE"};
    if(windowId==="lablog")return {icon:"≡",label:"LAB LOG"};
    if(windowId==="readme")return {icon:"▤",label:"README"};
    if(windowId==="map")return {icon:"▤",label:"MAP"};
    if(windowId==="allocation")return {icon:"▤",label:"ALLOCATION"};
    if(windowId==="emg")return {icon:"▤",label:"EMG"};
    if(windowId==="research")return {icon:"▤",label:"RESEARCH"};
    return {icon:"▤",label:"INTERNSHIP"};
  };
  const taskbarWindowIds:ComputerWindowId[]=["profile","readme","lablog","projects","map","allocation","emg","experience","research","internship","references"];
  const taskbarWindows=taskbarWindowIds.filter(showComputerWindow);
  const solved = discovered.length===zoneOrder.length;
  const status = roomContent.status.messages[discovered.length];
  const visibleReferences = referenceFilter==="all"?projectReferences:projectReferences.filter((reference)=>reference.project===referenceFilter);

  return (
    <main className={`room-shell ${entered?"room-entered":""}`}>
      <header className="room-nav">
        <button className="room-brand" onClick={() => setIndexOpen(true)}>{siteContent.brand.name} <span>{siteContent.brand.lab}</span></button>
        <nav><button onClick={() => setIndexOpen(true)}>{roomContent.navigation.index}</button><button onClick={() => setContactOpen(true)}>{roomContent.navigation.contact}</button></nav>
        <div className="room-count"><i /> {String(discovered.length).padStart(2,"0")}{roomContent.navigation.foundSuffix}</div>
      </header>

      <section className="room-viewport" aria-label={roomContent.ariaLabel}>
        <LabGame active={entered&&!active&&!indexOpen&&!faxOpen&&!contactOpen} viewing={active} discovered={discovered} faxReady={solved} faxPrinted={faxPrinted} onHover={setHovered} onInspect={inspect} onPrinterInspect={()=>setFaxOpen(true)} />
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
            <header className="os-bar"><span>{computerContent.topBar.title}</span><div><b>{computerContent.topBar.sync}</b><i />{computerContent.topBar.time}</div><button onClick={() => { setComputerWindows([]); setMaximizedWindow(null); setActive(null); }}>{computerContent.topBar.leave}</button></header>
            <div className="os-screen">
              <aside className="os-sidebar"><button className="os-profile-trigger" onClick={() => focusComputerWindow("profile")} aria-label={computerContent.profile.triggerAria}>{siteContent.brand.initials}</button><button onClick={() => openComputerFile("desktop")}>{computerContent.sidebar.desktop}</button><button onClick={() => openComputerFile("projects")}>{computerContent.sidebar.projects}</button><button onClick={() => openComputerFile("experience")}>{computerContent.sidebar.experience}</button><button onClick={() => openComputerFile("references")}>{computerContent.sidebar.references}</button><button onClick={() => openComputerFile("lablog")}>{computerContent.sidebar.labLog}</button><span>{computerContent.sidebar.location}</span></aside>
              <main className="os-workspace">
                <div className="desktop-icons">
                  <button className={selectedComputerFile==="readme"?"selected":""} onClick={() => setSelectedComputerFile("readme")} onDoubleClick={() => openComputerFile("readme")} onKeyDown={(event) => { if(event.key==="Enter") openComputerFile("readme"); }}><i className="file-icon" /><span>{computerContent.desktop.icons.readme}</span></button>
                  <button className={selectedComputerFile==="lablog"?"selected":""} onClick={() => setSelectedComputerFile("lablog")} onDoubleClick={() => openComputerFile("lablog")} onKeyDown={(event) => { if(event.key==="Enter") openComputerFile("lablog"); }}><i className="file-icon log-file-icon" /><span>{computerContent.desktop.icons.labLog}</span></button>
                  <button className={selectedComputerFile==="projects"?"selected":""} onClick={() => setSelectedComputerFile("projects")} onDoubleClick={() => openComputerFile("projects")} onKeyDown={(event) => { if(event.key==="Enter") openComputerFile("projects"); }}><i className="folder-icon" /><span>{computerContent.desktop.icons.projects}</span></button>
                  <button className={selectedComputerFile==="experience"?"selected":""} onClick={() => setSelectedComputerFile("experience")} onDoubleClick={() => openComputerFile("experience")} onKeyDown={(event) => { if(event.key==="Enter") openComputerFile("experience"); }}><i className="folder-icon" /><span>{computerContent.desktop.icons.experience}</span></button>
                  <button className={selectedComputerFile==="references"?"selected":""} onClick={() => setSelectedComputerFile("references")} onDoubleClick={() => openComputerFile("references")} onKeyDown={(event) => { if(event.key==="Enter") openComputerFile("references"); }}><i className="file-icon web-file-icon" /><span>{computerContent.desktop.icons.references}</span></button>
                  <div className="desktop-welcome"><small>{computerContent.desktop.welcome.eyebrow}</small><h2>{computerContent.desktop.welcome.title}</h2><p>{computerContent.desktop.welcome.description}</p></div>
                </div>

                {showComputerWindow("readme")&&<DraggableComputerWindow id="readme" className="text-file readme-file" position={computerWindowPosition("readme")} zIndex={computerWindowZ("readme")} onMove={moveComputerWindow} onFocus={focusComputerWindow} onClose={closeComputerWindow} ariaLabel={computerContent.readme.filename} header={<span>{computerContent.readme.filename}</span>}>
                  <div className="os-window-content"><small>{computerContent.readme.meta}</small><h2>{computerContent.readme.title}</h2>{computerContent.readme.paragraphs.map((paragraph)=><p key={paragraph}>{paragraph}</p>)}</div>
                </DraggableComputerWindow>}

                {showComputerWindow("lablog")&&<DraggableComputerWindow id="lablog" className="lab-log-window" position={computerWindowPosition("lablog")} zIndex={computerWindowZ("lablog")} onMove={moveComputerWindow} onFocus={focusComputerWindow} onClose={closeComputerWindow} ariaLabel={computerContent.labLog.filename} header={<span>{computerContent.labLog.filename}</span>}>
                  <div className="os-window-content lab-log-feed"><p className="lab-log-line lab-log-meta"><span>{computerContent.labLog.meta}</span></p>{computerContent.labLog.entries.map((entry)=><article className="lab-log-entry" key={`${entry.date}-${entry.title}`}><p className="lab-log-line lab-log-stamp"><span>[{entry.date}] {entry.type}</span></p><h2 className="lab-log-line"><span>{entry.title}</span></h2>{entry.body.map((paragraph)=><p className="lab-log-line" key={paragraph}><span>{paragraph}</span></p>)}<p className="lab-log-line lab-log-end" aria-hidden="true"><span>---</span></p></article>)}</div>
                </DraggableComputerWindow>}

                {showComputerWindow("projects")&&<DraggableComputerWindow id="projects" className="folder-window" position={computerWindowPosition("projects")} zIndex={computerWindowZ("projects")} onMove={moveComputerWindow} onFocus={focusComputerWindow} onClose={closeComputerWindow} ariaLabel={computerContent.projectsFolder.title} header={<span>{computerContent.projectsFolder.title}</span>}>
                  <div className="os-window-content file-list">{projectFiles.map((file) => <button className={selectedComputerFile===file.id?"selected":""} key={file.id} onClick={() => setSelectedComputerFile(file.id)} onDoubleClick={() => openComputerFile(file.id)} onKeyDown={(event) => { if(event.key==="Enter") openComputerFile(file.id); }}><i className="document-icon" /><span><strong>{file.name}</strong><small>{file.meta}</small></span></button>)}</div>
                </DraggableComputerWindow>}

                {projectFiles.map((file)=>showComputerWindow(file.id)&&<DraggableComputerWindow key={file.id} id={file.id} className="project-window" position={computerWindowPosition(file.id)} zIndex={computerWindowZ(file.id)} onMove={moveComputerWindow} onFocus={focusComputerWindow} onClose={closeComputerWindow} ariaLabel={file.name} header={<span>{file.name}</span>}>
                  <div className="os-window-content project-file-content"><small>{file.meta}</small><h2>{file.title}</h2><p className="project-lead">{file.copy}</p><div className="project-facts">{file.facts.map((fact) => <span key={fact}>{fact}</span>)}</div><dl className="project-brief">{file.details.map((detail)=><div key={detail.label}><dt>{detail.label}</dt><dd>{detail.copy}</dd></div>)}</dl><div className="project-file-actions"><button className="project-reference-link" onClick={()=>openReferences(file.id)}>{referencesContent.browser.projectLink}</button><button className="run-file">{computerContent.projectsFolder.verified}</button></div></div>
                </DraggableComputerWindow>)}

                {showComputerWindow("references")&&<DraggableComputerWindow id="references" className="reference-browser-window" position={computerWindowPosition("references")} zIndex={computerWindowZ("references")} onMove={moveComputerWindow} onFocus={focusComputerWindow} onClose={closeComputerWindow} onToggleMaximize={toggleMaximizedWindow} isMaximized={maximizedWindow==="references"} ariaLabel={referencesContent.browser.ariaLabel} header={<span>{referencesContent.browser.filename}</span>}>
                  <div className="os-window-content reference-browser-content">
                    <div className="reference-browser-bar"><span aria-hidden="true">● ● ●</span><div>{referencesContent.browser.address}</div></div>
                    <header className="reference-site-header"><small>{referencesContent.browser.meta}</small><h2>{referencesContent.browser.title}</h2><p>{referencesContent.browser.intro}</p></header>
                    <nav className="reference-site-nav" aria-label="Filter project references">{referenceGroups.map((group)=><button className={referenceFilter===group.id?"active":""} key={group.id} onClick={()=>setReferenceFilter(group.id)}>{group.label}</button>)}</nav>
                    <section className="reference-site-list">{visibleReferences.map((reference)=><article key={reference.id}><small>{reference.meta}</small><h3>{reference.title}</h3><p className="reference-citation">{reference.citation}</p><p>{reference.summary}</p><blockquote>{reference.annotation}</blockquote><div><span>{reference.provenance}</span><a href={reference.url} target="_blank" rel="noreferrer">{referencesContent.browser.openSource}</a></div></article>)}</section>
                  </div>
                </DraggableComputerWindow>}

                {showComputerWindow("experience")&&<DraggableComputerWindow id="experience" className="experience-window" position={computerWindowPosition("experience")} zIndex={computerWindowZ("experience")} onMove={moveComputerWindow} onFocus={focusComputerWindow} onClose={closeComputerWindow} ariaLabel={computerContent.experience.folderTitle} header={<span>{computerContent.experience.folderTitle}</span>}>
                  <div className="os-window-content"><button className={selectedComputerFile==="research"?"selected":""} onClick={() => setSelectedComputerFile("research")} onDoubleClick={() => openComputerFile("research")} onKeyDown={(event)=>{if(event.key==="Enter")openComputerFile("research");}}><span>{computerContent.experience.research.listMeta}</span><strong>{computerContent.experience.research.organization}</strong><small>{computerContent.experience.research.date}</small></button><button className={selectedComputerFile==="internship"?"selected":""} onClick={() => setSelectedComputerFile("internship")} onDoubleClick={() => openComputerFile("internship")} onKeyDown={(event)=>{if(event.key==="Enter")openComputerFile("internship");}}><span>{computerContent.experience.internship.listMeta}</span><strong>{computerContent.experience.internship.organization}</strong><small>{computerContent.experience.internship.date}</small></button></div>
                </DraggableComputerWindow>}

                {showComputerWindow("research")&&<DraggableComputerWindow id="research" className="text-file experience-detail-window" position={computerWindowPosition("research")} zIndex={computerWindowZ("research")} onMove={moveComputerWindow} onFocus={focusComputerWindow} onClose={closeComputerWindow} ariaLabel={computerContent.experience.research.filename} header={<span>{computerContent.experience.research.filename}</span>}>
                  <div className="os-window-content experience-file-content"><small>{computerContent.experience.research.meta}</small><h2>{computerContent.experience.research.title}</h2><p>{computerContent.experience.research.copy}</p><dl className="experience-brief">{computerContent.experience.research.details.map((detail)=><div key={detail.label}><dt>{detail.label}</dt><dd>{detail.copy}</dd></div>)}</dl><blockquote>{computerContent.experience.research.quote}</blockquote></div>
                </DraggableComputerWindow>}

                {showComputerWindow("internship")&&<DraggableComputerWindow id="internship" className="text-file experience-detail-window" position={computerWindowPosition("internship")} zIndex={computerWindowZ("internship")} onMove={moveComputerWindow} onFocus={focusComputerWindow} onClose={closeComputerWindow} ariaLabel={computerContent.experience.internship.filename} header={<span>{computerContent.experience.internship.filename}</span>}>
                  <div className="os-window-content experience-file-content"><small>{computerContent.experience.internship.meta}</small><h2>{computerContent.experience.internship.title}</h2><p>{computerContent.experience.internship.copy}</p><dl className="experience-brief">{computerContent.experience.internship.details.map((detail)=><div key={detail.label}><dt>{detail.label}</dt><dd>{detail.copy}</dd></div>)}</dl><blockquote>{computerContent.experience.internship.quote}</blockquote></div>
                </DraggableComputerWindow>}

                {showComputerWindow("profile")&&<DraggableComputerWindow id="profile" className="profile-window" position={computerWindowPosition("profile")} zIndex={computerWindowZ("profile")} onMove={moveComputerWindow} onFocus={focusComputerWindow} onClose={closeComputerWindow} ariaLabel={computerContent.profile.windowTitle} header={<span>{computerContent.profile.windowTitle}</span>}>
                  <div className="os-window-content profile-window-body">
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
                </DraggableComputerWindow>}

                <div className={`news-popup ${bulletin?"visible":""}`}><header><span>{computerContent.bulletin.header}</span><button onClick={() => setBulletin(false)}>{siteContent.shared.close}</button></header><strong>{computerContent.bulletin.title}</strong><p>{computerContent.bulletin.copy}</p></div>
              </main>
              <footer className="os-taskbar"><button className="taskbar-home" onClick={() => openComputerFile("desktop")} aria-label="Show desktop">{siteContent.brand.initials}</button><div className="taskbar-apps" aria-label="Open applications">{taskbarWindows.map((windowId)=>{const item=computerTaskbarItem(windowId);return <button className={`taskbar-app ${computerWindows.at(-1)===windowId?"active":""}`} key={windowId} onClick={()=>focusComputerWindow(windowId)} aria-label={`Focus ${item.label}`} aria-pressed={computerWindows.at(-1)===windowId}><i aria-hidden="true">{item.icon}</i><span>{item.label}</span></button>;})}</div><span className="taskbar-files">{computerContent.taskbar.files}</span><span className="taskbar-alert">{bulletin?computerContent.taskbar.unread:computerContent.taskbar.clear}</span></footer>
            </div>
          </div>
        </div>
      )}

      {active==="drawer"&&<DrawerScene faxPrinted={faxPrinted} onClose={() => setActive(null)} />}
      {active==="notebook"&&<NotebookScene onClose={() => setActive(null)} />}
      {active==="books"&&<BookshelfScene onClose={() => setActive(null)} />}
      {active==="board"&&<BoardScene onClose={() => setActive(null)} />}
      {active==="fieldcase"&&<FieldCaseScene onClose={() => setActive(null)} />}

      {faxOpen&&<PrinterScene faxPrinted={faxPrinted} onFaxPrinted={()=>setFaxPrinted(true)} onClose={()=>setFaxOpen(false)} />}
      {contactOpen&&<ContactScene faxPrinted={faxPrinted} onClose={()=>setContactOpen(false)} />}
    </main>
  );
}
