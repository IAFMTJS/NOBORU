import { redirect } from "next/navigation";

import { learningPathService } from "@/features/learning/services/learning-path.service";
import { journeyService } from "@/features/journey/services/journey.service";
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
} from "@/features/learning/types/lesson.types";
import type {
  JourneyPathViewModel,
  JourneyRegionViewModel,
} from "@/features/journey/types/journey.types";
import { companionService } from "@/features/companion/services/companion.service";
import type { CompanionEvolutionSlug } from "@/features/companion/types/companion.types";
import { profileServerService } from "@/features/profile/services/profile-server.service";
import { streakService } from "@/features/achievements/services/streak.service";
import { elevationRepository } from "@/features/elevation/repositories/elevation.repository";
import { requireAuthenticatedUserId } from "@/lib/orchestration/require-authenticated-user";
import { isJlptLevel, type JlptLevel } from "@/lib/content/types";

function resolveJlptLevel(value?: string | null): "n5" | "n4" {
  return isJlptLevel(value ?? "") && value === "n4" ? "n4" : "n5";
}

export async function getLearningPath(): Promise<LearningPathViewModel> {
  const userId = await requireAuthenticatedUserId();
  return learningPathService.getLearningPath(userId);
}

export async function getJourneyPath(): Promise<JourneyPathViewModel> {
  const userId = await requireAuthenticatedUserId();
  return journeyService.getJourneyPath(userId);
}

export async function getJourneyPathWithContext(): Promise<{
  journey: JourneyPathViewModel;
  currentRegionSlug: string;
  profileStats: {
    displayName: string;
    levelLabel: string;
    currentStreak: number;
    totalXp: number;
  } | null;
  companionEvolutionSlug: CompanionEvolutionSlug | null;
}> {
  const userId = await requireAuthenticatedUserId();
  const [journey, profile, currentStreak, elevation, companion] = await Promise.all([
    journeyService.getJourneyPath(userId),
    profileServerService.getProfileCore(),
    streakService.getCurrentStreak(userId),
    elevationRepository.ensureElevation(userId),
    companionService.getCompanion(userId),
  ]);

  return {
    journey,
    currentRegionSlug:
      journey.position.currentRegionSlug ??
      profile?.currentRegionSlug ??
      journey.regions[0]?.slug ??
      "foothills",
    profileStats: profile
      ? {
          displayName: profile.displayName,
          levelLabel: profile.levelLabel,
          currentStreak,
          totalXp: elevation.total_ep,
        }
      : null,
    companionEvolutionSlug: companion?.evolutionSlug ?? null,
  };
}

export async function getRegionJourney(
  regionSlug: string,
): Promise<JourneyRegionViewModel> {
  const userId = await requireAuthenticatedUserId();
  const region = await journeyService.getRegionJourney(userId, regionSlug);

  if (!region) {
    redirect("/tree");
  }

  return region;
}

export async function getLessonSession(
  lessonId: string,
): Promise<LessonSessionViewModel> {
  const userId = await requireAuthenticatedUserId();
  const session = await lessonService.getLessonSession(lessonId, userId);

  if (!session) {
    redirect("/tree");
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
