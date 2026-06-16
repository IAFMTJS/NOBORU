/** Centralized visual system — mockup-aligned primitives, shells, and domain visuals. */

export * from "./tokens";
export * from "./primitives";
export * from "./shells";
export * from "./art";
export * from "./camp";
export * from "./navigation";
export * from "./loading";

export { ContentHubScreen } from "./content-hub-screen";
export { FeedbackSparkOverlay } from "./feedback-spark-overlay";
export * from "./drill-glass-card";

// Trail / world nodes (journey + learning reuse)
export {
  WorldBossNode,
  WorldLessonNode,
  WorldToriiGate,
  EventTrailBranch,
  AchievementRevealCeremony,
  CharacterStage,
  LevelUpCeremony,
  MemoryBookSpread,
  MerchantStand,
  MessengerBoardRow,
  RecognitionPost,
  TrailAnswerPad,
} from "./world";

// Back-compat aliases
export { IllustratedScreen } from "./primitives/illustrated-screen";
export { SecondaryScreenShell } from "./shells/secondary-screen-shell";
export { FullscreenLoadingShell, LoadingShell } from "./loading";
export { BottomNav, NavTabItem } from "./navigation";
