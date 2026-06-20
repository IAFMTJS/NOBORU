import type { JlptWorldDefinition } from "@/features/worlds/types/world.types";

/** N2 world — Mount N2 canopy band. Self-contained; no cross-world imports. */
export const N2_WORLD: JlptWorldDefinition = {
  id: "n2",
  regionSlugs: ["mount-n2"],
  skeletonZoneIds: ["n2_canopy"],
  entryTrialSlug: "n3-final-trial",
  exitTrialSlug: "n2-final-trial",
  nextWorldId: "n1",
  portalLabel: "Portal to N1 Crown",
  portalDescription: "Ascend toward the celestial crown.",
  theme: {
    accentColor: "#4A9FD4",
    accentGlow: "rgba(74, 159, 212, 0.55)",
    backgroundLight: "#E0E8F0",
    backgroundDark: "#0A1218",
    label: "N2 Canopy",
    subtitle: "Open Sky Branch",
  },
  art: {
    heroFileBase: "wt_jlpt_n2",
    heroAnchor: "center",
  },
  canvasMinHeightVh: 115,
  audioThemeId: "world_n2_canopy",
};
