import type { VisualTier } from "@/lib/performance/visual-tier";

export type JourneyVisualSettings = {
  parallaxMultiplier: number;
  environmentLayers: boolean;
  weatherEffects: boolean;
  ambientParticles: boolean;
  particleIntensity: "full" | "reduced";
  foxInteractions: boolean;
  foxIdleMotion: boolean;
  ambientSound: boolean;
  checkpointCelebration: boolean;
  trialTempleEffects: boolean;
  lazyLoadRootMargin: string;
  /** Max region sections with artwork loaded simultaneously (0 = unlimited). */
  maxLoadedArtSections: number;
};

export function resolveJourneyVisualSettings(
  tier: VisualTier,
): JourneyVisualSettings {
  switch (tier) {
    case "high":
      return {
        parallaxMultiplier: 1,
        environmentLayers: true,
        weatherEffects: true,
        ambientParticles: true,
        particleIntensity: "full",
        foxInteractions: true,
        foxIdleMotion: true,
        ambientSound: true,
        checkpointCelebration: true,
        trialTempleEffects: true,
        lazyLoadRootMargin: "480px 0px",
        maxLoadedArtSections: 0,
      };
    case "medium":
      return {
        parallaxMultiplier: 0.45,
        environmentLayers: true,
        weatherEffects: false,
        ambientParticles: true,
        particleIntensity: "reduced",
        foxInteractions: true,
        foxIdleMotion: true,
        ambientSound: false,
        checkpointCelebration: false,
        trialTempleEffects: true,
        lazyLoadRootMargin: "480px 0px",
        maxLoadedArtSections: 0,
      };
    case "low":
      return {
        parallaxMultiplier: 0,
        environmentLayers: false,
        weatherEffects: false,
        ambientParticles: false,
        particleIntensity: "reduced",
        foxInteractions: false,
        foxIdleMotion: false,
        ambientSound: false,
        checkpointCelebration: false,
        trialTempleEffects: false,
        lazyLoadRootMargin: "120px 0px",
        maxLoadedArtSections: 2,
      };
  }
}
