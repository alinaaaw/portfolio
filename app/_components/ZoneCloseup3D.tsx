"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export type CloseupZone = "drawer" | "books" | "notebook" | "board" | "fieldcase";

type Props = {
  zone: CloseupZone;
  onSelect: (item: string) => void;
};

type HitMesh = THREE.Mesh & { userData: { item?: string; label?: string; requiresOpen?: boolean; visuals?: THREE.Mesh[] } };

const palette = {
  void: 0x07100f,
  ink: 0x101817,
  metal: 0x303a36,
  steel: 0x78817c,
  wood: 0x51392a,
  woodLight: 0x76543c,
  paper: 0xe2d8bd,
  paperDark: 0xc3b58d,
  cyan: 0x70c9c0,
  signal: 0xd1f45c,
  red: 0xb94e3e,
  green: 0x294139,
};

function mat(color:number,roughness=.78,metalness=.04,emissive=0x000000,intensity=0) {
  return new THREE.MeshStandardMaterial({color,roughness,metalness,emissive,emissiveIntensity:intensity});
}

function box(w:number,h:number,d:number,color:number,roughness?:number,metalness?:number) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(color,roughness,metalness));
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function cylinder(radius:number,height:number,color:number,segments=24) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius,radius,height,segments),mat(color));
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function hitBox(item:string,label:string,size:[number,number,number],position:[number,number,number],visuals:THREE.Mesh[],requiresOpen=false) {
  const hit = new THREE.Mesh(
    new THREE.BoxGeometry(...size),
    new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}),
  ) as HitMesh;
  hit.position.set(...position);
  hit.userData = {item,label,visuals,requiresOpen};
  return hit;
}

function addLines(parent:THREE.Object3D,x:number,y:number,z:number,width:number,count:number,vertical=false) {
  for (let index=0;index<count;index+=1) {
    const line = box(vertical?.018:width,.012,vertical?width:.018,index%4===0?palette.red:0x6d8b83);
    line.position.set(x+(vertical?index*.18:0),y+.025,z+(vertical?0:index*.16));
    parent.add(line);
  }
}

function buildBooks(scene:THREE.Scene,hits:HitMesh[]) {
  const shelf = new THREE.Group();
  const back = box(7.2,5.1,.18,0x32231b,.92,.02);
  back.position.set(0,2.55,-.55);
  const sideL = box(.3,5.5,1.5,palette.wood,.86,.03);
  sideL.position.set(-3.65,2.55,0);
  const sideR = sideL.clone(); sideR.position.x=3.65;
  shelf.add(back,sideL,sideR);
  for (const y of [.15,2.25,4.55]) {
    const board = box(7.5,.22,1.55,palette.woodLight,.84,.03);
    board.position.set(0,y,0);
    shelf.add(board);
  }
  const colors=[0x28504a,0x854b3d,0xb29145,0x33473f,0xd0c4a5,0x334d65];
  const labels=["Fair Allocation","Walking Distance","Signals in Motion","Human Systems","Relevance","Field Routes"];
  for (let index=0;index<6;index+=1) {
    const group=new THREE.Group();
    const height=1.5+(index%3)*.16;
    const width=.72+(index%2)*.08;
    const cover=box(width,height,.78,colors[index],.7,.02);
    cover.position.y=height/2;
    const pages=box(width-.12,height-.12,.67,0xd7cba9,.93,.01);
    pages.position.set(.04,height/2,.08);
    const band=box(width+.02,.055,.81,index===2?palette.signal:0xbba980,.7,.02);
    band.position.set(0,height*.7,.01);
    group.add(cover,pages,band);
    if(index===1||index===3||index===5){
      const bookmark=box(.13,.36,.025,index===3?palette.signal:palette.red);
      bookmark.position.set(width*.2,height+.13,.05);
      group.add(bookmark);
    }
    group.position.set(-2.72+index*1.08,.27,.08);
    group.rotation.z=(index-2.5)*.012;
    shelf.add(group);
    const hit=hitBox(String(index),labels[index],[width+.18,height+.25,1],[group.position.x,.27+height/2,.08],[cover,pages,band]);
    shelf.add(hit); hits.push(hit);
  }
  for(let index=0;index<9;index+=1){
    const filler=box(.48+(index%2)*.1,1.1+(index%3)*.1,.7,[0x594237,0x415954,0x82634a][index%3]);
    filler.position.set(-3+index*.72,2.92+(index%2)*.05,0);
    shelf.add(filler);
  }
  shelf.position.y=-.2;
  scene.add(shelf);
}

function buildDrawer(scene:THREE.Scene,hits:HitMesh[]) {
  const desk=box(8,.32,4.8,palette.woodLight,.86,.03);
  desk.position.y=2.1;
  scene.add(desk);
  const cabinet=box(6.4,1.7,3.5,palette.wood,.88,.02);
  cabinet.position.set(0,1.02,-.35);
  scene.add(cabinet);
  const tray=new THREE.Group();
  tray.userData.drawerTray=true;
  const bottom=box(5.75,.14,3.05,0x38271f,.94,.01);
  bottom.position.y=.42;
  const left=box(.16,.72,3.1,palette.woodLight,.88,.02); left.position.set(-2.9,.75,0);
  const right=left.clone(); right.position.x=2.9;
  const back=box(5.9,.72,.16,palette.woodLight,.88,.02); back.position.set(0,.75,-1.5);
  const front=box(6.1,1.08,.25,0x76543c,.82,.04); front.position.set(0,.84,1.58);
  const handle=box(1.05,.16,.18,palette.steel,.35,.72); handle.position.set(0,.88,1.76);
  tray.add(bottom,left,right,back,front,handle);
  const folder=box(2.05,.12,1.6,0x8b453a,.88,.01); folder.position.set(-1.65,.57,-.2); folder.rotation.y=-.08;
  const notebook=box(1.15,.17,1.5,0xd7c9a8,.88,.01); notebook.position.set(.35,.61,-.55); notebook.rotation.y=.04;
  const envelope=box(2.1,.1,.9,0xb89b65,.91,.01); envelope.position.set(.25,.6,.65); envelope.rotation.y=-.05;
  const pouch=box(1.3,.18,1.3,0x33413d,.4,.18); pouch.position.set(2,.62,-.25);
  const circuit=box(.82,.12,.72,0x245e4f,.5,.12); circuit.position.set(2,.78,-.25);
  tray.add(folder,notebook,envelope,pouch,circuit);
  const handleHit=hitBox("drawer-handle","PULL DRAWER",[1.5,.55,.55],[0,.88,1.8],[handle,front]);
  tray.add(handleHit); hits.push(handleHit);
  const items:[string,string,THREE.Mesh,[number,number,number],[number,number,number]][]=[
    ["folder","PROJECT FOLDER",folder,[2.25,.55,1.8],[-1.65,.75,-.2]],
    ["notebook","FIELD NOTEBOOK",notebook,[1.45,.55,1.75],[.35,.76,-.55]],
    ["envelope","SEALED ENVELOPE",envelope,[2.3,.5,1.12],[.25,.75,.65]],
    ["components","COMPONENT POUCH",pouch,[1.65,.6,1.55],[2,.78,-.25]],
  ];
  items.forEach(([item,label,visual,size,position])=>{ const hit=hitBox(item,label,size,position,[visual],true); tray.add(hit); hits.push(hit); });
  tray.position.set(0,.05,-.3);
  scene.add(tray);
  for(const x of [-3.15,3.15]){ const leg=box(.25,2,.25,palette.metal,.4,.68); leg.position.set(x,1,-1.55); scene.add(leg); }
}

function buildNotebook(scene:THREE.Scene,hits:HitMesh[]) {
  const table=box(8,.35,5.5,palette.woodLight,.9,.02); table.position.y=.05; scene.add(table);
  const matBoard=box(6.9,.06,4.6,0x213a35,.95,.02); matBoard.position.y=.27; scene.add(matBoard);
  for(let index=0;index<10;index+=1){ const grid=box(.015,.015,4.35,0x496960); grid.position.set(-3.1+index*.68,.315,0); scene.add(grid); }
  const book=new THREE.Group();
  const left=box(3.05,.12,3.85,palette.paper,.94,.01); left.position.set(-1.53,.48,0); left.rotation.y=-.025;
  const right=box(3.05,.12,3.85,0xe8ddc1,.94,.01); right.position.set(1.53,.48,0); right.rotation.y=.025;
  book.add(left,right);
  addLines(book,-1.53,.55,-1.42,2.45,12);
  addLines(book,1.53,.55,-1.42,2.45,12);
  const spine=box(.2,.18,3.9,0x6f5039,.78,.03); spine.position.set(0,.51,0); book.add(spine);
  const sticky=box(.7,.05,.75,palette.signal); sticky.position.set(1.9,.6,-.72); sticky.rotation.y=.08; book.add(sticky);
  const photo=box(1.25,.05,.95,0x455d59); photo.position.set(-1.55,.62,.62); photo.rotation.y=-.08; book.add(photo);
  const pen=cylinder(.065,2.7,palette.red,12); pen.rotation.z=Math.PI/2; pen.position.set(.9,.72,1.65); book.add(pen);
  scene.add(book);
  const researchHit=hitBox("research","RESEARCH PAGE",[2.8,.5,3.5],[-1.55,.7,0],[left]);
  const marginHit=hitBox("margin","PERSONAL MARGIN",[2.8,.5,3.5],[1.55,.7,0],[right,sticky]);
  const diagramHit=hitBox("diagram","FIELD DIAGRAM",[1.5,.65,1.2],[-1.55,.82,.62],[photo]);
  scene.add(researchHit,marginHit,diagramHit); hits.push(researchHit,marginHit,diagramHit);
  const mug=cylinder(.45,.78,0x29423c,28); mug.position.set(3.25,.66,-1.6); scene.add(mug);
}

function buildBoard(scene:THREE.Scene,hits:HitMesh[]) {
  const frame=box(8.4,5.35,.35,palette.wood,.86,.03); frame.position.set(0,2.7,-.25); scene.add(frame);
  const cork=box(7.85,4.82,.18,0x765d42,.98,.01); cork.position.set(0,2.7,0); scene.add(cork);
  const notes=[
    {x:-2.65,y:3.75,w:1.5,h:1.1,color:0xe1d3a4,label:"RESEARCH FIRST"},
    {x:-.7,y:3.55,w:1.65,h:1.35,color:0xb8d5cc,label:"OPEN QUESTION"},
    {x:1.55,y:3.8,w:1.35,h:1.05,color:0xd9a58f,label:"PLAN B"},
    {x:2.45,y:2.15,w:1.7,h:1.25,color:0xe2d8bd,label:"FIELD ROUTE"},
    {x:-1.9,y:1.65,w:1.85,h:1.2,color:0xc7b77f,label:"USEFUL FIRST"},
  ];
  notes.forEach((note,index)=>{
    const paper=box(note.w,note.h,.06,note.color,.94,.01); paper.position.set(note.x,note.y,.18); paper.rotation.z=(index-2)*.035; scene.add(paper);
    for(let line=0;line<4;line+=1){ const mark=box(note.w*.68,.018,.02,line===0?palette.red:0x63746d); mark.position.set(note.x,note.y+.25-line*.17,.225); mark.rotation.z=paper.rotation.z; scene.add(mark); }
    const pin=cylinder(.07,.1,index===2?palette.red:palette.signal,12); pin.rotation.x=Math.PI/2; pin.position.set(note.x,note.y+note.h*.37,.27); scene.add(pin);
    const hit=hitBox(String(index),note.label,[note.w+.2,note.h+.2,.45],[note.x,note.y,.28],[paper]); scene.add(hit); hits.push(hit);
  });
  const connections:[[number,number],[number,number]][]=[[[ -2.65,3.75],[-.7,3.55]],[[-.7,3.55],[1.55,3.8]],[[1.55,3.8],[2.45,2.15]],[[-1.9,1.65],[2.45,2.15]]];
  connections.forEach(([a,b])=>{
    const curve=new THREE.LineCurve3(new THREE.Vector3(a[0],a[1],.26),new THREE.Vector3(b[0],b[1],.26));
    const thread=new THREE.Mesh(new THREE.TubeGeometry(curve,12,.018,6,false),mat(palette.red,.55,.05)); scene.add(thread);
  });
}

function buildFieldCase(scene:THREE.Scene,hits:HitMesh[]) {
  const table=box(9,.35,5.8,palette.woodLight,.89,.03); table.position.y=.02; scene.add(table);
  const caseGroup=new THREE.Group();
  const base=box(5.3,.65,3.35,0x3b3327,.62,.18); base.position.set(-1,.65,-.2);
  const lid=box(5.3,.22,3.35,0x604b35,.62,.16); lid.position.set(-1,2.35,-1.45); lid.rotation.x=-1.08;
  caseGroup.add(base,lid);
  const target=new THREE.Mesh(new THREE.CylinderGeometry(.92,.92,.08,48),mat(palette.paper)); target.rotation.x=Math.PI/2; target.position.set(-2,.99,-.2); caseGroup.add(target);
  [0x507b78,0xcab65b,palette.red].forEach((color,index)=>{ const ring=new THREE.Mesh(new THREE.CylinderGeometry(.7-index*.22,.7-index*.22,.09,40),mat(color)); ring.rotation.x=Math.PI/2; ring.position.set(-2,.99,-.15+index*.01); caseGroup.add(ring); });
  const card=box(1.55,.06,.95,0xd8d0b9); card.position.set(.25,1.02,-.7); card.rotation.y=.1; caseGroup.add(card);
  const ticket=box(1.65,.06,.78,0xcbbb82); ticket.position.set(.3,1.02,.5); ticket.rotation.y=-.12; caseGroup.add(ticket);
  scene.add(caseGroup);
  const drafts:THREE.Mesh[]=[];
  for(let index=0;index<3;index+=1){ const draft=box(2.05,.05,1.45,index===1?0xd5c99f:palette.paperDark); draft.position.set(2.55+index*.28,.28,-1.35+index*1.25); draft.rotation.y=-.2+index*.12; scene.add(draft); addLines(scene,draft.position.x,.34,draft.position.z-.48,1.45,5); drafts.push(draft); }
  const items:[string,string,THREE.Mesh,[number,number,number],[number,number,number]][]=[
    ["target","USED TARGET",target,[2.1,.65,2.1],[-2,1.15,-.2]],
    ["internship","WORK CARD",card,[1.85,.55,1.2],[.25,1.18,-.7]],
    ["ticket","RETURN TICKET",ticket,[1.95,.55,1.05],[.3,1.18,.5]],
    ["draft","WORKFLOW DRAFTS",drafts[1],[2.8,.55,4],[2.75,.55,0]],
  ];
  items.forEach(([item,label,visual,size,position])=>{ const hit=hitBox(item,label,size,position,[visual]); scene.add(hit); hits.push(hit); });
  const lampBase=cylinder(.42,.12,0x292f2d,28); lampBase.position.set(3.7,.35,1.85); scene.add(lampBase);
}

const views:Record<CloseupZone,{position:[number,number,number];target:[number,number,number];hint:string}>={
  books:{position:[0,3.1,8.6],target:[0,2.35,0],hint:"DRAG TO LOOK · CLICK A BOOK"},
  drawer:{position:[0,5.8,7.4],target:[0,.75,0],hint:"CLICK THE HANDLE, THEN SELECT A FILE"},
  notebook:{position:[0,5.7,5.7],target:[0,.45,0],hint:"DRAG TO LOOK · CLICK A PAGE OR INSERT"},
  board:{position:[0,3,8.8],target:[0,2.65,0],hint:"FOLLOW THE THREADS · CLICK A NOTE"},
  fieldcase:{position:[0,5.4,7.2],target:[0,.75,0],hint:"INSPECT THE CASE AND THE DRAFTS BESIDE IT"},
};

export default function ZoneCloseup3D({zone,onSelect}:Props) {
  const canvasRef=useRef<HTMLCanvasElement>(null);
  const labelRef=useRef<HTMLDivElement>(null);
  const selectRef=useRef(onSelect);
  useEffect(()=>{selectRef.current=onSelect;},[onSelect]);

  useEffect(()=>{
    const canvas=canvasRef.current;
    if(!canvas)return;
    const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:"high-performance"});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.6));
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    renderer.toneMapping=THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure=1;
    renderer.shadowMap.enabled=true;
    renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    const scene=new THREE.Scene();
    scene.background=new THREE.Color(palette.void);
    scene.fog=new THREE.FogExp2(palette.void,.035);
    const camera=new THREE.PerspectiveCamera(42,1,.1,50);
    const view=views[zone];
    const defaultPosition=new THREE.Vector3(...view.position);
    const target=new THREE.Vector3(...view.target);
    camera.position.copy(defaultPosition);
    const hits:HitMesh[]=[];
    if(zone==="books")buildBooks(scene,hits);
    if(zone==="drawer")buildDrawer(scene,hits);
    if(zone==="notebook")buildNotebook(scene,hits);
    if(zone==="board")buildBoard(scene,hits);
    if(zone==="fieldcase")buildFieldCase(scene,hits);
    scene.add(new THREE.HemisphereLight(0x789892,0x090d0c,.85));
    const warm=new THREE.DirectionalLight(0xffc889,3.4); warm.position.set(-4,8,6); warm.castShadow=true; warm.shadow.mapSize.set(1536,1536); scene.add(warm);
    const cyan=new THREE.PointLight(palette.cyan,8,14,1.8); cyan.position.set(4,3,4); scene.add(cyan);
    const spot=new THREE.SpotLight(0xffd6a2,10,16,.68,.55,1.5); spot.position.set(-2,8,5); spot.target.position.copy(target); scene.add(spot,spot.target);

    const pointer=new THREE.Vector2(5,5);
    const raycaster=new THREE.Raycaster();
    let hovered:HitMesh|null=null;
    let dragging=false;
    let moved=0;
    let lastX=0;
    let orbitX=0;
    let orbitY=0;
    let drawerProgress=0;
    let drawerTarget=0;
    const drawerTray=scene.children.find((child)=>child.userData.drawerTray) as THREE.Group|undefined;
    let frame=0;
    const setHighlight=(hit:HitMesh|null,on:boolean)=>hit?.userData.visuals?.forEach((visual)=>{ const material=visual.material as THREE.MeshStandardMaterial; if("emissive" in material){ material.emissive.setHex(on?palette.signal:0x000000); material.emissiveIntensity=on ? .16 : 0; }});
    const resize=()=>{ const rect=canvas.getBoundingClientRect(); renderer.setSize(Math.max(1,rect.width),Math.max(1,rect.height),false); camera.aspect=Math.max(1,rect.width)/Math.max(1,rect.height); camera.updateProjectionMatrix(); };
    const observer=new ResizeObserver(resize); observer.observe(canvas); resize();
    const readHit=(event:PointerEvent)=>{
      const rect=canvas.getBoundingClientRect(); pointer.x=((event.clientX-rect.left)/rect.width)*2-1; pointer.y=-((event.clientY-rect.top)/rect.height)*2+1; raycaster.setFromCamera(pointer,camera);
      const found=raycaster.intersectObjects(hits,false).map((entry)=>entry.object as HitMesh).find((hit)=>!hit.userData.requiresOpen||drawerProgress>.72)??null;
      return found;
    };
    const pointerMove=(event:PointerEvent)=>{
      if(dragging){ const delta=event.clientX-lastX; moved+=Math.abs(delta); orbitX=THREE.MathUtils.clamp(orbitX+delta*.0025,-.32,.32); orbitY=THREE.MathUtils.clamp(orbitY+(event.movementY||0)*.0015,-.12,.12); lastX=event.clientX; canvas.style.cursor="grabbing"; return; }
      const next=readHit(event); if(next!==hovered){setHighlight(hovered,false); hovered=next; setHighlight(hovered,true); if(labelRef.current)labelRef.current.textContent=hovered?.userData.label??view.hint;} canvas.style.cursor=next?"pointer":"grab";
    };
    const pointerDown=(event:PointerEvent)=>{dragging=true;moved=0;lastX=event.clientX;canvas.setPointerCapture(event.pointerId);};
    const pointerUp=(event:PointerEvent)=>{dragging=false;if(canvas.hasPointerCapture(event.pointerId))canvas.releasePointerCapture(event.pointerId);if(moved<7){const hit=readHit(event);const item=hit?.userData.item;if(item==="drawer-handle")drawerTarget=1;else if(item)selectRef.current(item);}canvas.style.cursor=hovered?"pointer":"grab";};
    canvas.addEventListener("pointermove",pointerMove);canvas.addEventListener("pointerdown",pointerDown);canvas.addEventListener("pointerup",pointerUp);canvas.addEventListener("pointercancel",pointerUp);
    const tick=()=>{
      drawerProgress=THREE.MathUtils.lerp(drawerProgress,drawerTarget,.055);
      if(drawerTray)drawerTray.position.z=-.3+drawerProgress*2.7;
      const desired=defaultPosition.clone(); desired.x+=Math.sin(orbitX)*2.4; desired.y+=orbitY*2; desired.z-=Math.abs(Math.sin(orbitX))*.5; camera.position.lerp(desired,.06); camera.lookAt(target);
      renderer.render(scene,camera);frame=requestAnimationFrame(tick);
    };tick();
    return()=>{observer.disconnect();cancelAnimationFrame(frame);canvas.removeEventListener("pointermove",pointerMove);canvas.removeEventListener("pointerdown",pointerDown);canvas.removeEventListener("pointerup",pointerUp);canvas.removeEventListener("pointercancel",pointerUp);scene.traverse((object)=>{if(object instanceof THREE.Mesh){object.geometry.dispose();const materials=Array.isArray(object.material)?object.material:[object.material];materials.forEach((material)=>material.dispose());}});renderer.dispose();};
  },[zone]);

  return <div className={`model-scene model-${zone}`}><canvas ref={canvasRef} aria-label={`Interactive 3D ${zone} close-up`} /><div ref={labelRef} className="model-scene-readout">{views[zone].hint}</div></div>;
}
