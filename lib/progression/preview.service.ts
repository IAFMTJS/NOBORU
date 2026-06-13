import { companionService } from "@/features/companion/services/companion.service";
import { elevationService } from "@/features/elevation/services/elevation.service";
import { learningPathService } from "@/features/learning/services/learning-path.service";
import { learningPathRepository } from "@/features/learning/repositories/learning-path.repository";
import { trialService } from "@/features/trials/services/trial.service";
import { collectibleService } from "@/features/collectibles/services/collectible.service";
import { chestService } from "@/features/chests/services/chest.service";
import { getCachedProgressRows } from "@/lib/cache/user-progress-cache";

import type { ProgressionPreviewViewModel, NextUnlockViewModel } from "./preview.types";

function sortByProgress(unlocks: NextUnlockViewModel[]): NextUnlockViewModel[] {
  return [...unlocks].sort((a, b) => b.progressPercent - a.progressPercent);
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

    const region = learningPath.regions.find((r) => r.slug === regionSlug);
    const unlocks: NextUnlockViewModel[] = [];

    if (companionNext) {
      unlocks.push({
        kind: "companion",
        label: companionNext.label,
        progressPercent: companionNext.progressPercent,
        remainingLabel: companionNext.remainingLabel,
        href: "/camp",
      });
    }

    if (region && region.progressPercent < 100) {
      const readyTrial = trials.find(
        (t) =>
          t.regionSlug === regionSlug &&
          t.availability === "available" &&
          !t.progress?.passed,
      );
      if (readyTrial) {
        unlocks.push({
          kind: "trial",
          label: readyTrial.title,
          progressPercent: region.progressPercent,
          remainingLabel: `${region.progressPercent}% region progress`,
          href: `/trials/${readyTrial.slug}`,
        });
      } else if (learningPath.nextLesson && learningPath.nextLessonHref) {
        unlocks.push({
          kind: "region",
          label: `Continue ${region.name}`,
          progressPercent: region.progressPercent,
          remainingLabel: learningPath.nextLesson.title,
          href: learningPath.nextLessonHref,
        });
      }
    }

    if (elevation.nextReward) {
      unlocks.push({
        kind: "title",
        label: elevation.nextReward.title,
        progressPercent: elevation.levelProgressPercent,
        remainingLabel: `${elevation.epToNextLevel} EP to next level`,
        href: "/profile",
      });
    }

    if (collectibleNext) {
      unlocks.push(collectibleNext);
    }

    if (chestNext) {
      unlocks.push(chestNext);
    }

    const sorted = sortByProgress(unlocks);
    return {
      unlocks: sorted,
      primaryUnlock: sorted[0] ?? null,
    };
  }
}

export const progressionPreviewService = new ProgressionPreviewService();
