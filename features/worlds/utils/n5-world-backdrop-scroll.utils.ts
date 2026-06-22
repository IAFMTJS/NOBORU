import {
  N5_ACT_BACKDROP_PAN,
  N5_ACT_BLEND_ZONES,
} from "@/features/worlds/constants/n5-world.constants";

export type N5ActBackdropLayer = {
  opacity: number;
  objectXPercent: number;
  objectYPercent: number;
  scale: number;
  localProgress: number;
};

export type N5BackdropScrollState = {
  viewportCenterYPercent: number;
  acts: Record<1 | 2 | 3, N5ActBackdropLayer>;
  silhouetteOffsetPercent: number;
  mistOffsetPercent: number;
};

export function smoothstep(edge0: number, edge1: number, value: number): number {
  if (edge0 === edge1) {
    return value >= edge1 ? 1 : 0;
  }
  const t = Math.max(0, Math.min(1, (value - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function inverseLerp(start: number, end: number, value: number): number {
  if (start === end) return 0;
  return Math.max(0, Math.min(1, (start - value) / (start - end)));
}

function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

function resolveActOpacity(
  viewportCenterYPercent: number,
  zone: (typeof N5_ACT_BLEND_ZONES)[number],
): number {
  const y = viewportCenterYPercent;
  let opacity = 1;

  if ("fadeInBelow" in zone && zone.fadeInBelow) {
    opacity *= 1 - smoothstep(zone.fadeInBelow.start, zone.fadeInBelow.end, y);
  }
  if ("fadeOutAbove" in zone && zone.fadeOutAbove) {
    opacity *= smoothstep(zone.fadeOutAbove.start, zone.fadeOutAbove.end, y);
  }

  return Math.max(0, Math.min(1, opacity));
}

function resolveActLayer(
  viewportCenterYPercent: number,
  actIndex: 1 | 2 | 3,
): N5ActBackdropLayer {
  const zone = N5_ACT_BLEND_ZONES.find((entry) => entry.actIndex === actIndex)!;
  const pan = N5_ACT_BACKDROP_PAN[actIndex];
  const localProgress = inverseLerp(zone.panStart, zone.panEnd, viewportCenterYPercent);
  const easedProgress = smoothstep(0, 1, localProgress);
  const wave = Math.sin(easedProgress * Math.PI);

  return {
    opacity: resolveActOpacity(viewportCenterYPercent, zone),
    objectXPercent: lerp(pan.xStart, pan.xEnd, easedProgress),
    objectYPercent: lerp(pan.yStart, pan.yEnd, easedProgress),
    scale: lerp(pan.scaleStart, pan.scaleEnd, easedProgress) + wave * pan.scaleWave,
    localProgress: easedProgress,
  };
}

/** Derive backdrop layer transforms from scroll container metrics. */
export function computeN5BackdropScrollState(
  scrollTop: number,
  scrollHeight: number,
  clientHeight: number,
): N5BackdropScrollState {
  const maxScroll = Math.max(scrollHeight - clientHeight, 1);
  const viewportCenterPx = scrollTop + clientHeight * 0.5;
  const viewportCenterYPercent = (viewportCenterPx / Math.max(scrollHeight, 1)) * 100;
  const globalProgress = scrollTop / maxScroll;

  return {
    viewportCenterYPercent,
    acts: {
      1: resolveActLayer(viewportCenterYPercent, 1),
      2: resolveActLayer(viewportCenterYPercent, 2),
      3: resolveActLayer(viewportCenterYPercent, 3),
    },
    silhouetteOffsetPercent: (globalProgress - 0.5) * 10,
    mistOffsetPercent: globalProgress * 14,
  };
}

export const N5_BACKDROP_IDLE_STATE: N5BackdropScrollState = computeN5BackdropScrollState(
  0,
  1000,
  800,
);
