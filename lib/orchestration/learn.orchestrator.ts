import { redirect } from "next/navigation";

import { AUTH_ROUTES } from "@/features/authentication/constants/auth.constants";
import { learningPathService } from "@/features/learning/services/learning-path.service";
import { lessonService } from "@/features/learning/services/lesson.service";
import { hiraganaProgressService } from "@/features/hiragana/services/hiragana-progress.service";
import { katakanaProgressService } from "@/features/katakana/services/katakana-progress.service";
import { vocabularyProgressService } from "@/features/vocabulary/services/vocabulary-progress.service";
import { grammarProgressService } from "@/features/grammar/services/grammar-progress.service";
import { kanjiProgressService } from "@/features/kanji/services/kanji-progress.service";
import { readingProgressService } from "@/features/reading/services/reading-progress.service";
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
import { profileServerService } from "@/features/profile/services/profile-server.service";

export async function getLearningPath(): Promise<LearningPathViewModel> {
  const profile = await profileServerService.getProfile();

  if (!profile) {
    redirect(AUTH_ROUTES.login);
  }

  if (!profile.onboardingCompleted) {
    redirect(AUTH_ROUTES.onboarding);
  }

  return learningPathService.getLearningPath(profile.userId);
}

export async function getRegionPath(regionSlug: string): Promise<RegionPathViewModel> {
  const profile = await profileServerService.getProfile();

  if (!profile) {
    redirect(AUTH_ROUTES.login);
  }

  const region = await learningPathService.getRegionPath(
    profile.userId,
    regionSlug,
  );

  if (!region) {
    redirect("/learn");
  }

  return region;
}

export async function getLessonSession(
  lessonId: string,
): Promise<LessonSessionViewModel> {
  const profile = await profileServerService.getProfile();

  if (!profile) {
    redirect(AUTH_ROUTES.login);
  }

  const session = await lessonService.getLessonSession(lessonId, profile.userId);

  if (!session) {
    redirect("/learn");
  }

  return session;
}

export async function getHiraganaChart(): Promise<HiraganaChartViewModel> {
  const profile = await profileServerService.getProfile();

  if (!profile) {
    redirect(AUTH_ROUTES.login);
  }

  return hiraganaProgressService.getChart(profile.userId);
}

export async function getKatakanaChart(): Promise<KatakanaChartViewModel> {
  const profile = await profileServerService.getProfile();

  if (!profile) {
    redirect(AUTH_ROUTES.login);
  }

  return katakanaProgressService.getChart(profile.userId);
}

export async function getN5VocabularyList(): Promise<VocabularyListViewModel> {
  const profile = await profileServerService.getProfile();

  if (!profile) {
    redirect(AUTH_ROUTES.login);
  }

  return vocabularyProgressService.getN5List(profile.userId);
}

export async function getVocabularyDetail(
  wordId: string,
): Promise<VocabularyDetailViewModel | null> {
  const profile = await profileServerService.getProfile();

  if (!profile) {
    redirect(AUTH_ROUTES.login);
  }

  return vocabularyProgressService.getWordDetail(profile.userId, wordId);
}

export async function getN5GrammarList(): Promise<GrammarListViewModel> {
  const profile = await profileServerService.getProfile();

  if (!profile) {
    redirect(AUTH_ROUTES.login);
  }

  return grammarProgressService.getN5List(profile.userId);
}

export async function getGrammarDetail(
  grammarId: string,
): Promise<GrammarDetailViewModel | null> {
  const profile = await profileServerService.getProfile();

  if (!profile) {
    redirect(AUTH_ROUTES.login);
  }

  return grammarProgressService.getGrammarDetail(profile.userId, grammarId);
}

export async function getN5KanjiList(): Promise<KanjiListViewModel> {
  const profile = await profileServerService.getProfile();

  if (!profile) {
    redirect(AUTH_ROUTES.login);
  }

  return kanjiProgressService.getN5List(profile.userId);
}

export async function getKanjiDetail(
  kanjiId: string,
): Promise<KanjiDetailViewModel | null> {
  const profile = await profileServerService.getProfile();

  if (!profile) {
    redirect(AUTH_ROUTES.login);
  }

  return kanjiProgressService.getKanjiDetail(profile.userId, kanjiId);
}

export async function getReadingHub(): Promise<ReadingHubViewModel> {
  const profile = await profileServerService.getProfile();

  if (!profile) {
    redirect(AUTH_ROUTES.login);
  }

  return readingProgressService.getHub(profile.userId);
}

export async function getStoryDetail(slug: string): Promise<StoryDetailViewModel | null> {
  const profile = await profileServerService.getProfile();

  if (!profile) {
    redirect(AUTH_ROUTES.login);
  }

  return readingProgressService.getStoryDetail(profile.userId, slug);
}

export async function getDialogueDetail(
  slug: string,
): Promise<DialogueDetailViewModel | null> {
  const profile = await profileServerService.getProfile();

  if (!profile) {
    redirect(AUTH_ROUTES.login);
  }

  return readingProgressService.getDialogueDetail(profile.userId, slug);
}
