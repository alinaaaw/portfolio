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
  computer: [-5.9, 2.25, -6.05],
  drawer: [-3.4, 1.05, -5.75],
  notebook: [4.9, 1.72, 2.2],
  books: [8.2, 2.55, -5.95],
  board: [1.1, 3.15, -8.55],
  fieldcase: [-7.1, .85, 3.45],
};

const cameraPoses: Record<ZoneId, { position: [number,number,number]; target: [number,number,number] }> = {
  computer: { position: [-5.9,2.8,-2.75], target: [-5.9,2.25,-6.05] },
  drawer: { position: [-3.4,2.35,-2.7], target: [-3.4,1.05,-5.75] },
  notebook: { position: [4.9,4.25,5.65], target: [4.9,1.58,2.2] },
  books: { position: [8.1,3.1,-2.2], target: [8.2,2.5,-5.95] },
  board: { position: [1.1,3.35,-4.7], target: [1.1,3.1,-8.5] },
  fieldcase: { position: [-7.05,3.1,6.3], target: [-7.05,.85,3.45] },
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
    context.font = "700 34px monospace";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text,320,65);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map:texture,transparent:true,depthWrite:false }));
  sprite.scale.set(4.1,.82,1);
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
  label.position.y = .92;
  group.add(label);
  group.position.set(x,y,z);
  scene.add(group);
  targets.push(hit);
  return group;
}

function addDesk(scene: THREE.Scene, x: number, z: number, width: number, depth: number) {
  const group = new THREE.Group();
  const top = box(width,.25,depth,palette.woodLight);
  top.position.y = 1.48;
  group.add(top);
  for (const px of [-width/2+.26,width/2-.26]) {
    for (const pz of [-depth/2+.24,depth/2-.24]) {
      const leg = box(.22,1.45,.22,palette.metal,.38,.7);
      leg.position.set(px,.72,pz);
      group.add(leg);
    }
  }
  group.position.set(x,0,z);
  scene.add(group);
  return group;
}

function buildComputer(scene: THREE.Scene) {
  const desk = addDesk(scene,-4.7,-6.3,6.8,2.35);
  const monitor = box(3.25,2,.2,palette.metal,.35,.65);
  monitor.position.set(-1.2,2.6,.02);
  desk.add(monitor);
  const screen = box(2.9,1.65,.04,0x163d39);
  screen.position.set(-1.2,2.6,.14);
  const screenMat = screen.material as THREE.MeshStandardMaterial;
  screenMat.emissive.setHex(palette.cyan);
  screenMat.emissiveIntensity = 1.25;
  desk.add(screen);
  const stand = box(.2,.9,.24,palette.metal,.35,.7);
  stand.position.set(-1.2,1.87,0);
  desk.add(stand);
  const keyboard = box(2.55,.1,.8,0x202927,.5,.42);
  keyboard.position.set(-1.2,1.67,.67);
  desk.add(keyboard);
  for (let row=0; row<4; row+=1) {
    for (let column=0; column<11; column+=1) {
      const key = box(.15,.025,.1,0x778078);
      key.position.set(-2.02+column*.17,1.74,.44+row*.13);
      desk.add(key);
    }
  }
  const printer = box(1.7,.9,1.25,0xd0c6ad);
  printer.position.set(2,1.98,.05);
  desk.add(printer);
  const printerSlot = box(1.2,.08,.07,0x28302e);
  printerSlot.position.set(2,2.18,.69);
  desk.add(printerSlot);
  const printerLight = cylinder(.055,.055,0x635f4e,12);
  printerLight.rotation.x = Math.PI/2;
  printerLight.position.set(2.58,2.36,.67);
  printerLight.userData.faxLight = true;
  desk.add(printerLight);
  const paper = box(1.15,.025,1.35,palette.paper);
  paper.position.set(2,2.25,.1);
  paper.rotation.x = -.6;
  paper.userData.faxPaper = true;
  paper.visible = false;
  desk.add(paper);

  const drawerUnit = box(2.3,1.3,1.7,palette.wood);
  drawerUnit.position.set(.65,.75,0);
  desk.add(drawerUnit);
  for (let index=0; index<3; index+=1) {
    const face = box(2.05,.32,.08,palette.woodLight);
    face.position.set(.65,.45+index*.4,.89);
    desk.add(face);
    const handle = box(.42,.06,.08,palette.steel,.3,.75);
    handle.position.set(.65,.45+index*.4,.96);
    desk.add(handle);
  }
}

function buildNotebookTable(scene: THREE.Scene) {
  const desk = addDesk(scene,4.9,2.2,4.1,2.6);
  const left = box(1.55,.05,1.8,palette.paper);
  left.position.set(-.78,1.67,0);
  left.rotation.y = -.05;
  const right = left.clone();
  right.position.x = .78;
  right.rotation.y = .05;
  desk.add(left,right);
  for (let line=0; line<7; line+=1) {
    const leftLine = box(1.22,.01,.017,0x63817a);
    leftLine.position.set(-.78,1.7,-.65+line*.21);
    const rightLine = leftLine.clone();
    rightLine.position.x = .78;
    desk.add(leftLine,rightLine);
  }
  const pen = cylinder(.035,1.35,palette.red,10);
  pen.rotation.z = Math.PI/2;
  pen.position.set(.8,1.79,.7);
  desk.add(pen);
  const mug = cylinder(.32,.55,0x304b45,24);
  mug.position.set(1.65,1.8,-.55);
  desk.add(mug);
}

function buildBooks(scene: THREE.Scene) {
  const shelf = new THREE.Group();
  const back = box(3.1,5.8,.45,palette.wood);
  back.position.z = -.2;
  shelf.add(back);
  for (let level=0; level<4; level+=1) {
    const board = box(3.4,.18,1.25,palette.woodLight);
    board.position.set(0,.25+level*1.4,.15);
    shelf.add(board);
    for (let index=0; index<5; index+=1) {
      const colors = [0x8e4d3e,0x405c57,0xc2a866,0x6c5648,0x4b6671];
      const book = box(.38,.92+(index%2)*.16,.75,colors[(index+level)%colors.length]);
      book.position.set(-1.05+index*.5,.82+level*1.4,.15);
      book.rotation.z = index===4 ? -.08 : 0;
      shelf.add(book);
    }
  }
  shelf.position.set(8.25,0,-6.2);
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
  group.position.set(-7.1,0,3.45);
  scene.add(group);
}

function buildRoom(scene: THREE.Scene, targets: ZoneTarget[]) {
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(26,18),material(0x17211f,.97));
  floor.rotation.x = -Math.PI/2;
  floor.receiveShadow = true;
  scene.add(floor);
  const back = box(26,7.8,.34,0x101816);
  back.position.set(0,3.9,-9);
  const side = box(.34,7.8,18,0x121c19);
  side.position.set(-13,3.9,0);
  scene.add(back,side);
  for (let index=0; index<7; index+=1) {
    const beam = box(.17,7.3,.12,0x2c3834,.4,.72);
    beam.position.set(-11.4+index*3.7,3.65,-8.75);
    scene.add(beam);
  }
  const windowFrame = box(5.4,3.1,.12,0x26322f,.35,.72);
  windowFrame.position.set(-8.7,4.65,-8.7);
  const windowGlow = box(5,2.7,.05,0x2b5552);
  windowGlow.position.set(-8.7,4.65,-8.61);
  const glowMaterial = windowGlow.material as THREE.MeshStandardMaterial;
  glowMaterial.emissive.setHex(0x376b67);
  glowMaterial.emissiveIntensity = .65;
  scene.add(windowFrame,windowGlow);

  buildComputer(scene);
  buildNotebookTable(scene);
  buildBooks(scene);
  buildBoard(scene);
  buildFieldCase(scene);

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
    renderer.toneMappingExposure = 1.08;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(palette.void);
    scene.fog = new THREE.FogExp2(palette.void,.026);
    const camera = new THREE.PerspectiveCamera(45,1,.1,80);
    const defaultPosition = new THREE.Vector3(0,5.4,13.3);
    const defaultTarget = new THREE.Vector3(0,1.65,-1.5);
    camera.position.copy(defaultPosition);
    const currentTarget = defaultTarget.clone();
    const targets: ZoneTarget[] = [];
    buildRoom(scene,targets);

    scene.add(new THREE.HemisphereLight(0x83a8a1,0x080c0b,1.25));
    const key = new THREE.DirectionalLight(0xffd29c,3.6);
    key.position.set(-5,11,7);
    key.castShadow = true;
    key.shadow.mapSize.set(2048,2048);
    key.shadow.camera.left = -16;
    key.shadow.camera.right = 16;
    key.shadow.camera.top = 13;
    key.shadow.camera.bottom = -12;
    scene.add(key);
    const cyan = new THREE.PointLight(palette.cyan,16,18,1.8);
    cyan.position.set(-5.8,4.1,-5.2);
    const warm = new THREE.PointLight(0xffb46a,21,20,1.7);
    warm.position.set(4.5,5,-1);
    const boardLight = new THREE.SpotLight(0xffcd92,18,10,.75,.45,1.5);
    boardLight.position.set(1.1,6,-4.8);
    boardLight.target.position.set(1.1,3,-8.5);
    scene.add(cyan,warm,boardLight,boardLight.target);
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
        desiredPosition.x = Math.sin(orbit)*13.3 + pointerX*.22;
        desiredPosition.z = Math.cos(orbit)*13.3;
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
