"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

export type CloseupZone = "drawer" | "books" | "notebook" | "board" | "fieldcase" | "printer";

type Props = {
  zone: CloseupZone;
  onSelect: (item: string) => void;
};

type HitMesh = THREE.Mesh & { userData: { item?: string; label?: string; requiresOpen?: boolean; requiresPrinted?: boolean; visuals?: THREE.Mesh[] } };

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

function roundedBox(w:number,h:number,d:number,color:number,radius=.1,roughness=.78,metalness=.04) {
  const mesh = new THREE.Mesh(
    new RoundedBoxGeometry(w,h,d,4,Math.min(radius,w*.2,h*.2,d*.2)),
    mat(color,roughness,metalness),
  );
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

function hitBox(item:string,label:string,size:[number,number,number],position:[number,number,number],visuals:THREE.Mesh[],requiresOpen=false,requiresPrinted=false) {
  const hit = new THREE.Mesh(
    new THREE.BoxGeometry(...size),
    new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}),
  ) as HitMesh;
  hit.position.set(...position);
  hit.userData = {item,label,visuals,requiresOpen,requiresPrinted};
  return hit;
}

function buildPrinterModel(parent:THREE.Object3D, position:[number,number,number], scale=1, withFax=false, hits?:HitMesh[]) {
  const printer=new THREE.Group();
  const body=roundedBox(3.5,1.42,2.7,0xc8c2b4,.22,.58,.12); body.position.y=.82;
  const lower=roundedBox(3.3,.72,2.45,0xa8a79f,.16,.66,.16); lower.position.set(0,.35,.06);
  const scanner=roundedBox(3.28,.22,2.45,0x343c39,.1,.34,.48); scanner.position.set(0,1.62,-.05);
  const lid=roundedBox(3.04,.12,2.2,0x1d2422,.08,.3,.46); lid.position.set(0,1.79,-.12); lid.rotation.x=-.025;
  const glass=roundedBox(2.62,.025,1.8,0x729794,.04,.12,.08); glass.position.set(0,1.73,-.1);
  const control=roundedBox(1.35,.16,.5,0x29312f,.07,.32,.45); control.position.set(.75,1.44,1.24); control.rotation.x=-.22;
  const screen=roundedBox(.58,.025,.24,0x163c39,.025,.2,.1); screen.position.set(.53,1.52,1.33); screen.rotation.x=-.22;
  const screenMaterial=screen.material as THREE.MeshStandardMaterial; screenMaterial.emissive.setHex(palette.cyan); screenMaterial.emissiveIntensity=.72;
  const slot=roundedBox(2.45,.11,.12,0x151b1a,.035,.36,.42); slot.position.set(0,.82,1.37);
  const tray=roundedBox(2.72,.09,1.8,0x4a504d,.08,.55,.26); tray.position.set(0,.19,1.45); tray.rotation.x=.045;
  const trayLip=roundedBox(2.75,.18,.12,0x5b625e,.05,.48,.35); trayLip.position.set(0,.24,2.31);
  printer.add(lower,body,scanner,glass,lid,control,screen,slot,tray,trayLip);
  for(let index=0;index<4;index+=1){
    const button=cylinder(.055,.035,index===3?palette.signal:0x858b84,16); button.rotation.x=Math.PI/2; button.position.set(.78+index*.19,1.48,1.5); printer.add(button);
  }
  const hingeLeft=cylinder(.07,.26,0x1b2220,16); hingeLeft.rotation.z=Math.PI/2; hingeLeft.position.set(-1.22,1.72,-1.02);
  const hingeRight=hingeLeft.clone(); hingeRight.position.x=1.22; printer.add(hingeLeft,hingeRight);
  const paperGroup=new THREE.Group();
  paperGroup.userData.faxPaperGroup=withFax;
  paperGroup.position.set(0,.88,1.28);
  paperGroup.scale.z=withFax ? .035 : 1;
  const paper=roundedBox(2.3,.035,3.05,palette.paper,.025,.96,.01); paper.position.set(0,0,1.46); paper.rotation.x=.025;
  paperGroup.add(paper);
  for(let line=0;line<11;line+=1){
    const mark=box(line===0?1.55:1.75-(line%3)*.18,.018,.025,line===0?palette.red:0x65736d,.7,.02);
    mark.position.set(-.12,.04,.42+line*.2); paperGroup.add(mark);
  }
  const stamp=new THREE.Mesh(new THREE.RingGeometry(.25,.3,28),mat(palette.red,.7,.02)); stamp.rotation.x=-Math.PI/2; stamp.position.set(.67,.055,2.42); paperGroup.add(stamp);
  if(withFax&&hits){
    const paperHit=hitBox("fax","READ PRINTED FIELD REPORT",[2.55,.45,3.25],[0,.16,1.45],[paper],false,true);
    paperGroup.add(paperHit); hits.push(paperHit);
  }
  printer.add(paperGroup);
  printer.position.set(...position);
  printer.scale.setScalar(scale);
  parent.add(printer);
  return {printer,paperGroup,body,screen};
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
    const cover=roundedBox(width,height,.78,colors[index],.055,.7,.02);
    cover.position.y=height/2;
    const pages=roundedBox(width-.12,height-.12,.67,0xd7cba9,.045,.93,.01);
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
    const filler=roundedBox(.48+(index%2)*.1,1.1+(index%3)*.1,.7,[0x594237,0x415954,0x82634a][index%3],.045);
    filler.position.set(-3+index*.72,2.92+(index%2)*.05,0);
    shelf.add(filler);
  }
  shelf.position.y=-.2;
  scene.add(shelf);
}

function buildDrawer(scene:THREE.Scene,hits:HitMesh[]) {
  const wall=box(11,6,.2,0x18201e,.96,.03); wall.position.set(0,3,-2.8); scene.add(wall);
  const desk=roundedBox(9,.34,4.7,palette.woodLight,.12,.82,.04); desk.position.y=2.18; scene.add(desk);
  const frontEdge=roundedBox(9,.18,.16,palette.wood,.05,.72,.04); frontEdge.position.set(0,2.03,2.26); scene.add(frontEdge);
  for(const x of [-4.05,4.05]){
    const leg=roundedBox(.3,2.05,.32,palette.metal,.06,.38,.7); leg.position.set(x,1.02,-1.7); scene.add(leg);
    const foot=roundedBox(.72,.12,1.25,0x222927,.06,.38,.7); foot.position.set(x,.08,-1.7); scene.add(foot);
  }

  const cabinet=new THREE.Group();
  const sideLeft=roundedBox(.22,1.72,3.55,palette.wood,.07,.88,.02); sideLeft.position.set(-3.02,1.03,-.28);
  const sideRight=sideLeft.clone(); sideRight.position.x=1.02;
  const cabinetTop=roundedBox(4.25,.18,3.55,palette.wood,.06,.86,.02); cabinetTop.position.set(-1,1.85,-.28);
  const cabinetBottom=roundedBox(4.25,.16,3.55,0x3c2a20,.05,.9,.02); cabinetBottom.position.set(-1,.2,-.28);
  const cabinetBack=box(4.25,1.58,.16,0x30231c,.94,.01); cabinetBack.position.set(-1,1.03,-1.98);
  cabinet.add(sideLeft,sideRight,cabinetTop,cabinetBottom,cabinetBack); scene.add(cabinet);

  const tray=new THREE.Group();
  tray.userData.drawerTray=true;
  const bottom=roundedBox(3.72,.14,3.12,0x38271f,.06,.94,.01); bottom.position.y=.4;
  const left=roundedBox(.14,.67,3.12,palette.woodLight,.04,.88,.02); left.position.set(-1.84,.72,0);
  const right=left.clone(); right.position.x=1.84;
  const back=roundedBox(3.75,.67,.14,palette.woodLight,.04,.88,.02); back.position.set(0,.72,-1.49);
  const front=roundedBox(4.02,1.18,.27,0x76543c,.08,.78,.04); front.position.set(0,.87,1.6);
  const inset=roundedBox(3.5,.72,.06,0x60422f,.06,.86,.02); inset.position.set(0,.87,1.75);
  const handleBar=cylinder(.095,1.15,palette.steel,22); handleBar.rotation.z=Math.PI/2; handleBar.position.set(0,.92,1.98);
  const mountLeft=cylinder(.085,.22,palette.steel,18); mountLeft.rotation.x=Math.PI/2; mountLeft.position.set(-.48,.92,1.87);
  const mountRight=mountLeft.clone(); mountRight.position.x=.48;
  tray.add(bottom,left,right,back,front,inset,handleBar,mountLeft,mountRight);
  const folder=roundedBox(1.25,.12,1.65,0x8b453a,.04,.88,.01); folder.position.set(-1.05,.56,-.24); folder.rotation.y=-.08;
  const notebook=roundedBox(.78,.17,1.46,0xd7c9a8,.06,.88,.01); notebook.position.set(.15,.61,-.56); notebook.rotation.y=.04;
  const envelope=roundedBox(1.52,.08,.88,0xb89b65,.035,.91,.01); envelope.position.set(.05,.6,.61); envelope.rotation.y=-.05;
  const pouch=roundedBox(.94,.2,1.24,0x33413d,.12,.4,.18); pouch.position.set(1.23,.62,-.25);
  const circuit=roundedBox(.65,.11,.66,0x245e4f,.035,.5,.12); circuit.position.set(1.23,.79,-.25);
  const coil=new THREE.Mesh(new THREE.TorusGeometry(.28,.035,8,28),mat(palette.red,.5,.1)); coil.rotation.x=Math.PI/2; coil.position.set(1.25,.88,.28);
  tray.add(folder,notebook,envelope,pouch,circuit,coil);
  const handleHit=hitBox("drawer-handle","PULL THE METAL HANDLE",[1.7,.72,.58],[0,.92,1.99],[handleBar,front,inset]);
  tray.add(handleHit); hits.push(handleHit);
  const items:[string,string,THREE.Mesh,[number,number,number],[number,number,number]][]=[
    ["folder","PROJECT FOLDER",folder,[1.42,.55,1.82],[-1.05,.75,-.24]],
    ["notebook","FIELD NOTEBOOK",notebook,[1,.55,1.7],[.15,.76,-.56]],
    ["envelope","SEALED ENVELOPE",envelope,[1.7,.5,1.08],[.05,.75,.61]],
    ["components","COMPONENT POUCH",pouch,[1.2,.65,1.52],[1.23,.8,-.25]],
  ];
  items.forEach(([item,label,visual,size,position])=>{ const hit=hitBox(item,label,size,position,[visual],true); tray.add(hit); hits.push(hit); });
  tray.position.set(-1,.05,-.36);
  scene.add(tray);

  buildPrinterModel(scene,[2.25,2.32,-.45],.62);
  const paperStack=roundedBox(1.65,.12,1.32,palette.paper,.04,.94,.01); paperStack.position.set(2.25,2.43,1.25); paperStack.rotation.y=-.09; scene.add(paperStack);
  const mug=cylinder(.33,.64,0x28443d,28); mug.position.set(-3.2,2.5,-.5); scene.add(mug);
  const lampBase=cylinder(.42,.11,0x282f2d,28); lampBase.position.set(3.72,2.39,-1.2); scene.add(lampBase);
  const lampStem=cylinder(.045,1.45,0x3e4945,14); lampStem.position.set(3.72,3.08,-1.2); scene.add(lampStem);
  const shade=new THREE.Mesh(new THREE.ConeGeometry(.42,.55,28,1,true),mat(0x202825,.36,.62)); shade.position.set(3.72,3.72,-1.2); shade.rotation.z=Math.PI; scene.add(shade);
}

function buildPrinter(scene:THREE.Scene,hits:HitMesh[]) {
  const wall=box(11,6,.2,0x18201e,.96,.03); wall.position.set(0,3,-2.8); scene.add(wall);
  const desk=roundedBox(9,.34,4.7,palette.woodLight,.12,.82,.04); desk.position.y=.18; scene.add(desk);
  const matBoard=roundedBox(7.6,.035,3.85,0x243632,.05,.95,.02); matBoard.position.y=.38; scene.add(matBoard);
  buildPrinterModel(scene,[0,.42,-.35],1,true,hits);
  const monitor=roundedBox(2.15,1.45,.22,0x252d2b,.1,.36,.58); monitor.position.set(-3.12,1.52,-1.15); monitor.rotation.y=.13; scene.add(monitor);
  const monitorScreen=roundedBox(1.82,1.16,.03,0x153b38,.035,.18,.08); monitorScreen.position.set(-3,1.52,-1.02); monitorScreen.rotation.y=.13; scene.add(monitorScreen);
  const note=roundedBox(1.25,.035,1.2,palette.signal,.035,.9,.01); note.position.set(3.18,.48,-1.1); note.rotation.y=-.12; scene.add(note);
  const pen=cylinder(.06,1.55,palette.red,14); pen.rotation.z=Math.PI/2; pen.position.set(3.1,.55,.25); scene.add(pen);
}

function buildNotebook(scene:THREE.Scene,hits:HitMesh[]) {
  const table=box(8,.35,5.5,palette.woodLight,.9,.02); table.position.y=.05; scene.add(table);
  const matBoard=box(6.9,.06,4.6,0x213a35,.95,.02); matBoard.position.y=.27; scene.add(matBoard);
  for(let index=0;index<10;index+=1){ const grid=box(.015,.015,4.35,0x496960); grid.position.set(-3.1+index*.68,.315,0); scene.add(grid); }
  const book=new THREE.Group();
  const left=roundedBox(3.05,.12,3.85,palette.paper,.06,.94,.01); left.position.set(-1.53,.48,0); left.rotation.y=-.025;
  const right=roundedBox(3.05,.12,3.85,0xe8ddc1,.06,.94,.01); right.position.set(1.53,.48,0); right.rotation.y=.025;
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
  const frame=roundedBox(8.4,5.35,.35,palette.wood,.11,.86,.03); frame.position.set(0,2.7,-.25); scene.add(frame);
  const cork=roundedBox(7.85,4.82,.18,0x765d42,.06,.98,.01); cork.position.set(0,2.7,0); scene.add(cork);
  const notes=[
    {x:-2.65,y:3.75,w:1.5,h:1.1,color:0xe1d3a4,label:"RESEARCH FIRST"},
    {x:-.7,y:3.55,w:1.65,h:1.35,color:0xb8d5cc,label:"OPEN QUESTION"},
    {x:1.55,y:3.8,w:1.35,h:1.05,color:0xd9a58f,label:"PLAN B"},
    {x:2.45,y:2.15,w:1.7,h:1.25,color:0xe2d8bd,label:"FIELD ROUTE"},
    {x:-1.9,y:1.65,w:1.85,h:1.2,color:0xc7b77f,label:"USEFUL FIRST"},
  ];
  notes.forEach((note,index)=>{
    const paper=roundedBox(note.w,note.h,.06,note.color,.035,.94,.01); paper.position.set(note.x,note.y,.18); paper.rotation.z=(index-2)*.035; scene.add(paper);
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
  const base=roundedBox(5.3,.65,3.35,0x3b3327,.16,.62,.18); base.position.set(-1,.65,-.2);
  const lid=roundedBox(5.3,.22,3.35,0x604b35,.13,.62,.16); lid.position.set(-1,2.35,-1.45); lid.rotation.x=-1.08;
  caseGroup.add(base,lid);
  const target=new THREE.Mesh(new THREE.CylinderGeometry(.92,.92,.08,48),mat(palette.paper)); target.rotation.x=Math.PI/2; target.position.set(-2,.99,-.2); caseGroup.add(target);
  [0x507b78,0xcab65b,palette.red].forEach((color,index)=>{ const ring=new THREE.Mesh(new THREE.CylinderGeometry(.7-index*.22,.7-index*.22,.09,40),mat(color)); ring.rotation.x=Math.PI/2; ring.position.set(-2,.99,-.15+index*.01); caseGroup.add(ring); });
  const card=roundedBox(1.55,.06,.95,0xd8d0b9,.035); card.position.set(.25,1.02,-.7); card.rotation.y=.1; caseGroup.add(card);
  const ticket=roundedBox(1.65,.06,.78,0xcbbb82,.035); ticket.position.set(.3,1.02,.5); ticket.rotation.y=-.12; caseGroup.add(ticket);
  scene.add(caseGroup);
  const drafts:THREE.Mesh[]=[];
  for(let index=0;index<3;index+=1){ const draft=roundedBox(2.05,.05,1.45,index===1?0xd5c99f:palette.paperDark,.035); draft.position.set(2.55+index*.28,.28,-1.35+index*1.25); draft.rotation.y=-.2+index*.12; scene.add(draft); addLines(scene,draft.position.x,.34,draft.position.z-.48,1.45,5); drafts.push(draft); }
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
  drawer:{position:[0,4.75,8.8],target:[0,1.45,-.15],hint:"CLICK THE METAL HANDLE, THEN SELECT A FILE"},
  notebook:{position:[0,5.7,5.7],target:[0,.45,0],hint:"DRAG TO LOOK · CLICK A PAGE OR INSERT"},
  board:{position:[0,3,8.8],target:[0,2.65,0],hint:"FOLLOW THE THREADS · CLICK A NOTE"},
  fieldcase:{position:[0,5.4,7.2],target:[0,.75,0],hint:"INSPECT THE CASE AND THE DRAFTS BESIDE IT"},
  printer:{position:[0,4.25,8.2],target:[0,1.25,.55],hint:"INCOMING FIELD REPORT · PRINTING"},
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
    if(zone==="printer")buildPrinter(scene,hits);
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
    let faxPaperGroup:THREE.Group|undefined;
    scene.traverse((child)=>{if(child.userData.faxPaperGroup)faxPaperGroup=child as THREE.Group;});
    const printStarted=performance.now()+550;
    let printProgress=zone==="printer"?0:1;
    let frame=0;
    const setHighlight=(hit:HitMesh|null,on:boolean)=>hit?.userData.visuals?.forEach((visual)=>{ const material=visual.material as THREE.MeshStandardMaterial; if("emissive" in material){ material.emissive.setHex(on?palette.signal:0x000000); material.emissiveIntensity=on ? .16 : 0; }});
    const resize=()=>{ const rect=canvas.getBoundingClientRect(); renderer.setSize(Math.max(1,rect.width),Math.max(1,rect.height),false); camera.aspect=Math.max(1,rect.width)/Math.max(1,rect.height); camera.updateProjectionMatrix(); };
    const observer=new ResizeObserver(resize); observer.observe(canvas); resize();
    const readHit=(event:PointerEvent)=>{
      const rect=canvas.getBoundingClientRect(); pointer.x=((event.clientX-rect.left)/rect.width)*2-1; pointer.y=-((event.clientY-rect.top)/rect.height)*2+1; raycaster.setFromCamera(pointer,camera);
      const found=raycaster.intersectObjects(hits,false).map((entry)=>entry.object as HitMesh).find((hit)=>(!hit.userData.requiresOpen||drawerProgress>.72)&&(!hit.userData.requiresPrinted||printProgress>.96))??null;
      return found;
    };
    const pointerMove=(event:PointerEvent)=>{
      if(dragging){ const delta=event.clientX-lastX; moved+=Math.abs(delta); orbitX=THREE.MathUtils.clamp(orbitX+delta*.0025,-.32,.32); orbitY=THREE.MathUtils.clamp(orbitY+(event.movementY||0)*.0015,-.12,.12); lastX=event.clientX; canvas.style.cursor="grabbing"; return; }
      const next=readHit(event); if(next!==hovered){setHighlight(hovered,false); hovered=next; setHighlight(hovered,true); if(labelRef.current)labelRef.current.textContent=hovered?.userData.label??view.hint;} canvas.style.cursor=next?"pointer":"grab";
    };
    const pointerDown=(event:PointerEvent)=>{dragging=true;moved=0;lastX=event.clientX;canvas.setPointerCapture(event.pointerId);};
    const pointerUp=(event:PointerEvent)=>{dragging=false;if(canvas.hasPointerCapture(event.pointerId))canvas.releasePointerCapture(event.pointerId);if(moved<7){const hit=readHit(event);const item=hit?.userData.item;if(item==="drawer-handle")drawerTarget=1;else if(item)selectRef.current(item);}canvas.style.cursor=hovered?"pointer":"grab";};
    canvas.addEventListener("pointermove",pointerMove);canvas.addEventListener("pointerdown",pointerDown);canvas.addEventListener("pointerup",pointerUp);canvas.addEventListener("pointercancel",pointerUp);
    const tick=(now:number)=>{
      drawerProgress=THREE.MathUtils.lerp(drawerProgress,drawerTarget,.055);
      if(drawerTray)drawerTray.position.z=-.36+drawerProgress*2.7;
      if(zone==="printer"&&faxPaperGroup){
        printProgress=THREE.MathUtils.clamp((now-printStarted)/4600,0,1);
        const eased=1-Math.pow(1-printProgress,3);
        faxPaperGroup.scale.z=.035+eased*.965;
        faxPaperGroup.position.y=.88-eased*.22;
        if(labelRef.current&&!hovered)labelRef.current.textContent=printProgress>.96?"FIELD REPORT READY · CLICK THE PAPER":"INCOMING FIELD REPORT · PRINTING";
      }
      const desired=defaultPosition.clone(); desired.x+=Math.sin(orbitX)*2.4; desired.y+=orbitY*2; desired.z-=Math.abs(Math.sin(orbitX))*.5; camera.position.lerp(desired,.06); camera.lookAt(target);
      renderer.render(scene,camera);frame=requestAnimationFrame(tick);
    };frame=requestAnimationFrame(tick);
    return()=>{observer.disconnect();cancelAnimationFrame(frame);canvas.removeEventListener("pointermove",pointerMove);canvas.removeEventListener("pointerdown",pointerDown);canvas.removeEventListener("pointerup",pointerUp);canvas.removeEventListener("pointercancel",pointerUp);scene.traverse((object)=>{if(object instanceof THREE.Mesh){object.geometry.dispose();const materials=Array.isArray(object.material)?object.material:[object.material];materials.forEach((material)=>material.dispose());}});renderer.dispose();};
  },[zone]);

  return <div className={`model-scene model-${zone}`}><canvas ref={canvasRef} aria-label={`Interactive 3D ${zone} close-up`} /><div ref={labelRef} className="model-scene-readout">{views[zone].hint}</div></div>;
}
