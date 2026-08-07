"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import {
  board as boardContent,
  books as booksContent,
  drawer as drawerContent,
  faxContact,
  fieldCase as fieldCaseContent,
  notebook as notebookContent,
} from "@/content";

export type CloseupZone = "drawer" | "books" | "notebook" | "board" | "fieldcase" | "printer" | "contact";

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
  let paperGroup:THREE.Group|undefined;
  if(withFax&&hits){
    paperGroup=new THREE.Group();
    paperGroup.userData.faxPaperGroup=true;
    paperGroup.position.set(0,.88,1.28);
    paperGroup.scale.z=.035;
    const paper=roundedBox(2.3,.035,3.05,palette.paper,.025,.96,.01); paper.position.set(0,0,1.46); paper.rotation.x=.025;
    paperGroup.add(paper);
    for(let line=0;line<11;line+=1){
      const mark=box(line===0?1.55:1.75-(line%3)*.18,.018,.025,line===0?palette.red:0x65736d,.7,.02);
      mark.position.set(-.12,.04,.42+line*.2); paperGroup.add(mark);
    }
    const stamp=new THREE.Mesh(new THREE.RingGeometry(.25,.3,28),mat(palette.red,.7,.02)); stamp.rotation.x=-Math.PI/2; stamp.position.set(.67,.055,2.42); paperGroup.add(stamp);
    const paperHit=hitBox("fax",faxContact.printer.paperHitLabel,[2.55,.45,3.25],[0,.16,1.45],[paper],false,true);
    paperGroup.add(paperHit); hits.push(paperHit);
    printer.add(paperGroup);
  }
  printer.position.set(...position);
  printer.scale.setScalar(scale);
  parent.add(printer);
  return {printer,paperGroup,body,screen};
}

function addContactCard(parent:THREE.Object3D,position:[number,number,number],rotation=-.08,hits?:HitMesh[]) {
  const card=roundedBox(2.55,.045,1.45,0xe5dcc6,.055,.92,.01);
  card.position.set(...position); card.rotation.y=rotation; parent.add(card);
  const accent=box(.12,.025,1.16,palette.red,.7,.02); accent.position.set(position[0]-.93,position[1]+.045,position[2]); accent.rotation.y=rotation; parent.add(accent);
  const nameLine=box(1.15,.025,.055,0x283f3a,.72,.02); nameLine.position.set(position[0]-.12,position[1]+.05,position[2]-.32); nameLine.rotation.y=rotation; parent.add(nameLine);
  for(let line=0;line<3;line+=1){const detail=box(1.25-line*.14,.018,.028,0x6e7c75,.72,.02);detail.position.set(position[0]-.06,position[1]+.05,position[2]+.02+line*.18);detail.rotation.y=rotation;parent.add(detail);}
  if(hits){const hit=hitBox("contact",faxContact.contact.hitLabel,[2.8,.55,1.75],position,[card]);hit.rotation.y=rotation;parent.add(hit);hits.push(hit);}
  return card;
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
  const wall=box(11,6,.18,0x18201e,.96,.03);wall.position.set(0,3,-1.05);scene.add(wall);
  const back = roundedBox(8.25,4.55,.22,0x32231b,.08,.92,.02);
  back.position.set(0,2.45,-.48);
  const sideL = roundedBox(.34,4.9,1.75,palette.wood,.08,.86,.03);
  sideL.position.set(-4.18,2.45,0);
  const sideR = sideL.clone(); sideR.position.x=4.18;
  const base=roundedBox(8.7,.28,1.78,palette.woodLight,.08,.82,.04);base.position.set(0,.25,0);
  const top=roundedBox(8.7,.24,1.78,palette.wood,.08,.84,.03);top.position.set(0,4.72,0);
  const frontLip=roundedBox(8.55,.16,.16,0x4a3225,.045,.78,.04);frontLip.position.set(0,.4,.82);
  shelf.add(back,sideL,sideR,base,top,frontLip);
  const colors=[0x28504a,0x854b3d,0xb29145,0x33473f,0xd0c4a5,0x334d65];
  const labels=booksContent.spineLabels;
  for (let index=0;index<6;index+=1) {
    const group=new THREE.Group();
    const height=3.42+(index%3)*.22;
    const width=.92+(index%2)*.12;
    const cover=roundedBox(width,height,1.04,colors[index],.065,.7,.02);
    cover.position.y=height/2;
    const pages=roundedBox(width-.16,height-.16,.78,0xd7cba9,.045,.93,.01);
    pages.position.set(.035,height/2,-.08);
    const spine=roundedBox(.16,height-.12,1.08,colors[index],.05,.68,.02);spine.position.set(-width*.42,height/2,.01);
    const band=box(width+.025,.07,1.08,index===2?palette.signal:0xbba980,.7,.02);
    band.position.set(0,height*.72,.01);
    group.add(cover,pages,spine,band);
    for(let mark=0;mark<3;mark+=1){const titleMark=box(width*.5,.025,.035,index===4?0x33443f:0xd7cba9,.75,.01);titleMark.position.set(.08,height*.56-mark*.18,.55);group.add(titleMark);}
    if(index===1||index===3||index===5){
      const bookmark=box(.14,.52,.03,index===3?palette.signal:palette.red);
      bookmark.position.set(width*.2,height+.2,.08);
      group.add(bookmark);
    }
    group.position.set(-3.15+index*1.27,.43,.05);
    group.rotation.z=[-.025,.015,-.018,.028,-.012,.022][index];
    shelf.add(group);
    const hit=hitBox(String(index),labels[index],[width+.22,height+.28,1.28],[group.position.x,.43+height/2,.05],[cover,pages,spine,band]);
    shelf.add(hit); hits.push(hit);
  }
  scene.add(shelf);
}

function buildDrawer(scene:THREE.Scene,hits:HitMesh[]) {
  const wall=box(11,6,.2,0x18201e,.96,.03); wall.position.set(0,3,-2.8); scene.add(wall);
  const workspace=new THREE.Group();workspace.userData.drawerWorkspace=true;scene.add(workspace);
  const desk=roundedBox(9,.34,4.7,palette.woodLight,.12,.82,.04); desk.position.y=2.18; workspace.add(desk);
  const frontEdge=roundedBox(9,.18,.16,palette.wood,.05,.72,.04); frontEdge.position.set(0,2.03,2.26); workspace.add(frontEdge);
  for(const x of [-4.05,4.05]){
    const leg=roundedBox(.3,2.05,.32,palette.metal,.06,.38,.7); leg.position.set(x,1.02,-1.7); workspace.add(leg);
    const foot=roundedBox(.72,.12,1.25,0x222927,.06,.38,.7); foot.position.set(x,.08,-1.7); workspace.add(foot);
  }

  const cabinet=new THREE.Group();
  const sideLeft=roundedBox(.22,1.72,3.55,palette.wood,.07,.88,.02); sideLeft.position.set(-3.02,1.03,-.28);
  const sideRight=sideLeft.clone(); sideRight.position.x=1.02;
  const cabinetTop=roundedBox(4.25,.18,3.55,palette.wood,.06,.86,.02); cabinetTop.position.set(-1,1.85,-.28);
  const cabinetBottom=roundedBox(4.25,.16,3.55,0x3c2a20,.05,.9,.02); cabinetBottom.position.set(-1,.2,-.28);
  const cabinetBack=box(4.25,1.58,.16,0x30231c,.94,.01); cabinetBack.position.set(-1,1.03,-1.98);
  cabinet.add(sideLeft,sideRight,cabinetTop,cabinetBottom,cabinetBack); workspace.add(cabinet);

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
  const handleHit=hitBox("drawer-handle",drawerContent.handleLabel,[1.7,.72,.58],[0,.92,1.99],[handleBar,front,inset]);
  tray.add(handleHit); hits.push(handleHit);
  const items:[string,string,THREE.Mesh,[number,number,number],[number,number,number]][]=[
    ["folder",drawerContent.itemLabels.folder,folder,[1.42,.55,1.82],[-1.05,.75,-.24]],
    ["notebook",drawerContent.itemLabels.notebook,notebook,[1,.55,1.7],[.15,.76,-.56]],
    ["envelope",drawerContent.itemLabels.envelope,envelope,[1.7,.5,1.08],[.05,.75,.61]],
    ["components",drawerContent.itemLabels.components,pouch,[1.2,.65,1.52],[1.23,.8,-.25]],
  ];
  items.forEach(([item,label,visual,size,position])=>{ const hit=hitBox(item,label,size,position,[visual],true); tray.add(hit); hits.push(hit); });
  tray.position.set(-1,.05,-.36);
  workspace.add(tray);

  buildPrinterModel(workspace,[2.25,2.32,-.45],.62);
  addContactCard(workspace,[2.45,2.39,1.12],-.09);
  const monitor=roundedBox(3.45,2.15,.28,0x242c2a,.11,.34,.68);monitor.position.set(-1.2,3.47,-1.25);workspace.add(monitor);
  const monitorScreen=roundedBox(3.08,1.78,.035,0x0d2928,.035,.18,.08);monitorScreen.position.set(-1.2,3.47,-1.09);workspace.add(monitorScreen);
  const monitorMaterial=monitorScreen.material as THREE.MeshStandardMaterial;monitorMaterial.emissive.setHex(palette.cyan);monitorMaterial.emissiveIntensity=.72;
  for(let row=0;row<9;row+=1){const length=.55+((row*7)%9)*.18;const line=box(length,.018,.014,row%3===0?palette.signal:palette.cyan,.45,.15);line.position.set(-2.55+length/2,4.08-row*.15,-1.065);const lineMaterial=line.material as THREE.MeshStandardMaterial;lineMaterial.emissive.setHex(row%3===0?palette.signal:palette.cyan);lineMaterial.emissiveIntensity=1.05;workspace.add(line);}
  const monitorStem=roundedBox(.2,.9,.28,palette.metal,.05,.35,.7);monitorStem.position.set(-1.2,2.7,-1.25);workspace.add(monitorStem);
  const monitorBase=roundedBox(1.25,.08,.68,palette.metal,.05,.38,.62);monitorBase.position.set(-1.2,2.4,-.95);workspace.add(monitorBase);
  const keyboard=roundedBox(2.7,.1,.87,0x202725,.055,.5,.45);keyboard.position.set(-1.15,2.4,.58);keyboard.rotation.x=-.035;workspace.add(keyboard);
  for(let row=0;row<4;row+=1){for(let column=0;column<12;column+=1){const key=roundedBox(.14,.025,.1,column===11?0x8a6b52:0x68716c,.02,.42,.34);key.position.set(-2.03+column*.16,2.465,.32+row*.14);workspace.add(key);}}
  const mouse=roundedBox(.35,.13,.52,0x303936,.1,.34,.4);mouse.position.set(.62,2.46,.58);workspace.add(mouse);
  const mug=cylinder(.33,.64,0x28443d,28); mug.position.set(-3.2,2.5,-.5); workspace.add(mug);
  const lampBase=cylinder(.42,.11,0x282f2d,28); lampBase.position.set(3.72,2.39,-1.2); workspace.add(lampBase);
  const lampStem=cylinder(.045,1.45,0x3e4945,14); lampStem.position.set(3.72,3.08,-1.2); workspace.add(lampStem);
  const shade=new THREE.Mesh(new THREE.ConeGeometry(.42,.55,28,1,true),mat(0x202825,.36,.62)); shade.position.set(3.72,3.72,-1.2); shade.rotation.z=Math.PI; workspace.add(shade);
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

function buildContact(scene:THREE.Scene,hits:HitMesh[]) {
  const wall=box(11,6,.2,0x18201e,.96,.03);wall.position.set(0,3,-2.8);scene.add(wall);
  const desk=roundedBox(9,.34,4.7,palette.woodLight,.12,.82,.04);desk.position.y=.18;scene.add(desk);
  const deskMat=roundedBox(7.7,.035,3.85,0x243632,.05,.95,.02);deskMat.position.y=.38;scene.add(deskMat);
  buildPrinterModel(scene,[-1.35,.42,-.55],.9);
  addContactCard(scene,[2.25,.5,.65],-.12,hits);
  const cardCase=roundedBox(3.15,.12,1.95,0x4a3428,.08,.72,.04);cardCase.position.set(2.25,.37,.65);cardCase.rotation.y=-.12;scene.add(cardCase);
  const pen=cylinder(.06,1.6,palette.red,14);pen.rotation.z=Math.PI/2;pen.position.set(2.4,.56,-.55);scene.add(pen);
  const note=roundedBox(1.1,.03,1.05,palette.signal,.035,.9,.01);note.position.set(3.55,.48,-.8);note.rotation.y=.08;scene.add(note);
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
  const researchHit=hitBox("research",notebookContent.itemLabels.research,[2.8,.5,3.5],[-1.55,.7,0],[left]);
  const marginHit=hitBox("margin",notebookContent.itemLabels.margin,[2.8,.5,3.5],[1.55,.7,0],[right,sticky]);
  const diagramHit=hitBox("diagram",notebookContent.itemLabels.diagram,[1.5,.65,1.2],[-1.55,.82,.62],[photo]);
  scene.add(researchHit,marginHit,diagramHit); hits.push(researchHit,marginHit,diagramHit);
  const mug=cylinder(.45,.78,0x29423c,28); mug.position.set(3.25,.66,-1.6); scene.add(mug);
}

function buildBoard(scene:THREE.Scene,hits:HitMesh[]) {
  const frame=roundedBox(8.4,5.35,.35,palette.wood,.11,.86,.03); frame.position.set(0,2.7,-.25); scene.add(frame);
  const cork=roundedBox(7.85,4.82,.18,0x765d42,.06,.98,.01); cork.position.set(0,2.7,0); scene.add(cork);
  const notes=[
    {x:-2.65,y:3.75,w:1.5,h:1.1,color:0xe1d3a4,label:boardContent.hitLabels[0]},
    {x:-.7,y:3.55,w:1.65,h:1.35,color:0xb8d5cc,label:boardContent.hitLabels[1]},
    {x:1.55,y:3.8,w:1.35,h:1.05,color:0xd9a58f,label:boardContent.hitLabels[2]},
    {x:2.45,y:2.15,w:1.7,h:1.25,color:0xe2d8bd,label:boardContent.hitLabels[3]},
    {x:-1.9,y:1.65,w:1.85,h:1.2,color:0xc7b77f,label:boardContent.hitLabels[4]},
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
  const cartTop=roundedBox(9,.3,5.8,0x34443f,.14,.46,.34);cartTop.position.y=.08;scene.add(cartTop);
  const inset=roundedBox(8.55,.06,5.35,0x1c2c28,.08,.9,.05);inset.position.y=.27;scene.add(inset);
  for(const x of [-4.12,4.12]){for(const z of [-2.48,2.48]){const leg=roundedBox(.17,1.55,.17,palette.steel,.05,.34,.72);leg.position.set(x,-.72,z);scene.add(leg);const wheel=cylinder(.17,.11,0x151b19,16);wheel.rotation.z=Math.PI/2;wheel.position.set(x,-1.48,z);scene.add(wheel);}}
  for(const z of [-2.67,2.67]){const rail=cylinder(.055,8.3,palette.steel,14);rail.rotation.z=Math.PI/2;rail.position.set(0,.48,z);scene.add(rail);}
  const caseGroup=new THREE.Group();
  const base=roundedBox(4.75,.62,3.2,0x3b3327,.16,.62,.18); base.position.set(-1.85,.67,-.25);
  const lid=roundedBox(4.75,.2,3.2,0x604b35,.13,.62,.16); lid.position.set(-1.85,2.25,-1.55); lid.rotation.x=-1.03;
  caseGroup.add(base,lid);
  const target=roundedBox(1.95,.035,1.95,palette.paper,.035,.97,.01);target.position.set(-2.75,1.02,-.22);target.rotation.y=-.05;caseGroup.add(target);
  const targetRings=[[.73,.61,0x2d3a37],[.59,.45,0xd7c868],[.43,.28,palette.red],[.26,.08,0x4b7770]] as const;
  targetRings.forEach(([outer,inner,color])=>{const ring=new THREE.Mesh(new THREE.RingGeometry(inner,outer,40),mat(color,.78,.02));ring.rotation.x=-Math.PI/2;ring.position.set(-2.75,1.05,-.22);ring.rotation.z=-.05;caseGroup.add(ring);});
  for(const [x,z] of [[-2.86,-.3],[-2.61,-.14],[-2.72,-.38]] as const){const hole=new THREE.Mesh(new THREE.CircleGeometry(.035,12),mat(0x171b19,.9,.02));hole.rotation.x=-Math.PI/2;hole.position.set(x,1.057,z);caseGroup.add(hole);}
  const card=roundedBox(1.45,.055,.9,0xd8d0b9,.035); card.position.set(-.62,1.02,-.72); card.rotation.y=.1; caseGroup.add(card);
  const ticket=roundedBox(1.55,.055,.74,0xcbbb82,.035); ticket.position.set(-.58,1.02,.48); ticket.rotation.y=-.12; caseGroup.add(ticket);
  const strap=cylinder(.055,2.4,palette.red,12);strap.rotation.z=Math.PI/2;strap.position.set(-1.72,1.12,.92);caseGroup.add(strap);
  scene.add(caseGroup);
  const planBoard=roundedBox(3.25,.1,4.65,0x2b4b43,.1,.86,.05);planBoard.position.set(2.55,.37,0);scene.add(planBoard);
  const columns=[{x:1.65,color:0xe2d8bd},{x:2.55,color:0xc8d8cf},{x:3.45,color:0xd9b18e}];
  const drafts:THREE.Mesh[]=[];
  columns.forEach((column,index)=>{const label=roundedBox(.72,.035,.45,column.color,.03,.94,.01);label.position.set(column.x,.45,-1.78);scene.add(label);for(let row=0;row<3;row+=1){const task=roundedBox(.72,.035,.72,row===2&&index===2?palette.signal:palette.paperDark,.035,.94,.01);task.position.set(column.x,.46,-.9+row*.92);task.rotation.y=(index-1)*.025;scene.add(task);for(let mark=0;mark<3;mark+=1){const line=box(.44-mark*.06,.014,.018,mark===0?palette.red:0x63746d);line.position.set(column.x,.49,-1.08+row*.92+mark*.13);scene.add(line);}drafts.push(task);}});
  const route=roundedBox(2.75,.04,.72,0xb9aa7f,.035,.95,.01);route.position.set(2.55,.46,1.72);scene.add(route);
  const routeLine=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(1.5,.5,1.78),new THREE.Vector3(2.15,.51,1.55),new THREE.Vector3(2.85,.51,1.83),new THREE.Vector3(3.55,.51,1.58)]),24,.025,7,false),mat(palette.red,.5,.04));scene.add(routeLine);
  const items:[string,string,THREE.Mesh,[number,number,number],[number,number,number]][]=[
    ["target",fieldCaseContent.itemLabels.target,target,[2.18,.55,2.18],[-2.75,1.2,-.22]],
    ["internship",fieldCaseContent.itemLabels.internship,card,[1.7,.5,1.12],[-.62,1.17,-.72]],
    ["ticket",fieldCaseContent.itemLabels.ticket,ticket,[1.8,.5,1.02],[-.58,1.17,.48]],
    ["draft",fieldCaseContent.itemLabels.draft,drafts[4],[3.35,.55,4.75],[2.55,.67,0]],
  ];
  items.forEach(([item,label,visual,size,position])=>{ const hit=hitBox(item,label,size,position,[visual]); scene.add(hit); hits.push(hit); });
  const clip=cylinder(.12,.85,palette.steel,18);clip.rotation.z=Math.PI/2;clip.position.set(2.55,.53,-2.05);scene.add(clip);
}

const views:Record<CloseupZone,{position:[number,number,number];target:[number,number,number];hint:string}>={
  books:{position:[0,2.8,9.4],target:[0,2.35,0],hint:booksContent.sceneHint},
  drawer:{position:[0,4.75,8.8],target:[0,1.45,-.15],hint:drawerContent.sceneHint},
  notebook:{position:[0,5.7,5.7],target:[0,.45,0],hint:notebookContent.sceneHint},
  board:{position:[0,3,8.8],target:[0,2.65,0],hint:boardContent.sceneHint},
  fieldcase:{position:[0,6.2,7.8],target:[0,.62,0],hint:fieldCaseContent.sceneHint},
  printer:{position:[0,4.25,8.2],target:[0,1.25,.55],hint:faxContact.printer.sceneHint},
  contact:{position:[.8,4.6,7.4],target:[1.25,.6,.2],hint:faxContact.contact.sceneHint},
};

const ariaLabels:Record<CloseupZone,string>={
  books:booksContent.ariaLabel,
  drawer:drawerContent.ariaLabel,
  notebook:notebookContent.ariaLabel,
  board:boardContent.ariaLabel,
  fieldcase:fieldCaseContent.ariaLabel,
  printer:faxContact.printer.ariaLabel,
  contact:faxContact.contact.ariaLabel,
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
    const baseTarget=new THREE.Vector3(...view.target);
    const target=baseTarget.clone();
    camera.position.copy(defaultPosition);
    const hits:HitMesh[]=[];
    if(zone==="books")buildBooks(scene,hits);
    if(zone==="drawer")buildDrawer(scene,hits);
    if(zone==="notebook")buildNotebook(scene,hits);
    if(zone==="board")buildBoard(scene,hits);
    if(zone==="fieldcase")buildFieldCase(scene,hits);
    if(zone==="printer")buildPrinter(scene,hits);
    if(zone==="contact")buildContact(scene,hits);
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
    let drawerTray:THREE.Group|undefined;
    let drawerWorkspace:THREE.Group|undefined;
    let faxPaperGroup:THREE.Group|undefined;
    scene.traverse((child)=>{if(child.userData.drawerTray)drawerTray=child as THREE.Group;if(child.userData.drawerWorkspace)drawerWorkspace=child as THREE.Group;if(child.userData.faxPaperGroup)faxPaperGroup=child as THREE.Group;});
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
      if(drawerWorkspace)drawerWorkspace.rotation.y=-drawerProgress*.15;
      if(zone==="printer"&&faxPaperGroup){
        printProgress=THREE.MathUtils.clamp((now-printStarted)/4600,0,1);
        const eased=1-Math.pow(1-printProgress,3);
        faxPaperGroup.scale.z=.035+eased*.965;
        faxPaperGroup.position.y=.88-eased*.22;
        if(labelRef.current&&!hovered)labelRef.current.textContent=printProgress>.96?faxContact.printer.ready:faxContact.printer.printing;
      }
      const desired=defaultPosition.clone();
      const desiredTarget=baseTarget.clone();
      if(zone==="drawer"){
        desired.lerp(new THREE.Vector3(.4,7.15,6.25),drawerProgress);
        desiredTarget.lerp(new THREE.Vector3(-.85,.72,.85),drawerProgress);
      }
      desired.x+=Math.sin(orbitX)*2.4; desired.y+=orbitY*2; desired.z-=Math.abs(Math.sin(orbitX))*.5;
      camera.position.lerp(desired,.06);target.lerp(desiredTarget,.075);camera.lookAt(target);
      renderer.render(scene,camera);frame=requestAnimationFrame(tick);
    };frame=requestAnimationFrame(tick);
    return()=>{observer.disconnect();cancelAnimationFrame(frame);canvas.removeEventListener("pointermove",pointerMove);canvas.removeEventListener("pointerdown",pointerDown);canvas.removeEventListener("pointerup",pointerUp);canvas.removeEventListener("pointercancel",pointerUp);scene.traverse((object)=>{if(object instanceof THREE.Mesh){object.geometry.dispose();const materials=Array.isArray(object.material)?object.material:[object.material];materials.forEach((material)=>material.dispose());}});renderer.dispose();};
  },[zone]);

  return <div className={`model-scene model-${zone}`}><canvas ref={canvasRef} aria-label={ariaLabels[zone]} /><div ref={labelRef} className="model-scene-readout">{views[zone].hint}</div></div>;
}
