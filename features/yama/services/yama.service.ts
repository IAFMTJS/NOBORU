import type { NoboruPoseId } from "@/lib/assets/art-mappings";
import type { ReviewRating } from "@/features/review/types/review.types";
import {
  YAMA_CELEBRATION_MESSAGES,
  YAMA_CHECKPOINT_MESSAGES,
  YAMA_DIALOGUE_POOLS,
  YAMA_DRILL_MESSAGES,
  YAMA_EMPTY_MESSAGES,
  YAMA_ERROR_MESSAGES,
  YAMA_EXPLORE_MESSAGES,
  YAMA_HOME_MESSAGES,
  YAMA_LESSON_INTRO_MESSAGES,
  YAMA_LOADING_MESSAGES,
  YAMA_NOTIFICATION_MESSAGES,
  YAMA_PROFILE_MESSAGES,
  YAMA_REVIEW_MESSAGES,
  YAMA_TEACHING_MESSAGES,
} from "@/features/yama/constants/yama.constants";
import type {
  YamaCelebrationKind,
  YamaDialoguePoolId,
  YamaEmptySurface,
  YamaExamPhase,
  YamaHomeContext,
  YamaNotificationKind,
  YamaPresenceContext,
  YamaPresenceViewModel,
  YamaRewardKind,
  YamaSurpriseTrigger,
  YamaTrainingGroundLocation,
} from "@/features/yama/types/yama.types";

function pickMessage(messages: readonly string[], seed = 0): string {
  if (messages.length === 0) return "";
  return messages[Math.abs(seed) % messages.length] ?? messages[0];
}

function withPresence(
  expression: YamaPresenceViewModel["expression"],
  message: string,
  poseId: NoboruPoseId,
): YamaPresenceViewModel {
  return {
    expression,
    poseId,
    message,
    ariaLabel: `Yama: ${message}`,
  };
}

function fromDialoguePool(
  poolId: YamaDialoguePoolId,
  poseId: NoboruPoseId,
  seed = 0,
): YamaPresenceViewModel {
  const pool = YAMA_DIALOGUE_POOLS[poolId];
  return withPresence(
    pool.defaultExpression,
    pickMessage(pool.messages, seed),
    poseId,
  );
}

const TRAINING_GROUND_POOL: Record<YamaTrainingGroundLocation, YamaDialoguePoolId> = {
  kana_dojo: "training_kana_dojo",
  vocabulary_hall: "training_vocabulary_hall",
  grammar_shrine: "training_grammar_shrine",
  listening_pavilion: "training_listening_pavilion",
};

const TRAINING_GROUND_POSE: Record<YamaTrainingGroundLocation, NoboruPoseId> = {
  kana_dojo: "char-noboru-meditating-dojo",
  vocabulary_hall: "char-noboru-reading-book",
  grammar_shrine: "char-noboru-meditating-dojo",
  listening_pavilion: "char-noboru-reading-book",
};

const CELEBRATION_POSE: Record<YamaCelebrationKind, NoboruPoseId> = {
  lesson_complete: "char-noboru-reaction-proud",
  level_up: "char-noboru-reaction-excited",
  achievement: "char-noboru-reaction-mastery",
  quest: "char-noboru-reaction-happy",
  trail_node: "char-noboru-from-behind-region-transition",
  trial_boss: "char-noboru-running-ember",
  streak_milestone: "char-noboru-reaction-proud",
};

class YamaService {
  resolveLoadingMessage(seed = 0): YamaPresenceViewModel {
    return withPresence(
      "loading",
      pickMessage(YAMA_LOADING_MESSAGES, seed),
      "char-noboru-standing-traveler",
    );
  }

  resolveHomePresence(context: YamaHomeContext, seed = 0): YamaPresenceViewModel {
    if (
      context.dailyQuestsTotal > 0 &&
      context.dailyQuestsCompleted >= context.dailyQuestsTotal
    ) {
      return withPresence(
        "celebrating",
        pickMessage(YAMA_HOME_MESSAGES.allQuestsComplete, seed),
        "char-noboru-reaction-happy",
      );
    }

    if (
      context.dailyQuestsTotal > 0 &&
      context.dailyQuestsCompleted < context.dailyQuestsTotal
    ) {
      return withPresence(
        "encouraging",
        pickMessage(YAMA_HOME_MESSAGES.questsInProgress, seed),
        "char-noboru-reaction-encouraging",
      );
    }

    if (context.hasInProgressTrailNode) {
      return withPresence(
        "studying",
        pickMessage(YAMA_HOME_MESSAGES.trailInProgress, seed),
        "char-noboru-walking-backpack",
      );
    }

    if (context.regionProgressPercent >= 75) {
      return withPresence(
        "happy",
        "You're deep into this region. The summit feels closer.",
        "char-noboru-weather-sunny",
      );
    }

    return withPresence(
      "main",
      pickMessage(YAMA_HOME_MESSAGES.default, seed),
      "char-noboru-sitting-campfire",
    );
  }

  resolveDrillFeedback(
    result: "correct" | "incorrect",
    seed = 0,
  ): YamaPresenceViewModel {
    if (result === "correct") {
      return withPresence(
        "happy",
        pickMessage(YAMA_DRILL_MESSAGES.correct, seed),
        "char-noboru-reaction-happy",
      );
    }

    return withPresence(
      "confused",
      pickMessage(YAMA_DRILL_MESSAGES.incorrect, seed),
      "char-noboru-reaction-oops",
    );
  }

  resolveLessonIntroPresence(seed = 0): YamaPresenceViewModel {
    return withPresence(
      "teaching",
      pickMessage(YAMA_LESSON_INTRO_MESSAGES, seed),
      "char-noboru-reaction-teaching",
    );
  }

  resolveTeachPresence(seed = 0): YamaPresenceViewModel {
    return this.resolveTeachingPresence("explanation", seed);
  }

  resolveTeachingPresence(
    mode: "hint" | "tutorial" | "explanation" = "explanation",
    seed = 0,
  ): YamaPresenceViewModel {
    if (mode === "hint") {
      return withPresence(
        "thinking",
        pickMessage(YAMA_TEACHING_MESSAGES, seed),
        "char-noboru-reading-book",
      );
    }

    if (mode === "tutorial") {
      return fromDialoguePool("teaching", "char-noboru-reaction-teaching", seed);
    }

    return withPresence(
      "teaching",
      pickMessage(YAMA_TEACHING_MESSAGES, seed),
      "char-noboru-reaction-teaching",
    );
  }

  resolveCheckpointPresence(passed?: boolean, seed = 0): YamaPresenceViewModel {
    if (passed === true) {
      return withPresence(
        "celebrating",
        pickMessage(YAMA_CHECKPOINT_MESSAGES.passed, seed),
        "char-noboru-reaction-proud",
      );
    }

    if (passed === false) {
      return withPresence(
        "supportive",
        pickMessage(YAMA_DIALOGUE_POOLS.checkpoint.messages, seed),
        "char-noboru-reaction-encouraging",
      );
    }

    return withPresence(
      "determined",
      pickMessage(YAMA_CHECKPOINT_MESSAGES.prepare, seed),
      "char-noboru-running-ember",
    );
  }

  resolveTrainingGroundsPresence(
    location: YamaTrainingGroundLocation,
    seed = 0,
  ): YamaPresenceViewModel {
    return fromDialoguePool(
      TRAINING_GROUND_POOL[location],
      TRAINING_GROUND_POSE[location],
      seed,
    );
  }

  resolveNavPresence(
    tab: "journey" | "camp" | "study" | "bag" | "profile",
    seed = 0,
  ): YamaPresenceViewModel {
    switch (tab) {
      case "camp":
        return withPresence(
          "encouraging",
          pickMessage(YAMA_HOME_MESSAGES.default, seed),
          "char-noboru-sitting-campfire",
        );
      case "journey":
        return withPresence(
          "adventure",
          pickMessage(YAMA_HOME_MESSAGES.trailInProgress, seed),
          "char-noboru-walking-backpack",
        );
      case "study":
        return fromDialoguePool(
          "training_kana_dojo",
          "char-noboru-meditating-dojo",
          seed,
        );
      case "bag":
        return withPresence(
          "adventure",
          pickMessage(YAMA_EXPLORE_MESSAGES, seed),
          "char-noboru-cosmetic-backpack-bamboo",
        );
      case "profile":
        return withPresence(
          "victorious",
          pickMessage(YAMA_PROFILE_MESSAGES, seed),
          "char-noboru-hero-profile",
        );
    }
  }

  resolveErrorPresence(recoverable = true, seed = 0): YamaPresenceViewModel {
    if (recoverable) {
      return fromDialoguePool("error", "char-noboru-reaction-oops", seed);
    }

    return withPresence(
      "concerned",
      pickMessage(YAMA_ERROR_MESSAGES.blocking, seed),
      "char-noboru-weather-rainy-umbrella",
    );
  }

  resolveEmptyPresence(surface: YamaEmptySurface, seed = 0): YamaPresenceViewModel {
    const expression =
      surface === "trail"
        ? "concerned"
        : surface === "achievements" || surface === "generic"
          ? "encouraging"
          : "main";

    const poseId: NoboruPoseId =
      surface === "trail"
        ? "char-noboru-peeking-locked-detail"
        : surface === "achievements"
          ? "char-noboru-reaction-mastery"
          : "char-noboru-standing-traveler";

    return withPresence(
      expression,
      pickMessage(YAMA_EMPTY_MESSAGES[surface], seed),
      poseId,
    );
  }

  resolveNotificationPresence(
    kind: YamaNotificationKind,
    seed = 0,
  ): YamaPresenceViewModel {
    const expression = kind === "milestone" ? "happy" : "encouraging";
    const poseId: NoboruPoseId =
      kind === "milestone"
        ? "char-noboru-reaction-happy"
        : kind === "reminder"
          ? "char-noboru-weather-snowy-cloak"
          : "char-noboru-weather-night-lantern";

    return withPresence(
      expression,
      pickMessage(YAMA_NOTIFICATION_MESSAGES[kind], seed),
      poseId,
    );
  }

  resolveInactivityPresence(daysAway: number, seed = 0): YamaPresenceViewModel {
    const expression = daysAway <= 14 ? "encouraging" : "concerned";
    const poseId: NoboruPoseId =
      daysAway <= 14
        ? "char-noboru-reaction-encouraging"
        : "char-noboru-winter-staff";

    return withPresence(
      expression,
      pickMessage(YAMA_DIALOGUE_POOLS.concerned_inactivity.messages, seed),
      poseId,
    );
  }

  resolveExamPresence(phase: YamaExamPhase, seed = 0): YamaPresenceViewModel {
    if (phase === "failed") {
      return withPresence(
        "supportive",
        pickMessage(YAMA_DIALOGUE_POOLS.determined_exam.messages, seed),
        "char-noboru-reaction-worried",
      );
    }

    return withPresence(
      "determined",
      pickMessage(YAMA_DIALOGUE_POOLS.determined_exam.messages, seed),
      "char-noboru-running-ember",
    );
  }

  resolveOfflinePresence(seed = 0): YamaPresenceViewModel {
    return fromDialoguePool("sleeping_offline", "char-noboru-sitting-campfire", seed);
  }

  resolveStreakLostPresence(_previousStreak: number, seed = 0): YamaPresenceViewModel {
    return fromDialoguePool("sad_streak_lost", "char-noboru-reaction-out-of-hearts", seed);
  }

  resolveSurprisedPresence(
    trigger: YamaSurpriseTrigger,
    seed = 0,
  ): YamaPresenceViewModel {
    const expression = trigger === "easter_egg" ? "happy" : "surprised";
    const poseId: NoboruPoseId =
      trigger === "easter_egg"
        ? "char-noboru-cosmetic-fox-mask"
        : "char-noboru-reaction-excited";

    return withPresence(
      expression,
      pickMessage(YAMA_DIALOGUE_POOLS.surprised.messages, seed),
      poseId,
    );
  }

  resolveRewardPresence(rewardKind: YamaRewardKind, seed = 0): YamaPresenceViewModel {
    const poseId: NoboruPoseId =
      rewardKind === "collectible"
        ? "char-noboru-cosmetic-scarf-crimson"
        : "char-noboru-reaction-mastery";

    return fromDialoguePool("reward", poseId, seed);
  }

  resolveDailyChallengePresence(seed = 0): YamaPresenceViewModel {
    return fromDialoguePool("daily_challenge", "char-noboru-reaction-excited", seed);
  }

  resolveFailPresence(seed = 0): YamaPresenceViewModel {
    return withPresence(
      "supportive",
      "Every climber stumbles. Review and try again — the trail waits.",
      "char-noboru-reaction-encouraging",
    );
  }

  resolveReviewFeedback(
    rating: ReviewRating,
    seed = 0,
  ): YamaPresenceViewModel {
    if (rating === "again") {
      return withPresence(
        "supportive",
        pickMessage(YAMA_REVIEW_MESSAGES.again, seed),
        "char-noboru-reaction-encouraging",
      );
    }

    if (rating === "strong" || rating === "easy") {
      return withPresence(
        "happy",
        pickMessage(YAMA_REVIEW_MESSAGES.strong, seed),
        "char-noboru-reaction-mastery",
      );
    }

    if (rating === "hard") {
      return withPresence(
        "encouraging",
        pickMessage(YAMA_REVIEW_MESSAGES.good, seed),
        "char-noboru-reaction-encouraging",
      );
    }

    return withPresence(
      "encouraging",
      pickMessage(YAMA_REVIEW_MESSAGES.good, seed),
      "char-noboru-reaction-happy",
    );
  }

  resolveReviewEmpty(seed = 0): YamaPresenceViewModel {
    return this.resolveEmptyPresence("review", seed);
  }

  resolveCelebration(
    kind: YamaCelebrationKind,
    seed = 0,
  ): YamaPresenceViewModel {
    const expression =
      kind === "achievement"
        ? "reward"
        : kind === "level_up" || kind === "trial_boss"
          ? "celebrating"
          : kind === "quest" || kind === "streak_milestone"
            ? "happy"
            : "celebrating";

    return withPresence(
      expression,
      pickMessage(YAMA_CELEBRATION_MESSAGES[kind], seed),
      CELEBRATION_POSE[kind],
    );
  }

  resolveAchievementReaction(seed = 0): YamaPresenceViewModel {
    return this.resolveCelebration("achievement", seed);
  }

  resolveQuestReaction(seed = 0): YamaPresenceViewModel {
    return this.resolveCelebration("quest", seed);
  }

  resolveTrailProgress(seed = 0): YamaPresenceViewModel {
    return withPresence(
      "adventure",
      pickMessage(YAMA_CELEBRATION_MESSAGES.trail_node, seed),
      "char-noboru-walking-backpack",
    );
  }

  resolveExplorePresence(seed = 0): YamaPresenceViewModel {
    return withPresence(
      "adventure",
      pickMessage(YAMA_EXPLORE_MESSAGES, seed),
      "char-noboru-telescope-world",
    );
  }

  resolveProfilePresence(seed = 0): YamaPresenceViewModel {
    return withPresence(
      "main",
      pickMessage(YAMA_PROFILE_MESSAGES, seed),
      "char-noboru-cosmetic-preview-base",
    );
  }

  resolveGameVictory(seed = 0): YamaPresenceViewModel {
    return withPresence(
      "victorious",
      pickMessage(YAMA_CELEBRATION_MESSAGES.quest, seed),
      "char-noboru-reaction-proud",
    );
  }

  resolvePresence(context: YamaPresenceContext): YamaPresenceViewModel {
    const seed = context.seed ?? 0;

    switch (context.kind) {
      case "home":
        return this.resolveHomePresence(context.context, seed);
      case "loading":
        return this.resolveLoadingMessage(seed);
      case "lesson_intro":
        return this.resolveLessonIntroPresence(seed);
      case "teaching":
        return this.resolveTeachingPresence(context.mode ?? "explanation", seed);
      case "checkpoint":
        return this.resolveCheckpointPresence(context.passed, seed);
      case "training_grounds":
        return this.resolveTrainingGroundsPresence(context.location, seed);
      case "drill":
        return this.resolveDrillFeedback(context.result, seed);
      case "review":
        if (context.empty) {
          return this.resolveReviewEmpty(seed);
        }
        if (context.rating) {
          return this.resolveReviewFeedback(context.rating, seed);
        }
        return this.resolveReviewEmpty(seed);
      case "celebration":
        return this.resolveCelebration(context.celebrationKind, seed);
      case "inactivity":
        return this.resolveInactivityPresence(context.daysAway, seed);
      case "exam":
        return this.resolveExamPresence(context.phase, seed);
      case "offline":
        return this.resolveOfflinePresence(seed);
      case "streak_lost":
        return this.resolveStreakLostPresence(context.previousStreak, seed);
      case "surprised":
        return this.resolveSurprisedPresence(context.trigger, seed);
      case "reward":
        return this.resolveRewardPresence(context.rewardKind, seed);
      case "error":
        return this.resolveErrorPresence(context.recoverable ?? true, seed);
      case "empty":
        return this.resolveEmptyPresence(context.surface, seed);
      case "notification":
        return this.resolveNotificationPresence(context.notificationKind, seed);
      case "daily_challenge":
        return this.resolveDailyChallengePresence(seed);
      case "explore":
        return this.resolveExplorePresence(seed);
      case "profile":
        return this.resolveProfilePresence(seed);
      case "fail":
        return this.resolveFailPresence(seed);
      default: {
        const exhaustive: never = context;
        return exhaustive;
      }
    }
  }
}

export const yamaService = new YamaService();
