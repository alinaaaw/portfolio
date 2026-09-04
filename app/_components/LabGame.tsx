"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { room } from "@/content";
import { createFieldCaseWorldMapCanvas, FIELD_CASE_TRAVEL_PINS, pinPosition } from "./fieldCaseMap";
import { aspectOverflowDistanceScale, touchViewportFitDistanceScale } from "./cameraFraming";

const DEFAULT_ROOM_EXPOSURE = .92;
const PORTRAIT_ROOM_EXPOSURE = 1.08;
const MAX_PORTRAIT_ROOM_DISTANCE_SCALE = 1.85;
const PORTRAIT_ROOM_VIEW_OFFSET = 5.25;
const TOUCH_BOOKS_ZONE_FRONT_OFFSET = .82;
const TOUCH_BOOKS_ZONE_HIT_SCALE = 1.35;

export type ZoneId = "computer" | "drawer" | "notebook" | "books" | "board" | "fieldcase";
export type RoomPanView = "left" | "center" | "right";
type SceneTargetId = ZoneId | "printer";

const roomPanOffsets: Record<RoomPanView,number> = {
  left: -PORTRAIT_ROOM_VIEW_OFFSET,
  center: 0,
  right: PORTRAIT_ROOM_VIEW_OFFSET,
};
const roomPanOrder: RoomPanView[] = ["left","center","right"];

type LabGameProps = {
  active: boolean;
  viewing: ZoneId | null;
  discovered: ZoneId[];
  faxReady: boolean;
  faxPrinted: boolean;
  roomPanView: RoomPanView;
  onRoomPanViewChange: (view: RoomPanView) => void;
  onHover: (zone: ZoneId | null) => void;
  onInspect: (zone: ZoneId) => void;
  onPrinterInspect: () => void;
};

function createFieldCaseWorldMapTexture(resolution=1024) {
  const texture=new THREE.CanvasTexture(createFieldCaseWorldMapCanvas(resolution));
  texture.colorSpace=THREE.SRGBColorSpace;
  texture.minFilter=THREE.LinearMipmapLinearFilter;
  texture.magFilter=THREE.LinearFilter;
  texture.userData.fieldCaseOwned=true;
  return texture;
}

type ZoneTarget = THREE.Object3D & { userData: { zone?: SceneTargetId } };

const palette = {
  void: 0x07100f,
  ink: 0x101817,
  metal: 0x293432,
  steel: 0x707a75,
  wood: 0x604938,
  woodLight: 0x8c694b,
  paper: 0xdfd3b8,
  cyan: 0x70c9c0,
  signal: 0xd1f45c,
  red: 0xe45a43,
  green: 0x294139,
};

const zoneLabels: Record<ZoneId, string> = {
  computer: room.zones.computer.sceneLabel,
  drawer: room.zones.drawer.sceneLabel,
  notebook: room.zones.notebook.sceneLabel,
  books: room.zones.books.sceneLabel,
  board: room.zones.board.sceneLabel,
  fieldcase: room.zones.fieldcase.sceneLabel,
};

const zonePositions: Record<ZoneId, [number, number, number]> = {
  computer: [-5.7, 2.5, -6.2],
  drawer: [-3.53, .84, -5.38],
  notebook: [3.8, 1.85, -1.75],
  books: [8.2, 3.05, -6.35],
  board: [1.1, 3.55, -8.62],
  fieldcase: [-4.9, 1.55, 1.55],
};

const cameraPoses: Record<SceneTargetId, { position: [number,number,number]; target: [number,number,number] }> = {
  computer: { position: [-5.7,2.95,-2.75], target: [-5.7,2.45,-6.12] },
  drawer: { position: [-3.5,2.3,-2.55], target: [-3.53,.84,-5.47] },
  notebook: { position: [3.8,4.55,2.3], target: [3.8,1.55,-1.75] },
  books: { position: [8.05,3.45,-2.65], target: [8.2,3,-6.35] },
  board: { position: [1.1,3.35,-4.7], target: [1.1,3.1,-8.5] },
  fieldcase: { position: [-4.9,3.45,4.65], target: [-4.9,1.45,1.55] },
  printer: { position: [-2.15,3.15,-3.45], target: [-2.15,2.12,-6.5] },
};

function material(color: number, roughness = .8, metalness = .05, emissive = 0x000000, emissiveIntensity = 0) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness, emissive, emissiveIntensity });
}

function box(width: number, height: number, depth: number, color: number, roughness?: number, metalness?: number) {
  return new THREE.Mesh(new THREE.BoxGeometry(width,height,depth),material(color,roughness,metalness));
}

function roundedBox(width: number, height: number, depth: number, color: number, radius = .1, roughness = .78, metalness = .04) {
  return new THREE.Mesh(
    new RoundedBoxGeometry(width,height,depth,4,Math.min(radius,width*.2,height*.2,depth*.2)),
    material(color,roughness,metalness),
  );
}

function cylinder(radius: number, height: number, color: number, segments = 24) {
  return new THREE.Mesh(new THREE.CylinderGeometry(radius,radius,height,segments),material(color));
}

function makeLabel(text: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 128;
  const context = canvas.getContext("2d");
  if (context) {
    context.fillStyle = "rgba(5,12,11,.9)";
    context.fillRect(0,0,640,128);
    context.strokeStyle = "#d1f45c";
    context.lineWidth = 4;
    context.strokeRect(5,5,630,118);
    context.fillStyle = "#d1f45c";
    context.font = "700 38px monospace";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text,320,65);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map:texture,transparent:true,depthWrite:false,depthTest:false }));
  sprite.renderOrder = 20;
  sprite.scale.set(2.65,.53,1);
  return sprite;
}

function addZone(scene: THREE.Scene, zone: ZoneId, targets: ZoneTarget[]) {
  const [x,y,z] = zonePositions[zone];
  const group = new THREE.Group();
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(.38,.028,10,44),
    material(palette.signal,.28,.2,palette.signal,1.5),
  );
  ring.rotation.x = Math.PI/2;
  ring.userData.interactionOverlay = true;
  group.add(ring);
  const hit = new THREE.Mesh(
    new THREE.SphereGeometry(.68,16,12),
    new THREE.MeshBasicMaterial({ transparent:true,opacity:0,depthWrite:false }),
  ) as ZoneTarget;
  hit.userData.zone = zone;
  hit.userData.interactionOverlay = true;
  group.add(hit);
  const label = makeLabel(zoneLabels[zone]);
  label.position.y = .72;
  group.add(label);
  group.position.set(x,y,z);
  group.name = `zone-indicator-${zone}`;
  scene.add(group);
  targets.push(hit);
  return group;
}

function addDesk(scene: THREE.Scene, x: number, z: number, width: number, depth: number, rotation = 0) {
  const group = new THREE.Group();
  const top = box(width,.2,depth,palette.woodLight,.82,.04);
  top.position.y = 1.48;
  group.add(top);
  const frontEdge = box(width,.12,.1,palette.wood,.7,.04);
  frontEdge.position.set(0,1.36,depth/2-.03);
  group.add(frontEdge);
  for (const px of [-width/2+.26,width/2-.26]) {
    for (const pz of [-depth/2+.24,depth/2-.24]) {
      const leg = box(.22,1.45,.22,palette.metal,.38,.7);
      leg.position.set(px,.72,pz);
      group.add(leg);
    }
  }
  group.position.set(x,0,z);
  group.rotation.y = rotation;
  scene.add(group);
  return group;
}

function addCable(parent: THREE.Object3D, points: [number,number,number][], color: number, radius = .018) {
  const curve = new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point)),false,"centripetal");
  const cable = new THREE.Mesh(new THREE.TubeGeometry(curve,48,radius,8,false),material(color,.55,.15));
  parent.add(cable);
  return cable;
}

function addJumperLead(parent: THREE.Object3D, points: [[number,number,number],[number,number,number],[number,number,number],[number,number,number]], color: number) {
  const curve = new THREE.CubicBezierCurve3(...points.map((point) => new THREE.Vector3(...point)) as [THREE.Vector3,THREE.Vector3,THREE.Vector3,THREE.Vector3]);
  const lead = new THREE.Mesh(new THREE.TubeGeometry(curve,48,.023,8,false),material(color,.46,.16));
  parent.add(lead);
  return lead;
}

function addDeskLamp(group: THREE.Group, x: number, z: number, rotationY = -1) {
  const lamp = new THREE.Group();
  lamp.position.set(x,1.58,z);
  lamp.rotation.y = rotationY;

  const base = cylinder(.34,.09,0x26312e,32);
  base.position.y = .045;
  const baseCap = cylinder(.21,.035,palette.steel,28);
  baseCap.position.y = .105;
  const switchButton = box(.13,.045,.09,palette.red,.46,.18);
  switchButton.position.set(.13,.14,.03);

  const lowerJoint = cylinder(.11,.18,palette.steel,24);
  lowerJoint.position.set(0,.24,0);
  lowerJoint.rotation.x = Math.PI/2;
  const lowerArms = [-.075,.075].map((offset) => {
    const arm = cylinder(.035,1.02,0x56635e,14);
    arm.position.set(0,.76,offset);
    return arm;
  });
  const elbow = cylinder(.12,.22,palette.steel,24);
  elbow.position.set(0,1.29,0);
  elbow.rotation.x = Math.PI/2;

  const armAngle = -.88;
  const armLength = 1.15;
  const armX = Math.sin(-armAngle)*armLength;
  const armY = Math.cos(armAngle)*armLength;
  const upperArms = [-.065,.065].map((offset) => {
    const arm = cylinder(.034,armLength,0x56635e,14);
    arm.position.set(armX/2,1.29+armY/2,offset);
    arm.rotation.z = armAngle;
    return arm;
  });
  const headJoint = cylinder(.13,.24,palette.steel,24);
  headJoint.position.set(armX,1.29+armY,0);
  headJoint.rotation.x = Math.PI/2;

  const head = new THREE.Group();
  head.position.set(armX+.03,1.29+armY-.02,0);
  head.rotation.z = -.3;
  const shade = new THREE.Mesh(
    new THREE.CylinderGeometry(.22,.48,.46,32,1,true),
    material(0x334b45,.3,.48),
  );
  shade.position.y = -.27;
  const reflector = cylinder(.35,.025,0xd6c8a9,32);
  reflector.position.y = -.5;
  const shadeRim = new THREE.Mesh(new THREE.TorusGeometry(.48,.022,8,40),material(palette.steel,.28,.72));
  shadeRim.position.y = -.5;
  shadeRim.rotation.x = Math.PI/2;
  const bulbMesh = new THREE.Mesh(new THREE.SphereGeometry(.12,16,12),material(0xffc98c,.25,.02,0xffb96a,1.2));
  bulbMesh.position.y = -.56;
  const bulb = new THREE.PointLight(0xffbf7d,8,5.5,1.8);
  bulb.position.set(0,-.62,.04);
  head.add(shade,reflector,shadeRim,bulbMesh,bulb);

  lamp.add(base,baseCap,switchButton,lowerJoint,...lowerArms,elbow,...upperArms,headJoint,head);
  group.add(lamp);
}

function buildComputer(scene: THREE.Scene, targets: ZoneTarget[]) {
  const desk = addDesk(scene,-4.55,-6.35,7.4,2.7);
  const mat = box(4.1,.025,1.75,0x172321,.92,.02);
  mat.position.set(-1.15,1.6,.25);
  desk.add(mat);
  const monitor = box(3.45,2.15,.28,0x242c2a,.34,.68);
  monitor.position.set(-1.35,2.7,-.32);
  desk.add(monitor);
  const screen = box(3.08,1.78,.04,0x0d2928);
  screen.position.set(-1.35,2.7,-.16);
  const screenMat = screen.material as THREE.MeshStandardMaterial;
  screenMat.emissive.setHex(palette.cyan);
  screenMat.emissiveIntensity = .82;
  desk.add(screen);
  for (let row=0; row<10; row+=1) {
    const length = .45+((row*7)%10)*.17;
    const line = box(length,.018,.016,row%3===0?palette.signal:palette.cyan,.45,.15);
    line.position.set(-2.65+length/2,3.35-row*.13,-.125);
    const lineMaterial = line.material as THREE.MeshStandardMaterial;
    lineMaterial.emissive.setHex(row%3===0?palette.signal:palette.cyan);
    lineMaterial.emissiveIntensity = 1.2;
    desk.add(line);
  }
  const stand = box(.2,.9,.28,palette.metal,.35,.7);
  stand.position.set(-1.35,1.93,-.3);
  desk.add(stand);
  const keyboard = box(2.7,.09,.87,0x202725,.5,.45);
  keyboard.position.set(-1.25,1.68,.62);
  desk.add(keyboard);
  for (let row=0; row<4; row+=1) {
    for (let column=0; column<12; column+=1) {
      const key = box(.14,.024,.1,column===11?0x8a6b52:0x68716c);
      key.position.set(-2.1+column*.16,1.74,.38+row*.14);
      desk.add(key);
    }
  }
  const mouse = box(.35,.12,.52,0x303936,.34,.4);
  mouse.position.set(.42,1.68,.62);
  desk.add(mouse);
  const printer = new THREE.Group();
  printer.position.set(2.38,1.61,-.16);
  printer.scale.setScalar(.46);
  const printerBody=roundedBox(3.5,1.42,2.7,0xc8c2b4,.22,.58,.12); printerBody.position.y=.82; printerBody.userData.faxPrinter=true;
  const printerLower=roundedBox(3.3,.72,2.45,0xa8a79f,.16,.66,.16); printerLower.position.set(0,.35,.06);
  const printerScanner=roundedBox(3.28,.22,2.45,0x343c39,.1,.34,.48); printerScanner.position.set(0,1.62,-.05);
  const printerLid=roundedBox(3.04,.12,2.2,0x1d2422,.08,.3,.46); printerLid.position.set(0,1.79,-.12); printerLid.rotation.x=-.025;
  const printerGlass=roundedBox(2.62,.025,1.8,0x729794,.04,.12,.08); printerGlass.position.set(0,1.73,-.1);
  const printerControl=roundedBox(1.35,.16,.5,0x29312f,.07,.32,.45); printerControl.position.set(.75,1.44,1.24); printerControl.rotation.x=-.22;
  const printerScreen=roundedBox(.58,.025,.24,0x163c39,.025,.2,.1); printerScreen.position.set(.53,1.52,1.33); printerScreen.rotation.x=-.22;
  const printerScreenMaterial=printerScreen.material as THREE.MeshStandardMaterial; printerScreenMaterial.emissive.setHex(palette.cyan); printerScreenMaterial.emissiveIntensity=.72;
  const printerSlot=roundedBox(2.45,.11,.12,0x151b1a,.035,.36,.42); printerSlot.position.set(0,.82,1.37);
  const printerTray=roundedBox(2.72,.09,1.8,0x4a504d,.08,.55,.26); printerTray.position.set(0,.19,1.45); printerTray.rotation.x=.045;
  const printerTrayLip=roundedBox(2.75,.18,.12,0x5b625e,.05,.48,.35); printerTrayLip.position.set(0,.24,2.31);
  printer.add(printerLower,printerBody,printerScanner,printerGlass,printerLid,printerControl,printerScreen,printerSlot,printerTray,printerTrayLip);
  for(let index=0;index<4;index+=1){
    const button=cylinder(.055,.035,index===3?palette.signal:0x858b84,16); button.rotation.x=Math.PI/2; button.position.set(.78+index*.19,1.48,1.5); if(index===3)button.userData.faxLight=true; printer.add(button);
  }
  const printerHingeLeft=cylinder(.07,.26,0x1b2220,16); printerHingeLeft.rotation.z=Math.PI/2; printerHingeLeft.position.set(-1.22,1.72,-1.02);
  const printerHingeRight=printerHingeLeft.clone(); printerHingeRight.position.x=1.22; printer.add(printerHingeLeft,printerHingeRight);
  const paper=roundedBox(2.3,.035,3.05,palette.paper,.025,.96,.01); paper.position.set(0,.66,2.74); paper.rotation.x=.025; paper.userData.faxPaper=true; paper.visible=false; printer.add(paper);
  desk.add(printer);

  const contactCard=new THREE.Group(); contactCard.position.set(3.2,1.62,.96); contactCard.rotation.y=-.12; contactCard.scale.setScalar(.28);
  const contactPaper=roundedBox(2.55,.045,1.45,0xe5dcc6,.055,.92,.01);
  const contactAccent=box(.12,.025,1.16,palette.red,.7,.02); contactAccent.position.set(-.93,.045,0);
  const contactName=box(1.15,.025,.055,0x283f3a,.72,.02); contactName.position.set(-.12,.05,-.32);
  contactCard.add(contactPaper,contactAccent,contactName);
  for(let line=0;line<3;line+=1){const detail=box(1.25-line*.14,.018,.028,0x6e7c75,.72,.02); detail.position.set(-.06,.05,.02+line*.18); contactCard.add(detail);}
  desk.add(contactCard);
  const printerSignal = new THREE.Group();
  printerSignal.userData.faxSignal = true;
  printerSignal.visible = false;
  printerSignal.position.set(2.38,2.2,.56);
  const printerRing = new THREE.Mesh(new THREE.TorusGeometry(.76,.035,10,48),material(palette.signal,.25,.2,palette.signal,2));
  printerSignal.add(printerRing);
  const printerLabel = makeLabel(room.faxAlert.sceneLabel);
  printerLabel.position.y = 1.08;
  printerLabel.scale.set(3.15,.63,1);
  printerSignal.add(printerLabel);
  desk.add(printerSignal);
  const printerHit = new THREE.Mesh(new THREE.BoxGeometry(2.15,1.75,1.85),new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false})) as ZoneTarget;
  printerHit.position.set(2.38,2.16,-.05);
  printerHit.userData.zone = "printer";
  desk.add(printerHit);
  targets.push(printerHit);

  const drawerUnit = box(1.75,1.28,1.85,0x4e3b2e,.85,.03);
  drawerUnit.position.set(1.02,.76,-.08);
  desk.add(drawerUnit);
  for (let index=0; index<3; index+=1) {
    const face = box(1.52,.3,.07,0x76563f,.83,.03);
    face.position.set(1.02,.45+index*.39,.88);
    desk.add(face);
    const handle = box(.36,.055,.08,0x737d77,.3,.76);
    handle.position.set(1.02,.45+index*.39,.95);
    desk.add(handle);
  }

  const mug = new THREE.Group();
  mug.position.set(.78,1.59,-.38);
  const mugMaterial = material(0x253b36,.34,.12);
  const mugBody = new THREE.Mesh(new THREE.CylinderGeometry(.28,.245,.5,28,1,true),mugMaterial);
  mugBody.position.y = .25;
  const mugBase = new THREE.Mesh(new THREE.CylinderGeometry(.245,.245,.03,28),mugMaterial);
  mugBase.position.y = .015;
  const mugInside = new THREE.Mesh(new THREE.CylinderGeometry(.225,.225,.016,28),material(0x111917,.76,.02));
  mugInside.position.y = .445;
  const mugRim = new THREE.Mesh(new THREE.TorusGeometry(.255,.028,10,32),mugMaterial);
  mugRim.position.y = .5;
  mugRim.rotation.x = Math.PI/2;
  const mugHandle = new THREE.Mesh(new THREE.TorusGeometry(.17,.038,10,28),mugMaterial);
  mugHandle.position.set(.3,.27,0);
  mug.add(mugBody,mugBase,mugInside,mugRim,mugHandle);
  desk.add(mug);
  const note = box(.58,.02,.58,0xd1f45c);
  note.position.set(.15,1.64,-.44);
  note.rotation.y = -.18;
  desk.add(note);
  addCable(scene,[[-5.9,1.7,-5.8],[-5.25,1.67,-5.25],[-4.4,1.63,-5.6],[-3.5,1.58,-5.2]],palette.red,.022);
}

function buildNotebookTable(scene: THREE.Scene) {
  const desk = addDesk(scene,3.7,-1.65,6.1,3.4,-.025);
  const cuttingMat = box(5.35,.025,2.7,0x203934,.94,.03);
  cuttingMat.position.set(0,1.61,0);
  desk.add(cuttingMat);
  for (let index=0; index<9; index+=1) {
    const gridX = box(.012,.01,2.5,0x4f716a);
    gridX.position.set(-2.35+index*.58,1.635,0);
    desk.add(gridX);
  }
  for (let index=0; index<5; index+=1) {
    const gridZ = box(5.1,.01,.012,0x4f716a);
    gridZ.position.set(0,1.635,-1.12+index*.56);
    desk.add(gridZ);
  }
  const left = box(1.55,.05,1.8,palette.paper);
  left.position.set(.55,1.69,.05);
  left.rotation.y = -.05;
  const right = left.clone();
  right.position.x = 2.05;
  right.rotation.y = .05;
  desk.add(left,right);
  for (let line=0; line<7; line+=1) {
    const leftLine = box(1.22,.01,.017,0x63817a);
    leftLine.position.set(.55,1.725,-.65+line*.21);
    const rightLine = leftLine.clone();
    rightLine.position.x = 2.05;
    desk.add(leftLine,rightLine);
  }
  const pen = cylinder(.035,1.35,palette.red,10);
  pen.rotation.z = Math.PI/2;
  pen.position.set(1.55,1.79,.94);
  desk.add(pen);

  const breadboard = box(1.75,.1,1.05,0xe0dbc8,.72,.02);
  breadboard.position.set(-1.55,1.7,-.25);
  desk.add(breadboard);
  const micro = box(.82,.11,.42,0x225d4e,.55,.12);
  micro.position.set(-1.55,1.81,-.25);
  desk.add(micro);
  for (let pin=0; pin<8; pin+=1) {
    const header = box(.045,.08,.05,pin%3===0?palette.signal:0x343a37,.35,.64);
    header.position.set(-1.86+pin*.09,1.91,-.46);
    desk.add(header);
  }
  const sensor = box(.48,.08,.72,0x2b3431,.5,.45);
  sensor.position.set(-2.35,1.76,.72);
  desk.add(sensor);
  addJumperLead(desk,[[-1.78,1.95,-.35],[-1.88,2.28,-.12],[-2.08,2.28,.28],[-2.2,1.88,.5]],palette.red);
  addJumperLead(desk,[[-1.32,1.95,-.15],[-1.42,2.38,.12],[-2.28,2.38,.67],[-2.43,1.88,.86]],palette.cyan);
  const leadConnectors = [
    {x:-1.78,y:1.91,z:-.35,color:palette.red},
    {x:-2.2,y:1.845,z:.5,color:palette.red},
    {x:-1.32,y:1.91,z:-.15,color:palette.cyan},
    {x:-2.43,y:1.845,z:.86,color:palette.cyan},
  ];
  leadConnectors.forEach(({x,y,z,color}) => {
    const connector = box(.14,.075,.11,color,.38,.22);
    connector.position.set(x,y,z);
    desk.add(connector);
  });

  const rack = box(1.3,.12,.5,0x5f4938,.76,.05);
  rack.position.set(-2.15,1.7,-1.08);
  desk.add(rack);
  for (let tube=0; tube<5; tube+=1) {
    const glass = new THREE.Mesh(
      new THREE.CylinderGeometry(.09,.075,.72,16),
      new THREE.MeshPhysicalMaterial({ color:0xa9d8d5,roughness:.08,metalness:0,transparent:true,opacity:.42,transmission:.18 }),
    );
    glass.position.set(-2.65+tube*.25,2.08,-1.08);
    desk.add(glass);
  }
  const loosePaper = box(1.1,.02,1.45,0xc8b78d);
  loosePaper.position.set(-.15,1.66,.45);
  loosePaper.rotation.y = .16;
  desk.add(loosePaper);
  addDeskLamp(desk,2.65,-1.3,-2.15);
}

function buildBooks(scene: THREE.Scene) {
  const shelf = new THREE.Group();
  const leftSide = box(.22,5.9,1.25,0x4d382b,.86,.03);
  leftSide.position.set(-1.65,2.95,0);
  const rightSide = leftSide.clone();
  rightSide.position.x = 1.65;
  const top = box(3.5,.2,1.28,0x5f4432,.82,.04);
  top.position.set(0,5.83,0);
  const back = box(3.1,5.55,.1,0x33261f,.94,.01);
  back.position.set(0,2.88,-.55);
  shelf.add(leftSide,rightSide,top,back);
  for (let level=0; level<4; level+=1) {
    const board = box(3.35,.16,1.28,0x6b4c36,.82,.04);
    board.position.set(0,.28+level*1.42,0);
    shelf.add(board);
    for (let index=0; index<6; index+=1) {
      const colors = [0x8e4d3e,0x405c57,0xc2a866,0x6c5648,0x4b6671];
      const height = .88+((index+level)%3)*.12;
      const book = box(.31+(index%2)*.05,height,.78,colors[(index+level)%colors.length],.72,.03);
      book.position.set(-1.28+index*.45,.39+height/2+level*1.42,.08);
      book.rotation.z = index===5 ? -.1 : 0;
      shelf.add(book);
      const band = box(.24,.025,.8,level===2?palette.signal:0xb8ab8b,.6,.03);
      band.position.set(book.position.x,book.position.y+height*.23,.1);
      band.rotation.z = book.rotation.z;
      shelf.add(band);
    }
  }
  for (let stack=0; stack<4; stack+=1) {
    const journal = box(1.05,.1,.72,[0x405c57,0xc2a866,0x8e4d3e,0xd8d0b9][stack],.76,.02);
    journal.position.set(.82,.43+stack*.11,.08);
    journal.rotation.y = -.04+stack*.025;
    shelf.add(journal);
  }
  shelf.position.set(8.25,0,-6.38);
  scene.add(shelf);
}

function buildBoard(scene: THREE.Scene) {
  const board = box(6.8,3.25,.16,0x5b4838);
  board.position.set(1.1,3.45,-8.68);
  scene.add(board);
  const papers = [
    [-2.1,.55,.85,1.08,0xd8cda9,-.05],
    [-.65,.5,1.55,1.15,0xe1d7bd,.03],
    [1.2,.6,1.2,1.35,0xc7bd91,-.08],
    [2.35,-.65,1.25,.82,0xdfc4a0,.06],
    [-1.7,-.75,1.35,.8,0xd8d0bd,.08],
    [.2,-.82,1.55,.78,0xe1d9c6,-.03],
  ] as const;
  papers.forEach(([x,y,w,h,color,rotation],index) => {
    const paper = box(w,h,.025,color);
    paper.position.set(1.1+x,3.45+y,-8.56);
    paper.rotation.z = rotation;
    scene.add(paper);
    const pin = cylinder(.055,.08,index===2?palette.red:palette.signal,12);
    pin.rotation.x = Math.PI/2;
    pin.position.set(1.1+x,3.45+y+h/2-.12,-8.48);
    scene.add(pin);
  });
  for (const [x,y,rotation] of [[-.2,.1,.15],[-.4,-.4,-.12],[.35,.1,-.2]] as const) {
    const thread = box(2.6,.025,.02,palette.red);
    thread.position.set(1.1+x,3.45+y,-8.47);
    thread.rotation.z = rotation;
    scene.add(thread);
  }
}

function buildFieldCase(scene: THREE.Scene) {
  const group = new THREE.Group();
  const cartTopY=.58;
  const cartSurfaceY=.7;
  const caseSurfaceY=1.45;
  const mapPaperY=caseSurfaceY+.02;
  const mapBoardY=mapPaperY-.035;
  // One continuous work surface runs beneath both the target and the map.
  const base = box(4.8,.72,2.15,0x4e402f,.68,.12);
  base.position.set(0,1.09,0);
  const lid = box(2.5,.17,2.15,0x71583d);
  lid.position.set(-1.05,2.14,-.9);
  lid.rotation.x = -1.08;
  group.add(base,lid);
  const target = box(1.05,.025,1.05,palette.paper,.96,.01);
  target.position.set(-1.48,caseSurfaceY+.015,-.15);
  group.add(target);
  ([[.41,.33,0x507b78],[.31,.22,0xcab65b],[.2,.09,palette.red]] as const).forEach(([outer,inner,color]) => {
    const ring = new THREE.Mesh(new THREE.RingGeometry(inner,outer,40),material(color));
    ring.rotation.x = -Math.PI/2;
    ring.position.set(-1.48,caseSurfaceY+.035,-.15);
    group.add(ring);
  });
  const photo=box(.72,.035,.52,0xd8d0b9,.96,.01);photo.position.set(-.55,caseSurfaceY+.025,-.43);photo.rotation.y=.12;group.add(photo);
  const photoImage=box(.55,.018,.3,0x365f65,.88,.01);photoImage.position.set(-.55,caseSurfaceY+.05,-.48);photoImage.rotation.y=.12;group.add(photoImage);
  const photoTwo=box(.68,.035,.5,0xcfc39f,.96,.01);photoTwo.position.set(-.48,caseSurfaceY+.02,.08);photoTwo.rotation.y=-.1;group.add(photoTwo);
  const photoTwoImage=box(.52,.018,.28,0x765641,.88,.01);photoTwoImage.position.set(-.48,caseSurfaceY+.045,.03);photoTwoImage.rotation.y=-.1;group.add(photoTwoImage);
  const safetyTab=box(.24,.07,.34,0x5f392e,.7,.08);safetyTab.position.set(-.63,caseSurfaceY+.07,.4);safetyTab.rotation.y=.12;group.add(safetyTab);
  for(let index=0;index<3;index+=1){
    const arrow=cylinder(.018,1.55,index===0?0xb47b4d:0xb8d5cc,8);arrow.rotation.z=Math.PI/2;arrow.position.set(-1.05,caseSurfaceY+.07,.52+index*.14);group.add(arrow);
    const fletching=box(.17,.025,.08,index===1?palette.signal:palette.red);fletching.position.set(-1.72,caseSurfaceY+.08,.52+index*.14);group.add(fletching);
  }
  const cartTop = box(4.8,.16,2.5,0x303a36,.38,.62);
  cartTop.position.y = cartTopY;
  group.add(cartTop);
  const cartInset=box(4.55,.04,2.25,0x1c2c28,.9,.05);cartInset.position.y=cartSurfaceY-.02;group.add(cartInset);
  const mapCenterX=1.25,mapCenterZ=-.2,mapWidth=1.8,mapDepth=1;
  const mapBoard=box(1.98,.06,1.16,0x6b553a,.82,.05);mapBoard.position.set(mapCenterX,mapBoardY,mapCenterZ);group.add(mapBoard);
  const mapTexture=createFieldCaseWorldMapTexture(512);
  const worldMap=new THREE.Mesh(new THREE.PlaneGeometry(mapWidth,mapDepth),new THREE.MeshStandardMaterial({map:mapTexture,roughness:.9,metalness:0}));
  worldMap.rotation.x=-Math.PI/2;worldMap.position.set(mapCenterX,mapPaperY,mapCenterZ);worldMap.userData.fieldCaseTexture=mapTexture;group.add(worldMap);
  FIELD_CASE_TRAVEL_PINS.forEach(({coordinate})=>{
    const [x,z]=pinPosition(coordinate,mapCenterX,mapCenterZ,mapWidth,mapDepth);
    const pin=cylinder(.012,.1,palette.red,8);pin.position.set(x,mapPaperY+.055,z);group.add(pin);
  });
  const compassRing=new THREE.Mesh(new THREE.RingGeometry(.055,.08,18),material(0x7b503f,.76,.02));compassRing.rotation.x=-Math.PI/2;compassRing.position.set(1.94,mapPaperY+.01,.19);group.add(compassRing);
  const mapClip=cylinder(.05,.36,palette.steel,12);mapClip.rotation.z=Math.PI/2;mapClip.position.set(mapCenterX,mapPaperY+.035,-.72);group.add(mapClip);
  for (const x of [-2.05,2.05]) {
    for (const z of [-.9,.9]) {
      const leg = box(.11,.55,.11,0x58625e,.32,.75);
      leg.position.set(x,.28,z);
      const caster = cylinder(.12,.075,0x171d1b,14);
      caster.rotation.z = Math.PI/2;
      caster.position.set(x,.08,z);
      group.add(leg,caster);
    }
  }
  group.position.set(-4.9,0,1.55);
  scene.add(group);
}

function buildRoom(scene: THREE.Scene, targets: ZoneTarget[]) {
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(28,20),material(0x161d1b,.99));
  floor.rotation.x = -Math.PI/2;
  floor.receiveShadow = true;
  scene.add(floor);
  for (let x=-12; x<=12; x+=2) {
    const seam = box(.018,.008,18,0x2a312f,.95,.02);
    seam.position.set(x,.006,0);
    scene.add(seam);
  }
  for (let z=-8; z<=8; z+=2) {
    const seam = box(26,.008,.018,0x2a312f,.95,.02);
    seam.position.set(0,.006,z);
    scene.add(seam);
  }
  const wornPatch = box(8.4,.012,5.7,0x1d2a27,.98,.01);
  wornPatch.position.set(3.5,.012,-1.55);
  scene.add(wornPatch);

  const back = box(26,7.8,.34,0x111715,.96,.03);
  back.position.set(0,3.9,-9);
  const leftWall = box(.34,7.8,18,0x121917,.96,.03);
  leftWall.position.set(-13,3.9,0);
  const rightWall = box(.34,7.8,18,0x111816,.96,.03);
  rightWall.position.set(13,3.9,0);
  scene.add(back,leftWall,rightWall);
  for (let index=0; index<7; index+=1) {
    const beam = box(.17,7.3,.12,0x2c3834,.4,.72);
    beam.position.set(-11.4+index*3.7,3.65,-8.75);
    scene.add(beam);
  }
  const wallRail = box(24,.09,.1,0x303a37,.38,.72);
  wallRail.position.set(0,1.05,-8.72);
  scene.add(wallRail);

  const windowFrame = box(5.6,3.25,.14,0x26322f,.35,.72);
  windowFrame.position.set(-8.7,4.65,-8.7);
  const windowGlow = box(5.2,2.86,.05,0x183937);
  windowGlow.position.set(-8.7,4.65,-8.61);
  const glowMaterial = windowGlow.material as THREE.MeshStandardMaterial;
  glowMaterial.emissive.setHex(0x2e6f69);
  glowMaterial.emissiveIntensity = .48;
  scene.add(windowFrame,windowGlow);
  for (const x of [-10.4,-8.7,-7]) {
    const bar = box(.08,2.9,.08,0x2f3936,.35,.72);
    bar.position.set(x,4.65,-8.52);
    scene.add(bar);
  }
  const windowBar = box(5.2,.08,.08,0x2f3936,.35,.72);
  windowBar.position.set(-8.7,4.5,-8.52);
  scene.add(windowBar);
  for (let light=0; light<20; light+=1) {
    const city = box(.025+.02*(light%3),.02+.035*(light%4),.01,light%5===0?0xffc985:palette.cyan);
    city.position.set(-11+((light*17)%48)*.1,3.55+((light*13)%24)*.09,-8.44);
    const cityMaterial = city.material as THREE.MeshStandardMaterial;
    cityMaterial.emissive.setHex(light%5===0?0xffc985:palette.cyan);
    cityMaterial.emissiveIntensity = .8;
    scene.add(city);
  }

  for (const y of [6.75,7.05]) {
    const pipe = cylinder(.065,24,0x3d4844,16);
    pipe.rotation.z = Math.PI/2;
    pipe.position.set(0,y,-8.5);
    scene.add(pipe);
  }

  buildComputer(scene,targets);
  buildNotebookTable(scene);
  buildBooks(scene);
  buildBoard(scene);
  buildFieldCase(scene);

  const scopeBench = addDesk(scene,5.25,-6.55,2.4,1.6);
  const scope = box(1.55,1.05,.78,0x6f746b,.45,.35);
  scope.position.set(0,2.08,-.08);
  scopeBench.add(scope);
  const scopeScreen = box(.9,.58,.035,0x0b2524,.25,.2);
  scopeScreen.position.set(-.2,2.11,.33);
  const scopeScreenMaterial = scopeScreen.material as THREE.MeshStandardMaterial;
  scopeScreenMaterial.emissive.setHex(palette.cyan);
  scopeScreenMaterial.emissiveIntensity = .85;
  scopeBench.add(scopeScreen);
  for (let dial=0; dial<3; dial+=1) {
    const knob = cylinder(.085,.06,0x1c2422,16);
    knob.rotation.x = Math.PI/2;
    knob.position.set(.48+dial*.22,1.96,.36);
    scopeBench.add(knob);
  }
  addCable(scene,[[5.7,1.95,-6.1],[5.2,1.1,-5.4],[4.55,.4,-4.6],[3.9,.06,-3.6]],0x161b1a,.026);

  const rollingChair = new THREE.Group();
  const seat = box(1.25,.2,1.2,0x27312f,.48,.5);
  seat.position.y = 1.1;
  const chairBack = box(1.25,1.45,.18,0x27312f,.48,.5);
  chairBack.position.set(0,1.75,.5);
  rollingChair.add(seat,chairBack);
  for (let index=0; index<5; index+=1) {
    const spoke = box(1.1,.08,.08,palette.steel,.35,.75);
    spoke.position.y = .35;
    spoke.rotation.y = index*Math.PI*.4;
    rollingChair.add(spoke);
  }
  rollingChair.position.set(-5.5,0,-3.9);
  rollingChair.rotation.y = -.25;
  scene.add(rollingChair);

  const wasteBasket = new THREE.Mesh(new THREE.CylinderGeometry(.48,.37,.85,16,1,true),material(0x26302d,.46,.62));
  wasteBasket.position.set(1.1,.43,1.05);
  scene.add(wasteBasket);
  for (let paperIndex=0; paperIndex<3; paperIndex+=1) {
    const floorPaper = box(.65,.026,.9,[0xd0c5a8,0xbcae89,0xdfd7c1][paperIndex]);
    floorPaper.position.set(1.55+paperIndex*.42,.055+paperIndex*.006,1.4+paperIndex*.24);
    floorPaper.rotation.set((paperIndex-1)*.008,-.25+paperIndex*.28,(1-paperIndex)*.006);
    scene.add(floorPaper);
  }

  const planter = cylinder(.48,.72,0x3d3025,24);
  planter.position.set(9.6,.36,2.2);
  scene.add(planter);
  for (let leafIndex=0; leafIndex<7; leafIndex+=1) {
    const stem = cylinder(.025,1.2+.16*(leafIndex%3),0x355e47,10);
    stem.position.set(9.6,.9,2.2);
    stem.rotation.z = -.42+leafIndex*.14;
    scene.add(stem);
    const leaf = new THREE.Mesh(new THREE.SphereGeometry(.22,12,8),material(0x426d50,.92,.01));
    leaf.scale.set(1.8,.42,.65);
    leaf.position.set(9.15+leafIndex*.15,1.35+.08*(leafIndex%3),2.2+.12*((leafIndex%2)-.5));
    scene.add(leaf);
  }

  (Object.keys(zonePositions) as ZoneId[]).forEach((zone) => addZone(scene,zone,targets));
}

export default function LabGame({ active, viewing, discovered, faxReady, faxPrinted, roomPanView, onRoomPanViewChange, onHover, onInspect, onPrinterInspect }: LabGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  const viewingRef = useRef(viewing);
  const discoveredRef = useRef(discovered);
  const faxReadyRef = useRef(faxReady);
  const faxPrintedRef = useRef(faxPrinted);
  const roomPanViewRef = useRef(roomPanView);
  const roomPanViewChangeRef = useRef(onRoomPanViewChange);
  const inspectRef = useRef(onInspect);
  const printerInspectRef = useRef(onPrinterInspect);

  useEffect(() => { activeRef.current = active; },[active]);
  useEffect(() => { viewingRef.current = viewing; },[viewing]);
  useEffect(() => { discoveredRef.current = discovered; },[discovered]);
  useEffect(() => { faxReadyRef.current = faxReady; },[faxReady]);
  useEffect(() => { faxPrintedRef.current = faxPrinted; },[faxPrinted]);
  useEffect(() => { roomPanViewRef.current = roomPanView; },[roomPanView]);
  useEffect(() => { roomPanViewChangeRef.current = onRoomPanViewChange; },[onRoomPanViewChange]);
  useEffect(() => { inspectRef.current = onInspect; },[onInspect]);
  useEffect(() => { printerInspectRef.current = onPrinterInspect; },[onPrinterInspect]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const renderer = new THREE.WebGLRenderer({ canvas,antialias:true,powerPreference:"high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.65));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = DEFAULT_ROOM_EXPOSURE;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(palette.void);
    scene.fog = new THREE.FogExp2(palette.void,.021);
    const camera = new THREE.PerspectiveCamera(43,1,.1,80);
    const defaultPosition = new THREE.Vector3(0,4.75,11.5);
    const defaultTarget = new THREE.Vector3(0,1.72,-2.55);
    camera.position.copy(defaultPosition);
    const currentTarget = defaultTarget.clone();
    const targets: ZoneTarget[] = [];
    buildRoom(scene,targets);
    const booksZoneIndicator=scene.getObjectByName("zone-indicator-books") as THREE.Group;
    const booksZoneHit=booksZoneIndicator.children[1] as THREE.Mesh;

    scene.add(new THREE.HemisphereLight(0x71918b,0x080c0b,.72));
    const key = new THREE.DirectionalLight(0xffd29c,2.7);
    key.position.set(-5,11,7);
    key.castShadow = true;
    key.shadow.mapSize.set(2048,2048);
    key.shadow.camera.left = -16;
    key.shadow.camera.right = 16;
    key.shadow.camera.top = 13;
    key.shadow.camera.bottom = -12;
    scene.add(key);
    const cyan = new THREE.PointLight(palette.cyan,9,16,1.85);
    cyan.position.set(-5.8,4.1,-5.2);
    const warm = new THREE.PointLight(0xffb46a,12,16,1.7);
    warm.position.set(4.2,4.7,-.6);
    const boardLight = new THREE.SpotLight(0xffcd92,11,10,.7,.5,1.5);
    boardLight.position.set(1.1,6,-4.8);
    boardLight.target.position.set(1.1,3,-8.5);
    const workLight = new THREE.SpotLight(0xffe2b9,13,10,.62,.58,1.6);
    workLight.position.set(4.4,6.4,2.4);
    workLight.target.position.set(3.7,1.3,-1.6);
    scene.add(cyan,warm,boardLight,boardLight.target,workLight,workLight.target);
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        const isInteractionOverlay=object.userData.interactionOverlay===true;
        object.castShadow=!isInteractionOverlay;
        object.receiveShadow=!isInteractionOverlay;
      }
    });

    const pointer = new THREE.Vector2(5,5);
    const raycaster = new THREE.Raycaster();
    let pointerX = 0;
    let pointerY = 0;
    let hovered: SceneTargetId | null = null;
    let requested: SceneTargetId | null = null;
    let requestStarted = 0;
    let requestDelivered = false;
    let dragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragOrbit = 0;
    let dragPitch = 0;
    let portraitDragOffset = 0;
    let portraitPointerZone: SceneTargetId | null = null;
    let orbit = 0;
    let pitch = 0;
    let isPortrait = false;
    let portraitDistanceScale = 1;
    let landscapeTouchDistanceScale = 1;
    let frame = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if(rect.width<2||rect.height<2)return;
      const nextAspect=rect.width/rect.height;
      isPortrait=rect.height>=rect.width;
      const isCoarseLandscape=!isPortrait&&window.matchMedia("(pointer: coarse)").matches;
      const usesTouchBooksIndicator=isPortrait||isCoarseLandscape;
      portraitDistanceScale=isPortrait?Math.min(aspectOverflowDistanceScale(nextAspect),MAX_PORTRAIT_ROOM_DISTANCE_SCALE):1;
      landscapeTouchDistanceScale=isCoarseLandscape?touchViewportFitDistanceScale(rect.width,rect.height,nextAspect):1;
      booksZoneIndicator.position.z=zonePositions.books[2]+(usesTouchBooksIndicator?TOUCH_BOOKS_ZONE_FRONT_OFFSET:0);
      booksZoneHit.scale.setScalar(usesTouchBooksIndicator?TOUCH_BOOKS_ZONE_HIT_SCALE:1);
      renderer.toneMappingExposure=isPortrait?PORTRAIT_ROOM_EXPOSURE:DEFAULT_ROOM_EXPOSURE;
      renderer.setSize(rect.width,rect.height,false);
      camera.aspect=nextAspect;
      camera.fov=43;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    const readPointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((event.clientX-rect.left)/rect.width)*2-1;
      pointer.y = -((event.clientY-rect.top)/rect.height)*2+1;
      pointerX = pointer.x;
      pointerY = pointer.y;
      raycaster.setFromCamera(pointer,camera);
      const hit = raycaster.intersectObjects(targets,false).map((entry)=>entry.object as ZoneTarget).find((candidate)=>candidate.userData.zone!=="printer"||faxReadyRef.current);
      return hit?.userData.zone ?? null;
    };
    const pointerMove = (event: PointerEvent) => {
      const zone = readPointer(event);
      if (zone !== hovered) { hovered = zone; onHover(zone==="printer"?null:zone); }
      if (dragging) {
        if(isPortrait){
          const rect=canvas.getBoundingClientRect();
          portraitDragOffset=THREE.MathUtils.clamp(-(event.clientX-dragStartX)/rect.width*PORTRAIT_ROOM_VIEW_OFFSET,-PORTRAIT_ROOM_VIEW_OFFSET,PORTRAIT_ROOM_VIEW_OFFSET);
        }else{
          orbit = THREE.MathUtils.clamp(dragOrbit-(event.clientX-dragStartX)*.0025,-.42,.42);
          pitch = THREE.MathUtils.clamp(dragPitch+(event.clientY-dragStartY)*.003,-.22,.26);
        }
      }
      canvas.style.cursor = zone ? "pointer" : dragging ? "grabbing" : "grab";
    };
    const pointerDown = (event: PointerEvent) => {
      const zone = readPointer(event);
      if(isPortrait){
        dragging = true;
        portraitPointerZone = zone;
        portraitDragOffset = 0;
        dragStartX = event.clientX;
        dragStartY = event.clientY;
        canvas.setPointerCapture(event.pointerId);
      }else if (zone && activeRef.current) {
        requested = zone;
        requestStarted = performance.now();
        requestDelivered = false;
      } else {
        dragging = true;
        dragStartX = event.clientX;
        dragStartY = event.clientY;
        dragOrbit = orbit;
        dragPitch = pitch;
        canvas.setPointerCapture(event.pointerId);
      }
    };
    const pointerUp = (event: PointerEvent) => {
      if(isPortrait&&dragging){
        const deltaX=event.clientX-dragStartX;
        const deltaY=event.clientY-dragStartY;
        const isTap=Math.hypot(deltaX,deltaY)<12;
        if(isTap&&portraitPointerZone&&activeRef.current){
          requested=portraitPointerZone;
          requestStarted=performance.now();
          requestDelivered=false;
        }else if(Math.abs(deltaX)>32){
          const currentIndex=roomPanOrder.indexOf(roomPanViewRef.current);
          const direction=deltaX<0?1:-1;
          const nextIndex=THREE.MathUtils.clamp(currentIndex+direction,0,roomPanOrder.length-1);
          roomPanViewChangeRef.current(roomPanOrder[nextIndex]);
        }
        portraitDragOffset=0;
        portraitPointerZone=null;
      }
      dragging = false;
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    };
    canvas.addEventListener("pointermove",pointerMove);
    canvas.addEventListener("pointerdown",pointerDown);
    canvas.addEventListener("pointerup",pointerUp);
    canvas.addEventListener("pointercancel",pointerUp);
    canvas.addEventListener("pointerleave",pointerUp);

    const tick = (now: number) => {
      if (viewingRef.current === null && !requested) {
        const desiredPosition = defaultPosition.clone();
        const portraitPan=roomPanOffsets[roomPanViewRef.current]+portraitDragOffset;
        desiredPosition.x = isPortrait?portraitPan+pointerX*.08:Math.sin(orbit)*11.5+pointerX*.18;
        desiredPosition.z = isPortrait?defaultPosition.z:Math.cos(orbit)*11.5;
        desiredPosition.y += pitch*6-pointerY*.1;
        const desiredTarget=defaultTarget.clone().add(new THREE.Vector3(isPortrait?portraitPan+pointerX*.08:pointerX*.18,pitch*.75-pointerY*.05,0));
        const viewportDistanceScale=isPortrait?portraitDistanceScale:landscapeTouchDistanceScale;
        if(viewportDistanceScale>1){
          const fittedOffset=desiredPosition.clone().sub(desiredTarget).multiplyScalar(viewportDistanceScale);
          desiredPosition.copy(desiredTarget).add(fittedOffset);
        }
        camera.position.lerp(desiredPosition,.035);
        currentTarget.lerp(desiredTarget,.04);
      }
      if (requested) {
        const pose = cameraPoses[requested];
        const desiredPosition = new THREE.Vector3(...pose.position);
        const desiredTarget = new THREE.Vector3(...pose.target);
        camera.position.lerp(desiredPosition,.075);
        currentTarget.lerp(desiredTarget,.075);
        if (!requestDelivered && now-requestStarted>720) {
          requestDelivered = true;
          if(requested==="printer")printerInspectRef.current();
          else inspectRef.current(requested);
        }
      }
      if (viewingRef.current === null && requestDelivered) {
        requested = null;
        requestDelivered = false;
      }

      camera.lookAt(currentTarget);
      targets.forEach((target) => {
        const zone = target.userData.zone;
        const group = target.parent;
        if (!zone || zone==="printer" || !group) return;
        const ring = group.children[0] as THREE.Mesh;
        ring.rotation.z += .012;
        ring.scale.setScalar(1+Math.sin(now*.002+group.position.x)*.09);
        const found = discoveredRef.current.includes(zone);
        const ringMaterial = ring.material as THREE.MeshStandardMaterial;
        ringMaterial.color.setHex(found?palette.cyan:palette.signal);
        ringMaterial.emissive.setHex(found?palette.cyan:palette.signal);
      });
      scene.traverse((object) => {
        if (object.userData.faxLight && object instanceof THREE.Mesh) {
          const faxMaterial = object.material as THREE.MeshStandardMaterial;
          faxMaterial.color.setHex(faxReadyRef.current?palette.signal:0x635f4e);
          faxMaterial.emissive.setHex(faxReadyRef.current?palette.signal:0x000000);
          faxMaterial.emissiveIntensity = faxReadyRef.current ? 2+Math.sin(now*.008) : 0;
        }
        if (object.userData.faxPrinter && object instanceof THREE.Mesh) {
          const printerMaterial=object.material as THREE.MeshStandardMaterial;
          printerMaterial.emissive.setHex(faxReadyRef.current?palette.signal:0x000000);
          printerMaterial.emissiveIntensity=faxReadyRef.current ? .18 : 0;
        }
        if (object.userData.faxSignal) {
          object.visible=faxReadyRef.current;
          if(faxReadyRef.current&&object.children[0])object.children[0].rotation.z+=.014;
        }
        if (object.userData.faxPaper && object instanceof THREE.Mesh) {
          object.visible = faxPrintedRef.current;
        }
      });
      renderer.render(scene,camera);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      canvas.removeEventListener("pointermove",pointerMove);
      canvas.removeEventListener("pointerdown",pointerDown);
      canvas.removeEventListener("pointerup",pointerUp);
      canvas.removeEventListener("pointercancel",pointerUp);
      canvas.removeEventListener("pointerleave",pointerUp);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material)?object.material:[object.material];
          if(object.userData.fieldCaseTexture instanceof THREE.Texture)object.userData.fieldCaseTexture.dispose();
          materials.forEach((item) => item.dispose());
        }
        if (object instanceof THREE.Sprite) object.material.map?.dispose();
      });
      renderer.dispose();
    };
  },[onHover]);

  return <div className="lab-game"><canvas ref={canvasRef} aria-label={room.sceneAriaLabel} /></div>;
}
