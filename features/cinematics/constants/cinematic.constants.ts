export type CinematicSlug =
  | "hiragana_complete"
  | "katakana_complete"
  | "n5_complete"
  | "n4_complete"
  | "streak_30"
  | "evolution_unlock";

export type CinematicPanel = {
  imageAlt: string;
  caption: string;
  durationMs: number;
};

export const CINEMATIC_SCRIPTS: Record<CinematicSlug, CinematicPanel[]> = {
  hiragana_complete: [
    {
      imageAlt: "Hiragana valley sunrise",
      caption: "The hiragana foothills lie behind you. The forest beckons.",
      durationMs: 4000,
    },
  ],
  katakana_complete: [
    {
      imageAlt: "Forest canopy",
      caption: "Katakana mastered. Deeper trails await.",
      durationMs: 4000,
    },
  ],
  n5_complete: [
    {
      imageAlt: "Mount N5 summit",
      caption: "N5 conquered. The ascent continues.",
      durationMs: 5000,
    },
  ],
  n4_complete: [
    {
      imageAlt: "Mount N4 ridge",
      caption: "N4 cleared. Higher peaks call.",
      durationMs: 5000,
    },
  ],
  streak_30: [
    {
      imageAlt: "Campfire at base camp",
      caption: "Thirty days on the trail. Yama is proud.",
      durationMs: 4000,
    },
  ],
  evolution_unlock: [
    {
      imageAlt: "Yama evolution",
      caption: "Yama has evolved. A new form walks beside you.",
      durationMs: 5000,
    },
  ],
};
