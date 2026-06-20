import type { YamaExpression } from "@/features/yama/types/yama.types";

/** Primary destinations per VISUAL MD FILES Doc 01 — Journey · Tree · Camp · Study · Bag · Profile */
export type ImmersiveNavTab = "journey" | "tree" | "camp" | "study" | "bag" | "profile";

export type ImmersiveNavTheme = "trail" | "campfire" | "study" | "backpack" | "journal";

export type ImmersiveNavTabConfig = {
  tab: ImmersiveNavTab;
  theme: ImmersiveNavTheme;
  skinId: string;
  barTexturePath: string;
  mascotExpression: YamaExpression;
  /** Pill background when this tab is active */
  barSurfaceClass: string;
  barBorderClass: string;
  activeLabelClass: string;
  activeGlowClass: string;
  activeIconDropShadow: string;
  activeIconRingClass: string;
  activeIndicatorClass: string;
  particleClass: string;
};

export const IMMERSIVE_NAV_TAB_CONFIG: Record<ImmersiveNavTab, ImmersiveNavTabConfig> = {
  journey: {
    tab: "journey",
    theme: "trail",
    skinId: "trail_mist",
    barTexturePath: "",
    mascotExpression: "adventure",
    barSurfaceClass:
      "bg-gradient-to-r from-stone-950/95 via-amber-950/88 to-stone-950/95 shadow-[inset_0_1px_0_rgba(246,174,45,0.14)]",
    barBorderClass: "border-amber-700/35",
    activeLabelClass: "text-amber-300",
    activeGlowClass: "shadow-[0_0_20px_rgba(246,174,45,0.4)]",
    activeIconDropShadow: "drop-shadow-[0_0_8px_rgba(246,174,45,0.6)]",
    activeIconRingClass: "ring-amber-400/50 bg-amber-500/15",
    activeIndicatorClass: "bg-amber-400 shadow-[0_0_8px_rgba(246,174,45,0.7)]",
    particleClass: "bg-warning/55",
  },
  tree: {
    tab: "tree",
    theme: "trail",
    skinId: "bamboo_grove",
    barTexturePath: "",
    mascotExpression: "adventure",
    barSurfaceClass:
      "bg-gradient-to-r from-stone-950/95 via-emerald-950/88 to-stone-950/95 shadow-[inset_0_1px_0_rgba(120,180,120,0.14)]",
    barBorderClass: "border-emerald-700/35",
    activeLabelClass: "text-emerald-200",
    activeGlowClass: "shadow-[0_0_20px_rgba(120,180,120,0.35)]",
    activeIconDropShadow: "drop-shadow-[0_0_8px_rgba(120,180,120,0.55)]",
    activeIconRingClass: "ring-emerald-400/45 bg-emerald-500/15",
    activeIndicatorClass: "bg-emerald-400 shadow-[0_0_8px_rgba(120,180,120,0.6)]",
    particleClass: "bg-success/45",
  },
  camp: {
    tab: "camp",
    theme: "campfire",
    skinId: "ember_night",
    barTexturePath: "",
    mascotExpression: "encouraging",
    barSurfaceClass:
      "bg-gradient-to-r from-stone-950/95 via-stone-900/92 to-stone-950/95 shadow-[inset_0_1px_0_rgba(246,174,45,0.12)]",
    barBorderClass: "border-amber-700/35",
    activeLabelClass: "text-amber-300",
    activeGlowClass: "shadow-[0_0_20px_rgba(246,174,45,0.35)]",
    activeIconDropShadow: "drop-shadow-[0_0_6px_rgba(246,174,45,0.55)]",
    activeIconRingClass: "ring-amber-400/45 bg-amber-500/15",
    activeIndicatorClass: "bg-amber-400 shadow-[0_0_8px_rgba(246,174,45,0.65)]",
    particleClass: "bg-warning/60",
  },
  study: {
    tab: "study",
    theme: "study",
    skinId: "study_scroll",
    barTexturePath: "",
    mascotExpression: "studying",
    barSurfaceClass:
      "bg-gradient-to-r from-emerald-950/95 via-green-950/90 to-emerald-950/95 shadow-[inset_0_1px_0_rgba(74,222,128,0.1)]",
    barBorderClass: "border-emerald-600/35",
    activeLabelClass: "text-emerald-300",
    activeGlowClass: "shadow-[0_0_18px_rgba(47,191,113,0.3)]",
    activeIconDropShadow: "drop-shadow-[0_0_6px_rgba(74,222,128,0.5)]",
    activeIconRingClass: "ring-emerald-400/45 bg-emerald-500/15",
    activeIndicatorClass: "bg-emerald-400 shadow-[0_0_8px_rgba(74,222,128,0.55)]",
    particleClass: "bg-success/50",
  },
  bag: {
    tab: "bag",
    theme: "backpack",
    skinId: "travel_pack",
    barTexturePath: "",
    mascotExpression: "adventure",
    barSurfaceClass:
      "bg-gradient-to-r from-stone-950/95 via-amber-950/90 to-stone-950/95 shadow-[inset_0_1px_0_rgba(246,174,45,0.14)]",
    barBorderClass: "border-amber-700/35",
    activeLabelClass: "text-amber-300",
    activeGlowClass: "shadow-[0_0_20px_rgba(246,174,45,0.34)]",
    activeIconDropShadow: "drop-shadow-[0_0_7px_rgba(246,174,45,0.56)]",
    activeIconRingClass: "ring-amber-400/45 bg-amber-500/15",
    activeIndicatorClass: "bg-amber-400 shadow-[0_0_8px_rgba(246,174,45,0.6)]",
    particleClass: "bg-warning/55",
  },
  profile: {
    tab: "profile",
    theme: "journal",
    skinId: "stone_path",
    barTexturePath: "",
    mascotExpression: "victorious",
    barSurfaceClass:
      "bg-gradient-to-r from-amber-950/95 via-stone-900/92 to-amber-950/95 shadow-[inset_0_1px_0_rgba(250,204,21,0.1)]",
    barBorderClass: "border-yellow-600/30",
    activeLabelClass: "text-yellow-200",
    activeGlowClass: "shadow-[0_0_16px_rgba(250,204,21,0.25)]",
    activeIconDropShadow: "drop-shadow-[0_0_6px_rgba(250,204,21,0.45)]",
    activeIconRingClass: "ring-yellow-400/35 bg-yellow-500/10",
    activeIndicatorClass: "bg-yellow-300 shadow-[0_0_8px_rgba(250,204,21,0.5)]",
    particleClass: "bg-primary/35",
  },
};
