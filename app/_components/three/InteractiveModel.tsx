"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export type ModelKind = "locker" | "workbench" | "archive" | "routes" | "range";

type InteractiveModelProps = {
  kind: ModelKind;
  activeIndex?: number;
  className?: string;
  title?: string;
  hint?: string;
  interactive?: boolean;
  onSelect?: (index: number) => void;
};

type InteractivePart = THREE.Object3D & { userData: { index?: number; kind?: string; baseY?: number } };

const palette = {
  ink: 0x17202e,
  timber: 0x76543b,
  timberDark: 0x3b2b23,
  paper: 0xf3e7c8,
  mint: 0xc9ff69,
  orange: 0xff7356,
  blue: 0x5d83ff,
  metal: 0x9d9b90,
  field: 0x526b55,
};

function material(color: number, roughness = 0.78, metalness = 0.05) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness });
}

function box(width: number, height: number, depth: number, color: number) {
  return new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material(color));
}

function addInteractive(targets: InteractivePart[], object: THREE.Object3D, index: number, kind: string) {
  object.userData.index = index;
  object.userData.kind = kind;
  targets.push(object as InteractivePart);
}

function buildLocker(group: THREE.Group, targets: InteractivePart[]) {
  const frame = material(palette.timberDark);
  const shell = box(7.7, 5.4, .65, palette.timberDark);
  shell.position.z = -.42;
  group.add(shell);

  const bays = 5;
  for (let index = 0; index < bays; index += 1) {
    const x = -3.05 + index * 1.52;
    const interior = box(1.38, 4.72, .58, 0x1b211e);
    interior.position.set(x, 0, .05);
    group.add(interior);

    const hinge = new THREE.Group();
    hinge.position.set(x - .69, 0, .44);
    hinge.userData.index = index;
    hinge.userData.kind = "door";
    const door = box(1.32, 4.62, .16, palette.timber);
    door.position.x = .66;
    hinge.add(door);
    addInteractive(targets, door, index, "door");

    for (let vent = 0; vent < 3; vent += 1) {
      const slit = box(.54, .035, .035, palette.paper);
      slit.position.set(.66, 1.28 - vent * .18, .105);
      hinge.add(slit);
    }
    const plate = box(.42, .34, .06, palette.paper);
    plate.position.set(.66, -.66, .12);
    hinge.add(plate);
    const handle = box(.08, .5, .09, palette.metal);
    handle.position.set(1.14, 0, .16);
    hinge.add(handle);
    group.add(hinge);
  }

  const top = box(8.2, .28, .95, palette.timberDark);
  top.position.y = 2.82;
  group.add(top);
  const bottom = top.clone();
  bottom.position.y = -2.82;
  group.add(bottom);
  const sideLeft = new THREE.Mesh(new THREE.BoxGeometry(.25, 5.4, .95), frame);
  sideLeft.position.x = -4.05;
  group.add(sideLeft);
  const sideRight = sideLeft.clone();
  sideRight.position.x = 4.05;
  group.add(sideRight);
  group.rotation.x = -.05;
}

function buildWorkbench(group: THREE.Group, targets: InteractivePart[]) {
  const top = box(8.4, .42, 3.8, palette.timber);
  top.position.y = -.7;
  group.add(top);
  for (const x of [-3.4, 3.4]) {
    const leg = box(.42, 3.2, .42, palette.timberDark);
    leg.position.set(x, -2.4, .95);
    group.add(leg);
  }
  const bow = new THREE.Group();
  const curve = new THREE.TorusGeometry(1.75, .075, 10, 48, Math.PI * 1.22);
  const bowMesh = new THREE.Mesh(curve, material(0xa6794c));
  bowMesh.rotation.z = -.35;
  bow.add(bowMesh);
  const string = box(.025, 3.2, .025, palette.paper);
  string.rotation.z = -.35;
  bow.add(string);
  bow.position.set(-2.3, .2, .2);
  bow.rotation.x = 1.1;
  addInteractive(targets, bowMesh, 0, "part");
  group.add(bow);

  const routePart = new THREE.Group();
  for (let index = 0; index < 4; index += 1) {
    const node = new THREE.Mesh(new THREE.SphereGeometry(.22, 18, 12), material(index === 3 ? palette.orange : palette.blue));
    node.position.set(index * .72, Math.sin(index) * .25, 0);
    routePart.add(node);
  }
  routePart.position.set(.2, .25, .3);
  routePart.rotation.x = 1.08;
  addInteractive(targets, routePart.children[0], 1, "part");
  group.add(routePart);

  const board = box(1.65, .18, 1.35, 0x294843);
  board.position.set(2.65, -.28, .2);
  board.rotation.x = .08;
  const chip = box(.62, .22, .68, palette.ink);
  chip.position.set(2.65, .05, .25);
  group.add(board, chip);
  addInteractive(targets, board, 2, "part");
  group.rotation.x = -.18;
}

function buildArchive(group: THREE.Group, targets: InteractivePart[]) {
  const shell = box(6.9, 5.3, 2.6, palette.timberDark);
  shell.position.z = -.9;
  group.add(shell);
  for (let index = 0; index < 4; index += 1) {
    const drawer = new THREE.Group();
    drawer.position.set(0, 1.76 - index * 1.16, .44);
    drawer.userData.index = index;
    drawer.userData.kind = "drawer";
    const face = box(6.25, .9, .24, palette.timber);
    drawer.add(face);
    const label = box(1.15, .34, .08, palette.paper);
    label.position.z = .17;
    drawer.add(label);
    const handle = new THREE.Mesh(new THREE.TorusGeometry(.26, .045, 8, 24, Math.PI), material(palette.metal, .35, .6));
    handle.rotation.z = Math.PI;
    handle.position.set(0, -.05, .22);
    drawer.add(handle);
    addInteractive(targets, face, index, "drawer");
    group.add(drawer);
  }
  group.rotation.x = -.04;
}

function buildRoutes(group: THREE.Group, targets: InteractivePart[]) {
  const frame = box(7.7, 5.1, .34, palette.timberDark);
  frame.position.z = -.3;
  group.add(frame);
  const map = box(7.1, 4.5, .24, palette.paper);
  group.add(map);
  const points = [[-2.6, -1.35],[-1.15,.9],[.75,-.2],[2.55,1.25]];
  points.forEach(([x,y], index) => {
    const pin = new THREE.Group();
    const head = new THREE.Mesh(new THREE.SphereGeometry(.22, 18, 12), material(index === 3 ? palette.orange : palette.blue, .35));
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,.38,10), material(palette.metal,.3,.7));
    stem.rotation.x = Math.PI / 2;
    stem.position.z = -.1;
    pin.add(head, stem);
    pin.position.set(x, y, .32);
    addInteractive(targets, head, index, "pin");
    group.add(pin);
  });
  for (let index = 0; index < points.length - 1; index += 1) {
    const [x1,y1] = points[index];
    const [x2,y2] = points[index + 1];
    const dx = x2 - x1;
    const dy = y2 - y1;
    const line = box(Math.hypot(dx,dy), .045, .04, palette.orange);
    line.position.set((x1+x2)/2,(y1+y2)/2,.2);
    line.rotation.z = Math.atan2(dy,dx);
    group.add(line);
  }
  group.rotation.x = -.04;
}

function buildRange(group: THREE.Group, targets: InteractivePart[]) {
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(24, 15), material(palette.field));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -2.75;
  ground.position.z = -2;
  group.add(ground);
  const positions = [[-5,1.1,-1],[-2.6,-.65,1],[0,.75,-1.8],[2.7,-.45,.7],[5,1.05,-.6]];
  positions.forEach(([x,y,z], index) => {
    const target = new THREE.Group();
    const stand = box(.14,2.4,.14,palette.timberDark);
    stand.position.y = -1.45;
    target.add(stand);
    const face = new THREE.Mesh(new THREE.CylinderGeometry(1.05,1.05,.2,48),material(palette.paper));
    face.rotation.x = Math.PI / 2;
    target.add(face);
    const blue = new THREE.Mesh(new THREE.CylinderGeometry(.67,.67,.215,42),material(palette.blue));
    blue.rotation.x = Math.PI / 2;
    blue.position.z = .015;
    target.add(blue);
    const orange = new THREE.Mesh(new THREE.CylinderGeometry(.31,.31,.23,36),material(palette.orange));
    orange.rotation.x = Math.PI / 2;
    orange.position.z = .035;
    target.add(orange);
    const center = new THREE.Mesh(new THREE.CylinderGeometry(.105,.105,.245,24),material(palette.mint));
    center.rotation.x = Math.PI / 2;
    center.position.z = .055;
    target.add(center);
    target.position.set(x,y,z);
    target.scale.setScalar(.78 + (z + 2) * .045);
    addInteractive(targets, face, index, "target");
    group.add(target);
  });
  group.rotation.x = -.08;
}

export default function InteractiveModel({ kind, activeIndex = 0, className = "", title, hint, interactive = true, onSelect }: InteractiveModelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(activeIndex);
  const selectRef = useRef(onSelect);

  useEffect(() => { activeRef.current = activeIndex; }, [activeIndex]);
  useEffect(() => { selectRef.current = onSelect; }, [onSelect]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(kind === "range" ? 38 : 34, 1, .1, 100);
    camera.position.set(0, kind === "range" ? 1.2 : .25, kind === "range" ? 17 : 14);
    const root = new THREE.Group();
    const targets: InteractivePart[] = [];
    scene.add(root);
    if (kind === "locker") buildLocker(root, targets);
    if (kind === "workbench") buildWorkbench(root, targets);
    if (kind === "archive") buildArchive(root, targets);
    if (kind === "routes") buildRoutes(root, targets);
    if (kind === "range") buildRange(root, targets);

    scene.add(new THREE.HemisphereLight(0xfff3d7, 0x28413c, 2.25));
    const key = new THREE.DirectionalLight(0xffdca8, 3.2);
    key.position.set(-4, 7, 9);
    key.castShadow = true;
    scene.add(key);
    const accent = new THREE.PointLight(palette.mint, 5.5, 22);
    accent.position.set(5, 2, 5);
    scene.add(accent);

    const pointer = new THREE.Vector2(5, 5);
    const raycaster = new THREE.Raycaster();
    let pointerX = 0;
    let pointerY = 0;
    let hoveredIndex = -1;
    let frame = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      renderer.setSize(Math.max(1, rect.width), Math.max(1, rect.height), false);
      camera.aspect = Math.max(1, rect.width) / Math.max(1, rect.height);
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    const pick = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      pointerX = pointer.x;
      pointerY = pointer.y;
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(targets, false)[0]?.object as InteractivePart | undefined;
      hoveredIndex = hit?.userData.index ?? -1;
      canvas.style.cursor = hoveredIndex >= 0 && interactive ? "pointer" : "grab";
    };
    const click = (event: PointerEvent) => {
      pick(event);
      if (interactive && hoveredIndex >= 0) selectRef.current?.(hoveredIndex);
    };
    canvas.addEventListener("pointermove", pick);
    canvas.addEventListener("pointerdown", click);

    const tick = (now: number) => {
      const seconds = now * .001;
      root.rotation.y += ((pointerX * .09) - root.rotation.y) * .045;
      root.rotation.x += ((-pointerY * .035) - root.rotation.x) * .04;
      root.position.y = Math.sin(seconds * .7) * .045;

      root.children.forEach((child) => {
        const index = child.userData.index as number | undefined;
        const childKind = child.userData.kind as string | undefined;
        if (index === undefined) return;
        const selected = activeRef.current === index;
        if (childKind === "door") child.rotation.y += ((selected ? -1.72 : 0) - child.rotation.y) * .085;
        if (childKind === "drawer") child.position.z += ((selected ? 1.6 : .44) - child.position.z) * .09;
      });
      if (kind === "workbench") {
        targets.forEach((target) => {
          const selected = target.userData.index === activeRef.current;
          const baseY = typeof target.userData.baseY === "number" ? target.userData.baseY : target.position.y;
          target.userData.baseY = baseY;
          target.position.y += ((baseY + (selected ? .18 : 0)) - target.position.y) * .08;
          target.rotation.z += ((selected ? .08 : 0) - target.rotation.z) * .06;
        });
      }
      if (kind === "routes") {
        targets.forEach((target) => {
          const selected = target.userData.index === activeRef.current;
          const pin = target.parent;
          if (pin) pin.position.z = .32 + (selected ? .22 + Math.sin(seconds * 3) * .06 : 0);
        });
      }
      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      canvas.removeEventListener("pointermove", pick);
      canvas.removeEventListener("pointerdown", click);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((item) => item.dispose());
        }
      });
      renderer.dispose();
    };
  }, [interactive, kind]);

  return (
    <div className={`interactive-model model-${kind} ${className}`}>
      <canvas ref={canvasRef} aria-label={title ?? `Interactive 3D ${kind} model`} />
      {(title || hint) && <div className="model-caption"><strong>{title}</strong><span>{hint}</span></div>}
    </div>
  );
}
