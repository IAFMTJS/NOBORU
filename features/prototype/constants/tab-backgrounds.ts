import type { PrototypeScreenTab } from "@/features/prototype/constants/mock-data";
import { PROTOTYPE_BACKGROUNDS } from "@/lib/assets/art-library-paths";

export type PrototypeTabBackground = {
  src: string;
  scrimClassName: string;
};

/** One full-viewport background per prototype tab. */
export const PROTOTYPE_TAB_BACKGROUNDS: Record<PrototypeScreenTab, PrototypeTabBackground | null> = {
  journey: null,
  camp: {
    src: PROTOTYPE_BACKGROUNDS.camp.light,
    scrimClassName: "bg-gradient-to-b from-background/20 via-background/35 to-background/65",
  },
  study: {
    src: PROTOTYPE_BACKGROUNDS.study.light,
    scrimClassName: "bg-gradient-to-b from-background/25 via-background/40 to-background/70",
  },
  bag: {
    src: PROTOTYPE_BACKGROUNDS.camp.light,
    scrimClassName: "bg-gradient-to-b from-background/30 via-background/45 to-background/70",
  },
  profile: {
    src: PROTOTYPE_BACKGROUNDS.shrine.light,
    scrimClassName: "bg-gradient-to-b from-background/25 via-background/45 to-background/75",
  },
  kit: {
    src: PROTOTYPE_BACKGROUNDS.core.light,
    scrimClassName: "bg-background/35",
  },
};
