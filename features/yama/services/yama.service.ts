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
  YAMA_TRAINING_GROUNDS_MESSAGES,
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
): YamaPresenceViewModel {
  return {
    expression,
    message,
    ariaLabel: `Yama: ${message}`,
  };
}

function fromDialoguePool(poolId: YamaDialoguePoolId, seed = 0): YamaPresenceViewModel {
  const pool = YAMA_DIALOGUE_POOLS[poolId];
  return withPresence(
    pool.defaultExpression,
    pickMessage(pool.messages, seed),
  );
}

const TRAINING_GROUND_POOL: Record<YamaTrainingGroundLocation, YamaDialoguePoolId> = {
  kana_dojo: "training_kana_dojo",
  vocabulary_hall: "training_vocabulary_hall",
  grammar_shrine: "training_grammar_shrine",
  listening_pavilion: "training_listening_pavilion",
};

class YamaService {
  resolveLoadingMessage(seed = 0): YamaPresenceViewModel {
    return withPresence(
      "loading",
      pickMessage(YAMA_LOADING_MESSAGES, seed),
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
      );
    }

    if (
      context.dailyQuestsTotal > 0 &&
      context.dailyQuestsCompleted < context.dailyQuestsTotal
    ) {
      return withPresence(
        "encouraging",
        pickMessage(YAMA_HOME_MESSAGES.questsInProgress, seed),
      );
    }

    if (context.hasInProgressTrailNode) {
      return withPresence(
        "studying",
        pickMessage(YAMA_HOME_MESSAGES.trailInProgress, seed),
      );
    }

    if (context.regionProgressPercent >= 75) {
      return withPresence(
        "happy",
        "You're deep into this region. The summit feels closer.",
      );
    }

    return withPresence(
      "main",
      pickMessage(YAMA_HOME_MESSAGES.default, seed),
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
      );
    }

    return withPresence(
      "confused",
      pickMessage(YAMA_DRILL_MESSAGES.incorrect, seed),
    );
  }

  resolveLessonIntroPresence(seed = 0): YamaPresenceViewModel {
    return withPresence(
      "teaching",
      pickMessage(YAMA_LESSON_INTRO_MESSAGES, seed),
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
      );
    }

    if (mode === "tutorial") {
      return fromDialoguePool("teaching", seed);
    }

    return withPresence(
      "teaching",
      pickMessage(YAMA_TEACHING_MESSAGES, seed),
    );
  }

  resolveCheckpointPresence(passed?: boolean, seed = 0): YamaPresenceViewModel {
    if (passed === true) {
      return withPresence(
        "celebrating",
        pickMessage(YAMA_CHECKPOINT_MESSAGES.passed, seed),
      );
    }

    if (passed === false) {
      return withPresence(
        "supportive",
        pickMessage(YAMA_DIALOGUE_POOLS.checkpoint.messages, seed),
      );
    }

    return withPresence(
      "determined",
      pickMessage(YAMA_CHECKPOINT_MESSAGES.prepare, seed),
    );
  }

  resolveTrainingGroundsPresence(
    location: YamaTrainingGroundLocation,
    seed = 0,
  ): YamaPresenceViewModel {
    return fromDialoguePool(TRAINING_GROUND_POOL[location], seed);
  }

  resolveNavPresence(
    tab: "camp" | "journey" | "dojo" | "world" | "profile",
    seed = 0,
  ): YamaPresenceViewModel {
    switch (tab) {
      case "camp":
        return withPresence("encouraging", pickMessage(YAMA_HOME_MESSAGES.default, seed));
      case "journey":
        return withPresence("adventure", pickMessage(YAMA_HOME_MESSAGES.trailInProgress, seed));
      case "dojo":
        return fromDialoguePool("training_kana_dojo", seed);
      case "world":
        return withPresence("adventure", pickMessage(YAMA_EXPLORE_MESSAGES, seed));
      case "profile":
        return withPresence("victorious", pickMessage(YAMA_PROFILE_MESSAGES, seed));
    }
  }

  resolveErrorPresence(recoverable = true, seed = 0): YamaPresenceViewModel {
    if (recoverable) {
      return fromDialoguePool("error", seed);
    }

    return withPresence(
      "concerned",
      pickMessage(YAMA_ERROR_MESSAGES.blocking, seed),
    );
  }

  resolveEmptyPresence(surface: YamaEmptySurface, seed = 0): YamaPresenceViewModel {
    const expression =
      surface === "trail"
        ? "concerned"
        : surface === "achievements" || surface === "generic"
          ? "encouraging"
          : "main";

    return withPresence(
      expression,
      pickMessage(YAMA_EMPTY_MESSAGES[surface], seed),
    );
  }

  resolveNotificationPresence(
    kind: YamaNotificationKind,
    seed = 0,
  ): YamaPresenceViewModel {
    const expression = kind === "milestone" ? "happy" : "encouraging";

    return withPresence(
      expression,
      pickMessage(YAMA_NOTIFICATION_MESSAGES[kind], seed),
    );
  }

  resolveInactivityPresence(daysAway: number, seed = 0): YamaPresenceViewModel {
    const expression = daysAway <= 14 ? "encouraging" : "concerned";

    return withPresence(
      expression,
      pickMessage(YAMA_DIALOGUE_POOLS.concerned_inactivity.messages, seed),
    );
  }

  resolveExamPresence(phase: YamaExamPhase, seed = 0): YamaPresenceViewModel {
    if (phase === "failed") {
      return withPresence(
        "supportive",
        pickMessage(YAMA_DIALOGUE_POOLS.determined_exam.messages, seed),
      );
    }

    return withPresence(
      "determined",
      pickMessage(YAMA_DIALOGUE_POOLS.determined_exam.messages, seed),
    );
  }

  resolveOfflinePresence(seed = 0): YamaPresenceViewModel {
    return fromDialoguePool("sleeping_offline", seed);
  }

  resolveStreakLostPresence(_previousStreak: number, seed = 0): YamaPresenceViewModel {
    return fromDialoguePool("sad_streak_lost", seed);
  }

  resolveSurprisedPresence(
    trigger: YamaSurpriseTrigger,
    seed = 0,
  ): YamaPresenceViewModel {
    const expression = trigger === "easter_egg" ? "happy" : "surprised";

    return withPresence(
      expression,
      pickMessage(YAMA_DIALOGUE_POOLS.surprised.messages, seed),
    );
  }

  resolveRewardPresence(_rewardKind: YamaRewardKind, seed = 0): YamaPresenceViewModel {
    return fromDialoguePool("reward", seed);
  }

  resolveDailyChallengePresence(seed = 0): YamaPresenceViewModel {
    return fromDialoguePool("daily_challenge", seed);
  }

  resolveFailPresence(seed = 0): YamaPresenceViewModel {
    return withPresence(
      "supportive",
      "Every climber stumbles. Review and try again — the trail waits.",
    );
  }

  resolveReviewFeedback(
    rating: "again" | "good" | "strong",
    seed = 0,
  ): YamaPresenceViewModel {
    if (rating === "again") {
      return withPresence(
        "supportive",
        pickMessage(YAMA_REVIEW_MESSAGES.again, seed),
      );
    }

    if (rating === "strong") {
      return withPresence(
        "happy",
        pickMessage(YAMA_REVIEW_MESSAGES.strong, seed),
      );
    }

    return withPresence(
      "encouraging",
      pickMessage(YAMA_REVIEW_MESSAGES.good, seed),
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
    );
  }

  resolveExplorePresence(seed = 0): YamaPresenceViewModel {
    return withPresence("adventure", pickMessage(YAMA_EXPLORE_MESSAGES, seed));
  }

  resolveProfilePresence(seed = 0): YamaPresenceViewModel {
    return withPresence("main", pickMessage(YAMA_PROFILE_MESSAGES, seed));
  }

  resolveGameVictory(seed = 0): YamaPresenceViewModel {
    return withPresence(
      "victorious",
      pickMessage(YAMA_CELEBRATION_MESSAGES.quest, seed),
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
