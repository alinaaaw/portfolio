export const IDEAL_LANDSCAPE_ASPECT = 16 / 9;

export function aspectOverflowDistanceScale(aspect: number) {
  const safeAspect = Math.max(aspect, Number.EPSILON);
  return Math.max(1, IDEAL_LANDSCAPE_ASPECT / safeAspect);
}
