export type ZoneId = "web" | "algorithm" | "hardware" | "notes" | "travel";

export type LaunchSpec = {
  id: number;
  x: number;
  y: number;
  zone: ZoneId | null;
  power: number;
};

export type FlightModel = LaunchSpec & {
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  velocityX: number;
  velocityY: number;
  gravity: number;
  duration: number;
};

export type FlightSample = {
  x: number;
  y: number;
  angle: number;
  progress: number;
};

export function clamp(value: number, minimum = 0, maximum = 1) {
  return Math.min(maximum, Math.max(minimum, value));
}

export function createFlight(spec: LaunchSpec, width: number, height: number, reducedMotion: boolean): FlightModel {
  const startX = width * 0.5;
  const startY = height * 0.89;
  const targetX = spec.x * width;
  const targetY = spec.y * height;
  const duration = reducedMotion ? 0.14 : 1.02 - spec.power * 0.32;
  const gravity = height * 1.08;

  return {
    ...spec,
    startX,
    startY,
    targetX,
    targetY,
    duration,
    gravity,
    velocityX: (targetX - startX) / duration,
    velocityY: (targetY - startY - 0.5 * gravity * duration * duration) / duration,
  };
}

export function sampleFlight(flight: FlightModel, elapsed: number): FlightSample {
  const time = Math.min(flight.duration, Math.max(0, elapsed));
  const velocityY = flight.velocityY + flight.gravity * time;

  return {
    x: flight.startX + flight.velocityX * time,
    y: flight.startY + flight.velocityY * time + 0.5 * flight.gravity * time * time,
    angle: Math.atan2(velocityY, flight.velocityX),
    progress: clamp(time / flight.duration),
  };
}
