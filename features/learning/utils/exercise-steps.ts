import type {
  GrammarLessonContent,
  HiraganaLessonContent,
  KanjiLessonContent,
  KatakanaLessonContent,
  LessonContent,
  LessonFillBlankOption,
  LessonFillBlankStep,
  LessonListeningRecallStep,
  LessonMatchingStep,
  LessonRecallStep,
  LessonSentenceTypedStep,
  LessonWordBankStep,
  VocabularyLessonContent,
} from "@/features/learning/types/lesson.types";
import type { LessonStage } from "@/lib/learning/lesson-stage.constants";
import type { LessonPhase } from "@/lib/learning/lesson-phase.constants";
import { STAGE_TO_PHASE } from "@/lib/learning/lesson-phase.constants";
import {
  LESSON_MIXED_RECALL_MAX_ITEMS,
  LESSON_MIXED_RECALL_MIN_ITEMS,
} from "@/features/learning/constants/lesson.constants";
import { buildAcceptedAnswers, buildJapaneseSurfaceAcceptedAnswers } from "@/features/learning/utils/recall-answers";
import { tokenizeJapaneseSentence } from "@/features/learning/utils/japanese-tokenizer";

function phaseForStage(stage: LessonStage): LessonPhase {
  return STAGE_TO_PHASE[stage];
}

function withContentMeta<T extends object>(
  step: T,
  content: LessonContent,
  stage: LessonStage,
): T & { contentId: string; stage: LessonStage; lessonPhase: LessonPhase } {
  return {
    ...step,
    contentId: content.id,
    stage,
    lessonPhase: phaseForStage(stage),
  };
}

export function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

export function getJapaneseSurface(content: LessonContent): string {
  switch (content.type) {
    case "vocabulary":
      return content.kanji ?? content.kana;
    case "hiragana":
    case "katakana":
    case "kanji":
      return content.character;
    case "grammar":
      return content.title;
    default:
      return "";
  }
}

export function getJapaneseReading(content: LessonContent): string | null {
  switch (content.type) {
    case "vocabulary":
      return content.kanji ? content.kana : null;
    case "kanji":
      return content.kunyomi[0] ?? content.onyomi[0] ?? null;
    default:
      return null;
  }
}

export function buildRecognitionChoiceStep(
  content: LessonContent,
  allAnswers: string[],
  index: number,
  total: number,
  stage: LessonStage = "recognition",
): LessonRecallStep | null {
  if (
    content.type !== "vocabulary" &&
    content.type !== "kanji" &&
    content.type !== "hiragana" &&
    content.type !== "katakana" &&
    content.type !== "grammar"
  ) {
    return null;
  }

  const meaning = getRecallAnswer(content);
  const options = buildRecallOptions(meaning, allAnswers);

  return withContentMeta(
    {
      kind: "recall",
      mode: "choice",
      contentType: content.type,
      prompt: "Choose the correct meaning",
      display: getJapaneseSurface(content),
      reading: getJapaneseReading(content),
      options,
      correctIndex: options.indexOf(meaning),
      index,
      total,
    },
    content,
    stage,
  ) as LessonRecallStep;
}

export function buildReverseRecognitionStep(
  content: LessonContent,
  allJapaneseSurfaces: string[],
  index: number,
  total: number,
  stage: LessonStage = "recognition",
): LessonRecallStep | null {
  if (
    content.type !== "vocabulary" &&
    content.type !== "kanji" &&
    content.type !== "grammar"
  ) {
    return null;
  }

  const surface = getJapaneseSurface(content);
  const options = buildRecallOptions(surface, allJapaneseSurfaces);

  return withContentMeta(
    {
      kind: "recall",
      mode: "choice",
      contentType: content.type,
      prompt: "Choose the correct Japanese",
      display: getRecallAnswer(content),
      options,
      correctIndex: options.indexOf(surface),
      index,
      total,
    },
    content,
    stage,
  ) as LessonRecallStep;
}

export function buildActiveRecallStep(
  content: LessonContent,
  allAnswers: string[],
  index: number,
  total: number,
  stage: LessonStage = "active_recall",
): LessonRecallStep | null {
  if (
    content.type !== "vocabulary" &&
    content.type !== "kanji" &&
    content.type !== "hiragana" &&
    content.type !== "katakana" &&
    content.type !== "grammar"
  ) {
    return null;
  }

  const meaning = getRecallAnswer(content);
  const surface = getJapaneseSurface(content);

  if (content.type === "vocabulary" || content.type === "kanji") {
    return withContentMeta(
      {
        kind: "recall",
        mode: "typed",
        contentType: content.type,
        prompt: `Translate: "${meaning}" (Japanese or romaji)`,
        display: meaning,
        options: [],
        correctIndex: 0,
        acceptedAnswers: buildJapaneseSurfaceAcceptedAnswers(content),
        index,
        total,
      },
      content,
      stage,
    ) as LessonRecallStep;
  }

  const recall = buildRecallStep(content, allAnswers, index, total, "standard");
  const acceptedAnswers =
    content.type === "grammar"
      ? buildAcceptedAnswers(surface)
      : buildJapaneseSurfaceAcceptedAnswers(content);
  return withContentMeta(
    {
      ...recall,
      mode: "typed" as const,
      options: [],
      acceptedAnswers,
    },
    content,
    stage,
  ) as LessonRecallStep;
}

export function buildMasteryChallengeStep(
  content: LessonContent,
  allAnswers: string[],
  pool: LessonDrillPoolContext,
  index: number,
  total: number,
): LessonFillBlankStep | LessonWordBankStep | LessonSentenceTypedStep | LessonRecallStep | null {
  if (content.type === "grammar" || content.type === "vocabulary") {
    const sentenceStep = buildSentenceTypedStep(content, index, total);
    if (sentenceStep) {
      return { ...sentenceStep, stage: "mastery_challenge" as const, prompt: "Mastery challenge" };
    }
    const wordBank = buildWordBankStep(content, index, total);
    if (wordBank) {
      return { ...wordBank, stage: "mastery_challenge" as const, prompt: "Mastery challenge" };
    }
    const fillBlank = buildFillBlankStep(content, pool, index, total);
    if (fillBlank) {
      return { ...fillBlank, stage: "mastery_challenge" as const, prompt: "Mastery challenge" };
    }
  }

  const recall = buildRecallStep(content, allAnswers, index, total, "consolidation");
  const typedRecall: LessonRecallStep = {
    ...recall,
    stage: "mastery_challenge" as const,
    prompt: "Mastery challenge",
    mode: "typed" as const,
    options: [],
  };

  if (
    content.type === "vocabulary" ||
    content.type === "kanji" ||
    content.type === "hiragana" ||
    content.type === "katakana"
  ) {
    const meaning = getRecallAnswer(content);
    return {
      ...typedRecall,
      acceptedAnswers: buildJapaneseSurfaceAcceptedAnswers(content),
      ...(content.type === "vocabulary" || content.type === "kanji"
        ? {
            prompt: `Translate: "${meaning}" (Japanese or romaji)`,
            display: meaning,
          }
        : {}),
    };
  }

  return typedRecall;
}

export function buildRecallOptions(correct: string, distractors: string[]): string[] {
  const unique = Array.from(
    new Set(distractors.filter((value) => value !== correct)),
  ).slice(0, 3);
  return shuffle([correct, ...unique]).slice(0, 4);
}

export type LessonDrillPoolContext = {
  japaneseSurfaces: string[];
  lessonContents: LessonContent[];
};

export function buildLessonDrillPoolContext(
  lessonContents: LessonContent[],
): LessonDrillPoolContext {
  return {
    japaneseSurfaces: lessonContents.map(getJapaneseSurface).filter(Boolean),
    lessonContents,
  };
}

const JAPANESE_PARTICLE_RE =
  /^[はがをにのでともへかや]$|^です$|^ます$|^ません$|^ましょう$|^でした$/;

function isJapaneseParticle(token: string): boolean {
  return JAPANESE_PARTICLE_RE.test(token);
}

function containsKanji(text: string): boolean {
  return /\p{Script=Han}/u.test(text);
}

function isKanaOnly(text: string): boolean {
  return /^[\u3040-\u309F\u30A0-\u30FFー]+$/.test(text);
}

function isJapaneseSurface(text: string): boolean {
  return /[\u3040-\u30FF\u4E00-\u9FFF]/.test(text);
}

type TokenMetadata = {
  romaji: string | null;
  reading: string | null;
};

function buildJapaneseTokenMetadataLookup(
  contents: LessonContent[],
): Map<string, TokenMetadata> {
  const lookup = new Map<string, TokenMetadata>();

  function register(japanese: string, meta: TokenMetadata) {
    if (!japanese || !isJapaneseSurface(japanese)) return;
    const existing = lookup.get(japanese);
    lookup.set(japanese, {
      romaji: meta.romaji ?? existing?.romaji ?? null,
      reading: meta.reading ?? existing?.reading ?? null,
    });
  }

  for (const content of contents) {
    if (content.type === "vocabulary") {
      const japanese = content.kanji ?? content.kana;
      const meta = { romaji: content.romaji, reading: content.kana };
      register(japanese, meta);
      register(content.kana, meta);
      if (content.kanji) register(content.kanji, meta);
    }

    if (content.type === "kanji") {
      const reading = content.kunyomi[0] ?? content.onyomi[0] ?? null;
      register(content.character, { romaji: null, reading });
    }

    if (content.type === "hiragana" || content.type === "katakana") {
      register(content.character, { romaji: content.romaji, reading: content.character });
    }

    if (content.type === "grammar") {
      register(content.title, { romaji: null, reading: null });
    }
  }

  return lookup;
}

function resolveFillBlankOption(
  japanese: string,
  lookup: Map<string, TokenMetadata>,
): LessonFillBlankOption {
  const meta = lookup.get(japanese);
  const reading =
    meta?.reading ??
    (isKanaOnly(japanese) ? japanese : containsKanji(japanese) ? null : japanese);

  return {
    japanese,
    romaji: meta?.romaji ?? null,
    reading: reading && reading !== japanese ? reading : null,
  };
}

export function formatFillBlankAnswer(option: LessonFillBlankOption): string {
  if (option.romaji) return `${option.japanese} (${option.romaji})`;
  if (option.reading) return `${option.japanese} — ${option.reading}`;
  return option.japanese;
}

function collectJapaneseDistractorPool(
  exampleText: string,
  blankToken: string,
  pool: LessonDrillPoolContext,
): string[] {
  const sentenceTokens = tokenizeJapaneseSentence(exampleText).filter(
    (token) => token !== blankToken && !isJapaneseParticle(token) && isJapaneseSurface(token),
  );

  const lessonSurfaces = pool.japaneseSurfaces.filter(
    (surface) => surface !== blankToken && isJapaneseSurface(surface),
  );

  return Array.from(new Set([...sentenceTokens, ...lessonSurfaces]));
}

function pickBlankToken(
  tokens: string[],
  content: GrammarLessonContent | VocabularyLessonContent,
): string | null {
  const lessonSurfaces =
    content.type === "vocabulary"
      ? [content.kanji, content.kana].filter((value): value is string => Boolean(value))
      : [content.title];

  for (const surface of lessonSurfaces) {
    const match = tokens.find(
      (token) =>
        !isJapaneseParticle(token) &&
        (token === surface || token.includes(surface) || surface.includes(token)),
    );
    if (match) return match;
  }

  const candidates = tokens.filter(
    (token) => token.length >= 2 && !isJapaneseParticle(token) && isJapaneseSurface(token),
  );
  if (candidates.length > 0) {
    return [...candidates].sort((left, right) => right.length - left.length)[0] ?? null;
  }

  const fallback = tokens.find(
    (token) => token.length >= 1 && !isJapaneseParticle(token) && isJapaneseSurface(token),
  );
  return fallback ?? null;
}

export function getRecallAnswer(content: LessonContent): string {
  switch (content.type) {
    case "hiragana":
    case "katakana":
      return content.romaji;
    case "grammar":
    case "vocabulary":
    case "kanji":
      return content.meaning;
    default:
      return "";
  }
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

export function buildMatchingStep(contents: LessonContent[]): LessonMatchingStep | null {
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
    stage: "recognition",
    lessonPhase: "introduction",
    contentIds: selected.map((item) => item.id),
    index: 1,
    total: 1,
  };
}

export function buildRecallStep(
  content: LessonContent,
  allAnswers: string[],
  index: number,
  total: number,
  phase: "standard" | "consolidation" = "standard",
): LessonRecallStep {
  if (content.type === "vocabulary") {
    const options = buildRecallOptions(content.meaning, allAnswers);
    return {
      kind: "recall",
      mode: "typed",
      contentType: "vocabulary",
      prompt:
        phase === "consolidation"
          ? "Recall · type the meaning of this word"
          : "Type the meaning of this word",
      display: content.kanji ?? content.kana,
      reading: content.kanji ? content.kana : null,
      options,
      correctIndex: options.indexOf(content.meaning),
      acceptedAnswers: buildAcceptedAnswers(content.meaning),
      phase,
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
      prompt:
        phase === "consolidation"
          ? "Recall · type the meaning of this kanji"
          : "Type the meaning of this kanji",
      display: content.character,
      reading: content.kunyomi[0] ?? content.onyomi[0] ?? null,
      options,
      correctIndex: options.indexOf(content.meaning),
      acceptedAnswers: buildAcceptedAnswers(content.meaning),
      phase,
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
      prompt:
        phase === "consolidation"
          ? "Recall · type the romaji reading"
          : "Type the romaji reading",
      display: content.character,
      options,
      correctIndex: options.indexOf(content.romaji),
      acceptedAnswers: buildJapaneseSurfaceAcceptedAnswers(content),
      phase,
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
      prompt:
        phase === "consolidation"
          ? "Recall · type the romaji reading"
          : "Type the romaji reading",
      display: content.character,
      options,
      correctIndex: options.indexOf(content.romaji),
      acceptedAnswers: buildJapaneseSurfaceAcceptedAnswers(content),
      phase,
      index,
      total,
    };
  }

  if (content.type === "grammar") {
    const options = buildRecallOptions(content.meaning, allAnswers);
    return {
      kind: "recall",
      mode: phase === "consolidation" ? "typed" : "choice",
      contentType: "grammar",
      prompt:
        phase === "consolidation"
          ? "Recall · type what this grammar point means"
          : "What does this grammar point mean?",
      display: content.title,
      options,
      correctIndex: options.indexOf(content.meaning),
      acceptedAnswers:
        phase === "consolidation"
          ? buildAcceptedAnswers(content.meaning)
          : undefined,
      phase,
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
    phase,
    index,
    total,
  };
}

export function buildFillBlankStep(
  content: GrammarLessonContent | VocabularyLessonContent,
  pool: LessonDrillPoolContext,
  index: number,
  total: number,
): LessonFillBlankStep | null {
  const example = content.examples[0];
  if (!example) return null;

  const tokens = tokenizeJapaneseSentence(example.japaneseText);
  const blankToken = pickBlankToken(tokens, content);
  if (!blankToken || blankToken.length > 12) return null;

  const sentenceWithBlank = example.japaneseText.replace(blankToken, "___");
  if (sentenceWithBlank === example.japaneseText) return null;

  const lookup = buildJapaneseTokenMetadataLookup([content, ...pool.lessonContents]);
  const distractorPool = collectJapaneseDistractorPool(
    example.japaneseText,
    blankToken,
    pool,
  ).filter((candidate) => {
    if (candidate === blankToken) return false;
    if (!isJapaneseSurface(candidate)) return false;
    if (containsKanji(candidate) && !lookup.has(candidate)) return false;
    return true;
  });

  const japaneseOptions = buildRecallOptions(blankToken, distractorPool).map((japanese) =>
    resolveFillBlankOption(japanese, lookup),
  );
  const correctIndex = japaneseOptions.findIndex(
    (option) => option.japanese === blankToken,
  );
  if (correctIndex < 0) return null;

  return withContentMeta(
    {
      kind: "fill_blank",
      prompt:
        index % 2 === 0 ? "Tap a word to fill the blank" : "Fill in the blank",
      sentenceWithBlank,
      englishHint: example.english,
      options: japaneseOptions,
      correctIndex,
      interaction: index % 2 === 0 ? "blocks" : "choice",
      index,
      total,
    },
    content,
    "guided_practice",
  ) as LessonFillBlankStep;
}

export function buildWordBankStep(
  content: GrammarLessonContent | VocabularyLessonContent,
  index: number,
  total: number,
): LessonWordBankStep | null {
  const example = content.examples[0];
  if (!example) return null;

  const correctOrder = tokenizeJapaneseSentence(example.japaneseText);
  if (correctOrder.length < 2 || correctOrder.length > 8) return null;

  return withContentMeta(
    {
      kind: "word_bank",
      prompt: "Build the sentence",
      englishHint: example.english,
      tokens: shuffle(correctOrder),
      correctOrder,
      index,
      total,
    },
    content,
    "context_application",
  ) as LessonWordBankStep;
}

export function buildListeningRecallStep(
  content: VocabularyLessonContent,
  allAnswers: string[],
  index: number,
  total: number,
  stage: LessonStage = "listening",
): LessonListeningRecallStep | null {
  if (!content.audioUrl) return null;

  const options = buildRecallOptions(content.meaning, allAnswers);

  return withContentMeta(
    {
      kind: "listening_recall",
      prompt: "Listen and choose the meaning",
      audioUrl: content.audioUrl,
      display: content.kanji ?? content.kana,
      options,
      correctIndex: options.indexOf(content.meaning),
      index,
      total,
    },
    content,
    stage,
  ) as LessonListeningRecallStep;
}

export function buildSentenceTypedStep(
  content: GrammarLessonContent | VocabularyLessonContent,
  index: number,
  total: number,
): LessonSentenceTypedStep | null {
  const example = content.examples[0];
  if (!example) return null;

  return withContentMeta(
    {
      kind: "sentence_typed",
      prompt: "Type the sentence in Japanese or romaji",
      englishHint: example.english,
      acceptedAnswers: buildAcceptedAnswers(
        example.japaneseText.replace(/[。、！？]+$/g, ""),
        example.romaji ? [example.romaji] : [],
      ),
      index,
      total,
    },
    content,
    "context_application",
  ) as LessonSentenceTypedStep;
}

export function buildGrammarProductionStep(
  content: GrammarLessonContent,
  pool: LessonDrillPoolContext,
  index: number,
  total: number,
): LessonFillBlankStep | LessonWordBankStep | LessonSentenceTypedStep | null {
  const variant = index % 3;
  if (variant === 0) return buildWordBankStep(content, index, total);
  if (variant === 1) return buildFillBlankStep(content, pool, index, total);
  return buildSentenceTypedStep(content, index, total);
}

function isMixedRecallContent(
  content: LessonContent,
): content is
  | GrammarLessonContent
  | VocabularyLessonContent
  | HiraganaLessonContent
  | KatakanaLessonContent
  | KanjiLessonContent {
  return (
    content.type === "hiragana" ||
    content.type === "katakana" ||
    content.type === "vocabulary" ||
    content.type === "kanji" ||
    content.type === "grammar"
  );
}

export function buildMixedRecallSteps(contents: LessonContent[]): LessonRecallStep[] {
  const recallable = contents.filter(isMixedRecallContent);
  if (recallable.length < LESSON_MIXED_RECALL_MIN_ITEMS) return [];

  const selected = shuffle(recallable).slice(
    0,
    Math.min(LESSON_MIXED_RECALL_MAX_ITEMS, recallable.length),
  );
  const answers = contents.map(getRecallAnswer);

  return selected.map((content, index) =>
    buildRecallStep(content, answers, index + 1, selected.length, "consolidation"),
  );
}

type VarietyBuilder = (
  content: LessonContent,
  allAnswers: string[],
  pool: LessonDrillPoolContext,
  index: number,
  total: number,
) => { kind: string } | null;

const VARIETY_ROTATION: VarietyBuilder[] = [
  (content, allAnswers, _pool, index, total) => {
    if (content.type !== "vocabulary" || !content.audioUrl) return null;
    return buildListeningRecallStep(content, allAnswers, index, total);
  },
  (content, _allAnswers, pool, index, total) => {
    if (content.type !== "grammar" && content.type !== "vocabulary") return null;
    return buildFillBlankStep(content, pool, index, total);
  },
  (content, _allAnswers, _pool, index, total) => {
    if (content.type !== "grammar" && content.type !== "vocabulary") return null;
    return buildWordBankStep(content, index, total);
  },
  (content, _allAnswers, _pool, index, total) => {
    if (content.type !== "grammar" && content.type !== "vocabulary") return null;
    return buildSentenceTypedStep(content, index, total);
  },
  (content, allAnswers, _pool, index, total) => {
    if (content.type !== "grammar") return null;
    const step = buildRecallStep(content, allAnswers, index, total);
    return { ...step, mode: "choice" as const };
  },
];

export function buildVarietyStep(
  content: LessonContent,
  allAnswers: string[],
  pool: LessonDrillPoolContext,
  contentIndex: number,
  drillIndex: number,
  total: number,
): LessonFillBlankStep | LessonWordBankStep | LessonListeningRecallStep | LessonSentenceTypedStep | LessonRecallStep | null {
  const start = contentIndex % VARIETY_ROTATION.length;
  for (let offset = 0; offset < VARIETY_ROTATION.length; offset += 1) {
    const builder = VARIETY_ROTATION[(start + offset) % VARIETY_ROTATION.length];
    const step = builder(content, allAnswers, pool, drillIndex, total);
    if (step) return step as ReturnType<typeof buildVarietyStep>;
  }
  return null;
}
