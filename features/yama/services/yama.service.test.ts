import { describe, expect, it } from "vitest";

import { YAMA_DIALOGUE_POOLS } from "@/features/yama/constants/yama.constants";
import { yamaService } from "@/features/yama/services/yama.service";
import { getYamaExpressionPath } from "@/lib/assets/registry";

const GUILT_PHRASES = [
  "you failed",
  "you should have",
  "disappointed in you",
  "shame",
  "don't give up or you'll lose",
  "you're falling behind",
];

function assertNoGuiltTrip(message: string) {
  const lower = message.toLowerCase();
  for (const phrase of GUILT_PHRASES) {
    expect(lower).not.toContain(phrase);
  }
}

describe("yamaService context → expression mapping", () => {
  it("maps lesson intro to teaching", () => {
    expect(yamaService.resolveLessonIntroPresence().expression).toBe("teaching");
  });

  it("maps teaching hints to thinking", () => {
    expect(yamaService.resolveTeachingPresence("hint").expression).toBe("thinking");
    expect(yamaService.resolveTeachingPresence("tutorial").expression).toBe("teaching");
  });

  it("maps checkpoint prep to determined and pass to celebrating", () => {
    expect(yamaService.resolveCheckpointPresence().expression).toBe("determined");
    expect(yamaService.resolveCheckpointPresence(true).expression).toBe("celebrating");
    expect(yamaService.resolveCheckpointPresence(false).expression).toBe("supportive");
  });

  it("maps training grounds locations to training expression", () => {
    expect(
      yamaService.resolveTrainingGroundsPresence("kana_dojo").expression,
    ).toBe("training");
    expect(
      yamaService.resolveTrainingGroundsPresence("vocabulary_hall").expression,
    ).toBe("training");
    expect(
      yamaService.resolveTrainingGroundsPresence("grammar_shrine").expression,
    ).toBe("training");
    expect(
      yamaService.resolveTrainingGroundsPresence("listening_pavilion").expression,
    ).toBe("training");
  });

  it("maps inactivity to encouraging or concerned without guilt", () => {
    const shortBreak = yamaService.resolveInactivityPresence(3);
    const longBreak = yamaService.resolveInactivityPresence(21);

    expect(shortBreak.expression).toBe("encouraging");
    expect(longBreak.expression).toBe("concerned");
    assertNoGuiltTrip(shortBreak.message);
    assertNoGuiltTrip(longBreak.message);
  });

  it("maps exam phases to determined or supportive", () => {
    expect(yamaService.resolveExamPresence("prepare").expression).toBe("determined");
    expect(yamaService.resolveExamPresence("active").expression).toBe("determined");
    expect(yamaService.resolveExamPresence("failed").expression).toBe("supportive");
  });

  it("maps offline to sleeping", () => {
    expect(yamaService.resolveOfflinePresence().expression).toBe("sleeping");
  });

  it("maps streak loss to sad with supportive copy", () => {
    const presence = yamaService.resolveStreakLostPresence(14);
    expect(presence.expression).toBe("sad");
    assertNoGuiltTrip(presence.message);
  });

  it("maps surprise triggers to surprised or happy", () => {
    expect(
      yamaService.resolveSurprisedPresence("rare_achievement").expression,
    ).toBe("surprised");
    expect(yamaService.resolveSurprisedPresence("easter_egg").expression).toBe(
      "happy",
    );
  });

  it("maps rewards to reward expression", () => {
    expect(yamaService.resolveRewardPresence("chest").expression).toBe("reward");
    expect(yamaService.resolveCelebration("achievement").expression).toBe("reward");
  });

  it("maps errors to confused and empty surfaces to encouraging", () => {
    expect(yamaService.resolveErrorPresence(true).expression).toBe("confused");
    expect(yamaService.resolveEmptyPresence("achievements").expression).toBe(
      "encouraging",
    );
  });

  it("maps daily challenge and notifications", () => {
    expect(yamaService.resolveDailyChallengePresence().expression).toBe("happy");
    expect(yamaService.resolveNotificationPresence("milestone").expression).toBe(
      "happy",
    );
  });

  it("maps explore and trail progress to adventure", () => {
    expect(yamaService.resolveExplorePresence().expression).toBe("adventure");
    expect(yamaService.resolveTrailProgress().expression).toBe("adventure");
  });

  it("resolves unified presence contexts", () => {
    expect(
      yamaService.resolvePresence({ kind: "lesson_intro" }).expression,
    ).toBe("teaching");
    expect(
      yamaService.resolvePresence({
        kind: "training_grounds",
        location: "grammar_shrine",
      }).expression,
    ).toBe("training");
    expect(
      yamaService.resolvePresence({ kind: "offline" }).expression,
    ).toBe("sleeping");
  });

  it("keeps drill correct answers on happy mood", () => {
    expect(yamaService.resolveDrillFeedback("correct").expression).toBe("happy");
    expect(yamaService.resolveDrillFeedback("incorrect").expression).toBe("confused");
  });
});

describe("yama dialogue pools", () => {
  it("defines all expansion dialogue pools", () => {
    const poolIds = Object.keys(YAMA_DIALOGUE_POOLS);
    expect(poolIds).toContain("teaching");
    expect(poolIds).toContain("checkpoint");
    expect(poolIds).toContain("training_kana_dojo");
    expect(poolIds).toContain("sad_streak_lost");
    expect(poolIds).toContain("daily_challenge");
  });

  it("never guilt-trips in sensitive pools", () => {
    for (const pool of [
      YAMA_DIALOGUE_POOLS.concerned_inactivity,
      YAMA_DIALOGUE_POOLS.sad_streak_lost,
      YAMA_DIALOGUE_POOLS.error,
    ]) {
      for (const message of pool.messages) {
        assertNoGuiltTrip(message);
      }
    }
  });
});

describe("getYamaExpressionPath art-direction assets", () => {
  it("resolves char-noboru art-direction paths", () => {
    expect(getYamaExpressionPath("teaching", "dark")).toContain("char-noboru-reaction-teaching");
    expect(getYamaExpressionPath("sleeping", "light")).toContain("char-noboru-sitting-campfire");
    expect(getYamaExpressionPath("reward", "dark")).toContain("char-noboru-reaction-mastery");
    expect(getYamaExpressionPath("adventure", "light")).toContain("char-noboru-walking-backpack");
    expect(getYamaExpressionPath("determined", "dark")).toContain("char-noboru-running-ember");
    expect(getYamaExpressionPath("concerned", "light")).toContain("char-noboru-reaction-worried");
  });
});
