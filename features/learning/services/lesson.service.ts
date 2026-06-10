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
  LessonMatchingStep,
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
import { buildAcceptedAnswers } from "@/features/learning/utils/recall-answers";
import { learningPathService } from "@/features/learning/services/learning-path.service";
import { resolveRegionAccess } from "@/lib/learning/region-unlock";

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

function groupExamplesByParentId<T extends { vocabulary_id?: string; kanji_id?: string; grammar_id?: string }>(
  examples: T[],
  key: "vocabulary_id" | "kanji_id" | "grammar_id",
): Map<string, T[]> {
  const grouped = new Map<string, T[]>();
  for (const example of examples) {
    const parentId = example[key];
    if (!parentId) continue;
    const bucket = grouped.get(parentId) ?? [];
    bucket.push(example);
    grouped.set(parentId, bucket);
  }
  return grouped;
}

function getMatchingPrompt(content: LessonContent): string {
  switch (content.type) {
    case "vocabulary":
      return content.kanji ?? content.kana;
    case "hiragana":
    case "katakana":
    case "kanji":
      return content.character;
    default:
      return "";
  }
}

function buildMatchingStep(contents: LessonContent[]): LessonMatchingStep | null {
  const matchable = contents.filter(
    (content) =>
      content.type === "vocabulary" ||
      content.type === "hiragana" ||
      content.type === "katakana" ||
      content.type === "kanji",
  );

  if (matchable.length < 3) return null;

  const selected = matchable.slice(0, Math.min(4, matchable.length));
  const pairs = selected.map((content) => ({
    id: content.id,
    prompt: getMatchingPrompt(content),
    answer: getRecallAnswer(content),
  }));

  return {
    kind: "matching",
    prompt: "Match each item to its meaning or reading",
    pairs,
    index: 1,
    total: 1,
  };
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

  private async loadContentsBatch(
    items: Array<{ content_type: string; content_id: string }>,
  ): Promise<(LessonContent | null)[]> {
    const vocabularyIds = items
      .filter((item) => item.content_type === "vocabulary")
      .map((item) => item.content_id);
    const kanjiIds = items
      .filter((item) => item.content_type === "kanji")
      .map((item) => item.content_id);
    const grammarIds = items
      .filter((item) => item.content_type === "grammar")
      .map((item) => item.content_id);
    const hiraganaIds = items
      .filter((item) => item.content_type === "hiragana")
      .map((item) => item.content_id);
    const katakanaIds = items
      .filter((item) => item.content_type === "katakana")
      .map((item) => item.content_id);

    const specialTypes = new Set([
      "reading",
      "story",
      "dialogue",
      "listening",
      "listening_challenge",
    ]);
    const specialItems = items.filter((item) =>
      specialTypes.has(item.content_type),
    );

    const [
      vocabularyRows,
      vocabularyExamples,
      kanjiRows,
      kanjiExamples,
      grammarRows,
      grammarExamples,
      hiraganaRows,
      katakanaRows,
      specialContents,
    ] = await Promise.all([
      vocabularyRepository.findByIds(vocabularyIds),
      vocabularyRepository.listPublishedExamplesByVocabularyIds(vocabularyIds),
      kanjiRepository.findByIds(kanjiIds),
      kanjiRepository.listPublishedExamplesByKanjiIds(kanjiIds),
      grammarRepository.findByIds(grammarIds),
      grammarRepository.listPublishedExamplesByGrammarIds(grammarIds),
      hiraganaRepository.findByIds(hiraganaIds),
      katakanaRepository.findByIds(katakanaIds),
      Promise.all(
        specialItems.map((item) =>
          this.loadContent(item.content_type, item.content_id),
        ),
      ),
    ]);

    const vocabularyById = new Map(vocabularyRows.map((row) => [row.id, row]));
    const vocabularyExamplesById = groupExamplesByParentId(
      vocabularyExamples,
      "vocabulary_id",
    );
    const kanjiById = new Map(kanjiRows.map((row) => [row.id, row]));
    const kanjiExamplesById = groupExamplesByParentId(
      kanjiExamples,
      "kanji_id",
    );
    const grammarById = new Map(grammarRows.map((row) => [row.id, row]));
    const grammarExamplesById = groupExamplesByParentId(
      grammarExamples,
      "grammar_id",
    );
    const hiraganaById = new Map(hiraganaRows.map((row) => [row.id, row]));
    const katakanaById = new Map(katakanaRows.map((row) => [row.id, row]));
    const specialByKey = new Map(
      specialItems.map((item, index) => [
        `${item.content_type}:${item.content_id}`,
        specialContents[index] ?? null,
      ]),
    );

    return items.map((item) => {
      if (item.content_type === "vocabulary") {
        const row = vocabularyById.get(item.content_id);
        if (!row || row.status !== "published") return null;
        const examples = vocabularyExamplesById.get(row.id) ?? [];
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

      if (item.content_type === "kanji") {
        const row = kanjiById.get(item.content_id);
        if (!row || row.status !== "published") return null;
        const examples = kanjiExamplesById.get(row.id) ?? [];
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

      if (item.content_type === "grammar") {
        const row = grammarById.get(item.content_id);
        if (!row || row.status !== "published") return null;
        const examples = grammarExamplesById.get(row.id) ?? [];
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

      if (item.content_type === "hiragana") {
        const row = hiraganaById.get(item.content_id);
        if (!row || row.status !== "published") return null;
        return {
          type: "hiragana",
          id: row.id,
          character: row.character,
          romaji: row.romaji,
          rowLabel: row.row_label,
        } satisfies HiraganaLessonContent;
      }

      if (item.content_type === "katakana") {
        const row = katakanaById.get(item.content_id);
        if (!row || row.status !== "published") return null;
        return {
          type: "katakana",
          id: row.id,
          character: row.character,
          romaji: row.romaji,
          rowLabel: row.row_label,
        } satisfies KatakanaLessonContent;
      }

      if (specialTypes.has(item.content_type)) {
        return specialByKey.get(`${item.content_type}:${item.content_id}`) ?? null;
      }

      return null;
    });
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
        mode: "typed",
        contentType: "vocabulary",
        prompt: "Type the meaning of this word",
        display: content.kanji ?? content.kana,
        options,
        correctIndex: options.indexOf(content.meaning),
        acceptedAnswers: buildAcceptedAnswers(content.meaning),
        index,
        total,
      };
    }

    if (content.type === "kanji") {
      const options = buildRecallOptions(content.meaning, allAnswers);
      return {
        kind: "recall",
        mode: "typed",
        contentType: "kanji",
        prompt: "Type the meaning of this kanji",
        display: content.character,
        options,
        correctIndex: options.indexOf(content.meaning),
        acceptedAnswers: buildAcceptedAnswers(content.meaning),
        index,
        total,
      };
    }

    if (content.type === "hiragana") {
      const options = buildRecallOptions(content.romaji, allAnswers);
      return {
        kind: "recall",
        mode: "typed",
        contentType: "hiragana",
        prompt: "Type the romaji reading",
        display: content.character,
        options,
        correctIndex: options.indexOf(content.romaji),
        acceptedAnswers: buildAcceptedAnswers(content.romaji),
        index,
        total,
      };
    }

    if (content.type === "katakana") {
      const options = buildRecallOptions(content.romaji, allAnswers);
      return {
        kind: "recall",
        mode: "typed",
        contentType: "katakana",
        prompt: "Type the romaji reading",
        display: content.character,
        options,
        correctIndex: options.indexOf(content.romaji),
        acceptedAnswers: buildAcceptedAnswers(content.romaji),
        index,
        total,
      };
    }

    if (content.type === "grammar") {
      const options = buildRecallOptions(content.meaning, allAnswers);
      return {
        kind: "recall",
        mode: "choice",
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
      mode: "choice",
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
      const matchingStep = buildMatchingStep(practiceContents);
      return [
        intro,
        ...recallSteps,
        ...(matchingStep ? [matchingStep] : []),
        complete,
      ];
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
    const matchingStep = buildMatchingStep(contents);

    return [
      intro,
      ...teachSteps.flatMap((teach, index) => [teach, recallSteps[index]]),
      ...(matchingStep ? [matchingStep] : []),
      complete,
    ];
  }

  async getLessonSession(
    lessonId: string,
    userId: string,
  ): Promise<LessonSessionViewModel | null> {
    const lesson = await learningPathRepository.findPublishedLessonById(lessonId);
    if (!lesson) return null;

    const regionAccessible = await learningPathService.isRegionAccessible(
      userId,
      lesson.unit.region.slug,
    );
    if (!regionAccessible) return null;

    const items = await learningPathRepository.listLessonItems(lessonId);
    const loaded = await this.loadContentsBatch(items);
    const contents = loaded.filter(
      (content): content is LessonContent => content !== null,
    );

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
    const passedTrialSlugs = await learningPathService.getPassedTrialSlugs(userId);
    const progressByLesson = new Map(
      progressRows.map((row) => [row.lesson_id, row]),
    );

    for (const region of regions) {
      if (resolveRegionAccess(region.slug, passedTrialSlugs).availability === "locked") {
        continue;
      }

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
