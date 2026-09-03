"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { createFieldCaseWorldMapCanvas, FIELD_CASE_TRAVEL_PINS, pinPosition } from "./fieldCaseMap";
import { aspectOverflowDistanceScale } from "./cameraFraming";
import {
  board as boardContent,
  books as booksContent,
  drawer as drawerContent,
  faxContact,
  fieldCase as fieldCaseContent,
  notebook as notebookContent,
  site as siteContent,
} from "@/content";

const DEFAULT_CLOSEUP_EXPOSURE=1;
const PORTRAIT_CLOSEUP_EXPOSURE=1.1;
const DEFAULT_CLOSEUP_FOG_DENSITY=.035;

export type CloseupZone = "drawer" | "books" | "notebook" | "board" | "fieldcase" | "printer" | "contact";

type Props = {
  zone: CloseupZone;
  onSelect: (item: string) => void;
  faxPrinted?: boolean;
  onFaxPrinted?: () => void;
  contactCardRaised?: boolean;
};

function createFieldCaseWorldMapTexture(resolution=1024) {
  const texture=new THREE.CanvasTexture(createFieldCaseWorldMapCanvas(resolution));
  texture.colorSpace=THREE.SRGBColorSpace;
  texture.minFilter=THREE.LinearMipmapLinearFilter;
  texture.magFilter=THREE.LinearFilter;
  texture.userData.fieldCaseOwned=true;
  return texture;
}

type HitMesh = THREE.Mesh & { userData: { item?: string; label?: string; requiresOpen?: boolean; requiresPrinted?: boolean; hoverOnly?: boolean; visuals?: THREE.Mesh[] } };

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

function buildPrinterModel(parent:THREE.Object3D, position:[number,number,number], scale=1, showFax=false, hits?:HitMesh[], interactiveFax=false) {
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
  if(showFax){
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
    if(interactiveFax&&hits){
      const paperHit=hitBox("fax",faxContact.printer.paperHitLabel,[2.55,.45,3.25],[0,.16,1.45],[paper],false,true);
      paperGroup.add(paperHit); hits.push(paperHit);
    }
    printer.add(paperGroup);
  }
  printer.position.set(...position);
  printer.scale.setScalar(scale);
  parent.add(printer);
  return {printer,paperGroup,body,screen};
}

function addContactCard(parent:THREE.Object3D,position:[number,number,number],rotation=-.08,hits?:HitMesh[],scale=.58) {
  const group=new THREE.Group();
  group.userData.contactCard=true;
  group.position.set(...position);
  group.rotation.y=rotation;
  group.scale.setScalar(scale);
  const card=roundedBox(2.55,.045,1.45,0xe5dcc6,.055,.92,.01);
  const accent=box(.12,.025,1.16,palette.red,.7,.02); accent.position.set(-.93,.045,0);
  const nameLine=box(1.15,.025,.055,0x283f3a,.72,.02); nameLine.position.set(-.12,.05,-.32);
  group.add(card,accent,nameLine);
  for(let line=0;line<3;line+=1){const detail=box(1.25-line*.14,.018,.028,0x6e7c75,.72,.02);detail.position.set(-.06,.05,.02+line*.18);group.add(detail);}
  if(hits){const hit=hitBox("contact",faxContact.contact.hitLabel,[2.8,.55,1.75],[0,.12,0],[card]);group.add(hit);hits.push(hit);}
  parent.add(group);
  return group;
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
  const back = roundedBox(8.25,2.95,.22,0x32231b,.08,.92,.02);
  back.position.set(-.84,1.72,-.48);back.scale.x=.75;
  const sideL = roundedBox(.34,3.2,1.75,palette.wood,.08,.86,.03);
  sideL.position.set(-4.18,1.7,0);
  const sideR = sideL.clone(); sideR.position.x=2.43;
  const base=roundedBox(8.7,.28,1.78,palette.woodLight,.08,.82,.04);base.position.set(-.86,.25,0);base.scale.x=.75;
  const top=roundedBox(8.7,.24,1.78,palette.wood,.08,.84,.03);top.position.set(-.86,3.27,0);top.scale.x=.75;
  const frontLip=roundedBox(8.55,.16,.16,0x4a3225,.045,.78,.04);frontLip.position.set(-.86,.4,.82);frontLip.scale.x=.75;
  shelf.add(back,sideL,sideR,base,top,frontLip);

  const books=booksContent.books as {id:string;title:string;author:string;isReading:boolean}[];
  const movies=booksContent.movies as {id:string;title:string}[];
  const bookColors=[0x30584f,0x894a3c,0xb28e46,0x355066];
  const makeBook=(book:{id:string;title:string;author:string;isReading:boolean},index:number,x:number,y:number,series=false,selectable=true)=>{
    const group=new THREE.Group();
    const height=series?2.02:1.94+(index%2)*.12;
    const width=series ? .38 : .47;
    const color=series?0x402946:bookColors[index%bookColors.length];
    const cover=roundedBox(width,height,.92,color,.055,.67,.02);cover.position.y=height/2;
    const pages=roundedBox(width-.12,height-.13,.71,palette.paper,.035,.94,.01);pages.position.set(.028,height/2,-.075);
    const spine=roundedBox(.13,height-.08,.98,color,.035,.68,.02);spine.position.set(-width*.42,height/2,.02);
    const band=box(width+.015,series ? .105 : .07,.99,series?0xcaa65a:(book.isReading?palette.signal:0xbba980),.7,.02);band.position.set(0,height*(series ? .72 : .7),.02);
    group.add(cover,pages,spine,band);
    for(let mark=0;mark<3;mark+=1){const titleMark=box(width*.47,.023,.028,series?0xe5c675:0xd7cba9,.75,.01);titleMark.position.set(.04,height*.53-mark*.17,.51);group.add(titleMark);}
    if(book.isReading){const bookmark=box(.15,.58,.035,palette.signal);bookmark.position.set(width*.12,height+.17,.08);group.add(bookmark);}
    group.position.set(x,y,.05);group.rotation.z=(index%3-1)*.018;shelf.add(group);
    if(selectable){const hit=hitBox(`book:${book.id}`,book.title,[width+.16,height+.24,1.12],[x,y+height/2,.05],[cover,pages,spine,band]);hit.userData.hoverOnly=!booksContent.openingEnabled;shelf.add(hit);hits.push(hit);}
    return {group,cover,pages,spine,band};
  };
  books.filter((book)=>book.author!=="Keigo Higashino").forEach((book,index)=>makeBook(book,index,-3.74+index*.58,.43));
  const seriesBooks=books.filter((book)=>book.author==="Keigo Higashino");
  const seriesVisuals=seriesBooks.map((book,index)=>makeBook(book,index,-.35+index*.42,.43,true,false));
  const seriesHit=hitBox("series:higashino","KEIGO HIGASHINO SERIES",[.8,2.28,1.12],[-.14,1.45,.05],seriesVisuals.flatMap((entry)=>[entry.cover,entry.pages,entry.spine,entry.band]));seriesHit.userData.hoverOnly=!booksContent.openingEnabled;shelf.add(seriesHit);hits.push(seriesHit);

  const filmBasket=new THREE.Group();filmBasket.userData.mediaBasket=true;
  filmBasket.position.set(1.43,0,.03);filmBasket.rotation.y=Math.PI/2;
  const basketBase=roundedBox(1.02,.1,1.4,0x3d4844,.035,.38,.58);basketBase.position.set(0,.47,.04);
  const basketFront=roundedBox(1.02,.09,.08,0x59645f,.025,.32,.62);basketFront.position.set(0,.95,.73);
  const basketBack=basketFront.clone();basketBack.position.z=-.65;
  const basketSideL=roundedBox(.09,.55,1.4,0x59645f,.025,.34,.6);basketSideL.position.set(-.51,.72,.04);
  const basketSideR=basketSideL.clone();basketSideR.position.x=.51;
  filmBasket.add(basketBase,basketFront,basketBack,basketSideL,basketSideR);
  for(let index=0;index<3;index+=1){const slat=roundedBox(.055,.46,.07,0x46534e,.018,.34,.62);slat.position.set(-.33+index*.33,.72,.73);filmBasket.add(slat);}

  const filmColors=[0x70c9c0,0xb94e3e,0xd1f45c,0xcaa65a,0x8072a2,0x5da19b];
  movies.forEach((movie,index)=>{
    const x=0,y=.54,z=-.54+index*.095;
    const group=new THREE.Group();
    const disc=new THREE.Mesh(new THREE.CylinderGeometry(.27,.27,.018,48),mat(0xd9d5c5,.19,.82));disc.rotation.x=Math.PI/2;disc.scale.y=1.45;disc.position.set(0,.43,.045);disc.castShadow=true;
    const colorRing=new THREE.Mesh(new THREE.RingGeometry(.18,.252,48),mat(filmColors[index%filmColors.length],.24,.55));colorRing.position.set(0,.43,.058);
    const label=new THREE.Mesh(new THREE.CircleGeometry(.115,32),mat(index%2?0x243a36:0x334f4a,.46,.16));label.position.set(0,.43,.061);
    const hub=new THREE.Mesh(new THREE.RingGeometry(.032,.062,24),mat(0xe2dcc8,.16,.74));hub.position.set(0,.43,.064);
    const centerHole=new THREE.Mesh(new THREE.CircleGeometry(.031,24),mat(palette.void,.72,.08));centerHole.position.set(0,.43,.066);
    const clearMaterial=new THREE.MeshPhysicalMaterial({color:0xe8f3ee,transparent:true,opacity:.3,transmission:.62,roughness:.13,metalness:0,thickness:.04,depthWrite:false});
    const clearCase=new THREE.Mesh(new RoundedBoxGeometry(.72,.86,.052,4,.018),clearMaterial);clearCase.scale.z=1.42;clearCase.position.set(0,.43,.09);clearCase.castShadow=true;
    const hinge=roundedBox(.038,.77,.062,0xcad9d4,.012,.26,.12);hinge.scale.z=1.25;hinge.position.set(-.32,.43,.105);
    const topEdge=roundedBox(.65,.025,.065,0xdce7e2,.009,.24,.1);topEdge.position.set(.01,.82,.105);
    const bottomEdge=topEdge.clone();bottomEdge.position.y=.04;
    const latch=roundedBox(.075,.035,.07,0xb8c9c4,.009,.24,.12);latch.position.set(.32,.43,.108);
    group.add(disc,colorRing,label,hub,centerHole,clearCase,hinge,topEdge,bottomEdge,latch);
    group.position.set(x,y,z);group.rotation.z=[0,.022,0,-.018,0,.016,0,-.02,0,.018,0,-.014][index];filmBasket.add(group);
    const hit=hitBox(`movie:${movie.id}`,movie.title,[.285,.9,.075],[0,.43,.08],[disc,colorRing,label,hub,clearCase,hinge]);hit.userData.hoverOnly=true;group.add(hit);hits.push(hit);
  });
  shelf.add(filmBasket);
  scene.add(shelf);
}

function buildDrawer(scene:THREE.Scene,hits:HitMesh[],faxPrinted:boolean) {
  const wall=box(11,6,.2,0x18201e,.96,.03); wall.position.set(0,3,-2.8); scene.add(wall);
  const workspace=new THREE.Group();workspace.userData.drawerWorkspace=true;scene.add(workspace);
  const desk=roundedBox(9.5,.34,5.1,palette.woodLight,.12,.82,.04); desk.position.set(.25,2.18,.2); workspace.add(desk);
  const frontEdge=roundedBox(9.5,.18,.16,palette.wood,.05,.72,.04); frontEdge.position.set(.25,2.03,2.66); workspace.add(frontEdge);
  for(const x of [-4.05,4.55]){
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

  buildPrinterModel(workspace,[2.75,2.32,.35],.76,faxPrinted);
  addContactCard(workspace,[4.1,2.39,2.2],-.12,undefined,.46);
  const monitorAssembly=new THREE.Group();monitorAssembly.position.set(-1.5,2.35,-1.25);monitorAssembly.scale.setScalar(1.3);workspace.add(monitorAssembly);
  const monitor=roundedBox(3.45,2.15,.28,0x242c2a,.11,.34,.68);monitor.position.set(0,1.12,0);monitorAssembly.add(monitor);
  const monitorScreen=roundedBox(3.08,1.78,.035,0x0d2928,.035,.18,.08);monitorScreen.position.set(0,1.12,.16);monitorAssembly.add(monitorScreen);
  const monitorMaterial=monitorScreen.material as THREE.MeshStandardMaterial;monitorMaterial.emissive.setHex(palette.cyan);monitorMaterial.emissiveIntensity=.72;
  for(let row=0;row<9;row+=1){const length=.55+((row*7)%9)*.18;const line=box(length,.018,.014,row%3===0?palette.signal:palette.cyan,.45,.15);line.position.set(-1.35+length/2,1.73-row*.15,.185);const lineMaterial=line.material as THREE.MeshStandardMaterial;lineMaterial.emissive.setHex(row%3===0?palette.signal:palette.cyan);lineMaterial.emissiveIntensity=1.05;monitorAssembly.add(line);}
  const monitorStem=roundedBox(.2,.9,.28,palette.metal,.05,.35,.7);monitorStem.position.set(0,.35,0);monitorAssembly.add(monitorStem);
  const monitorBase=roundedBox(1.25,.08,.68,palette.metal,.05,.38,.62);monitorBase.position.set(0,.05,.3);monitorAssembly.add(monitorBase);
  const keyboard=roundedBox(2.7,.1,.87,0x202725,.055,.5,.45);keyboard.position.set(.05,.05,1.83);keyboard.rotation.x=-.035;monitorAssembly.add(keyboard);
  for(let row=0;row<4;row+=1){for(let column=0;column<12;column+=1){const key=roundedBox(.14,.025,.1,column===11?0x8a6b52:0x68716c,.02,.42,.34);key.position.set(-.83+column*.16,.115,1.57+row*.14);monitorAssembly.add(key);}}
  const mouse=roundedBox(.35,.13,.52,0x303936,.1,.34,.4);mouse.position.set(1.82,.11,1.83);monitorAssembly.add(mouse);
  const mug=new THREE.Group(); mug.position.set(.82,2.36,-.5);
  const mugMaterial=mat(0x28443d,.34,.12);
  const mugBody=new THREE.Mesh(new THREE.CylinderGeometry(.33,.29,.64,32,1,true),mugMaterial); mugBody.position.y=.32;
  const mugBase=new THREE.Mesh(new THREE.CylinderGeometry(.29,.29,.035,32),mugMaterial); mugBase.position.y=.018;
  const mugInside=new THREE.Mesh(new THREE.CylinderGeometry(.265,.265,.018,32),mat(0x111917,.76,.02)); mugInside.position.y=.57;
  const mugRim=new THREE.Mesh(new THREE.TorusGeometry(.3,.032,10,36),mugMaterial); mugRim.position.y=.64; mugRim.rotation.x=Math.PI/2;
  const mugHandle=new THREE.Mesh(new THREE.TorusGeometry(.2,.045,10,30),mugMaterial); mugHandle.position.set(.34,.34,0);
  mug.add(mugBody,mugBase,mugInside,mugRim,mugHandle); workspace.add(mug);
  const lampBase=cylinder(.42,.11,0x282f2d,28); lampBase.position.set(3.72,2.39,-1.2); workspace.add(lampBase);
  const lampStem=cylinder(.045,1.45,0x3e4945,14); lampStem.position.set(3.72,3.08,-1.2); workspace.add(lampStem);
  const shade=new THREE.Mesh(new THREE.ConeGeometry(.42,.55,28,1,true),mat(0x202825,.36,.62)); shade.position.set(3.72,3.72,-1.2); shade.rotation.z=Math.PI; workspace.add(shade);
}

function buildPrinterDesk(scene:THREE.Scene,hits:HitMesh[],withFax:boolean,faxPrinted:boolean) {
  const wall=box(11,6,.2,0x18201e,.96,.03); wall.position.set(0,3,-2.8); scene.add(wall);
  const desk=roundedBox(9,.34,4.7,palette.woodLight,.12,.82,.04); desk.position.y=.18; scene.add(desk);
  buildPrinterModel(scene,[0,.42,-.35],1,withFax||faxPrinted,hits,withFax);
  const note=roundedBox(1.25,.035,1.2,palette.signal,.035,.9,.01); note.position.set(3.18,.37,-1.1); note.rotation.y=-.12; scene.add(note);
  const penBarrel=cylinder(.06,1.1,palette.red,18); penBarrel.rotation.z=Math.PI/2; penBarrel.position.set(3.25,.45,-.85);
  const penCap=cylinder(.068,.28,0x303a36,18); penCap.rotation.z=Math.PI/2; penCap.position.set(3.88,.45,-.85);
  const penTip=new THREE.Mesh(new THREE.ConeGeometry(.06,.18,16),mat(0xb6aa91,.32,.52)); penTip.rotation.z=Math.PI/2; penTip.position.set(2.61,.45,-.85);
  const penClip=box(.42,.018,.026,0x7e8780,.28,.7); penClip.position.set(3.62,.52,-.85);
  scene.add(penBarrel,penCap,penTip,penClip);
  const cardCase=roundedBox(1.72,.07,1.02,0x4a3428,.06,.72,.04);cardCase.position.set(2.85,.42,.92);cardCase.rotation.y=-.1;scene.add(cardCase);
  addContactCard(scene,[2.85,.48,.92],-.1,hits,.58);
}

function buildPrinter(scene:THREE.Scene,hits:HitMesh[],faxPrinted:boolean) {
  buildPrinterDesk(scene,hits,true,faxPrinted);
}

function buildContact(scene:THREE.Scene,hits:HitMesh[],faxPrinted:boolean) {
  buildPrinterDesk(scene,hits,false,faxPrinted);
}

function buildNotebook(scene:THREE.Scene,hits:HitMesh[]) {
  const table=box(8,.35,6.8,palette.woodLight,.9,.02); table.position.y=.05; scene.add(table);
  const matBoard=box(6.9,.06,5.4,0x213a35,.95,.02); matBoard.position.y=.27; scene.add(matBoard);
  for(let index=0;index<10;index+=1){ const grid=box(.015,.015,5,0x496960); grid.position.set(-3.1+index*.68,.315,0); scene.add(grid); }
  const book=new THREE.Group();
  const left=roundedBox(3.05,.12,3.85,palette.paper,.06,.94,.01); left.position.set(-1.53,.48,0); left.rotation.y=-.025;
  const right=roundedBox(3.05,.12,3.85,0xe8ddc1,.06,.94,.01); right.position.set(1.53,.48,0); right.rotation.y=.025;
  book.add(left,right);
  addLines(book,-1.53,.55,-1.42,2.45,12);
  addLines(book,1.53,.55,-1.42,2.45,12);
  const spine=box(.2,.18,3.9,0x6f5039,.78,.03); spine.position.set(0,.51,0); book.add(spine);
  const comparisonSheet=roundedBox(1.92,.045,1.48,0xd8cba3,.035,.92,.01); comparisonSheet.position.set(1.55,.6,.12); comparisonSheet.rotation.y=.035;
  const comparisonBars=[
    {width:1.18,z:-.34,color:0x8b5a4c},
    {width:.88,z:.04,color:0x59746d},
    {width:1.48,z:.42,color:palette.signal},
  ].map(({width,z,color})=>{const bar=roundedBox(width,.025,.12,color,.02,.56,.06);bar.position.set(.92+width/2,.635,z);return bar;});
  book.add(comparisonSheet,...comparisonBars);
  const photo=box(1.25,.05,.95,0x455d59); photo.position.set(-1.55,.62,.62); photo.rotation.y=-.08; book.add(photo);
  const pen=cylinder(.065,2.7,palette.red,12); pen.rotation.z=Math.PI/2; pen.position.set(.9,.72,1.65); book.add(pen);
  scene.add(book);
  // The page is the interaction target. The blue diagram remains a sketch on
  // the paper instead of taking hover away from the page underneath it.
  const researchHit=hitBox("research",notebookContent.itemLabels.research,[3.02,.5,3.72],[-1.53,.7,0],[left,photo]);
  const marginHit=hitBox("margin",notebookContent.itemLabels.margin,[3.02,.5,3.72],[1.53,.7,0],[right,comparisonSheet,...comparisonBars]);
  scene.add(researchHit,marginHit); hits.push(researchHit,marginHit);

  // Match the room-view lamp exactly, scaled with the notebook (the close-up
  // pages are roughly twice the room-view dimensions). The shared -2.15 angle
  // makes the arm lean over the page in both views; the close framing crops the
  // upper lamp naturally.
  const lamp=new THREE.Group();
  lamp.position.set(2.7,.31,-2.6);
  lamp.rotation.y=-2.15;
  lamp.scale.setScalar(2);
  const lampBase=cylinder(.34,.09,0x26312e,32); lampBase.position.y=.045;
  const baseCap=cylinder(.21,.035,palette.steel,28); baseCap.position.y=.105;
  const switchButton=box(.13,.045,.09,palette.red,.46,.18); switchButton.position.set(.13,.14,.03);
  const lowerJoint=cylinder(.11,.18,palette.steel,24); lowerJoint.position.set(0,.24,0); lowerJoint.rotation.x=Math.PI/2;
  const lowerArms=[-.075,.075].map((offset)=>{const arm=cylinder(.035,1.02,0x56635e,14);arm.position.set(0,.76,offset);return arm;});
  const elbow=cylinder(.12,.22,palette.steel,24); elbow.position.set(0,1.29,0); elbow.rotation.x=Math.PI/2;
  const upperAngle=-.88;
  const upperLength=1.15;
  const upperX=Math.sin(-upperAngle)*upperLength;
  const upperY=Math.cos(upperAngle)*upperLength;
  const upperArms=[-.065,.065].map((offset)=>{const arm=cylinder(.034,upperLength,0x56635e,14);arm.position.set(upperX/2,1.29+upperY/2,offset);arm.rotation.z=upperAngle;return arm;});
  const headJoint=cylinder(.13,.24,palette.steel,24); headJoint.position.set(upperX,1.29+upperY,0); headJoint.rotation.x=Math.PI/2;
  const lampHead=new THREE.Group(); lampHead.position.set(upperX+.03,1.29+upperY-.02,0); lampHead.rotation.z=-.3;
  const shade=new THREE.Mesh(new THREE.CylinderGeometry(.22,.48,.46,32,1,true),mat(0x334b45,.3,.48)); shade.position.y=-.27;
  const reflector=cylinder(.35,.025,0xd6c8a9,32); reflector.position.y=-.5;
  const shadeRim=new THREE.Mesh(new THREE.TorusGeometry(.48,.022,8,40),mat(palette.steel,.28,.72)); shadeRim.position.y=-.5; shadeRim.rotation.x=Math.PI/2;
  const bulb=new THREE.Mesh(new THREE.SphereGeometry(.12,16,12),mat(0xffc98c,.25,.02,0xffb96a,1.2)); bulb.position.y=-.56;
  const lampGlow=new THREE.PointLight(0xffbf7d,8,5.5,1.8); lampGlow.position.set(0,-.62,.04);
  lampHead.add(shade,reflector,shadeRim,bulb,lampGlow);
  lamp.add(lampBase,baseCap,switchButton,lowerJoint,...lowerArms,elbow,...upperArms,headJoint,lampHead);
  scene.add(lamp);
}

function buildBoard(scene:THREE.Scene,hits:HitMesh[]) {
  const frame=roundedBox(8.4,5.35,.35,palette.wood,.11,.86,.03); frame.position.set(0,2.7,-.25); scene.add(frame);
  const cork=roundedBox(7.85,4.82,.18,0x765d42,.06,.98,.01); cork.position.set(0,2.7,0); scene.add(cork);
  const notes=[
    {x:-2.75,y:3.95,w:1.28,h:.94,color:0xe1d3a4,label:boardContent.hitLabels[0]},
    {x:-1.03,y:3.67,w:1.3,h:1,color:0xb9d6ce,label:boardContent.hitLabels[1]},
    {x:.68,y:3.95,w:1.15,h:.9,color:0xd8a895,label:boardContent.hitLabels[2]},
    {x:2.38,y:3.65,w:1.35,h:1,color:0xe2d8bd,label:boardContent.hitLabels[3]},
    {x:-2.42,y:2.08,w:1.42,h:1.02,color:0xc7b77f,label:boardContent.hitLabels[4]},
    {x:-.52,y:2.28,w:1.24,h:.94,color:0xd7c9a8,label:boardContent.hitLabels[5]},
    {x:1.42,y:1.82,w:1.4,h:1.04,color:0xb7ccc5,label:boardContent.hitLabels[6]},
  ];
  notes.forEach((note,index)=>{
    const paper=roundedBox(note.w,note.h,.045,note.color,.025,.94,.01); paper.position.set(note.x,note.y,.18); paper.rotation.z=(index-3)*.024; scene.add(paper);
    for(let line=0;line<3;line+=1){ const mark=box(note.w*.62,.014,.016,line===0?palette.red:0x63746d); mark.position.set(note.x,note.y+.18-line*.16,.225); mark.rotation.z=paper.rotation.z; scene.add(mark); }
    const pin=cylinder(.055,.08,index===0?palette.red:palette.signal,12); pin.rotation.x=Math.PI/2; pin.position.set(note.x,note.y+note.h*.36,.27); scene.add(pin);
    const hit=hitBox(String(index),note.label,[note.w+.2,note.h+.2,.45],[note.x,note.y,.28],[paper]); scene.add(hit); hits.push(hit);
  });
  const connections:[[number,number],[number,number]][]=[
    [[-2.75,3.95],[-1.03,3.67]],[[-1.03,3.67],[.68,3.95]],[[.68,3.95],[2.38,3.65]],
    [[-2.75,3.95],[-2.42,2.08]],[[-1.03,3.67],[-.52,2.28]],[[2.38,3.65],[1.42,1.82]],
  ];
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
  const target=roundedBox(1.72,.035,1.72,palette.paper,.035,.97,.01);target.position.set(-3.05,1.02,-.35);target.rotation.y=-.05;caseGroup.add(target);
  const targetRings=[[.73,.61,0x2d3a37],[.59,.45,0xd7c868],[.43,.28,palette.red],[.26,.08,0x4b7770]] as const;
  targetRings.forEach(([outer,inner,color])=>{const ring=new THREE.Mesh(new THREE.RingGeometry(inner,outer,40),mat(color,.78,.02));ring.rotation.x=-Math.PI/2;ring.position.set(-3.05,1.05,-.35);ring.rotation.z=-.05;caseGroup.add(ring);});
  const safetyTab=roundedBox(.42,.08,.58,0x5f392e,.12,.7,.08);safetyTab.position.set(-1.63,1.08,-.58);safetyTab.rotation.y=.12;caseGroup.add(safetyTab);
  for(const x of [-1.72,-1.54]){const rivet=cylinder(.026,.025,palette.steel,12);rivet.position.set(x,1.13,-.58);caseGroup.add(rivet);}
  const safetyLabel=roundedBox(.62,.025,.16,palette.signal,.025,.84,.01);safetyLabel.position.set(-3.05,1.065,-1.04);safetyLabel.rotation.y=-.05;caseGroup.add(safetyLabel);
  const recipeCards:THREE.Mesh[]=[];
  [[-.75,-.54,.1],[-.52,.25,-.1]].forEach(([x,z,angle],index)=>{
    const recipeCard=roundedBox(1.28,.045,.92,index===0?0xe4dcc6:0xd4c9a8,.035,.96,.01);recipeCard.position.set(x,1.03,z);recipeCard.rotation.y=angle;caseGroup.add(recipeCard);recipeCards.push(recipeCard);
    const image=roundedBox(.98,.018,.57,index===0?0x365f65:0x765641,.025,.85,.01);image.position.set(x,1.064,z-.1);image.rotation.y=angle;caseGroup.add(image);
    const horizon=box(.7,.012,.025,index===0?palette.cyan:0xd7bd73,.8,.01);horizon.position.set(x,1.078,z-.1);horizon.rotation.y=angle;caseGroup.add(horizon);
    const sun=new THREE.Mesh(new THREE.CircleGeometry(.07,16),mat(index===0?0xd6c66c:0xd8a66d,.76,.01));sun.rotation.x=-Math.PI/2;sun.position.set(x+.27,1.082,z-.22);caseGroup.add(sun);
    const caption=box(.55,.012,.018,0x6b766e,.82,.01);caption.position.set(x,1.066,z+.34);caption.rotation.y=angle;caseGroup.add(caption);
  });
  const arrows:THREE.Mesh[]=[];
  for(let index=0;index<3;index+=1){
    const shaft=cylinder(.025,2.15,index===1?0xb8d5cc:0xb47b4d,10);shaft.rotation.z=Math.PI/2;shaft.position.set(-1.8,1.12,.72+index*.17);shaft.rotation.y=-.04+index*.035;caseGroup.add(shaft);arrows.push(shaft);
    const fletching=box(.22,.035,.11,index===1?palette.signal:palette.red,.7,.02);fletching.position.set(-2.72,1.13,.72+index*.17);fletching.rotation.y=-.04+index*.035;caseGroup.add(fletching);
    const safeCap=cylinder(.038,.08,palette.steel,10);safeCap.rotation.z=Math.PI/2;safeCap.position.set(-.68,1.12,.72+index*.17);caseGroup.add(safeCap);
  }
  const arrowWrap=roundedBox(.26,.055,.58,0x6a4434,.035,.72,.05);arrowWrap.position.set(-1.72,1.15,.89);arrowWrap.rotation.y=.015;caseGroup.add(arrowWrap);
  scene.add(caseGroup);
  const mapCenterX=2.52,mapCenterZ=-.5,mapWidth=3.55,mapDepth=1.95;
  const mapBoard=roundedBox(3.82,.1,2.22,0x6b553a,.08,.78,.08);mapBoard.position.set(mapCenterX,.38,mapCenterZ);scene.add(mapBoard);
  const mapTexture=createFieldCaseWorldMapTexture();
  const worldMap=new THREE.Mesh(new THREE.PlaneGeometry(mapWidth,mapDepth),new THREE.MeshStandardMaterial({map:mapTexture,roughness:.9,metalness:0}));
  worldMap.rotation.x=-Math.PI/2;worldMap.position.set(mapCenterX,.445,mapCenterZ);worldMap.receiveShadow=true;worldMap.userData.fieldCaseTexture=mapTexture;scene.add(worldMap);
  for(const x of [mapCenterX-mapWidth*.47,mapCenterX+mapWidth*.47]){for(const z of [mapCenterZ-mapDepth*.44,mapCenterZ+mapDepth*.44]){const corner=roundedBox(.22,.035,.13,palette.steel,.025,.4,.55);corner.position.set(x,.47,z);scene.add(corner);}}
  FIELD_CASE_TRAVEL_PINS.forEach(({coordinate})=>{
    const [x,z]=pinPosition(coordinate,mapCenterX,mapCenterZ,mapWidth,mapDepth);
    const foot=new THREE.Mesh(new THREE.RingGeometry(.018,.03,14),mat(palette.red,.62,.04));foot.rotation.x=-Math.PI/2;foot.position.set(x,.458,z);scene.add(foot);
    const stem=cylinder(.01,.1,palette.red,8);stem.position.set(x,.515,z);scene.add(stem);
    const head=new THREE.Mesh(new THREE.SphereGeometry(.035,10,7),mat(palette.red,.55,.06));head.position.set(x,.59,z);head.castShadow=true;scene.add(head);
    const glint=new THREE.Mesh(new THREE.SphereGeometry(.008,7,5),mat(0xf2e9c9,.4,.02));glint.position.set(x-.012,.602,z+.012);scene.add(glint);
  });
  const compassRing=new THREE.Mesh(new THREE.RingGeometry(.12,.17,24),mat(0x7b503f,.76,.02));compassRing.rotation.x=-Math.PI/2;compassRing.position.set(3.93,.465,.26);scene.add(compassRing);
  const items:[string,string,THREE.Mesh,[number,number,number],[number,number,number]][]=[
    ["laserShooting",fieldCaseContent.itemLabels.laserShooting,target,[1.95,.55,1.95],[-3.05,1.2,-.35]],
    ["recipes",fieldCaseContent.itemLabels.recipes,recipeCards[0],[1.75,.55,2.05],[-.62,1.18,-.1]],
    ["archery",fieldCaseContent.itemLabels.archery,arrows[1],[2.55,.5,.7],[-1.8,1.25,.9]],
    ["travelMap",fieldCaseContent.itemLabels.travelMap,worldMap,[3.75,.55,2.18],[mapCenterX,.67,mapCenterZ]],
  ];
  items.forEach(([item,label,visual,size,position])=>{
    const hit=hitBox(item,label,size,position,[visual]);
    // The travel map remains interactive. Keep the other models and detail
    // routes intact, then set personalDetailsOpeningEnabled to true in
    // content/field-case.json when those personal close-ups are ready to reopen.
    hit.userData.hoverOnly=item!=="travelMap"&&!fieldCaseContent.personalDetailsOpeningEnabled;
    scene.add(hit);
    hits.push(hit);
  });
  const mapClip=cylinder(.1,.72,palette.steel,18);mapClip.rotation.z=Math.PI/2;mapClip.position.set(mapCenterX,.53,-1.59);scene.add(mapClip);
  for(const x of [mapCenterX-.3,mapCenterX+.3]){const mount=cylinder(.07,.13,0x4e5954,14);mount.position.set(x,.48,-1.59);scene.add(mount);}
}

const views:Record<CloseupZone,{position:[number,number,number];target:[number,number,number];hint:string}>={
  books:{position:[0,2.05,9.4],target:[0,1.62,0],hint:booksContent.sceneHint},
  drawer:{position:[0,4.75,8.8],target:[0,1.45,-.15],hint:drawerContent.sceneHint},
  notebook:{position:[-.35,5.7,5.7],target:[-.45,1.1,0],hint:notebookContent.sceneHint},
  board:{position:[0,3,8.8],target:[0,2.65,0],hint:boardContent.sceneHint},
  fieldcase:{position:[0,6.2,7.8],target:[0,.62,0],hint:fieldCaseContent.sceneHint},
  printer:{position:[0,4.25,8.2],target:[0,1.25,.55],hint:faxContact.printer.sceneHint},
  contact:{position:[0,4.25,8.2],target:[0,1.25,.55],hint:faxContact.contact.sceneHint},
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

export default function ZoneCloseup3D({zone,onSelect,faxPrinted=false,onFaxPrinted,contactCardRaised=false}:Props) {
  const canvasRef=useRef<HTMLCanvasElement>(null);
  const labelRef=useRef<HTMLDivElement>(null);
  const selectRef=useRef(onSelect);
  const faxPrintedRef=useRef(faxPrinted);
  const onFaxPrintedRef=useRef(onFaxPrinted);
  const contactCardRaisedRef=useRef(contactCardRaised);
  useEffect(()=>{selectRef.current=onSelect;},[onSelect]);
  useEffect(()=>{faxPrintedRef.current=faxPrinted;},[faxPrinted]);
  useEffect(()=>{onFaxPrintedRef.current=onFaxPrinted;},[onFaxPrinted]);
  useEffect(()=>{contactCardRaisedRef.current=contactCardRaised;},[contactCardRaised]);

  useEffect(()=>{
    const canvas=canvasRef.current;
    const stage=canvas?.parentElement;
    if(!canvas||!stage)return;
    const initialFaxPrinted=faxPrintedRef.current;
    const initialContactCardRaised=contactCardRaisedRef.current;
    const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:"high-performance"});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.6));
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    renderer.toneMapping=THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure=DEFAULT_CLOSEUP_EXPOSURE;
    renderer.shadowMap.enabled=true;
    renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    const scene=new THREE.Scene();
    scene.background=new THREE.Color(palette.void);
    const closeupFog=new THREE.FogExp2(palette.void,DEFAULT_CLOSEUP_FOG_DENSITY);
    scene.fog=closeupFog;
    const camera=new THREE.PerspectiveCamera(42,1,.1,50);
    const view=views[zone];
    const defaultPosition=new THREE.Vector3(...view.position);
    const baseTarget=new THREE.Vector3(...view.target);
    const target=baseTarget.clone();
    camera.position.copy(defaultPosition);
    const hits:HitMesh[]=[];
    if(zone==="books")buildBooks(scene,hits);
    if(zone==="drawer")buildDrawer(scene,hits,initialFaxPrinted);
    if(zone==="notebook")buildNotebook(scene,hits);
    if(zone==="board")buildBoard(scene,hits);
    if(zone==="fieldcase")buildFieldCase(scene,hits);
    if(zone==="printer")buildPrinter(scene,hits,initialFaxPrinted);
    if(zone==="contact")buildContact(scene,hits,initialFaxPrinted);
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
    let contactCardGroup:THREE.Group|undefined;
    scene.traverse((child)=>{if(child.userData.drawerTray)drawerTray=child as THREE.Group;if(child.userData.drawerWorkspace)drawerWorkspace=child as THREE.Group;if(child.userData.faxPaperGroup)faxPaperGroup=child as THREE.Group;if(child.userData.contactCard)contactCardGroup=child as THREE.Group;});
    const contactCardOrigin=contactCardGroup?.position.clone();
    const contactCardRotation=contactCardGroup?.rotation.clone();
    const contactCardScale=contactCardGroup?.scale.x??1;
    const printStarted=performance.now()+550;
    let printProgress=zone==="printer"&&!initialFaxPrinted?0:1;
    let printNotified=initialFaxPrinted;
    let contactCardProgress=initialContactCardRaised?1:0;
    let isPortrait=false;
    let portraitDistanceScale=1;
    if(faxPaperGroup&&initialFaxPrinted){faxPaperGroup.scale.z=1;faxPaperGroup.position.y=.66;}
    let frame=0;
    const setHighlight=(hit:HitMesh|null,on:boolean)=>hit?.userData.visuals?.forEach((visual)=>{ const material=visual.material as THREE.MeshStandardMaterial; if("emissive" in material){ material.emissive.setHex(on?palette.signal:0x000000); material.emissiveIntensity=on ? .16 : 0; }});
    const resize=()=>{ const rect=stage.getBoundingClientRect(); if(rect.width<2||rect.height<2)return; const nextAspect=rect.width/rect.height; isPortrait=rect.height>=rect.width; portraitDistanceScale=isPortrait?aspectOverflowDistanceScale(nextAspect):1; closeupFog.density=DEFAULT_CLOSEUP_FOG_DENSITY/portraitDistanceScale; renderer.toneMappingExposure=isPortrait?PORTRAIT_CLOSEUP_EXPOSURE:DEFAULT_CLOSEUP_EXPOSURE; renderer.setSize(rect.width,rect.height,false); camera.aspect=nextAspect; camera.fov=42; camera.updateProjectionMatrix(); };
    const observer=new ResizeObserver(resize); observer.observe(stage); resize();
    const layoutFrame=requestAnimationFrame(resize);
    const readHit=(event:PointerEvent)=>{
      const rect=canvas.getBoundingClientRect(); pointer.x=((event.clientX-rect.left)/rect.width)*2-1; pointer.y=-((event.clientY-rect.top)/rect.height)*2+1; raycaster.setFromCamera(pointer,camera);
      const found=raycaster.intersectObjects(hits,false).map((entry)=>entry.object as HitMesh).find((hit)=>(!hit.userData.requiresOpen||drawerProgress>.72)&&(!hit.userData.requiresPrinted||printProgress>.96))??null;
      return found;
    };
    const pointerMove=(event:PointerEvent)=>{
      if(dragging){ const delta=event.clientX-lastX; moved+=Math.abs(delta); orbitX=THREE.MathUtils.clamp(orbitX-delta*.0025,-.32,.32); orbitY=THREE.MathUtils.clamp(orbitY+(event.movementY||0)*.0015,-.12,.12); lastX=event.clientX; canvas.style.cursor="grabbing"; return; }
      const next=readHit(event); if(next!==hovered){setHighlight(hovered,false); hovered=next; setHighlight(hovered,true); if(labelRef.current){const label=hovered?.userData.label;labelRef.current.textContent=hovered?.userData.item==="drawer-handle"&&drawerProgress>.5?drawerContent.closeHandleLabel:hovered?.userData.hoverOnly&&label?`${label} · ${siteContent.shared.comingSoon}`:label??view.hint;}} canvas.style.cursor=next?.userData.hoverOnly?"help":next?"pointer":"grab";
    };
    const pointerDown=(event:PointerEvent)=>{dragging=true;moved=0;lastX=event.clientX;canvas.setPointerCapture(event.pointerId);};
    const pointerUp=(event:PointerEvent)=>{dragging=false;if(canvas.hasPointerCapture(event.pointerId))canvas.releasePointerCapture(event.pointerId);if(moved<7){const hit=readHit(event);const item=hit?.userData.item;if(item==="drawer-handle"){drawerTarget=drawerTarget>.5?0:1;if(labelRef.current)labelRef.current.textContent=drawerTarget?drawerContent.closeHandleLabel:drawerContent.handleLabel;}else if(item&&!hit?.userData.hoverOnly)selectRef.current(item);}canvas.style.cursor=hovered?.userData.hoverOnly?"help":hovered?"pointer":"grab";};
    canvas.addEventListener("pointermove",pointerMove);canvas.addEventListener("pointerdown",pointerDown);canvas.addEventListener("pointerup",pointerUp);canvas.addEventListener("pointercancel",pointerUp);
    const tick=(now:number)=>{
      drawerProgress=THREE.MathUtils.lerp(drawerProgress,drawerTarget,.055);
      if(drawerTray)drawerTray.position.z=-.36+drawerProgress*2.7;
      if(drawerWorkspace)drawerWorkspace.rotation.y=-drawerProgress*.15;
      if(zone==="printer"&&faxPaperGroup&&!faxPrintedRef.current){
        printProgress=THREE.MathUtils.clamp((now-printStarted)/4600,0,1);
        const eased=1-Math.pow(1-printProgress,3);
        faxPaperGroup.scale.z=.035+eased*.965;
        faxPaperGroup.position.y=.88-eased*.22;
        if(labelRef.current&&!hovered)labelRef.current.textContent=printProgress>.96?faxContact.printer.ready:faxContact.printer.printing;
        if(printProgress>.96&&!printNotified){printNotified=true;onFaxPrintedRef.current?.();}
      }else if(zone==="printer"&&faxPaperGroup){
        printProgress=1;
        faxPaperGroup.scale.z=1;
        faxPaperGroup.position.y=.66;
        if(labelRef.current&&!hovered)labelRef.current.textContent=faxContact.printer.ready;
      }
      if(contactCardGroup&&contactCardOrigin&&contactCardRotation){
        const cardTarget=contactCardRaisedRef.current?1:0;
        contactCardProgress=THREE.MathUtils.damp(contactCardProgress,cardTarget,7.2,.016);
        const eased=contactCardProgress<.5?2*contactCardProgress*contactCardProgress:1-Math.pow(-2*contactCardProgress+2,2)/2;
        contactCardGroup.position.set(contactCardOrigin.x,contactCardOrigin.y+eased*1.35,contactCardOrigin.z+eased*1.55);
        contactCardGroup.rotation.set(contactCardRotation.x-eased*.2,contactCardRotation.y-eased*.05,contactCardRotation.z+eased*.025);
        contactCardGroup.scale.setScalar(contactCardScale*(1+eased*.48));
      }
      const desired=defaultPosition.clone();
      const desiredTarget=baseTarget.clone();
      if(zone==="drawer"){
        desired.lerp(new THREE.Vector3(.4,7.15,6.25),drawerProgress);
        desiredTarget.lerp(new THREE.Vector3(-.85,.72,.85),drawerProgress);
      }
      if((zone==="printer"||zone==="contact")&&contactCardProgress>0){
        desiredTarget.lerp(new THREE.Vector3(2.5,1.55,1.3),contactCardProgress*.42);
      }
      if(isPortrait){
        const portraitOffset=desired.clone().sub(desiredTarget).multiplyScalar(portraitDistanceScale);
        desired.copy(desiredTarget).add(portraitOffset);
      }
      desired.x+=Math.sin(orbitX)*2.4; desired.y+=orbitY*2; desired.z-=Math.abs(Math.sin(orbitX))*.5;
      camera.position.lerp(desired,.06);target.lerp(desiredTarget,.075);camera.lookAt(target);
      renderer.render(scene,camera);frame=requestAnimationFrame(tick);
    };frame=requestAnimationFrame(tick);
    return()=>{observer.disconnect();cancelAnimationFrame(layoutFrame);cancelAnimationFrame(frame);canvas.removeEventListener("pointermove",pointerMove);canvas.removeEventListener("pointerdown",pointerDown);canvas.removeEventListener("pointerup",pointerUp);canvas.removeEventListener("pointercancel",pointerUp);scene.traverse((object)=>{if(object instanceof THREE.Mesh){object.geometry.dispose();if(object.userData.fieldCaseTexture instanceof THREE.Texture)object.userData.fieldCaseTexture.dispose();const materials=Array.isArray(object.material)?object.material:[object.material];materials.forEach((material)=>material.dispose());}});renderer.dispose();};
  },[zone]);

  return <div className={`model-scene model-${zone}`}><canvas ref={canvasRef} aria-label={ariaLabels[zone]} />{zone==="notebook"&&<div className="model-accessibility-controls" aria-label="Notebook pages"><button type="button" onClick={()=>selectRef.current("research")}>{notebookContent.itemLabels.research}</button><button type="button" onClick={()=>selectRef.current("margin")}>{notebookContent.itemLabels.margin}</button></div>}<div ref={labelRef} className="model-scene-readout">{views[zone].hint}</div></div>;
}
