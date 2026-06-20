import type { JlptWorldDefinition } from "@/features/worlds/types/world.types";

/** N4 world — Mount N4 foothills band. Self-contained; no cross-world imports. */
export const N4_WORLD: JlptWorldDefinition = {
  id: "n4",
  regionSlugs: ["mount-n4"],
  skeletonZoneIds: ["n4_foothills"],
  entryTrialSlug: "n5-final-trial",
  exitTrialSlug: "n4-final-trial",
  nextWorldId: "n3",
  portalLabel: "Portal to N3 Trunk",
  portalDescription: "The trunk rises — step through to the next ring.",
  theme: {
    accentColor: "#E8A317",
    accentGlow: "rgba(232, 163, 23, 0.55)",
    backgroundLight: "#EDE4CE",
    backgroundDark: "#101820",
    label: "N4 Foothills",
    subtitle: "Lower Ascent",
  },
  art: {
    heroFileBase: "wt_jlpt_n4",
    heroAnchor: "bottom",
  },
  canvasMinHeightVh: 110,
  audioThemeId: "world_n4_foothills",
};
