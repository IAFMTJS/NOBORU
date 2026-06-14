import type { YamaExpression } from "@/features/yama/types/yama.types";

export type ImmersiveNavTab = "camp" | "journey" | "dojo" | "world" | "profile";

export type ImmersiveNavTheme = "campfire" | "trail" | "dojo" | "compass" | "journal";

export type ImmersiveNavTabConfig = {
  tab: ImmersiveNavTab;
  theme: ImmersiveNavTheme;
  mascotExpression: YamaExpression;
  /** Pill background when this tab is active */
  barSurfaceClass: string;
  barBorderClass: string;
  activeLabelClass: string;
  activeGlowClass: string;
  activeIconRingClass: string;
  activeIndicatorClass: string;
  particleClass: string;
};

export const IMMERSIVE_NAV_TAB_CONFIG: Record<ImmersiveNavTab, ImmersiveNavTabConfig> = {
  camp: {
    tab: "camp",
    theme: "campfire",
    mascotExpression: "encouraging",
    barSurfaceClass:
      "bg-gradient-to-r from-stone-950/95 via-stone-900/92 to-stone-950/95 shadow-[inset_0_1px_0_rgba(246,174,45,0.12)]",
    barBorderClass: "border-amber-700/35",
    activeLabelClass: "text-amber-300",
    activeGlowClass: "shadow-[0_0_20px_rgba(246,174,45,0.35)]",
    activeIconRingClass: "ring-amber-400/45 bg-amber-500/15",
    activeIndicatorClass: "bg-amber-400 shadow-[0_0_8px_rgba(246,174,45,0.65)]",
    particleClass: "bg-warning/60",
  },
  journey: {
    tab: "journey",
    theme: "trail",
    mascotExpression: "adventure",
    barSurfaceClass:
      "bg-gradient-to-r from-slate-950/95 via-indigo-950/90 to-slate-950/95 shadow-[inset_0_1px_0_rgba(96,165,250,0.12)]",
    barBorderClass: "border-sky-600/35",
    activeLabelClass: "text-sky-300",
    activeGlowClass: "shadow-[0_0_20px_rgba(56,189,248,0.35)]",
    activeIconRingClass: "ring-sky-400/45 bg-sky-500/15",
    activeIndicatorClass: "bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.65)]",
    particleClass: "bg-primary/50",
  },
  dojo: {
    tab: "dojo",
    theme: "dojo",
    mascotExpression: "training",
    barSurfaceClass:
      "bg-gradient-to-r from-emerald-950/95 via-green-950/90 to-emerald-950/95 shadow-[inset_0_1px_0_rgba(74,222,128,0.1)]",
    barBorderClass: "border-emerald-600/35",
    activeLabelClass: "text-emerald-300",
    activeGlowClass: "shadow-[0_0_18px_rgba(47,191,113,0.3)]",
    activeIconRingClass: "ring-emerald-400/45 bg-emerald-500/15",
    activeIndicatorClass: "bg-emerald-400 shadow-[0_0_8px_rgba(74,222,128,0.55)]",
    particleClass: "bg-success/50",
  },
  world: {
    tab: "world",
    theme: "compass",
    mascotExpression: "adventure",
    barSurfaceClass:
      "bg-gradient-to-r from-violet-950/95 via-purple-950/90 to-violet-950/95 shadow-[inset_0_1px_0_rgba(167,139,250,0.12)]",
    barBorderClass: "border-violet-500/35",
    activeLabelClass: "text-violet-300",
    activeGlowClass: "shadow-[0_0_18px_rgba(167,139,250,0.3)]",
    activeIconRingClass: "ring-violet-400/40 bg-violet-500/12",
    activeIndicatorClass: "bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.55)]",
    particleClass: "bg-muted-foreground/40",
  },
  profile: {
    tab: "profile",
    theme: "journal",
    mascotExpression: "victorious",
    barSurfaceClass:
      "bg-gradient-to-r from-amber-950/95 via-stone-900/92 to-amber-950/95 shadow-[inset_0_1px_0_rgba(250,204,21,0.1)]",
    barBorderClass: "border-yellow-600/30",
    activeLabelClass: "text-yellow-200",
    activeGlowClass: "shadow-[0_0_16px_rgba(250,204,21,0.25)]",
    activeIconRingClass: "ring-yellow-400/35 bg-yellow-500/10",
    activeIndicatorClass: "bg-yellow-300 shadow-[0_0_8px_rgba(250,204,21,0.5)]",
    particleClass: "bg-primary/35",
  },
};
