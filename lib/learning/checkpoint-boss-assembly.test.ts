import { describe, expect, it } from "vitest";

import { planCheckpointActivities } from "@/lib/learning/checkpoint-assembly.service";
import { planBossExamination } from "@/lib/learning/boss-examination.service";

describe("checkpoint and boss examination assembly", () => {
  it("plans mixed checkpoint activities", () => {
    const plans = planCheckpointActivities({
      vocabularyIds: ["v1", "v2", "v3"],
      listeningIds: ["l1"],
      readingIds: ["r1"],
      applicationIds: ["a1"],
      grammarIds: ["g1"],
    });

    expect(plans.map((plan) => plan.type)).toEqual(
      expect.arrayContaining([
        "vocabulary_recognition",
        "listening",
        "reading",
        "writing",
        "context_usage",
        "mixed_activities",
      ]),
    );
  });

  it("plans branch boss examination sections", () => {
    const steps = planBossExamination({
      vocabularyIds: ["v1"],
      grammarIds: ["g1"],
      readingIds: ["r1"],
      listeningIds: ["l1"],
      storyIds: ["s1"],
      applicationIds: ["a1"],
    });

    expect(steps.map((step) => step.type)).toEqual(
      expect.arrayContaining([
        "applied_vocabulary",
        "grammar",
        "reading",
        "listening",
        "story_comprehension",
        "writing",
      ]),
    );
  });
});
