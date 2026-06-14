import type { YamaExpression } from "@/features/yama/types/yama.types";

export type ImmersiveNavTab = "camp" | "journey" | "dojo" | "world" | "profile";

export type ImmersiveNavTheme = "campfire" | "trail" | "dojo" | "compass" | "journal";

export type ImmersiveNavTabConfig = {
  tab: ImmersiveNavTab;
  theme: ImmersiveNavTheme;
  mascotExpression: YamaExpression;
  activeGlowClass: string;
  activeIconRingClass: string;
  particleClass: string;
};

export const IMMERSIVE_NAV_TAB_CONFIG: Record<ImmersiveNavTab, ImmersiveNavTabConfig> = {
  camp: {
    tab: "camp",
    theme: "campfire",
    mascotExpression: "encouraging",
    activeGlowClass: "shadow-[0_0_20px_rgba(246,174,45,0.35)]",
    activeIconRingClass: "ring-warning/40 bg-warning/10",
    particleClass: "bg-warning/60",
  },
  journey: {
    tab: "journey",
    theme: "trail",
    mascotExpression: "adventure",
    activeGlowClass: "shadow-[0_0_20px_rgba(214,64,69,0.35)]",
    activeIconRingClass: "ring-primary/40 bg-primary/10",
    particleClass: "bg-primary/50",
  },
  dojo: {
    tab: "dojo",
    theme: "dojo",
    mascotExpression: "training",
    activeGlowClass: "shadow-[0_0_18px_rgba(47,191,113,0.3)]",
    activeIconRingClass: "ring-success/35 bg-success/10",
    particleClass: "bg-success/50",
  },
  world: {
    tab: "world",
    theme: "compass",
    mascotExpression: "adventure",
    activeGlowClass: "shadow-[0_0_18px_rgba(214,64,69,0.25)]",
    activeIconRingClass: "ring-primary/30 bg-primary/8",
    particleClass: "bg-muted-foreground/40",
  },
  profile: {
    tab: "profile",
    theme: "journal",
    mascotExpression: "victorious",
    activeGlowClass: "shadow-[0_0_16px_rgba(214,64,69,0.2)]",
    activeIconRingClass: "ring-primary/25 bg-primary/8",
    particleClass: "bg-primary/35",
  },
};
