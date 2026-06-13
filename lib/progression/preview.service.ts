import { cache } from "react";

import { chestService } from "@/features/chests/services/chest.service";
import { collectibleService } from "@/features/collectibles/services/collectible.service";
import { companionService } from "@/features/companion/services/companion.service";
import type { ElevationSummaryViewModel } from "@/features/elevation/types/elevation.types";
import { elevationService } from "@/features/elevation/services/elevation.service";
import { learningPathService } from "@/features/learning/services/learning-path.service";
import { learningPathRepository } from "@/features/learning/repositories/learning-path.repository";
import type { LearningPathViewModel } from "@/features/learning/types/lesson.types";
import { trialService } from "@/features/trials/services/trial.service";
import type { CompanionNextUnlock } from "@/features/companion/types/companion.types";
import type { TrialListEntryViewModel } from "@/features/trials/types/trial.types";
import { getCachedProgressRows } from "@/lib/cache/user-progress-cache";

import type { NextUnlockViewModel, ProgressionPreviewViewModel } from "./preview.types";

function sortByProgress(unlocks: NextUnlockViewModel[]): NextUnlockViewModel[] {
  return [...unlocks].sort((a, b) => b.progressPercent - a.progressPercent);
}

export type ProgressionPreviewBuildInput = {
  regionSlug: string;
  learningPath: LearningPathViewModel;
  elevation: ElevationSummaryViewModel;
  trials: TrialListEntryViewModel[];
  companionNext: CompanionNextUnlock | null;
  collectibleNext: NextUnlockViewModel | null;
  chestNext: NextUnlockViewModel | null;
};

export function buildProgressionPreview(
  input: ProgressionPreviewBuildInput,
): ProgressionPreviewViewModel {
  const region = input.learningPath.regions.find(
    (entry) => entry.slug === input.regionSlug,
  );
  const unlocks: NextUnlockViewModel[] = [];

  if (input.companionNext) {
    unlocks.push({
      kind: "companion",
      label: input.companionNext.label,
      progressPercent: input.companionNext.progressPercent,
      remainingLabel: input.companionNext.remainingLabel,
      href: "/camp",
    });
  }

  if (region && region.progressPercent < 100) {
    const readyTrial = input.trials.find(
      (trial) =>
        trial.regionSlug === input.regionSlug &&
        trial.availability === "available" &&
        !trial.progress?.passed,
    );
    if (readyTrial) {
      unlocks.push({
        kind: "trial",
        label: readyTrial.title,
        progressPercent: region.progressPercent,
        remainingLabel: `${region.progressPercent}% region progress`,
        href: `/trials/${readyTrial.slug}`,
      });
    } else if (
      input.learningPath.nextLesson &&
      input.learningPath.nextLessonHref
    ) {
      unlocks.push({
        kind: "region",
        label: `Continue ${region.name}`,
        progressPercent: region.progressPercent,
        remainingLabel: input.learningPath.nextLesson.title,
        href: input.learningPath.nextLessonHref,
      });
    }
  }

  if (input.elevation.nextReward) {
    unlocks.push({
      kind: "title",
      label: input.elevation.nextReward.title,
      progressPercent: input.elevation.levelProgressPercent,
      remainingLabel: `${input.elevation.epToNextLevel} EP to next level`,
      href: "/profile",
    });
  }

  if (input.collectibleNext) {
    unlocks.push(input.collectibleNext);
  }

  if (input.chestNext) {
    unlocks.push(input.chestNext);
  }

  const sorted = sortByProgress(unlocks);
  return {
    unlocks: sorted,
    primaryUnlock: sorted[0] ?? null,
  };
}

class ProgressionPreviewService {
  async getPreview(
    userId: string,
    regionSlug: string,
  ): Promise<ProgressionPreviewViewModel> {
    const [
      regions,
      progressRows,
      elevation,
      trials,
      passedTrialSlugs,
      companionNext,
      collectibleNext,
      chestNext,
    ] = await Promise.all([
      learningPathRepository.listPublishedRegionsWithCurriculum(),
      getCachedProgressRows(userId),
      elevationService.getSummary(userId),
      trialService.listTrials(userId),
      learningPathService.getPassedTrialSlugs(userId),
      companionService.getNextUnlock(userId),
      collectibleService.getNextRegionCollectible(userId, regionSlug),
      chestService.getNextEligibleChest(userId),
    ]);

    const learningPath = learningPathService.buildLearningPath(
      regions,
      progressRows,
      passedTrialSlugs,
    );

    return buildProgressionPreview({
      regionSlug,
      learningPath,
      elevation,
      trials,
      companionNext,
      collectibleNext,
      chestNext,
    });
  }
}

export const progressionPreviewService = new ProgressionPreviewService();
