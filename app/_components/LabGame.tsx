"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export type StationId = "terminal" | "route" | "hardware" | "notebook" | "fieldcase";

type LabGameProps = {
  active: boolean;
  discovered: StationId[];
  onNearChange: (station: StationId | null) => void;
  onInspect: (station: StationId) => void;
};

type StationTarget = THREE.Object3D & { userData: { station?: StationId } };

const stationPositions: Record<StationId, [number, number]> = {
  terminal: [-7.2, -5.7],
  route: [-1.9, -6.6],
  hardware: [5.4, -5.5],
  notebook: [6.6, 2.8],
  fieldcase: [-6.3, 3.5],
};

const palette = {
  ink: 0x0b1211,
  metal: 0x293432,
  metalLight: 0x68736e,
  wood: 0x5d4737,
  woodLight: 0x8b6a4e,
  paper: 0xd9cfb7,
  cyan: 0x65c7c0,
  signal: 0xd1f45c,
  red: 0xe45a43,
  green: 0x31463e,
};

function mat(color: number, roughness = .82, metalness = .04, emissive = 0x000000, emissiveIntensity = 0) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness, emissive, emissiveIntensity });
}

function box(w: number, h: number, d: number, color: number, roughness?: number, metalness?: number) {
  return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color, roughness, metalness));
}

function cylinder(radius: number, height: number, color: number, segments = 24) {
  return new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, segments), mat(color));
}

function labelSprite(text: string, accent: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const context = canvas.getContext("2d");
  if (context) {
    context.fillStyle = "rgba(7,14,13,.9)";
    context.fillRect(0, 0, 512, 128);
    context.strokeStyle = accent;
    context.lineWidth = 4;
    context.strokeRect(4, 4, 504, 120);
    context.fillStyle = accent;
    context.font = "700 35px monospace";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text, 256, 65);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(3.5, .875, 1);
  return sprite;
}

function addBench(scene: THREE.Scene, x: number, z: number, width = 4.2, depth = 2.2) {
  const group = new THREE.Group();
  const top = box(width, .26, depth, palette.woodLight);
  top.position.y = 1.48;
  group.add(top);
  for (const px of [-width / 2 + .28, width / 2 - .28]) {
    for (const pz of [-depth / 2 + .25, depth / 2 - .25]) {
      const leg = box(.26, 1.45, .26, palette.metal, .45, .65);
      leg.position.set(px, .72, pz);
      group.add(leg);
    }
  }
  group.position.set(x, 0, z);
  scene.add(group);
  return group;
}

function addBeacon(scene: THREE.Scene, id: StationId, x: number, z: number, label: string, targets: StationTarget[]) {
  const beacon = new THREE.Group();
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(.52, .035, 10, 48),
    mat(palette.signal, .35, .25, palette.signal, 1.4),
  );
  ring.rotation.x = Math.PI / 2;
  beacon.add(ring);
  const hit = new THREE.Mesh(
    new THREE.SphereGeometry(.75, 20, 14),
    new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }),
  ) as StationTarget;
  hit.userData.station = id;
  beacon.add(hit);
  const sprite = labelSprite(label, "#d1f45c");
  sprite.position.y = 1.25;
  beacon.add(sprite);
  beacon.position.set(x, .13, z);
  scene.add(beacon);
  targets.push(hit);
  return beacon;
}

function buildTerminal(scene: THREE.Scene) {
  const bench = addBench(scene, -7.2, -6.25, 4.5, 2.1);
  const monitor = box(2.65, 1.55, .18, palette.metal, .35, .65);
  monitor.position.set(0, 2.45, 0);
  bench.add(monitor);
  const screen = box(2.35, 1.25, .04, 0x183f3d);
  screen.position.set(0, 2.45, .115);
  (screen.material as THREE.MeshStandardMaterial).emissive.setHex(palette.cyan);
  (screen.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.25;
  bench.add(screen);
  const stand = box(.22, .85, .22, palette.metal, .35, .7);
  stand.position.set(0, 1.85, -.05);
  bench.add(stand);
  const keyboard = box(2.2, .1, .72, 0x202927, .55, .4);
  keyboard.position.set(0, 1.68, .58);
  keyboard.rotation.x = -.08;
  bench.add(keyboard);
  for (let row = 0; row < 4; row += 1) {
    for (let col = 0; col < 10; col += 1) {
      const key = box(.15, .035, .1, 0x70766e);
      key.position.set(-.76 + col * .17, 1.75, .38 + row * .13);
      bench.add(key);
    }
  }
}

function buildRouteTable(scene: THREE.Scene) {
  const bench = addBench(scene, -1.9, -7, 4, 2);
  const paper = box(2.8, .045, 1.45, palette.paper);
  paper.position.set(0, 1.64, .05);
  bench.add(paper);
  const nodes: [number, number][] = [[-.95,-.35],[-.4,.35],[.25,-.1],[.92,.38]];
  nodes.forEach(([x,z], index) => {
    const node = cylinder(.09, .08, index === 3 ? palette.red : palette.cyan, 16);
    node.position.set(x, 1.71, z);
    bench.add(node);
    if (index > 0) {
      const [px,pz] = nodes[index - 1];
      const dx = x - px;
      const dz = z - pz;
      const line = box(Math.hypot(dx,dz), .025, .035, palette.red);
      line.position.set((x+px)/2,1.7,(z+pz)/2);
      line.rotation.y = -Math.atan2(dz,dx);
      bench.add(line);
    }
  });
  const lamp = new THREE.SpotLight(0xffc682, 18, 8, .65, .55, 1.6);
  lamp.position.set(-1.9, 5, -5.9);
  lamp.target.position.set(-1.9, 0, -7);
  scene.add(lamp, lamp.target);
}

function buildHardware(scene: THREE.Scene) {
  const bench = addBench(scene, 5.4, -6.1, 4.4, 2.2);
  const board = box(2.9, .12, 1.5, 0x314f46);
  board.position.set(0, 1.66, 0);
  bench.add(board);
  const core = box(.82, .24, .7, 0x171d1c, .35, .6);
  core.position.set(0, 1.84, 0);
  bench.add(core);
  for (let index = 0; index < 8; index += 1) {
    const pin = box(.08, .12, .08, palette.metalLight, .3, .8);
    pin.position.set(-1.15 + index * .33, 1.81, index % 2 ? .55 : -.55);
    bench.add(pin);
  }
  const sensor = cylinder(.27, .3, palette.paper);
  sensor.position.set(-1, 1.88, 0);
  bench.add(sensor);
  const led = cylinder(.08, .18, palette.signal, 16);
  led.position.set(1.1, 1.92, 0);
  (led.material as THREE.MeshStandardMaterial).emissive.setHex(palette.signal);
  (led.material as THREE.MeshStandardMaterial).emissiveIntensity = 2.5;
  bench.add(led);
}

function buildNotebook(scene: THREE.Scene) {
  const bench = addBench(scene, 7.2, 3.15, 3.4, 2.2);
  const left = box(1.35, .06, 1.6, palette.paper);
  left.position.set(-.69, 1.67, 0);
  left.rotation.y = -.06;
  const right = left.clone();
  right.position.x = .69;
  right.rotation.y = .06;
  bench.add(left, right);
  for (let index = 0; index < 6; index += 1) {
    const lineL = box(1.08, .012, .018, 0x66827a);
    lineL.position.set(-.69, 1.705, -.55 + index * .2);
    const lineR = lineL.clone();
    lineR.position.x = .69;
    bench.add(lineL, lineR);
  }
  const mug = cylinder(.32, .55, 0x334a45, 24);
  mug.position.set(1.35, 1.82, -.55);
  bench.add(mug);
}

function buildFieldCase(scene: THREE.Scene) {
  const caseGroup = new THREE.Group();
  const base = box(3.3, .75, 2.1, 0x4e412f, .65, .15);
  base.position.y = .48;
  caseGroup.add(base);
  const lid = box(3.3, .18, 2.1, 0x6e573c);
  lid.position.set(0, 1.5, -.9);
  lid.rotation.x = -1.08;
  caseGroup.add(lid);
  const target = new THREE.Mesh(new THREE.CylinderGeometry(.72,.72,.07,48), mat(palette.paper));
  target.rotation.x = Math.PI / 2;
  target.position.set(-.85, 1.05, 0);
  caseGroup.add(target);
  [.52,.34,.16].forEach((radius,index) => {
    const color = [0x4e7c7a,0xc8b65d,palette.red][index];
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(radius,radius,.075,40),mat(color));
    ring.rotation.x = Math.PI / 2;
    ring.position.set(-.85,1.05,.045 + index * .008);
    caseGroup.add(ring);
  });
  const ticket = box(1.1,.05,.55,0xc9b982);
  ticket.position.set(.9,1.05,.1);
  ticket.rotation.y = -.18;
  caseGroup.add(ticket);
  caseGroup.position.set(-6.3,0,3.5);
  scene.add(caseGroup);
}

function buildRoom(scene: THREE.Scene, targets: StationTarget[]) {
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(26, 18), mat(0x18221f, .96));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  floor.userData.floor = true;
  scene.add(floor);

  const backWall = box(26, 7.5, .35, 0x101816);
  backWall.position.set(0,3.75,-9);
  const sideWall = box(.35,7.5,18,0x131d1a);
  sideWall.position.set(-13,3.75,0);
  scene.add(backWall,sideWall);
  for (let index = 0; index < 7; index += 1) {
    const beam = box(.18,7.2,.12,0x2e3a36,.42,.65);
    beam.position.set(-11.5 + index * 3.7,3.6,-8.72);
    scene.add(beam);
  }
  const windowFrame = box(5.6,3.25,.12,0x25312e,.4,.7);
  windowFrame.position.set(7.9,4.65,-8.7);
  const windowGlow = box(5.15,2.8,.06,0x335c59);
  windowGlow.position.set(7.9,4.65,-8.61);
  (windowGlow.material as THREE.MeshStandardMaterial).emissive.setHex(0x3d7773);
  (windowGlow.material as THREE.MeshStandardMaterial).emissiveIntensity = .6;
  scene.add(windowFrame,windowGlow);

  buildTerminal(scene);
  buildRouteTable(scene);
  buildHardware(scene);
  buildNotebook(scene);
  buildFieldCase(scene);

  addBeacon(scene,"terminal",...stationPositions.terminal,"01 / TERMINAL",targets);
  addBeacon(scene,"route",...stationPositions.route,"02 / ROUTE",targets);
  addBeacon(scene,"hardware",...stationPositions.hardware,"03 / DEVICE",targets);
  addBeacon(scene,"notebook",...stationPositions.notebook,"04 / NOTES",targets);
  addBeacon(scene,"fieldcase",...stationPositions.fieldcase,"05 / FIELD CASE",targets);

  const shelf = box(2.6,5.4,.55,palette.metal,.45,.7);
  shelf.position.set(-11.9,2.7,3.8);
  scene.add(shelf);
  for (let index = 0; index < 4; index += 1) {
    const shelfBoard = box(2.6,.12,2,palette.metal,.42,.65);
    shelfBoard.position.set(-11.9,.8 + index * 1.35,3.8);
    scene.add(shelfBoard);
  }
}

function buildRover(scene: THREE.Scene) {
  const rover = new THREE.Group();
  const body = box(1.1,.35,1.55,0x313b38,.3,.72);
  body.position.y = .5;
  rover.add(body);
  const top = box(.78,.28,.82,0xd1f45c,.45,.35);
  top.position.set(0,.78,-.08);
  rover.add(top);
  const mast = cylinder(.055,.65,palette.metalLight,12);
  mast.position.set(0,1.18,-.1);
  rover.add(mast);
  const camera = box(.35,.25,.3,0x101817,.25,.75);
  camera.position.set(0,1.52,-.1);
  rover.add(camera);
  for (const x of [-.63,.63]) {
    for (const z of [-.5,.5]) {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(.25,.25,.18,20),mat(0x0a0d0c,.5,.35));
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(x,.31,z);
      rover.add(wheel);
    }
  }
  for (const x of [-.3,.3]) {
    const lamp = cylinder(.09,.08,0xffe0a3,16);
    lamp.rotation.x = Math.PI / 2;
    lamp.position.set(x,.56,-.8);
    (lamp.material as THREE.MeshStandardMaterial).emissive.setHex(0xffd28a);
    (lamp.material as THREE.MeshStandardMaterial).emissiveIntensity = 3;
    rover.add(lamp);
  }
  rover.position.set(0,0,6.2);
  rover.rotation.y = Math.PI;
  scene.add(rover);
  return rover;
}

export default function LabGame({ active, discovered, onNearChange, onInspect }: LabGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keyRef = useRef(new Set<string>());
  const inspectRef = useRef(onInspect);
  const activeRef = useRef(active);
  const nearRef = useRef<StationId | null>(null);
  const discoveredRef = useRef(discovered);

  useEffect(() => { inspectRef.current = onInspect; }, [onInspect]);
  useEffect(() => { activeRef.current = active; }, [active]);
  useEffect(() => { discoveredRef.current = discovered; }, [discovered]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x08100f);
    scene.fog = new THREE.FogExp2(0x08100f,.027);
    const camera = new THREE.PerspectiveCamera(47,1,.1,80);
    const targets: StationTarget[] = [];
    buildRoom(scene,targets);
    const rover = buildRover(scene);

    scene.add(new THREE.HemisphereLight(0x7fa39d,0x0b0e0d,1.3));
    const key = new THREE.DirectionalLight(0xffd19a,3.5);
    key.position.set(-5,10,7);
    key.castShadow = true;
    key.shadow.mapSize.set(2048,2048);
    key.shadow.camera.left = -16;
    key.shadow.camera.right = 16;
    key.shadow.camera.top = 13;
    key.shadow.camera.bottom = -12;
    scene.add(key);
    const cyan = new THREE.PointLight(palette.cyan,15,18,1.7);
    cyan.position.set(-7,4,-5);
    const warm = new THREE.PointLight(0xffb46a,20,20,1.8);
    warm.position.set(4,5,-2);
    scene.add(cyan,warm);
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });

    const pointer = new THREE.Vector2(5,5);
    const raycaster = new THREE.Raycaster();
    let destination: THREE.Vector3 | null = null;
    let destinationStation: StationId | null = null;
    let speed = 0;
    let previous = performance.now();
    let frame = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      renderer.setSize(Math.max(1,rect.width),Math.max(1,rect.height),false);
      camera.aspect = Math.max(1,rect.width) / Math.max(1,rect.height);
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    const updatePointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((event.clientX-rect.left)/rect.width)*2-1;
      pointer.y = -((event.clientY-rect.top)/rect.height)*2+1;
      raycaster.setFromCamera(pointer,camera);
    };
    const pointerMove = (event: PointerEvent) => {
      updatePointer(event);
      const stationHit = raycaster.intersectObjects(targets,false)[0]?.object as StationTarget | undefined;
      canvas.style.cursor = stationHit?.userData.station ? "pointer" : "crosshair";
    };
    const pointerDown = (event: PointerEvent) => {
      updatePointer(event);
      const stationHit = raycaster.intersectObjects(targets,false)[0]?.object as StationTarget | undefined;
      const station = stationHit?.userData.station;
      if (station) {
        const [x,z] = stationPositions[station];
        destination = new THREE.Vector3(x,0,z+1.55);
        destinationStation = station;
        return;
      }
      const floor = scene.children.find((child) => child.userData.floor);
      if (!floor) return;
      const hit = raycaster.intersectObject(floor,false)[0];
      if (hit) {
        destination = hit.point.clone();
        destination.x = THREE.MathUtils.clamp(destination.x,-11.5,11.5);
        destination.z = THREE.MathUtils.clamp(destination.z,-7.6,7.6);
        destinationStation = null;
      }
    };
    canvas.addEventListener("pointermove",pointerMove);
    canvas.addEventListener("pointerdown",pointerDown);

    const keyDown = (event: KeyboardEvent) => {
      const keyName = event.key.toLowerCase();
      if (["arrowup","arrowdown","arrowleft","arrowright","w","a","s","d","e"].includes(keyName)) event.preventDefault();
      keyRef.current.add(keyName);
      if (keyName === "e" && nearRef.current) inspectRef.current(nearRef.current);
      if (["arrowup","arrowdown","arrowleft","arrowright","w","a","s","d"].includes(keyName)) destination = null;
    };
    const keyUp = (event: KeyboardEvent) => keyRef.current.delete(event.key.toLowerCase());
    window.addEventListener("keydown",keyDown);
    window.addEventListener("keyup",keyUp);

    const tick = (now: number) => {
      const delta = Math.min(.04,(now-previous)/1000);
      previous = now;
      const keys = keyRef.current;
      const forward = keys.has("w") || keys.has("arrowup");
      const reverse = keys.has("s") || keys.has("arrowdown");
      const left = keys.has("a") || keys.has("arrowleft");
      const right = keys.has("d") || keys.has("arrowright");

      if (activeRef.current) {
        if (forward || reverse) {
          const targetSpeed = forward ? 3.8 : -2.3;
          speed = THREE.MathUtils.lerp(speed,targetSpeed,.08);
          const steer = (left ? 1 : 0) - (right ? 1 : 0);
          rover.rotation.y += steer * delta * (forward ? 1.75 : -1.35);
        } else if (destination) {
          const dx = destination.x-rover.position.x;
          const dz = destination.z-rover.position.z;
          const distance = Math.hypot(dx,dz);
          if (distance < .35) {
            speed = THREE.MathUtils.lerp(speed,0,.25);
            destination = null;
            if (destinationStation) inspectRef.current(destinationStation);
            destinationStation = null;
          } else {
            const desired = Math.atan2(dx,dz);
            let angle = desired-rover.rotation.y;
            angle = Math.atan2(Math.sin(angle),Math.cos(angle));
            rover.rotation.y += THREE.MathUtils.clamp(angle,-delta*2.2,delta*2.2);
            speed = THREE.MathUtils.lerp(speed,Math.min(3.4,distance*1.5),.07);
          }
        } else {
          speed = THREE.MathUtils.lerp(speed,0,.12);
          if (left || right) rover.rotation.y += ((left ? 1 : 0)-(right ? 1 : 0))*delta*1.25;
        }

        rover.position.x += Math.sin(rover.rotation.y)*speed*delta;
        rover.position.z += Math.cos(rover.rotation.y)*speed*delta;
        rover.position.x = THREE.MathUtils.clamp(rover.position.x,-11.5,11.5);
        rover.position.z = THREE.MathUtils.clamp(rover.position.z,-7.65,7.65);
      }

      let nearest: StationId | null = null;
      let nearestDistance = 2.35;
      (Object.entries(stationPositions) as [StationId,[number,number]][]).forEach(([id,[x,z]]) => {
        const distance = Math.hypot(rover.position.x-x,rover.position.z-z);
        if (distance < nearestDistance) { nearest = id; nearestDistance = distance; }
      });
      if (nearest !== nearRef.current) {
        nearRef.current = nearest;
        onNearChange(nearest);
      }

      targets.forEach((target) => {
        const id = target.userData.station;
        if (!id) return;
        const beacon = target.parent;
        if (!beacon) return;
        const found = discoveredRef.current.includes(id);
        const ring = beacon.children[0] as THREE.Mesh;
        ring.rotation.z += delta*(found ? .35 : 1.2);
        const scale = 1 + Math.sin(now*.002 + beacon.position.x)*.08;
        ring.scale.setScalar(scale);
        const material = ring.material as THREE.MeshStandardMaterial;
        material.color.setHex(found ? palette.cyan : palette.signal);
        material.emissive.setHex(found ? palette.cyan : palette.signal);
      });

      rover.children.forEach((child) => {
        if (child instanceof THREE.Mesh && child.geometry instanceof THREE.CylinderGeometry && child.position.y < .5) child.rotation.x -= speed*delta*2.2;
      });

      const behind = new THREE.Vector3(-Math.sin(rover.rotation.y)*6.4,5.5,-Math.cos(rover.rotation.y)*6.4);
      const cameraTarget = rover.position.clone().add(behind);
      camera.position.lerp(cameraTarget,.055);
      const lookAt = rover.position.clone().add(new THREE.Vector3(0,.65,0));
      camera.lookAt(lookAt);
      renderer.render(scene,camera);
      frame = requestAnimationFrame(tick);
    };
    camera.position.set(0,6,12);
    frame = requestAnimationFrame(tick);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      canvas.removeEventListener("pointermove",pointerMove);
      canvas.removeEventListener("pointerdown",pointerDown);
      window.removeEventListener("keydown",keyDown);
      window.removeEventListener("keyup",keyUp);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
        if (object instanceof THREE.Sprite) object.material.map?.dispose();
      });
      renderer.dispose();
    };
  }, [onNearChange]);

  const press = (key: string, down: boolean) => {
    if (down) keyRef.current.add(key);
    else keyRef.current.delete(key);
  };

  return (
    <div className="lab-game">
      <canvas ref={canvasRef} aria-label="Driveable 3D model of Alina's laboratory" />
      <div className="mobile-drive" aria-label="Drive controls">
        <button onPointerDown={() => press("w",true)} onPointerUp={() => press("w",false)} onPointerCancel={() => press("w",false)} aria-label="Drive forward">↑</button>
        <button onPointerDown={() => press("a",true)} onPointerUp={() => press("a",false)} onPointerCancel={() => press("a",false)} aria-label="Turn left">←</button>
        <button onPointerDown={() => press("s",true)} onPointerUp={() => press("s",false)} onPointerCancel={() => press("s",false)} aria-label="Drive backward">↓</button>
        <button onPointerDown={() => press("d",true)} onPointerUp={() => press("d",false)} onPointerCancel={() => press("d",false)} aria-label="Turn right">→</button>
      </div>
    </div>
  );
}
