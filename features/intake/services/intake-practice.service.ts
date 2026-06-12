import { applicationRepository } from "@/features/application/repositories/application.repository";
import { hiraganaRepository } from "@/features/hiragana/repositories/hiragana.repository";
import { katakanaRepository } from "@/features/katakana/repositories/katakana.repository";
import { vocabularyRepository } from "@/features/vocabulary/repositories/vocabulary.repository";
import {
  INTAKE_GROW_MAX_NEW_KANA,
  INTAKE_PRACTICE_LIMIT,
} from "@/features/intake/constants/intake.constants";
import type {
  IntakePracticeMode,
  IntakePracticeSessionViewModel,
  IntakePracticeStep,
} from "@/features/intake/types/intake.types";
import {
  isWithinKnownKanaCoverage,
  listNewKanaInText,
} from "@/features/intake/utils/kana-coverage";
import type { ApplicationExerciseRow } from "@/features/application/types/application.types";
import type { LessonApplicationStep } from "@/features/learning/types/lesson.types";
import { buildRecallStep, shuffle } from "@/features/learning/utils/exercise-steps";
import type { VocabularyRow } from "@/features/vocabulary/types/vocabulary.types";

function toApplicationStep(
  exercise: ApplicationExerciseRow,
  index: number,
  total: number,
): LessonApplicationStep {
  return {
    kind: "application",
    direction: exercise.direction,
    prompt: exercise.prompt,
    display: exercise.japanese_text ?? "",
    displayHint: exercise.display_hint,
    acceptedAnswers: exercise.accepted_answers,
    index,
    total,
  };
}

function buildKnownCharacterSet(
  hiragana: Array<{ character: string }>,
  katakana: Array<{ character: string }>,
): Set<string> {
  return new Set([
    ...hiragana.map((item) => item.character),
    ...katakana.map((item) => item.character),
  ]);
}

function filterExercisesByMode(
  exercises: ApplicationExerciseRow[],
  knownCharacters: Set<string>,
  mode: IntakePracticeMode,
): ApplicationExerciseRow[] {
  return exercises.filter((exercise) => {
    const text = exercise.japanese_text ?? exercise.accepted_answers.join("");
    if (mode === "reinforce") {
      return isWithinKnownKanaCoverage(text, knownCharacters, 0);
    }
    return isWithinKnownKanaCoverage(
      text,
      knownCharacters,
      INTAKE_GROW_MAX_NEW_KANA,
    );
  });
}

function buildVocabularyRecallSteps(
  knownVocabulary: VocabularyRow[],
  limit: number,
): IntakePracticeStep[] {
  if (knownVocabulary.length < 2) return [];

  const selected = shuffle(knownVocabulary).slice(0, Math.min(limit, knownVocabulary.length));
  const meanings = knownVocabulary.map((word) => word.meaning);

  return selected.map((word, index) =>
    buildRecallStep(
      {
        type: "vocabulary",
        id: word.id,
        kana: word.kana,
        kanji: word.kanji,
        meaning: word.meaning,
        partOfSpeech: word.part_of_speech,
        audioUrl: word.audio_url,
        examples: [],
      },
      meanings,
      index + 1,
      selected.length,
      "consolidation",
    ),
  );
}

class IntakePracticeService {
  async buildSession(
    userId: string,
    mode: IntakePracticeMode,
  ): Promise<IntakePracticeSessionViewModel> {
    const [
      hiraganaIds,
      katakanaIds,
      vocabularyIds,
      exercises,
      allHiragana,
      allKatakana,
    ] = await Promise.all([
      hiraganaRepository.listLearnedHiraganaIds(userId),
      katakanaRepository.listLearnedKatakanaIds(userId),
      vocabularyRepository.listLearnedVocabularyIds(userId),
      applicationRepository.listPublished(),
      hiraganaRepository.listPublished(),
      katakanaRepository.listPublished(),
    ]);

    const knownHiragana = allHiragana.filter((item) => hiraganaIds.includes(item.id));
    const knownKatakana = allKatakana.filter((item) => katakanaIds.includes(item.id));
    const knownCharacters = buildKnownCharacterSet(knownHiragana, knownKatakana);

    const eligibleExercises = shuffle(
      filterExercisesByMode(exercises, knownCharacters, mode),
    );

    const applicationLimit =
      mode === "grow"
        ? Math.max(4, Math.floor(INTAKE_PRACTICE_LIMIT * 0.7))
        : Math.floor(INTAKE_PRACTICE_LIMIT * 0.6);

    const applicationSteps = eligibleExercises
      .slice(0, applicationLimit)
      .map((exercise, index, array) =>
        toApplicationStep(exercise, index + 1, array.length),
      );

    const vocabularyRows =
      vocabularyIds.length > 0
        ? await vocabularyRepository.findByIds(vocabularyIds)
        : [];

    const vocabularySteps = buildVocabularyRecallSteps(
      vocabularyRows,
      INTAKE_PRACTICE_LIMIT - applicationSteps.length,
    );

    const steps: IntakePracticeStep[] = shuffle([
      ...applicationSteps,
      ...vocabularySteps,
    ]).slice(0, INTAKE_PRACTICE_LIMIT);

    const newKanaCharacters = Array.from(
      new Set(
        steps.flatMap((step) => {
          if (step.kind !== "application") return [];
          return listNewKanaInText(step.display, knownCharacters);
        }),
      ),
    );

    if (steps.length === 0) {
      throw new Error(
        mode === "grow"
          ? "Add a few more kana in the questionnaire, then try Grow practice again."
          : "Mark more kana or words as known to unlock practice.",
      );
    }

    return {
      mode,
      modeLabel: mode === "grow" ? "Learn more" : "Practice what you know",
      steps: steps.map((step, index) => ({
        ...step,
        index: index + 1,
        total: steps.length,
      })),
      knownHiraganaCount: knownHiragana.length,
      knownKatakanaCount: knownKatakana.length,
      knownVocabularyCount: vocabularyRows.length,
      newKanaCharacters,
    };
  }

  async previewCoverage(userId: string): Promise<{
    reinforceCount: number;
    growCount: number;
    knownKanaCount: number;
  }> {
    const [hiraganaIds, katakanaIds, exercises, allHiragana, allKatakana] =
      await Promise.all([
        hiraganaRepository.listLearnedHiraganaIds(userId),
        katakanaRepository.listLearnedKatakanaIds(userId),
        applicationRepository.listPublished(),
        hiraganaRepository.listPublished(),
        katakanaRepository.listPublished(),
      ]);

    const knownHiragana = allHiragana.filter((item) => hiraganaIds.includes(item.id));
    const knownKatakana = allKatakana.filter((item) => katakanaIds.includes(item.id));
    const knownCharacters = buildKnownCharacterSet(knownHiragana, knownKatakana);

    const reinforce = filterExercisesByMode(exercises, knownCharacters, "reinforce");
    const grow = filterExercisesByMode(exercises, knownCharacters, "grow");

    return {
      reinforceCount: reinforce.length,
      growCount: grow.length,
      knownKanaCount: knownCharacters.size,
    };
  }
}

export const intakePracticeService = new IntakePracticeService();
