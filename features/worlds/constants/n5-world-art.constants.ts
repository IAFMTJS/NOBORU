import type { ArtLibraryTheme } from "@/lib/assets/art-library-paths";
import { artLibraryPath } from "@/lib/assets/art-library-paths";

/** N5 art pack v1 — staged from Art Library / published WebP (interim until bespoke act slices). */
export const N5_REALM_SILHOUETTE: Record<ArtLibraryTheme, string> = {
  dark: artLibraryPath("world-tree/jlpt-bands/n5/wt_jlpt_n5_dark_v2.png"),
  light: artLibraryPath("world-tree/jlpt-bands/n5/wt_jlpt_n5_light_v2.png"),
};

export const N5_ACT_SLICE_ART: Record<1 | 2 | 3, Record<ArtLibraryTheme, string>> = {
  1: {
    dark: artLibraryPath("backgrounds/trail/bg_trail_bamboo_dark_v1.png"),
    light: artLibraryPath("backgrounds/trail/bg_trail_bamboo_light_v1.png"),
  },
  2: {
    dark: artLibraryPath("backgrounds/trail/bg_trail_light_v1.png"),
    light: artLibraryPath("backgrounds/trail/bg_trail_light_v1.png"),
  },
  3: {
    dark: artLibraryPath("backgrounds/trail/bg_trail_dark_v1.png"),
    light: artLibraryPath("backgrounds/trail/bg_trail_light_v1.png"),
  },
};

export const N5_PORTAL_MATTE: Record<ArtLibraryTheme, string> = {
  dark: artLibraryPath("backgrounds/shrine/bg_shrine_dark_v1.png"),
  light: artLibraryPath("backgrounds/shrine/bg_shrine_light_v1.png"),
};

export const N5_LANDMARK_ICON_BASES: Record<string, string> = {
  "ember-threshold": "icons/icon_node_shrine_rest",
  "script-sanctum": "icons/icon_node_shrine_rest",
  "kana-bridge": "icons/icon_node_mountain_bridge",
  "lantern-hamlet": "icons/icon_node_start_village",
  "market-bend": "icons/icon_node_start_village",
  "forest-torii": "icons/icon_node_torii_gate",
  "kanji-grove": "icons/icon_node_scenic_overlook",
  "first-slope-shrine": "icons/icon_node_shrine_rest",
  "gate-of-ascent": "icons/icon_node_torii_gate",
};
