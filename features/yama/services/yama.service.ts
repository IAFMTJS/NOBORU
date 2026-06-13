import {
  YAMA_CELEBRATION_MESSAGES,
  YAMA_DRILL_MESSAGES,
  YAMA_EXPLORE_MESSAGES,
  YAMA_HOME_MESSAGES,
  YAMA_LOADING_MESSAGES,
  YAMA_PROFILE_MESSAGES,
  YAMA_REVIEW_MESSAGES,
} from "@/features/yama/constants/yama.constants";
import type {
  YamaCelebrationKind,
  YamaHomeContext,
  YamaPresenceViewModel,
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
        "encouraging",
        pickMessage(YAMA_DRILL_MESSAGES.correct, seed),
      );
    }

    return withPresence(
      "confused",
      pickMessage(YAMA_DRILL_MESSAGES.incorrect, seed),
    );
  }

  resolveTeachPresence(seed = 0): YamaPresenceViewModel {
    return withPresence(
      "studying",
      pickMessage(YAMA_HOME_MESSAGES.trailInProgress, seed),
    );
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
    return withPresence(
      "main",
      pickMessage(YAMA_REVIEW_MESSAGES.queueEmpty, seed),
    );
  }

  resolveCelebration(
    kind: YamaCelebrationKind,
    seed = 0,
  ): YamaPresenceViewModel {
    const expression =
      kind === "level_up" || kind === "trial_boss"
        ? "celebrating"
        : kind === "achievement" || kind === "quest" || kind === "streak_milestone"
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
      "studying",
      pickMessage(YAMA_CELEBRATION_MESSAGES.trail_node, seed),
    );
  }

  resolveExplorePresence(seed = 0): YamaPresenceViewModel {
    return withPresence("happy", pickMessage(YAMA_EXPLORE_MESSAGES, seed));
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
}

export const yamaService = new YamaService();
