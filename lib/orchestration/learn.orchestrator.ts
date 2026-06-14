import { redirect } from "next/navigation";

import { learningPathService } from "@/features/learning/services/learning-path.service";
import { journeyService } from "@/features/learning/services/journey.service";
import { lessonService } from "@/features/learning/services/lesson.service";
import { hiraganaProgressService } from "@/features/hiragana/services/hiragana-progress.service";
import { katakanaProgressService } from "@/features/katakana/services/katakana-progress.service";
import { vocabularyProgressService } from "@/features/vocabulary/services/vocabulary-progress.service";
import { grammarProgressService } from "@/features/grammar/services/grammar-progress.service";
import { kanjiProgressService } from "@/features/kanji/services/kanji-progress.service";
import { readingProgressService } from "@/features/reading/services/reading-progress.service";
import { listeningProgressService } from "@/features/listening/services/listening-progress.service";
import type {
  ListeningChallengeDetailViewModel,
  ListeningExerciseDetailViewModel,
  ListeningHubViewModel,
} from "@/features/listening/types/listening.types";
import type { HiraganaChartViewModel } from "@/features/hiragana/types/hiragana.types";
import type { KatakanaChartViewModel } from "@/features/katakana/types/katakana.types";
import type {
  GrammarDetailViewModel,
  GrammarListViewModel,
} from "@/features/grammar/types/grammar.types";
import type {
  KanjiDetailViewModel,
  KanjiListViewModel,
} from "@/features/kanji/types/kanji.types";
import type {
  VocabularyDetailViewModel,
  VocabularyListViewModel,
} from "@/features/vocabulary/types/vocabulary.types";
import type {
  DialogueDetailViewModel,
  ReadingHubViewModel,
  StoryDetailViewModel,
} from "@/features/reading/types/reading.types";
import type {
  LearningPathViewModel,
  LessonSessionViewModel,
  RegionPathViewModel,
} from "@/features/learning/types/lesson.types";
import type {
  JourneyPathViewModel,
  JourneyRegionViewModel,
} from "@/features/learning/types/journey.types";
import { profileServerService } from "@/features/profile/services/profile-server.service";
import { requireAuthenticatedUserId } from "@/lib/orchestration/require-authenticated-user";
import { isJlptLevel, type JlptLevel } from "@/lib/content/types";

function resolveJlptLevel(value?: string | null): "n5" | "n4" {
  return isJlptLevel(value ?? "") && value === "n4" ? "n4" : "n5";
}

export async function getLearningPath(): Promise<LearningPathViewModel> {
  const userId = await requireAuthenticatedUserId();
  return learningPathService.getLearningPath(userId);
}

export async function getLearningPathWithContext(): Promise<{
  path: LearningPathViewModel;
  currentRegionSlug: string;
}> {
  const userId = await requireAuthenticatedUserId();
  const [path, profile] = await Promise.all([
    learningPathService.getLearningPath(userId),
    profileServerService.getProfileCore(),
  ]);

  return {
    path,
    currentRegionSlug: profile?.currentRegionSlug ?? path.regions[0]?.slug ?? "foothills",
  };
}

export async function getRegionPath(regionSlug: string): Promise<RegionPathViewModel> {
  const userId = await requireAuthenticatedUserId();
  const region = await learningPathService.getRegionPath(userId, regionSlug);

  if (!region) {
    redirect("/learn");
  }

  return region;
}

export async function getJourneyPath(): Promise<JourneyPathViewModel> {
  const userId = await requireAuthenticatedUserId();
  return journeyService.getJourneyPath(userId);
}

export async function getJourneyPathWithContext(): Promise<{
  journey: JourneyPathViewModel;
  currentRegionSlug: string;
}> {
  const userId = await requireAuthenticatedUserId();
  const [journey, profile] = await Promise.all([
    journeyService.getJourneyPath(userId),
    profileServerService.getProfileCore(),
  ]);

  return {
    journey,
    currentRegionSlug:
      journey.position.currentRegionSlug ??
      profile?.currentRegionSlug ??
      journey.regions[0]?.slug ??
      "foothills",
  };
}

export async function getRegionJourney(
  regionSlug: string,
): Promise<JourneyRegionViewModel> {
  const userId = await requireAuthenticatedUserId();
  const region = await journeyService.getRegionJourney(userId, regionSlug);

  if (!region) {
    redirect("/learn");
  }

  return region;
}

export async function getLessonSession(
  lessonId: string,
): Promise<LessonSessionViewModel> {
  const userId = await requireAuthenticatedUserId();
  const session = await lessonService.getLessonSession(lessonId, userId);

  if (!session) {
    redirect("/learn");
  }

  return session;
}

export async function getHiraganaChart(): Promise<HiraganaChartViewModel> {
  const userId = await requireAuthenticatedUserId();
  return hiraganaProgressService.getChart(userId);
}

export async function getKatakanaChart(): Promise<KatakanaChartViewModel> {
  const userId = await requireAuthenticatedUserId();
  return katakanaProgressService.getChart(userId);
}

export async function getVocabularyList(
  jlptLevel: "n5" | "n4" = "n5",
): Promise<VocabularyListViewModel> {
  const userId = await requireAuthenticatedUserId();
  return vocabularyProgressService.getListByJlpt(userId, jlptLevel);
}

export async function getN5VocabularyList(): Promise<VocabularyListViewModel> {
  return getVocabularyList("n5");
}

export async function getVocabularyDetail(
  wordId: string,
): Promise<VocabularyDetailViewModel | null> {
  const userId = await requireAuthenticatedUserId();
  return vocabularyProgressService.getWordDetail(userId, wordId);
}

export async function getGrammarList(
  jlptLevel: "n5" | "n4" = "n5",
): Promise<GrammarListViewModel> {
  const userId = await requireAuthenticatedUserId();
  return grammarProgressService.getListByJlpt(userId, jlptLevel);
}

export async function getN5GrammarList(): Promise<GrammarListViewModel> {
  return getGrammarList("n5");
}

export async function getGrammarDetail(
  grammarId: string,
): Promise<GrammarDetailViewModel | null> {
  const userId = await requireAuthenticatedUserId();
  return grammarProgressService.getGrammarDetail(userId, grammarId);
}

export async function getKanjiList(
  jlptLevel: "n5" | "n4" = "n5",
): Promise<KanjiListViewModel> {
  const userId = await requireAuthenticatedUserId();
  return kanjiProgressService.getListByJlpt(userId, jlptLevel);
}

export async function getN5KanjiList(): Promise<KanjiListViewModel> {
  return getKanjiList("n5");
}

export async function getKanjiDetail(
  kanjiId: string,
): Promise<KanjiDetailViewModel | null> {
  const userId = await requireAuthenticatedUserId();
  return kanjiProgressService.getKanjiDetail(userId, kanjiId);
}

export async function getReadingHub(
  jlptLevel: "n5" | "n4" = "n5",
): Promise<ReadingHubViewModel> {
  const userId = await requireAuthenticatedUserId();
  return readingProgressService.getHubByJlpt(userId, jlptLevel);
}

export async function getN5ReadingHub(): Promise<ReadingHubViewModel> {
  return getReadingHub("n5");
}

export async function getStoryDetail(slug: string): Promise<StoryDetailViewModel | null> {
  const userId = await requireAuthenticatedUserId();
  return readingProgressService.getStoryDetail(userId, slug);
}

export async function getDialogueDetail(
  slug: string,
): Promise<DialogueDetailViewModel | null> {
  const userId = await requireAuthenticatedUserId();
  return readingProgressService.getDialogueDetail(userId, slug);
}

export async function getListeningHub(
  jlptLevel: "n5" | "n4" = "n5",
): Promise<ListeningHubViewModel> {
  const userId = await requireAuthenticatedUserId();
  return listeningProgressService.getHubByJlpt(userId, jlptLevel);
}

export async function getN5ListeningHub(): Promise<ListeningHubViewModel> {
  return getListeningHub("n5");
}

export async function getListeningExerciseDetail(
  slug: string,
): Promise<ListeningExerciseDetailViewModel | null> {
  const userId = await requireAuthenticatedUserId();
  return listeningProgressService.getExerciseDetail(userId, slug);
}

export async function getListeningChallengeDetail(
  slug: string,
): Promise<ListeningChallengeDetailViewModel | null> {
  const userId = await requireAuthenticatedUserId();
  return listeningProgressService.getChallengeDetail(userId, slug);
}

export { resolveJlptLevel };
export type { JlptLevel };
