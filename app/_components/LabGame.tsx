"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export type ZoneId = "computer" | "drawer" | "notebook" | "books" | "board" | "fieldcase";

type LabGameProps = {
  active: boolean;
  viewing: ZoneId | null;
  discovered: ZoneId[];
  faxReady: boolean;
  onHover: (zone: ZoneId | null) => void;
  onInspect: (zone: ZoneId) => void;
};

type ZoneTarget = THREE.Object3D & { userData: { zone?: ZoneId } };

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
  computer: "COMPUTER / FILE SYSTEM",
  drawer: "DRAWER / PROTOTYPE",
  notebook: "NOTEBOOK / RESEARCH",
  books: "BOOKS / ALGORITHMS",
  board: "BOARD / MARGIN NOTES",
  fieldcase: "FIELD CASE / EXPERIENCE",
};

const zonePositions: Record<ZoneId, [number, number, number]> = {
  computer: [-5.7, 2.5, -6.2],
  drawer: [-3.53, .84, -5.38],
  notebook: [3.8, 1.85, -1.75],
  books: [8.2, 3.05, -6.35],
  board: [1.1, 3.55, -8.62],
  fieldcase: [-4.9, 1.55, 1.55],
};

const cameraPoses: Record<ZoneId, { position: [number,number,number]; target: [number,number,number] }> = {
  computer: { position: [-5.7,2.95,-2.75], target: [-5.7,2.45,-6.12] },
  drawer: { position: [-3.5,2.3,-2.55], target: [-3.53,.84,-5.47] },
  notebook: { position: [3.8,4.55,2.3], target: [3.8,1.55,-1.75] },
  books: { position: [8.05,3.45,-2.65], target: [8.2,3,-6.35] },
  board: { position: [1.1,3.35,-4.7], target: [1.1,3.1,-8.5] },
  fieldcase: { position: [-4.9,3.45,4.65], target: [-4.9,1.45,1.55] },
};

function material(color: number, roughness = .8, metalness = .05, emissive = 0x000000, emissiveIntensity = 0) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness, emissive, emissiveIntensity });
}

function box(width: number, height: number, depth: number, color: number, roughness?: number, metalness?: number) {
  return new THREE.Mesh(new THREE.BoxGeometry(width,height,depth),material(color,roughness,metalness));
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
    context.font = "700 28px monospace";
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
  group.add(ring);
  const hit = new THREE.Mesh(
    new THREE.SphereGeometry(.68,16,12),
    new THREE.MeshBasicMaterial({ transparent:true,opacity:0,depthWrite:false }),
  ) as ZoneTarget;
  hit.userData.zone = zone;
  group.add(hit);
  const label = makeLabel(zoneLabels[zone]);
  label.position.y = .72;
  group.add(label);
  group.position.set(x,y,z);
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

function addCable(scene: THREE.Scene, points: [number,number,number][], color: number, radius = .018) {
  const curve = new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point)));
  const cable = new THREE.Mesh(new THREE.TubeGeometry(curve,32,radius,7,false),material(color,.55,.15));
  scene.add(cable);
  return cable;
}

function addDeskLamp(group: THREE.Group, x: number, z: number) {
  const base = cylinder(.42,.09,0x252c2a,30);
  base.position.set(x,1.64,z);
  const lower = cylinder(.045,1.15,0x343d3a,14);
  lower.position.set(x,2.18,z);
  const upper = cylinder(.04,1.1,0x343d3a,14);
  upper.position.set(x-.36,2.87,z);
  upper.rotation.z = -.7;
  const shade = new THREE.Mesh(new THREE.ConeGeometry(.5,.58,32,1,true),material(0x1b2321,.32,.72));
  shade.position.set(x-.72,3.25,z);
  shade.rotation.z = Math.PI;
  const bulb = new THREE.PointLight(0xffbf7d,12,7,1.65);
  bulb.position.set(x-.72,2.95,z);
  group.add(base,lower,upper,shade,bulb);
}

function buildComputer(scene: THREE.Scene) {
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
  const printer = box(1.65,.84,1.35,0xbcb5a4,.66,.12);
  printer.position.set(2.38,2.03,-.16);
  desk.add(printer);
  const printerSlot = box(1.2,.08,.07,0x28302e);
  printerSlot.position.set(2.38,2.2,.54);
  desk.add(printerSlot);
  const printerLight = cylinder(.055,.055,0x635f4e,12);
  printerLight.rotation.x = Math.PI/2;
  printerLight.position.set(2.95,2.38,.54);
  printerLight.userData.faxLight = true;
  desk.add(printerLight);
  const paper = box(1.15,.025,1.35,palette.paper);
  paper.position.set(2.38,2.28,-.08);
  paper.rotation.x = -.6;
  paper.userData.faxPaper = true;
  paper.visible = false;
  desk.add(paper);

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

  addDeskLamp(desk,3.05,-.55);
  const mug = cylinder(.28,.5,0x253b36,28);
  mug.position.set(.78,1.86,-.38);
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
  addCable(scene,[[2.15,1.77,-1.25],[1.55,2.1,-1.6],[.75,1.82,-1.5],[-.05,1.79,-1.92]],palette.red,.016);
  addCable(scene,[[1.2,1.78,-1.22],[.5,2.2,-1.58],[-.45,1.86,-1.55],[-.92,1.8,-1.72]],palette.cyan,.016);

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
  const base = box(3.4,.72,2.15,0x4e402f,.68,.12);
  base.position.y = .46;
  const lid = box(3.4,.17,2.15,0x71583d);
  lid.position.set(0,1.52,-.9);
  lid.rotation.x = -1.08;
  group.add(base,lid);
  const target = new THREE.Mesh(new THREE.CylinderGeometry(.72,.72,.06,48),material(palette.paper));
  target.rotation.x = Math.PI/2;
  target.position.set(-.85,1.02,.05);
  group.add(target);
  [.53,.35,.17].forEach((radius,index) => {
    const colors = [0x507b78,0xcab65b,palette.red];
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(radius,radius,.065,40),material(colors[index]));
    ring.rotation.x = Math.PI/2;
    ring.position.set(-.85,1.02,.09+index*.01);
    group.add(ring);
  });
  const ticket = box(1.15,.035,.58,0xcbbb82);
  ticket.position.set(.9,1.02,.1);
  ticket.rotation.y = -.16;
  group.add(ticket);
  const card = box(1.15,.035,.72,0xd8d0b9);
  card.position.set(.82,1.05,-.58);
  card.rotation.y = .12;
  group.add(card);
  group.children.forEach((item) => { item.position.y += .62; });
  const cartTop = box(3.75,.16,2.5,0x303a36,.38,.62);
  cartTop.position.y = .58;
  group.add(cartTop);
  for (const x of [-1.55,1.55]) {
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

  buildComputer(scene);
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
    const floorPaper = box(.65,.018,.9,[0xd0c5a8,0xbcae89,0xdfd7c1][paperIndex]);
    floorPaper.position.set(1.55+paperIndex*.42,.025,1.4+paperIndex*.24);
    floorPaper.rotation.y = -.25+paperIndex*.28;
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

export default function LabGame({ active, viewing, discovered, faxReady, onHover, onInspect }: LabGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  const viewingRef = useRef(viewing);
  const discoveredRef = useRef(discovered);
  const faxReadyRef = useRef(faxReady);
  const inspectRef = useRef(onInspect);

  useEffect(() => { activeRef.current = active; },[active]);
  useEffect(() => { viewingRef.current = viewing; },[viewing]);
  useEffect(() => { discoveredRef.current = discovered; },[discovered]);
  useEffect(() => { faxReadyRef.current = faxReady; },[faxReady]);
  useEffect(() => { inspectRef.current = onInspect; },[onInspect]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const renderer = new THREE.WebGLRenderer({ canvas,antialias:true,powerPreference:"high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.65));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = .92;
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
      if (object instanceof THREE.Mesh) { object.castShadow = true; object.receiveShadow = true; }
    });

    const pointer = new THREE.Vector2(5,5);
    const raycaster = new THREE.Raycaster();
    let pointerX = 0;
    let pointerY = 0;
    let hovered: ZoneId | null = null;
    let requested: ZoneId | null = null;
    let requestStarted = 0;
    let requestDelivered = false;
    let dragging = false;
    let dragStartX = 0;
    let dragOrbit = 0;
    let orbit = 0;
    let frame = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      renderer.setSize(Math.max(1,rect.width),Math.max(1,rect.height),false);
      camera.aspect = Math.max(1,rect.width)/Math.max(1,rect.height);
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
      const hit = raycaster.intersectObjects(targets,false)[0]?.object as ZoneTarget | undefined;
      return hit?.userData.zone ?? null;
    };
    const pointerMove = (event: PointerEvent) => {
      const zone = readPointer(event);
      if (zone !== hovered) { hovered = zone; onHover(zone); }
      if (dragging) orbit = THREE.MathUtils.clamp(dragOrbit+(event.clientX-dragStartX)*.0025,-.42,.42);
      canvas.style.cursor = zone ? "pointer" : dragging ? "grabbing" : "grab";
    };
    const pointerDown = (event: PointerEvent) => {
      const zone = readPointer(event);
      if (zone && activeRef.current) {
        requested = zone;
        requestStarted = performance.now();
        requestDelivered = false;
      } else {
        dragging = true;
        dragStartX = event.clientX;
        dragOrbit = orbit;
        canvas.setPointerCapture(event.pointerId);
      }
    };
    const pointerUp = (event: PointerEvent) => {
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
        desiredPosition.x = Math.sin(orbit)*11.5 + pointerX*.18;
        desiredPosition.z = Math.cos(orbit)*11.5;
        desiredPosition.y += -pointerY*.15;
        camera.position.lerp(desiredPosition,.035);
        currentTarget.lerp(defaultTarget.clone().add(new THREE.Vector3(pointerX*.18,-pointerY*.08,0)),.04);
      }
      if (requested) {
        const pose = cameraPoses[requested];
        const desiredPosition = new THREE.Vector3(...pose.position);
        const desiredTarget = new THREE.Vector3(...pose.target);
        camera.position.lerp(desiredPosition,.075);
        currentTarget.lerp(desiredTarget,.075);
        if (!requestDelivered && now-requestStarted>720) {
          requestDelivered = true;
          inspectRef.current(requested);
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
        if (!zone || !group) return;
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
        if (object.userData.faxPaper && object instanceof THREE.Mesh) {
          object.visible = faxReadyRef.current;
          if (faxReadyRef.current) object.position.z = .1+Math.sin(now*.0015)*.05;
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
          materials.forEach((item) => item.dispose());
        }
        if (object instanceof THREE.Sprite) object.material.map?.dispose();
      });
      renderer.dispose();
    };
  },[onHover]);

  return <div className="lab-game"><canvas ref={canvasRef} aria-label="Interactive 3D laboratory with six explorable objects" /></div>;
}
