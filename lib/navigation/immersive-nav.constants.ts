import type { YamaExpression } from "@/features/yama/types/yama.types";

/** Primary destinations per VISUAL MD FILES Doc 01 — Journey · Camp · Study · Bag · Profile */
export type ImmersiveNavTab = "journey" | "camp" | "study" | "bag" | "profile";

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
    barTexturePath: "/art/ui/navbars/nav-moonlit-journey-active-journey.webp",
    mascotExpression: "adventure",
    barSurfaceClass:
      "bg-gradient-to-r from-slate-950/95 via-indigo-950/90 to-slate-950/95 shadow-[inset_0_1px_0_rgba(96,165,250,0.12)]",
    barBorderClass: "border-sky-600/35",
    activeLabelClass: "text-sky-300",
    activeGlowClass: "shadow-[0_0_20px_rgba(56,189,248,0.35)]",
    activeIconDropShadow: "drop-shadow-[0_0_6px_rgba(56,189,248,0.55)]",
    activeIconRingClass: "ring-sky-400/45 bg-sky-500/15",
    activeIndicatorClass: "bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.65)]",
    particleClass: "bg-primary/50",
  },
  camp: {
    tab: "camp",
    theme: "campfire",
    skinId: "ember_night",
    barTexturePath: "/art/ui/navbars/nav-ember-camp-active-camp.webp",
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
    barTexturePath: "/art/ui/navbars/nav-app-dark-active-study.webp",
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
    barTexturePath: "/art/ui/navbars/nav-app-dark-active-bag.webp",
    mascotExpression: "adventure",
    barSurfaceClass:
      "bg-gradient-to-r from-slate-950/95 via-blue-950/90 to-slate-950/95 shadow-[inset_0_1px_0_rgba(96,165,250,0.1)]",
    barBorderClass: "border-blue-600/35",
    activeLabelClass: "text-blue-300",
    activeGlowClass: "shadow-[0_0_18px_rgba(56,189,248,0.28)]",
    activeIconDropShadow: "drop-shadow-[0_0_6px_rgba(56,189,248,0.45)]",
    activeIconRingClass: "ring-blue-400/40 bg-blue-500/12",
    activeIndicatorClass: "bg-blue-400 shadow-[0_0_8px_rgba(56,189,248,0.5)]",
    particleClass: "bg-muted-foreground/40",
  },
  profile: {
    tab: "profile",
    theme: "journal",
    skinId: "stone_path",
    barTexturePath: "/art/ui/navbars/nav-premium-gold-profile-active-profile.webp",
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
