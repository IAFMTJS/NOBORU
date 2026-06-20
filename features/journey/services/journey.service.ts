import { profileServerRepository } from "@/features/profile/repositories/profile-server.repository";
import {
  learningPathRepository,
} from "@/features/learning/repositories/learning-path.repository";
import { learningPathService } from "@/features/learning/services/learning-path.service";
import type {
  JourneyPathViewModel,
  JourneyPosition,
  JourneyRegionViewModel,
  RegionJourneyInput,
} from "@/features/journey/types/journey.types";
import type { RegionPathViewModel } from "@/features/learning/types/lesson.types";
import type { UserProgressRow } from "@/features/learning/types/progress.types";
import { getCachedProgressRows } from "@/lib/cache/user-progress-cache";
import { journeyLandmarkRepository } from "@/features/journey/repositories/journey-landmark.repository";
import { augmentRegionsWithBlueprint } from "@/features/journey/utils/journey-blueprint-merge.utils";
import type { JourneyLandmarkContent } from "@/features/journey/types/journey-content.types";
import {
  buildJourneyPathFromData,
  buildRegionJourney,
  canAccessLessonInPath,
  groupLandmarksByRegionId,
  resolveJourneyPositionFromPath,
} from "@/features/journey/utils/journey-path.builder";

export {
  buildJourneyPathFromData,
  buildRegionJourney,
  canAccessLessonInPath,
  canAccessLessonInRegion,
  resolveJourneyPositionFromPath,
  resolveNodeKind,
} from "@/features/journey/utils/journey-path.builder";

class JourneyService {
  async resolveJourneyPosition(userId: string): Promise<JourneyPosition> {
    const [regions, progressRows, passedTrialSlugs] = await Promise.all([
      learningPathRepository.listPublishedRegionsWithCurriculum(),
      getCachedProgressRows(userId),
      learningPathService.getPassedTrialSlugs(userId),
    ]);

    const path = learningPathService.buildLearningPath(
      regions,
      progressRows,
      passedTrialSlugs,
    );

    return resolveJourneyPositionFromPath(path.regions, progressRows, passedTrialSlugs);
  }

  async canAccessLesson(userId: string, lessonId: string): Promise<boolean> {
    const [regions, progressRows, passedTrialSlugs] = await Promise.all([
      learningPathRepository.listPublishedRegionsWithCurriculum(),
      getCachedProgressRows(userId),
      learningPathService.getPassedTrialSlugs(userId),
    ]);

    const path = learningPathService.buildLearningPath(
      regions,
      progressRows,
      passedTrialSlugs,
    );

    return canAccessLessonInPath(path.regions, lessonId, progressRows, passedTrialSlugs);
  }

  buildRegionJourney(
    region: RegionJourneyInput,
    progressRows: ReadonlyArray<UserProgressRow>,
    passedTrialSlugs: ReadonlySet<string>,
    options?: { globalStartIndex?: number },
  ): JourneyRegionViewModel {
    return buildRegionJourney(region, progressRows, passedTrialSlugs, options);
  }

  buildJourneyPath(
    regions: RegionPathViewModel[],
    progressRows: ReadonlyArray<UserProgressRow>,
    passedTrialSlugs: ReadonlySet<string>,
    landmarksByRegionId: Map<string, JourneyLandmarkContent[]> = new Map(),
  ): JourneyPathViewModel {
    return buildJourneyPathFromData(
      regions,
      progressRows,
      passedTrialSlugs,
      landmarksByRegionId,
    );
  }

  async getJourneyPath(userId: string): Promise<JourneyPathViewModel> {
    const [path, progressRows, passedTrialSlugs] = await Promise.all([
      learningPathService.getJourneyLearningPath(userId),
      getCachedProgressRows(userId),
      learningPathService.getPassedTrialSlugs(userId),
    ]);

    const augmentedRegions = augmentRegionsWithBlueprint(
      path.regions,
      passedTrialSlugs,
    );

    const landmarks = await journeyLandmarkRepository.listPublishedByRegionIds(
      augmentedRegions
        .filter((region) => !region.id.startsWith("blueprint-region:"))
        .map((region) => region.id),
    );

    return buildJourneyPathFromData(
      augmentedRegions,
      progressRows,
      passedTrialSlugs,
      groupLandmarksByRegionId(landmarks),
    );
  }

  async syncCurrentRegionToProfile(userId: string): Promise<string> {
    const position = await this.resolveJourneyPosition(userId);
    await profileServerRepository.updateCurrentRegionSlug(
      userId,
      position.currentRegionSlug,
    );
    return position.currentRegionSlug;
  }

  async getRegionJourney(
    userId: string,
    regionSlug: string,
  ): Promise<JourneyRegionViewModel | null> {
    const [region, progressRows, passedTrialSlugs] = await Promise.all([
      learningPathRepository.findPublishedRegionBySlug(regionSlug),
      getCachedProgressRows(userId),
      learningPathService.getPassedTrialSlugs(userId),
    ]);

    if (!region) return null;

    const path = learningPathService.buildLearningPath(
      [region],
      progressRows,
      passedTrialSlugs,
    );

    const regionPath = path.regions[0];
    if (!regionPath) return null;

    const landmarks = await journeyLandmarkRepository.listPublishedByRegionIds([
      region.id,
    ]);

    return buildRegionJourney(regionPath, progressRows, passedTrialSlugs, {
      cmsLandmarks: landmarks,
    });
  }
}

export const journeyService = new JourneyService();
