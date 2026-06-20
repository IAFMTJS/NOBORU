import type { JlptWorldDefinition } from "@/features/worlds/types/world.types";

/** N1 world — Celestial crown through Master Summit. Self-contained; no cross-world imports. */
export const N1_WORLD: JlptWorldDefinition = {
  id: "n1",
  regionSlugs: ["mount-n1", "master-summit"],
  skeletonZoneIds: ["n1_celestial"],
  entryTrialSlug: "n2-final-trial",
  exitTrialSlug: "n1-final-trial",
  nextWorldId: null,
  portalLabel: "Summit Gate",
  portalDescription: "You have reached the crown of the World Tree.",
  theme: {
    accentColor: "#8B5CF6",
    accentGlow: "rgba(139, 92, 246, 0.55)",
    backgroundLight: "#E8E4F0",
    backgroundDark: "#0C0E18",
    label: "N1 Celestial Crown",
    subtitle: "Master Summit",
  },
  art: {
    heroFileBase: "wt_jlpt_n1",
    heroAnchor: "top",
  },
  canvasMinHeightVh: 130,
  audioThemeId: "world_n1_celestial",
};
