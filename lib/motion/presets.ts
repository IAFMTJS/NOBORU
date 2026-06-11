export const motionDurations = {
  fast: 0.15,
  standard: 0.25,
  complex: 0.35,
} as const;

export const fadeInUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
};

export const trailNodeReveal = {
  initial: { opacity: 0, x: -6 },
  animate: { opacity: 1, x: 0 },
};
