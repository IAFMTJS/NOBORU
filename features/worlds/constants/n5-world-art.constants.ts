import type { ArtLibraryTheme } from "@/lib/assets/art-library-paths";
import { artLibraryPath } from "@/lib/assets/art-library-paths";

/** N5 art pack v1 — bespoke Realm of First Light slices from Art Library. */
export const N5_REALM_SILHOUETTE: Record<ArtLibraryTheme, string> = {
  dark: artLibraryPath("backgrounds/n5/bg_n5_realm_silhouette_dark_v1.png"),
  light: artLibraryPath("backgrounds/n5/bg_n5_realm_silhouette_light_v1.png"),
};

export const N5_ACT_SLICE_ART: Record<1 | 2 | 3, Record<ArtLibraryTheme, string>> = {
  1: {
    dark: artLibraryPath("backgrounds/n5/bg_n5_act1_dark_v1.png"),
    light: artLibraryPath("backgrounds/n5/bg_n5_act1_light_v1.png"),
  },
  2: {
    dark: artLibraryPath("backgrounds/n5/bg_n5_act2_dark_v1.png"),
    light: artLibraryPath("backgrounds/n5/bg_n5_act2_light_v1.png"),
  },
  3: {
    dark: artLibraryPath("backgrounds/n5/bg_n5_act3_dark_v1.png"),
    light: artLibraryPath("backgrounds/n5/bg_n5_act3_light_v1.png"),
  },
};

export const N5_PORTAL_MATTE: Record<ArtLibraryTheme, string> = {
  dark: artLibraryPath("backgrounds/n5/bg_portal_n5_n4_dark_v1.png"),
  light: artLibraryPath("backgrounds/n5/bg_portal_n5_n4_light_v1.png"),
};

/** Base path without theme — append `_${theme}_v1` when resolving. */
export const N5_LANDMARK_ICON_BASES: Record<string, string> = {
  "ember-threshold": "icons/landmarks/n5/icon_landmark_n5_ember-threshold",
  "script-sanctum": "icons/landmarks/n5/icon_landmark_n5_script-sanctum",
  "kana-bridge": "icons/landmarks/n5/icon_landmark_n5_kana-bridge",
  "lantern-hamlet": "icons/landmarks/n5/icon_landmark_n5_lantern-hamlet",
  "market-bend": "icons/landmarks/n5/icon_landmark_n5_market-bend",
  "forest-torii": "icons/landmarks/n5/icon_landmark_n5_forest-torii",
  "kanji-grove": "icons/landmarks/n5/icon_landmark_n5_kanji-grove",
  "first-slope-shrine": "icons/landmarks/n5/icon_landmark_n5_first-slope-shrine",
  "gate-of-ascent": "icons/landmarks/n5/icon_landmark_n5_gate-of-ascent",
};
