/** Core expression moods resolved by YamaService and mapped to asset paths. */
import type { NoboruPoseId } from "@/lib/assets/art-mappings";
import type { ReviewRating } from "@/features/review/types/review.types";

export type YamaExpression =
  | "main"
  | "happy"
  | "celebrating"
  | "encouraging"
  | "supportive"
  | "thinking"
  | "studying"
  | "teaching"
  | "surprised"
  | "concerned"
  | "determined"
  | "sleeping"
  | "confused"
  | "sad"
  | "adventure"
  | "training"
  | "seasonal"
  | "reward"
  | "loading"
  | "victorious";

export type YamaSize = "xs" | "sm" | "md" | "lg" | "xl";

export type YamaPresenceViewModel = {
  expression: YamaExpression;
  /** Canonical Noboru pose asset id when context resolves to a specific illustration. */
  poseId?: NoboruPoseId;
  message: string;
  ariaLabel: string;
};

/** High-level surfaces where Yama may appear. */
export type YamaContext =
  | "home"
  | "loading"
  | "lesson_intro"
  | "lesson_teach"
  | "lesson_drill"
  | "lesson_complete"
  | "checkpoint"
  | "training_grounds"
  | "review"
  | "explore"
  | "profile"
  | "achievement"
  | "quest"
  | "trial"
  | "error"
  | "empty"
  | "notification"
  | "daily_challenge"
  | "offline"
  | "inactivity"
  | "streak_lost"
  | "reward"
  | "surprise";

export type YamaExpressionPackId =
  | "happy"
  | "celebrating"
  | "encouraging"
  | "thinking"
  | "teaching"
  | "surprised"
  | "concerned"
  | "determined"
  | "sleeping"
  | "confused"
  | "sad"
  | "adventure"
  | "training_grounds"
  | "seasonal"
  | "reward";

export type YamaAssetStatus = "approved" | "planned";

export type YamaAssetTheme = "light" | "dark";

/** Canonical asset id: yama_{pack}_{variant}_{theme}_v{n} */
export type YamaAssetEntry = {
  id: string;
  packId: YamaExpressionPackId;
  variant: string;
  theme: YamaAssetTheme;
  version: number;
  status: YamaAssetStatus;
  publicPath?: string;
  fallbackExpression?: YamaExpression;
};

export type YamaAssetPack = {
  id: YamaExpressionPackId;
  label: string;
  expression: YamaExpression;
  minimumVariations: number;
  useCases: readonly string[];
  variants: readonly string[];
  assets: readonly YamaAssetEntry[];
};

export type YamaDialoguePoolId =
  | "teaching"
  | "checkpoint"
  | "training_kana_dojo"
  | "training_vocabulary_hall"
  | "training_grammar_shrine"
  | "training_listening_pavilion"
  | "concerned_inactivity"
  | "determined_exam"
  | "sleeping_offline"
  | "sad_streak_lost"
  | "surprised"
  | "reward"
  | "error"
  | "empty"
  | "notification"
  | "daily_challenge"
  | "lesson_intro";

export type YamaDialoguePool = {
  id: YamaDialoguePoolId;
  messages: readonly string[];
  defaultExpression: YamaExpression;
};

export type YamaTrainingGroundLocation =
  | "kana_dojo"
  | "vocabulary_hall"
  | "grammar_shrine"
  | "listening_pavilion";

export type YamaHomeContext = {
  dailyQuestsCompleted: number;
  dailyQuestsTotal: number;
  regionProgressPercent: number;
  hasInProgressTrailNode: boolean;
};

export type YamaCelebrationKind =
  | "lesson_complete"
  | "level_up"
  | "achievement"
  | "quest"
  | "trail_node"
  | "trial_boss"
  | "streak_milestone";

export type YamaEmptySurface =
  | "review"
  | "search"
  | "achievements"
  | "notifications"
  | "trail"
  | "generic";

export type YamaNotificationKind = "reminder" | "milestone" | "social";

export type YamaRewardKind = "xp" | "chest" | "badge" | "collectible";

export type YamaSurpriseTrigger =
  | "easter_egg"
  | "rare_achievement"
  | "unexpected";

export type YamaExamPhase = "prepare" | "active" | "failed";

/** Discriminated union for context-aware Yama resolution. */
export type YamaPresenceContext =
  | { kind: "home"; context: YamaHomeContext; seed?: number }
  | { kind: "loading"; seed?: number }
  | { kind: "lesson_intro"; seed?: number }
  | { kind: "teaching"; mode?: "hint" | "tutorial" | "explanation"; seed?: number }
  | { kind: "checkpoint"; passed?: boolean; seed?: number }
  | {
      kind: "training_grounds";
      location: YamaTrainingGroundLocation;
      seed?: number;
    }
  | { kind: "drill"; result: "correct" | "incorrect"; seed?: number }
  | {
      kind: "review";
      rating?: ReviewRating;
      empty?: boolean;
      seed?: number;
    }
  | { kind: "celebration"; celebrationKind: YamaCelebrationKind; seed?: number }
  | { kind: "inactivity"; daysAway: number; seed?: number }
  | { kind: "exam"; phase: YamaExamPhase; seed?: number }
  | { kind: "offline"; seed?: number }
  | { kind: "streak_lost"; previousStreak: number; seed?: number }
  | { kind: "surprised"; trigger: YamaSurpriseTrigger; seed?: number }
  | { kind: "reward"; rewardKind: YamaRewardKind; seed?: number }
  | { kind: "error"; recoverable?: boolean; seed?: number }
  | { kind: "empty"; surface: YamaEmptySurface; seed?: number }
  | { kind: "notification"; notificationKind: YamaNotificationKind; seed?: number }
  | { kind: "daily_challenge"; seed?: number }
  | { kind: "explore"; seed?: number }
  | { kind: "profile"; seed?: number }
  | { kind: "fail"; seed?: number };
