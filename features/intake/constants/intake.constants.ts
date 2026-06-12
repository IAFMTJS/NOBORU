export const INTAKE_STEP_COUNT = 5;

export const INTAKE_COPY = {
  intro: {
    title: "What do you already know?",
    subtitle:
      "Tell us what you have learned before. We will use your kana and words to build practice that mixes Japanese you know with romaji and English hints — so you learn more from what you already have.",
  },
  hiragana: {
    title: "Hiragana you know",
    subtitle: "Tap every hiragana character you can read. Use row shortcuts to select faster.",
  },
  katakana: {
    title: "Katakana you know",
    subtitle: "Tap every katakana character you can read.",
  },
  vocabulary: {
    title: "Words you know",
    subtitle:
      "Select vocabulary you already recognize. Romaji and English will appear in practice for words you skip.",
  },
  summary: {
    title: "Your starting inventory",
    subtitle: "We will mark these as known and build practice from them.",
  },
} as const;

export const INTAKE_PRACTICE_LIMIT = 8;

export const INTAKE_GROW_MAX_NEW_KANA = 2;

export const INTAKE_ROW_SHORTCUTS = [
  { label: "あ行", match: "A row" },
  { label: "か行", match: "Ka row" },
  { label: "さ行", match: "Sa row" },
  { label: "た行", match: "Ta row" },
  { label: "な行", match: "Na row" },
  { label: "は行", match: "Ha row" },
  { label: "ま行", match: "Ma row" },
  { label: "や行", match: "Ya row" },
  { label: "ら行", match: "Ra row" },
  { label: "わ行", match: "Wa row" },
] as const;
