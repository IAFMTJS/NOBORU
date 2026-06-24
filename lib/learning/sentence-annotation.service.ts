import type {
  AnnotateSentenceOptions,
  ComprehensionSupportContext,
  KanjiLookupEntry,
  SentenceSegment,
  SentenceTokenAnnotation,
  VocabularyLookupEntry,
} from "@/lib/learning/comprehension-support.types";
import { deriveKanaRomaji } from "@/features/learning/utils/kana-romaji";

const TOKEN_PATTERN = /[\u3040-\u9fff\u30a0-\u30ff]+/g;
const KANJI_PATTERN = /[\u4e00-\u9fff]/g;
const KANA_ONLY_PATTERN = /^[\u3040-\u309F\u30A0-\u30FFー]+$/;

function isKanaOnly(text: string): boolean {
  return KANA_ONLY_PATTERN.test(text);
}

function listKanjiCharacters(text: string): string[] {
  const matches = text.match(KANJI_PATTERN);
  return matches ? Array.from(new Set(matches)) : [];
}

function matchVocabularyToken(
  token: string,
  support: ComprehensionSupportContext,
): VocabularyLookupEntry | null {
  let best: { entry: VocabularyLookupEntry; length: number } | null = null;

  for (const entry of Object.values(support.vocabularyById)) {
    for (const form of entry.surfaceForms) {
      if (!form) continue;
      if (token === form || token.includes(form) || form.includes(token)) {
        const length = form.length;
        if (!best || length > best.length) {
          best = { entry, length };
        }
      }
    }
  }

  return best?.entry ?? null;
}

function listUnknownKanjiInToken(
  token: string,
  support: ComprehensionSupportContext,
): KanjiLookupEntry[] {
  const knownKanji = new Set(support.knownKanjiIds);

  return listKanjiCharacters(token)
    .map((character) => support.kanjiByCharacter[character])
    .filter((entry): entry is KanjiLookupEntry => Boolean(entry))
    .filter((entry) => !knownKanji.has(entry.id));
}

function isTokenMastered(
  vocabulary: VocabularyLookupEntry | null,
  unknownKanji: KanjiLookupEntry[],
  support: ComprehensionSupportContext,
): boolean {
  const vocabularyMastered = vocabulary
    ? support.masteredVocabularyIds.includes(vocabulary.id)
    : true;

  return vocabularyMastered && unknownKanji.length === 0;
}

function resolveTokenRomaji(
  token: string,
  vocabulary: VocabularyLookupEntry | null,
): string | null {
  if (vocabulary?.romaji) {
    return vocabulary.romaji;
  }

  if (isKanaOnly(token)) {
    return deriveKanaRomaji(token) || null;
  }

  if (vocabulary?.kana) {
    return deriveKanaRomaji(vocabulary.kana) || null;
  }

  return null;
}

function buildTokenMeaning(
  vocabulary: VocabularyLookupEntry | null,
  unknownKanji: KanjiLookupEntry[],
): string | null {
  if (vocabulary) {
    return vocabulary.meaning;
  }

  if (unknownKanji.length === 0) {
    return null;
  }

  return unknownKanji.map((entry) => `${entry.character}: ${entry.meaning}`).join(" · ");
}

function annotateToken(
  token: string,
  support: ComprehensionSupportContext,
  _options: AnnotateSentenceOptions,
): SentenceTokenAnnotation {
  const vocabulary = matchVocabularyToken(token, support);
  const unknownKanji = listUnknownKanjiInToken(token, support);
  const isMastered = isTokenMastered(vocabulary, unknownKanji, support);
  const shouldGloss = !isMastered && (vocabulary !== null || unknownKanji.length > 0);
  const reading =
    vocabulary && vocabulary.kana !== token ? vocabulary.kana : null;
  const showFurigana = shouldGloss && Boolean(reading && reading !== token);
  const romaji = shouldGloss ? resolveTokenRomaji(token, vocabulary) : null;

  return {
    surface: token,
    reading,
    romaji,
    meaning: buildTokenMeaning(vocabulary, unknownKanji),
    vocabularyId: vocabulary?.id ?? null,
    unknownKanji,
    isKnown: isMastered,
    isMastered,
    shouldGloss,
    showFurigana,
  };
}

/** Split Japanese text into plain and annotated token segments for Trail Guide UI. */
export function annotateJapaneseSentence(
  text: string,
  support: ComprehensionSupportContext,
  options: AnnotateSentenceOptions = {},
): SentenceSegment[] {
  if (!text) return [];

  const segments: SentenceSegment[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(TOKEN_PATTERN)) {
    const token = match[0];
    const start = match.index ?? 0;
    if (!token) continue;

    if (start > lastIndex) {
      segments.push({
        kind: "plain",
        text: text.slice(lastIndex, start),
      });
    }

    segments.push({
      kind: "token",
      annotation: annotateToken(token, support, options),
    });

    lastIndex = start + token.length;
  }

  if (lastIndex < text.length) {
    segments.push({
      kind: "plain",
      text: text.slice(lastIndex),
    });
  }

  return segments;
}

export function sentenceHasUnknownTokens(
  text: string,
  support: ComprehensionSupportContext,
  options: AnnotateSentenceOptions = {},
): boolean {
  return annotateJapaneseSentence(text, support, options).some(
    (segment) => segment.kind === "token" && segment.annotation.shouldGloss,
  );
}
