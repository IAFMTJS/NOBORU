import type { JlptWorldDefinition } from "@/features/worlds/types/world.types";

/** N3 world — Mount N3 trunk rings. Self-contained; no cross-world imports. */
export const N3_WORLD: JlptWorldDefinition = {
  id: "n3",
  regionSlugs: ["mount-n3"],
  skeletonZoneIds: ["n3_trunk_1", "n3_trunk_2", "n3_trunk_3"],
  entryTrialSlug: "n4-final-trial",
  exitTrialSlug: "n3-final-trial",
  nextWorldId: "n2",
  portalLabel: "Portal to N2 Canopy",
  portalDescription: "Break through the canopy veil into open sky.",
  theme: {
    accentColor: "#5EAA5A",
    accentGlow: "rgba(94, 170, 90, 0.55)",
    backgroundLight: "#E5E8D8",
    backgroundDark: "#0E1518",
    label: "N3 Trunk",
    subtitle: "Three Rings of Growth",
  },
  art: {
    heroFileBase: "wt_jlpt_n3",
    heroAnchor: "center",
  },
  canvasMinHeightVh: 140,
  audioThemeId: "world_n3_trunk",
};
