import type { LessonContent } from "@/features/learning/types/lesson.types";
import { deriveKanaRomaji } from "@/features/learning/utils/kana-romaji";

export function normalizeRecallAnswer(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

/** Strip spaces for kana/kanji answer comparison. */
export function normalizeJapaneseAnswer(value: string): string {
  return value.trim().replace(/\s+/g, "");
}

const ROMAJI_DIACRITIC_MAP: Record<string, string> = {
  ā: "a",
  á: "a",
  à: "a",
  â: "a",
  ä: "a",
  ē: "e",
  é: "e",
  è: "e",
  ê: "e",
  ī: "i",
  í: "i",
  ì: "i",
  î: "i",
  ō: "o",
  ó: "o",
  ò: "o",
  ô: "o",
  ū: "u",
  ú: "u",
  ù: "u",
  û: "u",
};

export function normalizeRomajiAnswer(value: string): string {
  let normalized = value.trim().toLowerCase();
  for (const [from, to] of Object.entries(ROMAJI_DIACRITIC_MAP)) {
    normalized = normalized.replaceAll(from, to);
  }
  return normalized
    .replace(/[-'’.]/g, "")
    .replace(/\s+/g, "");
}

export function isMostlyLatinAnswer(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  return /^[a-zA-Z\s\-'’.ōūāēīôûêâîäëïöüàèìòù]+$/.test(trimmed);
}

export function isRecallAnswerCorrect(
  input: string,
  acceptedAnswers: string[],
): boolean {
  const normalized = normalizeRecallAnswer(input);
  if (!normalized) return false;

  return acceptedAnswers.some(
    (answer) => normalizeRecallAnswer(answer) === normalized,
  );
}

export function isJapaneseTextAnswerCorrect(
  input: string,
  acceptedAnswers: string[],
): boolean {
  const trimmed = input.trim();
  if (!trimmed) return false;

  const japaneseAnswers: string[] = [];
  const romajiAnswers: string[] = [];

  for (const answer of acceptedAnswers) {
    if (isMostlyLatinAnswer(answer)) {
      romajiAnswers.push(answer);
    } else {
      japaneseAnswers.push(answer);
    }
  }

  const normalizedJapanese = normalizeJapaneseAnswer(trimmed);
  if (
    japaneseAnswers.some(
      (answer) => normalizeJapaneseAnswer(answer) === normalizedJapanese,
    )
  ) {
    return true;
  }

  if (!isMostlyLatinAnswer(trimmed)) {
    return false;
  }

  const normalizedRomaji = normalizeRomajiAnswer(trimmed);
  if (
    romajiAnswers.some(
      (answer) => normalizeRomajiAnswer(answer) === normalizedRomaji,
    )
  ) {
    return true;
  }

  // Derive romaji from kana surfaces so typed answers work even when steps omit
  // explicit romaji (cached sessions, legacy assembly, or sentence-level metadata).
  return japaneseAnswers.some((answer) => {
    const derived = deriveKanaRomaji(answer);
    return derived !== "" && normalizeRomajiAnswer(derived) === normalizedRomaji;
  });
}

/** Prefer romaji in mistake feedback when the learner typed latin input. */
export function pickJapaneseAnswerCorrection(
  acceptedAnswers: string[],
  userAnswer = "",
): string {
  if (!acceptedAnswers.length) return "";

  if (isMostlyLatinAnswer(userAnswer)) {
    const listedRomaji = acceptedAnswers.find((answer) =>
      isMostlyLatinAnswer(answer),
    );
    if (listedRomaji) return listedRomaji;

    for (const answer of acceptedAnswers) {
      if (isMostlyLatinAnswer(answer)) continue;
      const derived = deriveKanaRomaji(answer);
      if (derived) return derived;
    }
  }

  return acceptedAnswers[0] ?? "";
}

export function buildAcceptedAnswers(
  primary: string,
  extras: string[] = [],
): string[] {
  return Array.from(
    new Set([primary, ...extras].map((value) => value.trim()).filter(Boolean)),
  );
}

/** English meaning variants for typed grammar recall (not the surface title). */
export function buildGrammarMeaningAcceptedAnswers(
  meaning: string,
  extras: string[] = [],
): string[] {
  const variants = new Set<string>();

  function addVariant(value: string) {
    const trimmed = value.trim();
    if (trimmed) variants.add(trimmed);
  }

  addVariant(meaning);
  addVariant(meaning.replace(/\s*\([^)]*\)\s*/g, " ").trim());

  if (meaning.includes("/")) {
    for (const part of meaning.split("/")) {
      addVariant(part);
      addVariant(part.replace(/\s*\([^)]*\)\s*/g, " ").trim());
    }
  }

  for (const extra of extras) {
    addVariant(extra);
  }

  return Array.from(variants);
}

export function buildJapaneseSurfaceAcceptedAnswers(
  content: Extract<
    LessonContent,
    { type: "vocabulary" | "kanji" | "hiragana" | "katakana" }
  >,
  extras: string[] = [],
): string[] {
  const surfaces: string[] = [...extras];

  switch (content.type) {
    case "vocabulary": {
      if (content.kanji) surfaces.push(content.kanji);
      surfaces.push(content.kana);
      const romaji = deriveKanaRomaji(content.kana);
      if (romaji) surfaces.push(romaji);
      break;
    }
    case "hiragana":
    case "katakana":
      surfaces.push(content.character, content.romaji);
      break;
    case "kanji": {
      surfaces.push(content.character, ...content.kunyomi, ...content.onyomi);
      for (const reading of [...content.kunyomi, ...content.onyomi]) {
        const romaji = deriveKanaRomaji(reading);
        if (romaji) surfaces.push(romaji);
      }
      break;
    }
  }

  const [primary, ...rest] = surfaces.filter(Boolean);
  return primary ? buildAcceptedAnswers(primary, rest) : [];
}
