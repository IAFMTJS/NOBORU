import type {
  GrammarLessonContent,
  HiraganaLessonContent,
  KanjiLessonContent,
  KatakanaLessonContent,
  LessonContent,
  LessonConjugationStep,
  LessonFillBlankOption,
  LessonFillBlankStep,
  LessonListeningRecallStep,
  LessonMatchingStep,
  LessonRecallStep,
  LessonSentenceTypedStep,
  LessonStep,
  LessonTranslationChoiceStep,
  LessonWordBankStep,
  PedagogyStepMeta,
  ScoredLessonStep,
  VocabularyLessonContent,
} from "@/features/learning/types/lesson.types";
import type { LessonStage } from "@/lib/learning/lesson-stage.constants";
import type { LessonPhase } from "@/lib/learning/lesson-phase.constants";
import { STAGE_TO_PHASE } from "@/lib/learning/lesson-phase.constants";
import type { HintVisibility } from "@/lib/learning/hint-policy.service";
import type { BlankTarget } from "@/lib/learning/knowledge-block/types";
import { parseTeachingStepsFromExplanation } from "@/lib/learning/knowledge-block/concept-detection";
import {
  LESSON_MIXED_RECALL_MAX_ITEMS,
  LESSON_MIXED_RECALL_MIN_ITEMS,
} from "@/features/learning/constants/lesson.constants";
import { deriveKanaRomaji, deriveSentenceRomaji } from "@/features/learning/utils/kana-romaji";
import {
  buildAcceptedAnswers,
  buildGrammarMeaningAcceptedAnswers,
  buildJapaneseSurfaceAcceptedAnswers,
} from "@/features/learning/utils/recall-answers";
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

export function getJapaneseRomaji(content: LessonContent): string | null {
  switch (content.type) {
    case "vocabulary": {
      if (content.romaji && !/\s/.test(content.romaji)) {
        return content.romaji;
      }
      return deriveKanaRomaji(content.kana) || null;
    }
    case "kanji": {
      const reading = content.kunyomi[0] ?? content.onyomi[0] ?? null;
      return reading ? deriveKanaRomaji(reading) || null : null;
    }
    case "hiragana":
    case "katakana":
      return content.romaji || null;
    case "grammar":
      return parseGrammarTitleMetadata(content.title).romaji;
    default:
      return null;
  }
}

/** Romaji for recall prompts — uses step metadata with fallbacks for cached sessions. */
export function resolveRecallStepRomaji(
  step: Pick<LessonRecallStep, "display" | "reading" | "romaji" | "contentType">,
): string | null {
  if (step.romaji) return step.romaji;

  const reading = step.reading?.trim();
  if (reading && reading !== step.display) {
    const fromReading = deriveKanaRomaji(reading);
    if (fromReading) return fromReading;
  }

  if (step.contentType === "grammar") {
    return parseGrammarTitleMetadata(step.display).romaji;
  }

  if (
    step.contentType === "vocabulary" ||
    step.contentType === "kanji" ||
    step.contentType === "hiragana" ||
    step.contentType === "katakana"
  ) {
    const fromDisplay = deriveKanaRomaji(step.display);
    if (fromDisplay) return fromDisplay;
  }

  return null;
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
      romaji: getJapaneseRomaji(content),
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
  pool: LessonDrillPoolContext,
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
  const options = buildRecallOptions(surface, pool.japaneseSurfaces);

  return withContentMeta(
    {
      kind: "recall",
      mode: "choice",
      contentType: content.type,
      prompt: "Choose the correct Japanese",
      display: getRecallAnswer(content),
      options,
      optionMeta: buildSurfaceOptionMeta(options, pool.lessonContents),
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
      ? buildGrammarMeaningAcceptedAnswers(meaning)
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

function parseGrammarTitleMetadata(title: string): TokenMetadata {
  const match = title.match(/^(.+?)\s*\(([a-zA-Z][a-zA-Z\s\-']*)\)\s*$/);
  if (!match) {
    return { romaji: null, reading: null };
  }

  const reading = match[1]?.trim() ?? null;
  const romaji = match[2]?.trim().toLowerCase() ?? null;
  return {
    reading: reading && reading.length > 0 ? reading : null,
    romaji: romaji && romaji.length > 0 ? romaji : null,
  };
}

function findVocabularyMetadataForSurface(
  japanese: string,
  contents: LessonContent[],
): TokenMetadata | null {
  let best: { meta: TokenMetadata; length: number } | null = null;

  for (const content of contents) {
    if (content.type !== "vocabulary") continue;

    const surfaces = [content.kanji, content.kana].filter(
      (value): value is string => Boolean(value),
    );
    const romaji =
      content.romaji && !/\s/.test(content.romaji)
        ? content.romaji
        : deriveKanaRomaji(content.kana) || null;
    const meta: TokenMetadata = {
      romaji,
      reading: content.kana,
    };

    for (const surface of surfaces) {
      const matches =
        japanese === surface ||
        surface.startsWith(japanese) ||
        japanese.startsWith(surface);
      if (!matches) continue;

      const length = surface.length;
      if (!best || length > best.length) {
        best = { meta, length };
      }
    }

    const leadingKanji = content.kanji?.match(/^[\u4e00-\u9fff]+/)?.[0];
    if (leadingKanji && leadingKanji === japanese) {
      const length = leadingKanji.length;
      if (!best || length > best.length) {
        best = { meta, length };
      }
    }
  }

  return best?.meta ?? null;
}

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
      const romaji =
        content.romaji && !/\s/.test(content.romaji)
          ? content.romaji
          : deriveKanaRomaji(content.kana) || null;
      const meta = { romaji, reading: content.kana };
      register(japanese, meta);
      register(content.kana, meta);
      if (content.kanji) {
        register(content.kanji, meta);
        const leadingKanji = content.kanji.match(/^[\u4e00-\u9fff]+/)?.[0];
        if (leadingKanji && leadingKanji !== content.kanji) {
          register(leadingKanji, meta);
        }
      }
    }

    if (content.type === "kanji") {
      const reading = content.kunyomi[0] ?? content.onyomi[0] ?? null;
      const romaji = reading ? deriveKanaRomaji(reading) || null : null;
      register(content.character, { romaji, reading });
    }

    if (content.type === "hiragana" || content.type === "katakana") {
      register(content.character, {
        romaji: content.romaji,
        reading: content.character,
      });
    }

    if (content.type === "grammar") {
      register(content.title, parseGrammarTitleMetadata(content.title));
    }
  }

  return lookup;
}

export function resolveSurfaceDisplayMeta(
  surface: string,
  contents: LessonContent[],
): LessonFillBlankOption {
  const lookup = buildJapaneseTokenMetadataLookup(contents);
  const meta = lookup.get(surface) ?? findVocabularyMetadataForSurface(surface, contents);
  const reading =
    meta?.reading && meta.reading !== surface ? meta.reading : null;
  const romaji =
    meta?.romaji ??
    (reading ? deriveKanaRomaji(reading) || null : null) ??
    (deriveKanaRomaji(surface) || null);

  return {
    japanese: surface,
    reading,
    romaji,
  };
}

export function buildSurfaceOptionMeta(
  surfaces: string[],
  contents: LessonContent[],
): LessonFillBlankOption[] {
  return surfaces.map((surface) => resolveSurfaceDisplayMeta(surface, contents));
}

function resolveFillBlankOption(
  japanese: string,
  lookup: Map<string, TokenMetadata>,
  contents: LessonContent[] = [],
): LessonFillBlankOption {
  const meta =
    lookup.get(japanese) ?? findVocabularyMetadataForSurface(japanese, contents);
  const reading =
    meta?.reading ??
    (isKanaOnly(japanese) ? japanese : containsKanji(japanese) ? null : japanese);
  const romaji =
    meta?.romaji ??
    (reading ? deriveKanaRomaji(reading) || null : null) ??
    (isKanaOnly(japanese) ? deriveKanaRomaji(japanese) || null : null);

  return {
    japanese,
    romaji,
    reading: reading && reading !== japanese ? reading : null,
  };
}

export function resolveFillBlankPrompt(blankTarget?: BlankTarget): string {
  switch (blankTarget) {
    case "particle":
      return "Choose the missing particle.";
    case "conjugation":
      return "Complete the verb form.";
    case "grammar_element":
      return "Select the correct sentence piece.";
    case "word":
    default:
      return "Choose the missing part.";
  }
}

export function applyHintPolicyToStep<T extends LessonStep>(
  step: T,
  hintPolicy: HintVisibility,
): T {
  return {
    ...step,
    hintPolicy: {
      showKanji: hintPolicy.showKanji,
      showFurigana: hintPolicy.showFurigana,
      showRomaji: hintPolicy.showRomaji,
      showTranslation: hintPolicy.showTranslation,
      romajiOnDemand: hintPolicy.romajiOnDemand,
    },
  };
}

export function formatFillBlankAnswer(
  option: LessonFillBlankOption,
  showRomaji = true,
): string {
  if (showRomaji && option.romaji) return `${option.japanese} (${option.romaji})`;
  if (option.reading) return `${option.japanese} — ${option.reading}`;
  return option.japanese;
}

function collectJapaneseDistractorPool(
  exampleText: string,
  blankToken: string,
  pool: LessonDrillPoolContext,
  blankTarget?: BlankTarget,
): string[] {
  const sentenceTokens = tokenizeJapaneseSentence(exampleText).filter(
    (token) => token !== blankToken && isJapaneseSurface(token),
  );

  if (blankTarget === "particle") {
    const particles = ["は", "が", "を", "に", "で", "の", "と", "も", "へ"];
    return Array.from(new Set([...particles, ...sentenceTokens.filter(isJapaneseParticle)]));
  }

  const lessonSurfaces = pool.japaneseSurfaces.filter(
    (surface) => surface !== blankToken && isJapaneseSurface(surface),
  );

  return Array.from(
    new Set([
      ...sentenceTokens.filter((token) => !isJapaneseParticle(token)),
      ...lessonSurfaces,
    ]),
  );
}

function pickBlankToken(
  tokens: string[],
  content: GrammarLessonContent | VocabularyLessonContent,
  blankTarget?: BlankTarget,
): string | null {
  if (blankTarget === "particle") {
    return tokens.find((token) => isJapaneseParticle(token)) ?? null;
  }

  if (blankTarget === "conjugation") {
    const verbStem = tokens.find(
      (token) =>
        /み$|び$|ち$|き$|ぎ$|し$|り$|に$|い$/.test(token) &&
        !isJapaneseParticle(token),
    );
    if (verbStem) return verbStem;
    const polite = tokens.find((token) => token.endsWith("ます"));
    if (polite) return polite.replace(/ます$/, "");
  }

  const lessonSurfaces =
    content.type === "vocabulary"
      ? [content.kanji, content.kana].filter((value): value is string => Boolean(value))
      : [content.title];

  for (const surface of lessonSurfaces) {
    const exact = tokens.find(
      (token) => !isJapaneseParticle(token) && token === surface,
    );
    if (exact) return exact;
  }

  let bestMatch: string | null = null;
  let bestLength = -1;

  for (const surface of lessonSurfaces) {
    for (const token of tokens) {
      if (isJapaneseParticle(token)) continue;
      if (token === surface) return token;
      if (token.includes(surface) || surface.includes(token)) {
        if (token.length > bestLength) {
          bestLength = token.length;
          bestMatch = token;
        }
      }
    }
  }

  if (bestMatch) return bestMatch;

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
    promptReading: getJapaneseReading(content),
    promptRomaji: getJapaneseRomaji(content),
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
      romaji: getJapaneseRomaji(content),
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
      romaji: getJapaneseRomaji(content),
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
      romaji: getJapaneseRomaji(content),
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
      romaji: getJapaneseRomaji(content),
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
      romaji: getJapaneseRomaji(content),
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
  options?: { blankTarget?: BlankTarget; deferFullSentence?: boolean },
): LessonFillBlankStep | null {
  if (options?.deferFullSentence && content.type === "vocabulary") {
    return null;
  }

  const example = content.examples[0];
  if (!example) return null;

  const tokens = tokenizeJapaneseSentence(example.japaneseText);
  const blankTarget = options?.blankTarget ?? inferBlankTarget(tokens, content);
  const blankToken = pickBlankToken(tokens, content, blankTarget);
  if (!blankToken || blankToken.length > 12) return null;

  const sentenceWithBlank = example.japaneseText.replace(blankToken, "___");
  if (sentenceWithBlank === example.japaneseText) return null;

  const lookup = buildJapaneseTokenMetadataLookup([content, ...pool.lessonContents]);
  const contentPool = [content, ...pool.lessonContents];
  const distractorPool = collectJapaneseDistractorPool(
    example.japaneseText,
    blankToken,
    pool,
    blankTarget,
  ).filter((candidate) => {
    if (candidate === blankToken) return false;
    if (!isJapaneseSurface(candidate)) return false;
    if (
      containsKanji(candidate) &&
      !lookup.has(candidate) &&
      !findVocabularyMetadataForSurface(candidate, contentPool)
    ) {
      return false;
    }
    return true;
  });

  const japaneseOptions = buildRecallOptions(blankToken, distractorPool).map((japanese) =>
    resolveFillBlankOption(japanese, lookup, contentPool),
  );
  const correctIndex = japaneseOptions.findIndex(
    (option) => option.japanese === blankToken,
  );
  if (correctIndex < 0) return null;

  return withContentMeta(
    {
      kind: "fill_blank",
      prompt: resolveFillBlankPrompt(blankTarget),
      sentenceWithBlank,
      englishHint: example.english,
      sentenceRomaji: example.romaji ?? null,
      options: japaneseOptions,
      correctIndex,
      interaction: index % 2 === 0 ? "blocks" : "choice",
      blankTarget,
      index,
      total,
    },
    content,
    "guided_practice",
  ) as LessonFillBlankStep;
}

function inferBlankTarget(
  tokens: string[],
  content: GrammarLessonContent | VocabularyLessonContent,
): BlankTarget {
  if (content.type === "vocabulary") {
    return "word";
  }

  const title = content.title.replace(/\s*\([^)]*\)\s*$/, "").trim();
  if (/^(は|が|を|に|で|の|と|も|へ|から|まで|より|か)$/.test(title)) {
    return "particle";
  }
  if (/ます|て-form|た-form|stem|conjugat/i.test(`${content.title} ${content.meaning}`)) {
    return "conjugation";
  }
  return "grammar_element";
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
      referenceJapanese: example.japaneseText,
      sentenceRomaji: example.romaji ?? (deriveSentenceRomaji(example.japaneseText) || null),
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
      reading: content.kanji ? content.kana : null,
      romaji: getJapaneseRomaji(content),
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
      referenceJapanese: example.japaneseText,
      sentenceRomaji: example.romaji ?? (deriveSentenceRomaji(example.japaneseText) || null),
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

const PARTICLE_OPTIONS = ["は", "が", "を", "に", "で", "の", "と", "も", "へ"];

export function buildParticleChoiceStep(
  content: GrammarLessonContent,
  pool: LessonDrillPoolContext,
  index: number,
  total: number,
): LessonFillBlankStep | null {
  const particle = content.title.replace(/\s*\([^)]*\)\s*$/, "").trim();
  const example = content.examples[0];
  if (!example) {
    const options = buildRecallOptions(particle, PARTICLE_OPTIONS).map((japanese) => ({
      japanese,
      romaji: null,
      reading: null,
    }));
    return withContentMeta(
      {
        kind: "fill_blank",
        prompt: resolveFillBlankPrompt("particle"),
        sentenceWithBlank: `___`,
        englishHint: content.meaning,
        sentenceRomaji: null,
        options,
        correctIndex: options.findIndex((option) => option.japanese === particle),
        interaction: "choice",
        blankTarget: "particle",
        index,
        total,
      },
      content,
      "guided_practice",
    ) as LessonFillBlankStep;
  }

  return buildFillBlankStep(content, pool, index, total, { blankTarget: "particle" });
}

export function buildConjugationStep(
  content: GrammarLessonContent,
  pool: LessonDrillPoolContext,
  index: number,
  total: number,
): LessonConjugationStep | null {
  const teachingSteps = parseTeachingStepsFromExplanation(content.explanation);
  const example = content.examples[0];

  let dictionaryForm = teachingSteps?.[0]?.japanese ?? "";
  let targetForm = teachingSteps?.[teachingSteps.length - 1]?.japanese ?? "";

  if (!dictionaryForm && example) {
    const tokens = tokenizeJapaneseSentence(example.japaneseText);
    dictionaryForm = tokens.find((token) => /[ぁ-ん]+/.test(token) && !isJapaneseParticle(token)) ?? "";
    targetForm = tokens.find((token) => token.endsWith("ます")) ?? tokens[tokens.length - 1] ?? "";
  }

  if (!dictionaryForm || !targetForm) return null;

  const distractors = pool.japaneseSurfaces
    .filter((surface) => surface !== targetForm && surface.length <= targetForm.length + 2)
    .slice(0, 6);

  const options = buildRecallOptions(targetForm, [dictionaryForm, ...distractors]);
  const correctIndex = options.indexOf(targetForm);
  if (correctIndex < 0) return null;

  return withContentMeta(
    {
      kind: "conjugation",
      prompt: "Complete the verb form.",
      dictionaryForm,
      targetForm,
      options,
      correctIndex,
      teachingChain: teachingSteps?.map((step) => step.japanese),
      index,
      total,
    },
    content,
    "guided_practice",
  ) as LessonConjugationStep;
}

export function buildTranslationChoiceStep(
  content: GrammarLessonContent | VocabularyLessonContent,
  poolContents: LessonContent[],
  index: number,
  total: number,
): LessonTranslationChoiceStep | null {
  const example = content.examples[0];
  if (!example) return null;

  const correct = example.japaneseText.replace(/[。、！？]+$/g, "");
  const distractors = poolContents
    .filter((item) => item.id !== content.id)
    .map((item) => {
      if (item.type === "vocabulary" || item.type === "grammar") {
        return item.examples[0]?.japaneseText.replace(/[。、！？]+$/g, "") ?? null;
      }
      return null;
    })
    .filter((value): value is string => Boolean(value) && value !== correct)
    .slice(0, 3);

  while (distractors.length < 3) {
    distractors.push(
      correct
        .replace("を", "が")
        .replace("が", "を")
        .concat(distractors.length === 0 ? "ます" : ""),
    );
  }

  const options = buildRecallOptions(correct, distractors);

  return withContentMeta(
    {
      kind: "translation_choice",
      prompt: "Choose the correct Japanese sentence.",
      englishPrompt: example.english,
      options,
      correctIndex: options.indexOf(correct),
      index,
      total,
    },
    content,
    "context_application",
  ) as LessonTranslationChoiceStep;
}
