import { applicationRepository } from "@/features/application/repositories/application.repository";
import type { ApplicationLessonContent } from "@/features/application/types/application.types";
import { grammarRepository } from "@/features/grammar/repositories/grammar.repository";
import { hiraganaProgressService } from "@/features/hiragana/services/hiragana-progress.service";
import { hiraganaRepository } from "@/features/hiragana/repositories/hiragana.repository";
import { katakanaProgressService } from "@/features/katakana/services/katakana-progress.service";
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
  LessonApplicationStep,
  LessonKnowledgeInventoryStep,
  LessonSummaryViewModel,
  LessonTeachStep,
  ReadingLessonContent,
  VocabularyLessonContent,
} from "@/features/learning/types/lesson.types";
import type { ProgressStatus } from "@/features/learning/types/progress.types";
import { listeningProgressService } from "@/features/listening/services/listening-progress.service";
import { readingProgressService } from "@/features/reading/services/reading-progress.service";
import { readingRepository } from "@/features/reading/repositories/reading.repository";
import { getLessonPassScore } from "@/features/learning/constants/lesson.constants";
import {
  buildGrammarProductionStep,
  buildMatchingStep,
  buildMixedRecallSteps,
  buildRecallStep,
  getRecallAnswer,
} from "@/features/learning/utils/exercise-steps";
import { learningPathService } from "@/features/learning/services/learning-path.service";
import { journeyService } from "@/features/journey/services/journey.service";
import { resolveRegionAccess } from "@/lib/learning/region-unlock";
import {
  buildCheckpointExerciseCandidates,
  capNewVocabularyInLessonContents,
  extractExerciseContents,
  partitionLessonContentsByKnown,
  planLessonExerciseCandidates,
} from "@/lib/learning/lesson-assembly.service";
import { capNewGrammarInLessonContents } from "@/lib/learning/grammar-progression.service";
import { planCheckpointActivities } from "@/lib/learning/checkpoint-assembly.service";
import { learnedContentRepository } from "@/features/learning/repositories/learned-content.repository";
import { playerKnowledgeService } from "@/features/learning/services/player-knowledge.service";

type LessonAssemblyPlan = {
  newContents: LessonContent[];
  exerciseContents: LessonContent[];
  exerciseIsReviewById: Map<string, boolean>;
};

function isKnownLessonContent(
  content: LessonContent,
  knownIdsByType: ReadonlyMap<string, ReadonlySet<string>>,
): boolean {
  const knownIds = knownIdsByType.get(content.type);
  return knownIds?.has(content.id) ?? false;
}

function resolveUnlocksRegionSlug(
  regions: Awaited<
    ReturnType<typeof learningPathRepository.listPublishedRegionsWithCurriculum>
  >,
  currentRegionSlug: string,
  currentLessonId: string,
  progressByLesson: ReadonlyMap<string, { status: ProgressStatus }>,
): string | null {
  const regionIndex = regions.findIndex((region) => region.slug === currentRegionSlug);
  if (regionIndex === -1 || regionIndex >= regions.length - 1) return null;

  const region = regions[regionIndex];
  if (!region) return null;

  const allOthersComplete = region.units.every((unit) =>
    unit.lessons.every((lesson) => {
      if (lesson.id === currentLessonId) return true;
      return progressByLesson.get(lesson.id)?.status === "completed";
    }),
  );

  if (!allOthersComplete) return null;

  return regions[regionIndex + 1]?.slug ?? null;
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

    if (contentType === "application") {
      const row = await applicationRepository.findById(contentId);
      if (!row || row.status !== "published") return null;
      return {
        type: "application",
        id: row.id,
        title: row.title,
        direction: row.direction,
        prompt: row.prompt,
        japaneseText: row.japanese_text,
        displayHint: row.display_hint,
        acceptedAnswers: row.accepted_answers,
        script: row.script,
      } satisfies ApplicationLessonContent;
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

    const applicationIds = items
      .filter((item) => item.content_type === "application")
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
      applicationRows,
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
      applicationRepository.findByIds(applicationIds),
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
    const applicationById = new Map(applicationRows.map((row) => [row.id, row]));
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

      if (item.content_type === "application") {
        const row = applicationById.get(item.content_id);
        if (!row || row.status !== "published") return null;
        return {
          type: "application",
          id: row.id,
          title: row.title,
          direction: row.direction,
          prompt: row.prompt,
          japaneseText: row.japanese_text,
          displayHint: row.display_hint,
          acceptedAnswers: row.accepted_answers,
          script: row.script,
        } satisfies ApplicationLessonContent;
      }

      if (specialTypes.has(item.content_type)) {
        return specialByKey.get(`${item.content_type}:${item.content_id}`) ?? null;
      }

      return null;
    });
  }

  private buildApplicationStep(
    content: ApplicationLessonContent,
    index: number,
    total: number,
  ): LessonApplicationStep {
    const display =
      content.direction === "to_japanese"
        ? content.prompt
        : (content.japaneseText ?? content.prompt);

    return {
      kind: "application",
      direction: content.direction,
      prompt: content.prompt,
      display,
      displayHint: content.displayHint,
      acceptedAnswers: content.acceptedAnswers,
      index,
      total,
    };
  }

  private async buildKnowledgeInventoryStep(
    userId: string,
    script: "hiragana" | "katakana",
  ): Promise<LessonKnowledgeInventoryStep> {
    const chart =
      script === "katakana"
        ? await katakanaProgressService.getChart(userId)
        : await hiraganaProgressService.getChart(userId);

    const learnedCharacters = chart.entries
      .filter((entry) => entry.learned)
      .map((entry) => ({
        character: entry.character,
        romaji: entry.romaji,
      }));

    return {
      kind: "knowledge_inventory",
      script,
      learnedCount: chart.learnedCount,
      totalCount: chart.totalCount,
      learnedCharacters,
    };
  }

  private buildArchitectureExerciseBlock(
    exerciseContents: LessonContent[],
    exerciseIsReviewById: Map<string, boolean>,
    includeGrammarProduction: boolean,
  ): LessonStep[] {
    if (exerciseContents.length === 0) return [];

    const answers = exerciseContents.map(getRecallAnswer);
    const recallSteps: LessonRecallStep[] = exerciseContents.map((content, index) =>
      buildRecallStep(
        content,
        answers,
        index + 1,
        exerciseContents.length,
        exerciseIsReviewById.get(content.id) ? "consolidation" : "standard",
      ),
    );

    const grammarProductionSteps: LessonStep[] = [];
    if (includeGrammarProduction) {
      for (const [index, content] of exerciseContents.entries()) {
        if (content.type !== "grammar") continue;
        const productionStep = buildGrammarProductionStep(
          content,
          answers,
          index + 1,
          exerciseContents.length,
        );
        if (productionStep) grammarProductionSteps.push(productionStep);
      }
    }

    const matchingStep = buildMatchingStep(exerciseContents);
    const mixedRecallSteps = buildMixedRecallSteps(exerciseContents);

    return [
      ...recallSteps,
      ...grammarProductionSteps,
      ...(matchingStep ? [matchingStep] : []),
      ...mixedRecallSteps,
    ];
  }

  private buildDiscoverTeachSteps(contents: LessonContent[]): LessonTeachStep[] {
    return contents.map((content, index) => ({
      kind: "teach",
      content,
      index: index + 1,
      total: contents.length,
    }));
  }

  private async loadReviewVocabularyContents(
    userId: string,
    excludeIds: ReadonlySet<string>,
    limit: number,
  ): Promise<VocabularyLessonContent[]> {
    if (limit <= 0) return [];

    const reviewIds = await learnedContentRepository.getPrioritizedReviewIds(
      userId,
      "vocabulary",
      { excludeIds, limit },
    );
    if (reviewIds.length === 0) return [];

    const rows = await vocabularyRepository.findByIds(reviewIds);
    const examples = await vocabularyRepository.listPublishedExamplesByVocabularyIds(
      reviewIds,
    );
    const examplesById = groupExamplesByParentId(examples, "vocabulary_id");

    return rows
      .filter((row) => row.status === "published")
      .map(
        (row) =>
          ({
            type: "vocabulary",
            id: row.id,
            kana: row.kana,
            kanji: row.kanji,
            meaning: row.meaning,
            partOfSpeech: row.part_of_speech,
            audioUrl: row.audio_url,
            examples: (examplesById.get(row.id) ?? []).map((example) => ({
              japaneseText: example.japanese_text,
              romaji: example.romaji,
              english: example.english,
            })),
          }) satisfies VocabularyLessonContent,
      );
  }

  private async prepareLessonAssembly(
    userId: string,
    lesson: {
      id: string;
      type: string;
      checkpoint_activity_mix?: string[] | null;
      unit: { id: string; region: { slug: string } };
    },
    contents: LessonContent[],
  ): Promise<LessonAssemblyPlan | null> {
    const architectureLessonTypes = new Set([
      "vocabulary",
      "grammar",
      "kanji",
      "hiragana",
      "katakana",
      "practice",
    ]);
    if (!architectureLessonTypes.has(lesson.type)) return null;

    const playerContext = await playerKnowledgeService.getContext({
      userId,
      regionSlug: lesson.unit.region.slug,
      unitId: lesson.unit.id,
      lessonId: lesson.id,
    });

    const knownIdsByType = new Map<string, Set<string>>([
      ["vocabulary", new Set(playerContext.knownVocabularyIds)],
      ["grammar", new Set(playerContext.knownGrammarIds)],
      [
        "kanji",
        new Set(await learnedContentRepository.getKnownIdsByContentType(userId, "kanji")),
      ],
      [
        "hiragana",
        new Set(await learnedContentRepository.getKnownIdsByContentType(userId, "hiragana")),
      ],
      [
        "katakana",
        new Set(await learnedContentRepository.getKnownIdsByContentType(userId, "katakana")),
      ],
    ]);

    const workingContents =
      lesson.type === "practice"
        ? contents
        : capNewGrammarInLessonContents(
            capNewVocabularyInLessonContents(
              contents,
              playerContext.jlptLevel,
              knownIdsByType.get("vocabulary") ?? new Set<string>(),
            ),
            playerContext.jlptLevel,
            knownIdsByType.get("grammar") ?? new Set<string>(),
          );

    const { newContents, knownContents } = partitionLessonContentsByKnown(
      workingContents,
      new Set(
        workingContents
          .filter((content) => isKnownLessonContent(content, knownIdsByType))
          .map((content) => content.id),
      ),
    );

    const crossLessonReviewVocabulary = await this.loadReviewVocabularyContents(
      userId,
      new Set(workingContents.map((content) => content.id)),
      Math.max(newContents.length * 3, 6),
    );

    const reviewContents = [
      ...knownContents,
      ...crossLessonReviewVocabulary.filter(
        (content) => !workingContents.some((item) => item.id === content.id),
      ),
    ];

    let exerciseCandidates = planLessonExerciseCandidates(
      lesson.type === "practice" ? [] : newContents,
      reviewContents,
    );

    if (lesson.type === "practice") {
      const reviewPool = [
        ...reviewContents,
        ...workingContents.filter(
          (content) => !reviewContents.some((item) => item.id === content.id),
        ),
      ];
      const contentsById = new Map(reviewPool.map((content) => [content.id, content]));
      const checkpointPlans = planCheckpointActivities({
        vocabularyIds: reviewPool
          .filter((content) => content.type === "vocabulary")
          .map((content) => content.id),
        grammarIds: reviewPool
          .filter((content) => content.type === "grammar")
          .map((content) => content.id),
        listeningIds: reviewPool
          .filter((content) => content.type === "listening")
          .map((content) => content.id),
        readingIds: reviewPool
          .filter((content) => content.type === "reading")
          .map((content) => content.id),
        applicationIds: reviewPool
          .filter((content) => content.type === "application")
          .map((content) => content.id),
      });
      const checkpointCandidates = buildCheckpointExerciseCandidates(
        checkpointPlans,
        contentsById,
        lesson.checkpoint_activity_mix,
      );
      if (checkpointCandidates.length > 0) {
        exerciseCandidates = checkpointCandidates;
      }
    }

    const exerciseIsReviewById = new Map(
      exerciseCandidates.map((candidate) => [candidate.id, candidate.isReview]),
    );

    return {
      newContents: lesson.type === "practice" ? [] : newContents,
      exerciseContents: extractExerciseContents(exerciseCandidates),
      exerciseIsReviewById,
    };
  }

  private buildTeachRecallSequence(
    contents: LessonContent[],
    answers: string[],
    includeGrammarProduction: boolean,
  ): LessonStep[] {
    const teachSteps: LessonTeachStep[] = contents.map((content, index) => ({
      kind: "teach",
      content,
      index: index + 1,
      total: contents.length,
    }));

    const recallSteps: LessonRecallStep[] = contents.map((content, index) =>
      buildRecallStep(content, answers, index + 1, contents.length),
    );

    return teachSteps.flatMap((teach, index) => {
      const content = contents[index];
      const steps: LessonStep[] = [teach, recallSteps[index]];

      if (includeGrammarProduction && content.type === "grammar") {
        const productionStep = buildGrammarProductionStep(
          content,
          answers,
          index + 1,
          contents.length,
        );
        if (productionStep) steps.push(productionStep);
      }

      return steps;
    });
  }

  private buildSteps(
    lesson: {
      title: string;
      description: string | null;
      type: string;
      xp_reward: number;
    },
    contents: LessonContent[],
    assembly?: LessonAssemblyPlan,
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

    if (lesson.type === "application") {
      const applicationContents = contents.filter(
        (content): content is ApplicationLessonContent =>
          content.type === "application",
      );
      const applicationSteps = applicationContents.map((content, index) =>
        this.buildApplicationStep(content, index + 1, applicationContents.length),
      );
      return [intro, ...applicationSteps, complete];
    }

    if (lesson.type === "practice") {
      if (assembly) {
        return [
          intro,
          ...this.buildArchitectureExerciseBlock(
            assembly.exerciseContents,
            assembly.exerciseIsReviewById,
            false,
          ),
          complete,
        ];
      }

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
        buildRecallStep(content, answers, index + 1, practiceContents.length),
      );
      const matchingStep = buildMatchingStep(practiceContents);
      const mixedRecallSteps = buildMixedRecallSteps(practiceContents);
      return [
        intro,
        ...recallSteps,
        ...(matchingStep ? [matchingStep] : []),
        ...mixedRecallSteps,
        complete,
      ];
    }

    if (assembly) {
      return [
        intro,
        ...this.buildDiscoverTeachSteps(assembly.newContents),
        ...this.buildArchitectureExerciseBlock(
          assembly.exerciseContents,
          assembly.exerciseIsReviewById,
          lesson.type === "grammar",
        ),
        complete,
      ];
    }

    const answers = contents.map(getRecallAnswer);
    const teachRecallSteps = this.buildTeachRecallSequence(
      contents,
      answers,
      lesson.type === "grammar",
    );
    const matchingStep = buildMatchingStep(contents);
    const mixedRecallSteps = buildMixedRecallSteps(contents);

    return [
      intro,
      ...teachRecallSteps,
      ...(matchingStep ? [matchingStep] : []),
      ...mixedRecallSteps,
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

    const lessonAccessible = await journeyService.canAccessLesson(userId, lessonId);
    if (!lessonAccessible) return null;

    const items = await learningPathRepository.listLessonItems(lessonId);
    const loaded = await this.loadContentsBatch(items);
    const contents = loaded.filter(
      (content): content is LessonContent => content !== null,
    );

    const [progress, nextLesson, regions] = await Promise.all([
      progressRepository.findByUserAndLesson(userId, lessonId),
      this.getNextIncompleteLesson(userId),
      learningPathRepository.listPublishedRegionsWithCurriculum(),
    ]);
    const progressStatus: ProgressStatus = progress?.status ?? "not_started";
    const progressByLesson = new Map(
      (await progressRepository.listByUserId(userId)).map((row) => [row.lesson_id, row]),
    );
    const unlocksRegionSlug = resolveUnlocksRegionSlug(
      regions,
      lesson.unit.region.slug,
      lesson.id,
      progressByLesson,
    );
    const assembly = await this.prepareLessonAssembly(userId, lesson, contents);
    let steps = this.buildSteps(lesson, contents, assembly ?? undefined);

    if (lesson.type === "application") {
      const script =
        contents.find(
          (content): content is ApplicationLessonContent =>
            content.type === "application",
        )?.script ?? "hiragana";
      const resolvedScript = script === "katakana" ? "katakana" : "hiragana";
      const inventoryStep = await this.buildKnowledgeInventoryStep(
        userId,
        resolvedScript,
      );
      const introIndex = steps.findIndex((step) => step.kind === "intro");
      if (introIndex >= 0) {
        steps = [
          ...steps.slice(0, introIndex + 1),
          inventoryStep,
          ...steps.slice(introIndex + 1),
        ];
      }
    }

    return {
      lessonId: lesson.id,
      trailNodeId: lesson.id,
      unitId: lesson.unit.id,
      regionSlug: lesson.unit.region.slug,
      title: lesson.title,
      description: lesson.description,
      type: lesson.type,
      xpReward: lesson.xp_reward,
      status: lesson.status,
      progress: progressStatus,
      score: progress?.score ?? 0,
      passScore: getLessonPassScore(lesson.type),
      steps,
      nextLesson:
        nextLesson && nextLesson.id !== lesson.id
          ? {
              title: nextLesson.title,
              href: `/learn/lesson/${nextLesson.id}`,
            }
          : null,
      unlocksRegionSlug,
    };
  }

  private extractPreviewLabel(content: LessonContent): string | null {
    switch (content.type) {
      case "hiragana":
      case "katakana":
      case "kanji":
        return content.character;
      case "vocabulary":
        return content.kanji ?? content.kana;
      case "grammar":
        return content.title;
      default:
        return null;
    }
  }

  async getLessonPreviewLabels(
    lessonId: string,
    userId: string,
  ): Promise<string[] | null> {
    const lesson = await learningPathRepository.findPublishedLessonById(lessonId);
    if (!lesson) return null;

    const regionAccessible = await learningPathService.isRegionAccessible(
      userId,
      lesson.unit.region.slug,
    );
    if (!regionAccessible) return null;

    const items = await learningPathRepository.listLessonItems(lessonId);
    const labels: string[] = [];

    for (const item of items.slice(0, 5)) {
      const content = await this.loadContent(item.content_type, item.content_id);
      if (!content) continue;
      const label = this.extractPreviewLabel(content);
      if (label) labels.push(label);
    }

    return labels;
  }

  async getLessonSummary(
    lessonId: string,
    userId: string,
  ): Promise<LessonSummaryViewModel | null> {
    const lesson = await learningPathRepository.findPublishedLessonById(lessonId);
    if (!lesson) return null;

    const regionAccessible = await learningPathService.isRegionAccessible(
      userId,
      lesson.unit.region.slug,
    );
    if (!regionAccessible) return null;

    const progress = await progressRepository.findByUserAndLesson(
      userId,
      lessonId,
    );

    return {
      id: lesson.id,
      unitId: lesson.unit_id,
      type: lesson.type,
      title: lesson.title,
      description: lesson.description,
      xpReward: lesson.xp_reward,
      estimatedDuration: lesson.estimated_duration,
      progress: progress?.status ?? "not_started",
      score: progress?.score ?? 0,
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
