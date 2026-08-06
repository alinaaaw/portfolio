"use client";

import { useCallback, useEffect, useRef } from "react";
import { createFlight, sampleFlight, type FlightModel, type FlightSample, type LaunchSpec } from "./archery-physics";

type Arrow = {
  flight: FlightModel;
  launchedAt: number;
  impactedAt: number | null;
  sample: FlightSample;
  trail: Array<{ x: number; y: number }>;
};

type World = {
  active: boolean;
  drawing: boolean;
  tension: number;
  aimX: number;
  aimY: number;
  width: number;
  height: number;
  arrows: Arrow[];
  reloadUntil: number;
};

type ImpactHandler = (shot: LaunchSpec) => void;

function drawArrow(context: CanvasRenderingContext2D, arrow: Arrow, now: number) {
  const embeddedAge = arrow.impactedAt === null ? 0 : now - arrow.impactedAt;
  const wobble = arrow.impactedAt === null
    ? 0
    : Math.sin(embeddedAge * 0.055) * Math.exp(-embeddedAge / 240) * 0.2;
  const angle = arrow.sample.angle + wobble;
  const length = Math.max(48, Math.min(78, arrow.flight.duration * 82));

  if (arrow.trail.length > 1 && arrow.impactedAt === null) {
    context.save();
    context.beginPath();
    context.moveTo(arrow.trail[0].x, arrow.trail[0].y);
    for (const point of arrow.trail.slice(1)) context.lineTo(point.x, point.y);
    context.strokeStyle = "rgba(247, 244, 234, 0.2)";
    context.lineWidth = 1;
    context.stroke();
    context.restore();
  }

  context.save();
  context.translate(arrow.sample.x, arrow.sample.y);
  context.rotate(angle);
  context.strokeStyle = "#f7f4ea";
  context.lineWidth = 3;
  context.lineCap = "round";
  context.beginPath();
  context.moveTo(-length, 0);
  context.lineTo(2, 0);
  context.stroke();

  context.fillStyle = "#e9664a";
  context.beginPath();
  context.moveTo(7, 0);
  context.lineTo(-3, -6);
  context.lineTo(-3, 6);
  context.closePath();
  context.fill();

  context.strokeStyle = "#c7e86a";
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(-length + 8, 0);
  context.lineTo(-length - 2, -7);
  context.moveTo(-length + 8, 0);
  context.lineTo(-length - 2, 7);
  context.stroke();
  context.restore();

  if (arrow.impactedAt !== null && embeddedAge < 620) {
    const progress = embeddedAge / 620;
    context.save();
    context.beginPath();
    context.arc(arrow.sample.x, arrow.sample.y, 12 + progress * 54, 0, Math.PI * 2);
    context.strokeStyle = `rgba(199, 232, 106, ${0.8 * (1 - progress)})`;
    context.lineWidth = 2;
    context.stroke();
    context.restore();
  }
}

function drawBow(context: CanvasRenderingContext2D, world: World, now: number) {
  if (!world.active) return;

  const originX = world.width * 0.5;
  const originY = world.height * 0.9;
  const aimX = world.aimX * world.width;
  const aimY = world.aimY * world.height;
  const angle = Math.atan2(aimY - originY, aimX - originX);
  const scale = Math.max(0.72, Math.min(1.08, world.width / 1050));
  const pull = world.drawing ? world.tension * 48 : 0;
  const showNockedArrow = now >= world.reloadUntil;

  context.save();
  context.translate(originX, originY);
  context.rotate(angle);
  context.scale(scale, scale);

  context.strokeStyle = "#8b5a3b";
  context.lineWidth = 9;
  context.lineCap = "round";
  context.beginPath();
  context.moveTo(0, -86);
  context.quadraticCurveTo(46 - world.tension * 7, 0, 0, 86);
  context.stroke();

  context.strokeStyle = "rgba(247, 244, 234, 0.92)";
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(0, -86);
  context.lineTo(-pull, 0);
  context.lineTo(0, 86);
  context.stroke();

  context.fillStyle = "#101827";
  context.fillRect(25, -10, 19, 20);

  if (showNockedArrow) {
    context.strokeStyle = "#f7f4ea";
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(-pull - 18, 0);
    context.lineTo(105, 0);
    context.stroke();
    context.fillStyle = "#e9664a";
    context.beginPath();
    context.moveTo(114, 0);
    context.lineTo(102, -6);
    context.lineTo(102, 6);
    context.closePath();
    context.fill();
  }

  if (world.drawing) {
    context.strokeStyle = `rgba(199, 232, 106, ${0.3 + world.tension * 0.55})`;
    context.lineWidth = 1;
    context.setLineDash([5, 7]);
    context.beginPath();
    context.moveTo(112, 0);
    context.lineTo(Math.hypot(aimX - originX, aimY - originY) / scale, 0);
    context.stroke();
  }

  context.restore();
}

function drawAtmosphere(context: CanvasRenderingContext2D, world: World, now: number) {
  if (!world.active) return;
  context.save();
  for (let index = 0; index < 12; index += 1) {
    const cycle = (now * (0.012 + index * 0.00035) + index * 173) % (world.width + 240);
    const x = cycle - 120;
    const y = world.height * (0.2 + ((index * 37) % 62) / 100);
    const length = 18 + (index % 4) * 12;
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + length, y + Math.sin(now * 0.001 + index) * 2);
    context.strokeStyle = `rgba(247, 244, 234, ${0.07 + (index % 3) * 0.025})`;
    context.lineWidth = 1;
    context.stroke();
  }
  context.restore();
}

export function useArcheryEngine(onImpact: ImpactHandler) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const impactRef = useRef(onImpact);
  const reducedMotionRef = useRef(false);
  const worldRef = useRef<World>({
    active: false,
    drawing: false,
    tension: 0,
    aimX: 0.5,
    aimY: 0.35,
    width: 1,
    height: 1,
    arrows: [],
    reloadUntil: 0,
  });

  useEffect(() => {
    impactRef.current = onImpact;
  }, [onImpact]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const world = worldRef.current;
    let frame = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const density = Math.min(window.devicePixelRatio || 1, 2);
      world.width = Math.max(1, rect.width);
      world.height = Math.max(1, rect.height);
      canvas.width = Math.round(world.width * density);
      canvas.height = Math.round(world.height * density);
      context.setTransform(density, 0, 0, density, 0, 0);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    const tick = (now: number) => {
      context.clearRect(0, 0, world.width, world.height);
      drawAtmosphere(context, world, now);

      for (const arrow of world.arrows) {
        if (arrow.impactedAt === null) {
          const elapsed = (now - arrow.launchedAt) / 1000;
          arrow.sample = sampleFlight(arrow.flight, elapsed);
          arrow.trail.push({ x: arrow.sample.x, y: arrow.sample.y });
          if (arrow.trail.length > 9) arrow.trail.shift();

          if (arrow.sample.progress >= 1) {
            arrow.impactedAt = now;
            arrow.sample.x = arrow.flight.targetX;
            arrow.sample.y = arrow.flight.targetY;
            impactRef.current(arrow.flight);
          }
        }
        drawArrow(context, arrow, now);
      }

      drawBow(context, world, now);
      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, []);

  const setActive = useCallback((active: boolean) => {
    worldRef.current.active = active;
  }, []);

  const setAim = useCallback((x: number, y: number) => {
    worldRef.current.aimX = x;
    worldRef.current.aimY = y;
  }, []);

  const setDraw = useCallback((drawing: boolean, tension: number) => {
    worldRef.current.drawing = drawing;
    worldRef.current.tension = tension;
  }, []);

  const launch = useCallback((spec: LaunchSpec) => {
    const world = worldRef.current;
    const flight = createFlight(spec, world.width, world.height, reducedMotionRef.current);
    world.arrows = [...world.arrows.slice(-7), {
      flight,
      launchedAt: performance.now(),
      impactedAt: null,
      sample: sampleFlight(flight, 0),
      trail: [],
    }];
    world.drawing = false;
    world.tension = 0;
    world.reloadUntil = performance.now() + 360;
  }, []);

  return { canvasRef, launch, setActive, setAim, setDraw };
}
