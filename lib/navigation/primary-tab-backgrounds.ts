import type { ArtLibraryTheme } from "@/lib/assets/art-library-paths";
import { PROTOTYPE_BACKGROUNDS } from "@/lib/assets/art-library-paths";
import { isNavActive } from "@/lib/navigation/is-nav-active";
import { PRIMARY_NAV_ITEMS } from "@/lib/navigation/primary-nav";
import type { ImmersiveNavTab } from "@/lib/navigation/immersive-nav.constants";

export type PrimaryTabBackground = {
  src: string;
  scrimClassName: string;
};

type BackgroundAssetPair = {
  light: string;
  dark: string;
};

const TAB_BACKGROUND_ASSETS: Record<Exclude<ImmersiveNavTab, "journey">, BackgroundAssetPair> = {
  camp: PROTOTYPE_BACKGROUNDS.camp,
  study: PROTOTYPE_BACKGROUNDS.study,
  bag: PROTOTYPE_BACKGROUNDS.camp,
  profile: PROTOTYPE_BACKGROUNDS.shrine,
};

const TAB_SCRIMS: Record<Exclude<ImmersiveNavTab, "journey">, string> = {
  camp: "bg-gradient-to-b from-background/20 via-background/35 to-background/65",
  study: "bg-gradient-to-b from-background/25 via-background/40 to-background/70",
  bag: "bg-gradient-to-b from-background/30 via-background/45 to-background/70",
  profile: "bg-gradient-to-b from-background/25 via-background/45 to-background/75",
};

export function resolvePrimaryTabBackground(
  pathname: string | null,
  theme: ArtLibraryTheme = "light",
): PrimaryTabBackground | null {
  if (!pathname) return null;

  for (const item of PRIMARY_NAV_ITEMS) {
    if (!isNavActive(pathname, item.href)) continue;
    if (item.navTab === "journey") return null;
    const assets = TAB_BACKGROUND_ASSETS[item.navTab];
    return {
      src: assets[theme],
      scrimClassName: TAB_SCRIMS[item.navTab],
    };
  }

  return null;
}

/** @deprecated Use resolvePrimaryTabBackground — kept for imports. */
export const PRIMARY_TAB_BACKGROUNDS: Record<
  Exclude<ImmersiveNavTab, "journey">,
  PrimaryTabBackground
> = {
  camp: {
    src: PROTOTYPE_BACKGROUNDS.camp.light,
    scrimClassName: TAB_SCRIMS.camp,
  },
  study: {
    src: PROTOTYPE_BACKGROUNDS.study.light,
    scrimClassName: TAB_SCRIMS.study,
  },
  bag: {
    src: PROTOTYPE_BACKGROUNDS.camp.light,
    scrimClassName: TAB_SCRIMS.bag,
  },
  profile: {
    src: PROTOTYPE_BACKGROUNDS.shrine.light,
    scrimClassName: TAB_SCRIMS.profile,
  },
};
