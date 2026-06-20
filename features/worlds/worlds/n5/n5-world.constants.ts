import type { JlptWorldDefinition } from "@/features/worlds/types/world.types";

/** N5 world — Deep Roots through Mount N5. Self-contained; no cross-world imports. */
export const N5_WORLD: JlptWorldDefinition = {
  id: "n5",
  regionSlugs: ["foothills", "forest-trail", "mount-n5"],
  skeletonZoneIds: ["deep_roots", "n5_roots"],
  entryTrialSlug: null,
  exitTrialSlug: "n5-final-trial",
  nextWorldId: "n4",
  portalLabel: "Portal to N4 Foothills",
  portalDescription: "Cross into the next realm of your ascent.",
  theme: {
    accentColor: "#D64045",
    accentGlow: "rgba(214, 64, 69, 0.55)",
    backgroundLight: "#E9E1D0",
    backgroundDark: "#0D1320",
    label: "N5 Roots",
    subtitle: "Deep Root Network",
  },
  art: {
    heroFileBase: "wt_jlpt_n5",
    heroAnchor: "bottom",
  },
  canvasMinHeightVh: 420,
  audioThemeId: "world_n5_roots",
};
