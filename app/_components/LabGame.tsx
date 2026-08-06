"use client";

import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useRef, useState } from "react";

export type ZoneId = "computer" | "drawer" | "notebook" | "books" | "board" | "fieldcase";

type LabGameProps = {
  active: boolean;
  viewing: ZoneId | null;
  discovered: ZoneId[];
  faxReady: boolean;
  onHover: (zone: ZoneId | null) => void;
  onInspect: (zone: ZoneId) => void;
};

const zones: { id: ZoneId; index: string; label: string; x: number; y: number }[] = [
  { id:"computer",index:"01",label:"COMPUTER",x:13.2,y:24 },
  { id:"drawer",index:"02",label:"DESK DRAWER",x:35.4,y:55.5 },
  { id:"board",index:"05",label:"NOTE BOARD",x:54.5,y:20.5 },
  { id:"books",index:"04",label:"BOOKSHELF",x:81.7,y:27 },
  { id:"notebook",index:"03",label:"RESEARCH BOOK",x:72.5,y:69 },
  { id:"fieldcase",index:"06",label:"FIELD CASE",x:18.2,y:69.5 },
];

export default function LabGame({ active, discovered, faxReady, onHover, onInspect }: LabGameProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const inspectRef = useRef(onInspect);
  const dragRef = useRef({ active:false,x:0,y:0,offsetX:0,offsetY:0 });
  const timerRef = useRef<number | null>(null);
  const [requested,setRequested] = useState<ZoneId|null>(null);

  useEffect(() => { inspectRef.current = onInspect; },[onInspect]);
  useEffect(() => () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
  },[]);

  const setLook = (x:number,y:number) => {
    stageRef.current?.style.setProperty("--look-x",`${x}px`);
    stageRef.current?.style.setProperty("--look-y",`${y}px`);
  };

  const enterZone = (zone: ZoneId) => {
    if (!active || requested) return;
    setRequested(zone);
    const target = zones.find((item) => item.id===zone);
    if (target && stageRef.current) {
      stageRef.current.style.setProperty("--focus-x",`${target.x}%`);
      stageRef.current.style.setProperty("--focus-y",`${target.y}%`);
    }
    timerRef.current = window.setTimeout(() => {
      inspectRef.current(zone);
      setRequested(null);
    },620);
  };

  const pointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!active || (event.target as HTMLElement).closest("button")) return;
    dragRef.current = { active:true,x:event.clientX,y:event.clientY,offsetX:dragRef.current.offsetX,offsetY:dragRef.current.offsetY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const pointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) {
      const rect = event.currentTarget.getBoundingClientRect();
      setLook(((event.clientX-rect.left)/rect.width-.5)*-10,((event.clientY-rect.top)/rect.height-.5)*-7);
      return;
    }
    const nextX = Math.max(-22,Math.min(22,dragRef.current.offsetX+event.clientX-dragRef.current.x));
    const nextY = Math.max(-13,Math.min(13,dragRef.current.offsetY+event.clientY-dragRef.current.y));
    dragRef.current.offsetX = nextX;
    dragRef.current.offsetY = nextY;
    dragRef.current.x = event.clientX;
    dragRef.current.y = event.clientY;
    setLook(nextX,nextY);
  };
  const pointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    dragRef.current.active = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const style = {
    "--focus-x":"50%",
    "--focus-y":"50%",
    "--look-x":"0px",
    "--look-y":"0px",
  } as CSSProperties;

  return (
    <div className={`lab-game photo-lab ${faxReady?"fax-ready":""}`}>
      <div
        ref={stageRef}
        className={`photo-stage ${requested?`photo-focus focus-${requested}`:""}`}
        style={style}
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={pointerUp}
        onPointerCancel={pointerUp}
        onPointerLeave={(event) => { pointerUp(event); onHover(null); }}
      >
        <img src="/lab-workspace-v2.png" alt="A lived-in late-night laboratory with a computer, bookshelf, worktable, drawer, note board, and field case" draggable={false} />
        <div className="photo-light" aria-hidden="true" />
        {zones.map((zone) => (
          <button
            key={zone.id}
            className={`zone-hotspot zone-${zone.id} ${discovered.includes(zone.id)?"found":""}`}
            style={{ left:`${zone.x}%`,top:`${zone.y}%` }}
            onPointerEnter={() => onHover(zone.id)}
            onPointerLeave={() => onHover(null)}
            onClick={() => enterZone(zone.id)}
            aria-label={`Inspect ${zone.label.toLowerCase()}`}
          >
            <i />
            <span><b>{zone.index}</b>{zone.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
