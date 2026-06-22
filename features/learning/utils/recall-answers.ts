import type { LessonContent } from "@/features/learning/types/lesson.types";

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

  if (isMostlyLatinAnswer(trimmed) && romajiAnswers.length > 0) {
    const normalizedRomaji = normalizeRomajiAnswer(trimmed);
    return romajiAnswers.some(
      (answer) => normalizeRomajiAnswer(answer) === normalizedRomaji,
    );
  }

  return false;
}

export function buildAcceptedAnswers(
  primary: string,
  extras: string[] = [],
): string[] {
  return Array.from(
    new Set([primary, ...extras].map((value) => value.trim()).filter(Boolean)),
  );
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
      if (content.romaji) surfaces.push(content.romaji);
      break;
    }
    case "hiragana":
    case "katakana":
      surfaces.push(content.character, content.romaji);
      break;
    case "kanji":
      surfaces.push(content.character, ...content.kunyomi, ...content.onyomi);
      break;
  }

  const [primary, ...rest] = surfaces.filter(Boolean);
  return primary ? buildAcceptedAnswers(primary, rest) : [];
}
