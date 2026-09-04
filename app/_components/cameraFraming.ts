export const IDEAL_LANDSCAPE_ASPECT = 16 / 9;

export function aspectOverflowDistanceScale(aspect: number) {
  const safeAspect = Math.max(aspect, Number.EPSILON);
  return Math.max(1, IDEAL_LANDSCAPE_ASPECT / safeAspect);
}

export function shortSideFitDistanceScale(width: number, height: number, referenceShortSide = 600, maxScale = 1.4) {
  const shortSide = Math.max(Math.min(width,height),Number.EPSILON);
  return Math.min(Math.max(1,referenceShortSide/shortSide),maxScale);
}

export function touchViewportFitDistanceScale(width: number, height: number, aspect: number) {
  return Math.max(aspectOverflowDistanceScale(aspect),shortSideFitDistanceScale(width,height));
}
