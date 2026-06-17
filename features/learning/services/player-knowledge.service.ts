import { buildActiveVocabularyPool } from "@/lib/learning/active-vocabulary-pool.service";
import { getJlptLevelForRegion } from "@/lib/learning/region-jlpt";
import type { PlayerKnowledgeContext } from "@/lib/learning/learning-architecture.types";
import {
  getKnownIdsFromSnapshot,
  getMasteredIdsFromSnapshot,
  getScheduledReviewIdsFromSnapshot,
  getWeakIdsFromSnapshot,
} from "@/lib/learning/player-knowledge.utils";
import { learnedContentRepository } from "@/features/learning/repositories/learned-content.repository";
import {
  learningPathRepository,
  progressRepository,
} from "@/features/learning/repositories/learning-path.repository";

export type PlayerKnowledgeScope = {
  userId: string;
  regionSlug: string;
  unitId: string;
  lessonId: string;
};

function listUnlockedBranchIds(
  regions: Awaited<
    ReturnType<typeof learningPathRepository.listPublishedRegionsWithCurriculum>
  >,
  regionSlug: string,
  completedLessonIds: ReadonlySet<string>,
): string[] {
  const region = regions.find((entry) => entry.slug === regionSlug);
  if (!region) return [];

  const unlocked: string[] = [];
  for (const unit of region.units) {
    const hasProgress = unit.lessons.some((lesson) =>
      completedLessonIds.has(lesson.id),
    );
    if (hasProgress || unlocked.length > 0) {
      unlocked.push(unit.id);
    }
  }

  return unlocked.length > 0 ? unlocked : region.units.slice(0, 1).map((unit) => unit.id);
}

function listUnlockedChapterIds(
  regions: Awaited<
    ReturnType<typeof learningPathRepository.listPublishedRegionsWithCurriculum>
  >,
  regionSlug: string,
  completedLessonIds: ReadonlySet<string>,
  currentLessonId: string,
): string[] {
  const region = regions.find((entry) => entry.slug === regionSlug);
  if (!region) return [currentLessonId];

  const chapterIds: string[] = [];
  for (const unit of region.units) {
    for (const lesson of unit.lessons) {
      if (completedLessonIds.has(lesson.id)) {
        chapterIds.push(lesson.id);
      }
      if (lesson.id === currentLessonId && !chapterIds.includes(lesson.id)) {
        chapterIds.push(lesson.id);
      }
    }
  }

  return chapterIds;
}

async function listLessonVocabularyIds(lessonId: string): Promise<string[]> {
  const items = await learningPathRepository.listLessonItems(lessonId);
  return items
    .filter((item) => item.content_type === "vocabulary")
    .map((item) => item.content_id);
}

async function listPreviousLessonVocabularyIds(
  unitId: string,
  lessonId: string,
): Promise<string[]> {
  const regions = await learningPathRepository.listPublishedRegionsWithCurriculum();
  const unit = regions
    .flatMap((region) => region.units)
    .find((entry) => entry.id === unitId);
  if (!unit) return [];

  const lessonIndex = unit.lessons.findIndex((lesson) => lesson.id === lessonId);
  if (lessonIndex <= 0) return [];

  const previousLesson = unit.lessons[lessonIndex - 1];
  if (!previousLesson) return [];

  return listLessonVocabularyIds(previousLesson.id);
}

class PlayerKnowledgeService {
  async getContext(scope: PlayerKnowledgeScope): Promise<PlayerKnowledgeContext> {
    const [snapshot, regions, progressRows, currentChapterVocabularyIds, previousChapterVocabularyIds] =
      await Promise.all([
        learnedContentRepository.getSnapshot(scope.userId),
        learningPathRepository.listPublishedRegionsWithCurriculum(),
        progressRepository.listByUserId(scope.userId),
        listLessonVocabularyIds(scope.lessonId),
        listPreviousLessonVocabularyIds(scope.unitId, scope.lessonId),
      ]);

    const completedLessonIds = new Set(
      progressRows
        .filter((row) => row.status === "completed")
        .map((row) => row.lesson_id),
    );

    const knownVocabularyIds = getKnownIdsFromSnapshot(snapshot, "vocabulary");
    const knownGrammarIds = getKnownIdsFromSnapshot(snapshot, "grammar");
    const masteredVocabularyIds = getMasteredIdsFromSnapshot(snapshot, "vocabulary");
    const weakVocabularyIds = getWeakIdsFromSnapshot(snapshot, "vocabulary");
    const scheduledReviewVocabularyIds = getScheduledReviewIdsFromSnapshot(
      snapshot,
      "vocabulary",
    );

    const recentlyLearnedVocabularyIds = knownVocabularyIds.filter(
      (id) =>
        !previousChapterVocabularyIds.includes(id) &&
        !currentChapterVocabularyIds.includes(id),
    );

    const activePool = buildActiveVocabularyPool({
      currentChapterVocabularyIds: currentChapterVocabularyIds,
      previousChapterVocabularyIds: previousChapterVocabularyIds,
      recentlyLearnedVocabularyIds,
      scheduledReviewVocabularyIds,
    });

    return {
      jlptLevel: getJlptLevelForRegion(scope.regionSlug),
      unlockedBranchIds: listUnlockedBranchIds(
        regions,
        scope.regionSlug,
        completedLessonIds,
      ),
      unlockedChapterIds: listUnlockedChapterIds(
        regions,
        scope.regionSlug,
        completedLessonIds,
        scope.lessonId,
      ),
      knownVocabularyIds,
      knownGrammarIds,
      masteredVocabularyIds,
      weakVocabularyIds,
      activeVocabularyPool: activePool.vocabularyIds,
    };
  }

  async getGlobalContext(userId: string): Promise<PlayerKnowledgeContext | null> {
    const scope = await resolveDefaultLessonScope(userId);
    if (!scope) return null;
    return this.getContext(scope);
  }
}

async function resolveDefaultLessonScope(userId: string): Promise<PlayerKnowledgeScope | null> {
  const regions = await learningPathRepository.listPublishedRegionsWithCurriculum();
  const progressRows = await progressRepository.listByUserId(userId);
  const completed = new Set(
    progressRows
      .filter((row) => row.status === "completed")
      .map((row) => row.lesson_id),
  );

  for (const region of regions) {
    for (const unit of region.units) {
      for (const lesson of unit.lessons) {
        if (!completed.has(lesson.id)) {
          return {
            userId,
            regionSlug: region.slug,
            unitId: unit.id,
            lessonId: lesson.id,
          };
        }
      }
    }
  }

  const firstRegion = regions[0];
  const firstUnit = firstRegion?.units[0];
  const firstLesson = firstUnit?.lessons[0];
  if (!firstRegion || !firstUnit || !firstLesson) return null;

  return {
    userId,
    regionSlug: firstRegion.slug,
    unitId: firstUnit.id,
    lessonId: firstLesson.id,
  };
}

export const playerKnowledgeService = new PlayerKnowledgeService();
export { resolveDefaultLessonScope };
