import { grammarRepository } from "@/features/grammar/repositories/grammar.repository";
import { hiraganaRepository } from "@/features/hiragana/repositories/hiragana.repository";
import { katakanaRepository } from "@/features/katakana/repositories/katakana.repository";
import { vocabularyRepository } from "@/features/vocabulary/repositories/vocabulary.repository";
import { kanjiRepository } from "@/features/kanji/repositories/kanji.repository";
import {
  learningPathRepository,
  progressRepository,
} from "@/features/learning/repositories/learning-path.repository";
import type {
  GrammarLessonContent,
  HiraganaLessonContent,
  KatakanaLessonContent,
  KanjiLessonContent,
  LessonContent,
  LessonRecallStep,
  LessonReadingStep,
  LessonSessionViewModel,
  LessonStep,
  LessonStoryStep,
  LessonDialogueStep,
  LessonListeningStep,
  LessonListeningChallengeStep,
  LessonSummaryViewModel,
  LessonTeachStep,
  ReadingLessonContent,
  VocabularyLessonContent,
} from "@/features/learning/types/lesson.types";
import type { ProgressStatus } from "@/features/learning/types/progress.types";
import { listeningProgressService } from "@/features/listening/services/listening-progress.service";
import { readingProgressService } from "@/features/reading/services/reading-progress.service";
import { readingRepository } from "@/features/reading/repositories/reading.repository";

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function buildRecallOptions(correct: string, distractors: string[]): string[] {
  const unique = Array.from(
    new Set(distractors.filter((value) => value !== correct)),
  ).slice(0, 3);
  return shuffle([correct, ...unique]).slice(0, 4);
}

function getRecallAnswer(content: LessonContent): string {
  switch (content.type) {
    case "hiragana":
    case "katakana":
      return content.romaji;
    case "grammar":
      return content.meaning;
    case "vocabulary":
    case "kanji":
      return content.meaning;
    default:
      return "";
  }
}

class LessonService {
  private async loadContent(
    contentType: string,
    contentId: string,
  ): Promise<LessonContent | null> {
    if (contentType === "vocabulary") {
      const row = await vocabularyRepository.findById(contentId);
      if (!row || row.status !== "published") return null;
      const examples = await vocabularyRepository.listPublishedExamplesByVocabularyId(
        row.id,
      );
      return {
        type: "vocabulary",
        id: row.id,
        kana: row.kana,
        kanji: row.kanji,
        meaning: row.meaning,
        partOfSpeech: row.part_of_speech,
        audioUrl: row.audio_url,
        examples: examples.map((example) => ({
          japaneseText: example.japanese_text,
          romaji: example.romaji,
          english: example.english,
        })),
      } satisfies VocabularyLessonContent;
    }

    if (contentType === "kanji") {
      const row = await kanjiRepository.findById(contentId);
      if (!row || row.status !== "published") return null;
      const examples = await kanjiRepository.listPublishedExamplesByKanjiId(row.id);
      return {
        type: "kanji",
        id: row.id,
        character: row.character,
        meaning: row.meaning,
        strokeCount: row.stroke_count,
        onyomi: row.readings
          .filter((reading) => reading.reading_type === "onyomi")
          .map((reading) => reading.reading),
        kunyomi: row.readings
          .filter((reading) => reading.reading_type === "kunyomi")
          .map((reading) => reading.reading),
        examples: examples.map((example) => ({
          japaneseText: example.japanese_text,
          romaji: example.romaji,
          english: example.english,
        })),
      } satisfies KanjiLessonContent;
    }

    if (contentType === "grammar") {
      const row = await grammarRepository.findById(contentId);
      if (!row || row.status !== "published") return null;
      const examples = await grammarRepository.listPublishedExamplesByGrammarId(
        row.id,
      );
      return {
        type: "grammar",
        id: row.id,
        title: row.title,
        meaning: row.meaning,
        explanation: row.explanation,
        examples: examples.map((example) => ({
          japaneseText: example.japanese_text,
          romaji: example.romaji,
          english: example.english,
        })),
      } satisfies GrammarLessonContent;
    }

    if (contentType === "hiragana") {
      const row = await hiraganaRepository.findById(contentId);
      if (!row || row.status !== "published") return null;
      return {
        type: "hiragana",
        id: row.id,
        character: row.character,
        romaji: row.romaji,
        rowLabel: row.row_label,
      } satisfies HiraganaLessonContent;
    }

    if (contentType === "katakana") {
      const row = await katakanaRepository.findById(contentId);
      if (!row || row.status !== "published") return null;
      return {
        type: "katakana",
        id: row.id,
        character: row.character,
        romaji: row.romaji,
        rowLabel: row.row_label,
      } satisfies KatakanaLessonContent;
    }

    if (contentType === "reading") {
      const row = await readingRepository.findExerciseById(contentId);
      if (!row || row.status !== "published") return null;
      return {
        type: "reading",
        id: row.id,
        title: row.title,
        japaneseText: row.japanese_text,
        romaji: row.romaji,
        english: row.english,
        question: row.question,
        options: row.options,
        correctOptionIndex: row.correct_option_index,
      } satisfies ReadingLessonContent;
    }

    if (contentType === "story") {
      return readingProgressService.loadStoryLessonContent(contentId);
    }

    if (contentType === "dialogue") {
      return readingProgressService.loadDialogueLessonContent(contentId);
    }

    if (contentType === "listening") {
      return listeningProgressService.loadExerciseLessonContent(contentId);
    }

    if (contentType === "listening_challenge") {
      return listeningProgressService.loadChallengeLessonContent(contentId);
    }

    return null;
  }

  private buildRecallStep(
    content: LessonContent,
    allAnswers: string[],
    index: number,
    total: number,
  ): LessonRecallStep {
    if (content.type === "vocabulary") {
      const options = buildRecallOptions(content.meaning, allAnswers);
      return {
        kind: "recall",
        contentType: "vocabulary",
        prompt: "What does this word mean?",
        display: content.kanji ? `${content.kana} · ${content.kanji}` : content.kana,
        options,
        correctIndex: options.indexOf(content.meaning),
        index,
        total,
      };
    }

    if (content.type === "kanji") {
      const options = buildRecallOptions(content.meaning, allAnswers);
      return {
        kind: "recall",
        contentType: "kanji",
        prompt: "What is the meaning of this kanji?",
        display: content.character,
        options,
        correctIndex: options.indexOf(content.meaning),
        index,
        total,
      };
    }

    if (content.type === "hiragana") {
      const options = buildRecallOptions(content.romaji, allAnswers);
      return {
        kind: "recall",
        contentType: "hiragana",
        prompt: "What is the romaji reading?",
        display: content.character,
        options,
        correctIndex: options.indexOf(content.romaji),
        index,
        total,
      };
    }

    if (content.type === "katakana") {
      const options = buildRecallOptions(content.romaji, allAnswers);
      return {
        kind: "recall",
        contentType: "katakana",
        prompt: "What is the romaji reading?",
        display: content.character,
        options,
        correctIndex: options.indexOf(content.romaji),
        index,
        total,
      };
    }

    if (content.type === "grammar") {
      const options = buildRecallOptions(content.meaning, allAnswers);
      return {
        kind: "recall",
        contentType: "grammar",
        prompt: "What does this grammar point mean?",
        display: content.title,
        options,
        correctIndex: options.indexOf(content.meaning),
        index,
        total,
      };
    }

    return {
      kind: "recall",
      contentType: "hiragana",
      prompt: "What is the romaji reading?",
      display: "?",
      options: allAnswers.slice(0, 4),
      correctIndex: 0,
      index,
      total,
    };
  }

  private buildSteps(
    lesson: {
      title: string;
      description: string | null;
      type: string;
      xp_reward: number;
    },
    contents: LessonContent[],
  ): LessonStep[] {
    const intro: LessonStep = {
      kind: "intro",
      title: lesson.title,
      description: lesson.description,
      lessonType: lesson.type,
      xpReward: lesson.xp_reward,
    };

    const complete: LessonStep = {
      kind: "complete",
      xpReward: lesson.xp_reward,
    };

    if (lesson.type === "reading") {
      const readingContents = contents.filter(
        (content): content is ReadingLessonContent => content.type === "reading",
      );
      const readingSteps: LessonReadingStep[] = readingContents.map(
        (content, index) => ({
          kind: "reading",
          content,
          index: index + 1,
          total: readingContents.length,
        }),
      );
      return [intro, ...readingSteps, complete];
    }

    if (lesson.type === "story") {
      const storyContent = contents.find((content) => content.type === "story");
      if (!storyContent || storyContent.type !== "story") {
        return [intro, complete];
      }
      const storyStep: LessonStoryStep = {
        kind: "story",
        content: storyContent,
      };
      return [intro, storyStep, complete];
    }

    if (lesson.type === "dialogue") {
      const dialogueContent = contents.find((content) => content.type === "dialogue");
      if (!dialogueContent || dialogueContent.type !== "dialogue") {
        return [intro, complete];
      }
      const dialogueStep: LessonDialogueStep = {
        kind: "dialogue",
        content: dialogueContent,
      };
      return [intro, dialogueStep, complete];
    }

    if (lesson.type === "listening") {
      const listeningContent = contents.find((content) => content.type === "listening");
      if (!listeningContent || listeningContent.type !== "listening") {
        return [intro, complete];
      }
      const listeningStep: LessonListeningStep = {
        kind: "listening",
        content: listeningContent,
      };
      return [intro, listeningStep, complete];
    }

    if (lesson.type === "listening_challenge") {
      const challengeContent = contents.find(
        (content) => content.type === "listening_challenge",
      );
      if (!challengeContent || challengeContent.type !== "listening_challenge") {
        return [intro, complete];
      }
      const challengeStep: LessonListeningChallengeStep = {
        kind: "listening_challenge",
        content: challengeContent,
      };
      return [intro, challengeStep, complete];
    }

    if (lesson.type === "practice") {
      const practiceContents = contents.filter(
        (
          content,
        ): content is
          | HiraganaLessonContent
          | KatakanaLessonContent
          | VocabularyLessonContent
          | GrammarLessonContent
          | KanjiLessonContent =>
          content.type === "hiragana" ||
          content.type === "katakana" ||
          content.type === "vocabulary" ||
          content.type === "grammar" ||
          content.type === "kanji",
      );
      const answers = practiceContents.map(getRecallAnswer);
      const recallSteps = practiceContents.map((content, index) =>
        this.buildRecallStep(content, answers, index + 1, practiceContents.length),
      );
      return [intro, ...recallSteps, complete];
    }

    const answers = contents.map(getRecallAnswer);
    const teachSteps: LessonTeachStep[] = contents.map((content, index) => ({
      kind: "teach",
      content,
      index: index + 1,
      total: contents.length,
    }));
    const recallSteps: LessonRecallStep[] = contents.map((content, index) =>
      this.buildRecallStep(content, answers, index + 1, contents.length),
    );

    return [
      intro,
      ...teachSteps.flatMap((teach, index) => [teach, recallSteps[index]]),
      complete,
    ];
  }

  async getLessonSession(
    lessonId: string,
    userId: string,
  ): Promise<LessonSessionViewModel | null> {
    const lesson = await learningPathRepository.findPublishedLessonById(lessonId);
    if (!lesson) return null;

    const items = await learningPathRepository.listLessonItems(lessonId);
    const contents: LessonContent[] = [];

    for (const item of items) {
      const content = await this.loadContent(item.content_type, item.content_id);
      if (content) contents.push(content);
    }

    const progress =
      (await progressRepository.findByUserAndLesson(userId, lessonId)) ?? null;
    const progressStatus: ProgressStatus = progress?.status ?? "not_started";
    const steps = this.buildSteps(lesson, contents);

    return {
      lessonId: lesson.id,
      unitId: lesson.unit.id,
      regionSlug: lesson.unit.region.slug,
      title: lesson.title,
      description: lesson.description,
      type: lesson.type,
      xpReward: lesson.xp_reward,
      status: lesson.status,
      progress: progressStatus,
      score: progress?.score ?? 0,
      steps,
    };
  }

  async getNextIncompleteLesson(
    userId: string,
  ): Promise<LessonSummaryViewModel | null> {
    const regions = await learningPathRepository.listPublishedRegionsWithCurriculum();
    const progressRows = await progressRepository.listByUserId(userId);
    const progressByLesson = new Map(
      progressRows.map((row) => [row.lesson_id, row]),
    );

    for (const region of regions) {
      for (const unit of region.units) {
        for (const lesson of unit.lessons) {
          const progress = progressByLesson.get(lesson.id);
          if (!progress || progress.status !== "completed") {
            return {
              id: lesson.id,
              unitId: unit.id,
              type: lesson.type,
              title: lesson.title,
              description: lesson.description,
              xpReward: lesson.xp_reward,
              estimatedDuration: lesson.estimated_duration,
              progress: progress?.status ?? "not_started",
              score: progress?.score ?? 0,
            };
          }
        }
      }
    }

    return null;
  }
}

export const lessonService = new LessonService();
