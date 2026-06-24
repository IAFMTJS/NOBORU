/** Serializable lookup payload for Trail Guide sentence annotations. */
export type VocabularyLookupEntry = {
  id: string;
  kana: string;
  kanji: string | null;
  romaji: string | null;
  meaning: string;
  surfaceForms: string[];
};

export type KanjiLookupEntry = {
  id: string;
  character: string;
  meaning: string;
  onyomi: string[];
  kunyomi: string[];
};

export type ComprehensionSupportContext = {
  knownVocabularyIds: string[];
  knownKanjiIds: string[];
  activeVocabularyPool: string[];
  masteredVocabularyIds: string[];
  vocabularyById: Record<string, VocabularyLookupEntry>;
  kanjiByCharacter: Record<string, KanjiLookupEntry>;
};

export type SentenceTokenAnnotation = {
  surface: string;
  reading: string | null;
  romaji: string | null;
  meaning: string | null;
  vocabularyId: string | null;
  unknownKanji: KanjiLookupEntry[];
  /** @deprecated Use isMastered — kept for existing readers. */
  isKnown: boolean;
  isMastered: boolean;
  shouldGloss: boolean;
  showFurigana: boolean;
};

export type SentenceSegment =
  | { kind: "plain"; text: string }
  | { kind: "token"; annotation: SentenceTokenAnnotation };

export type AnnotateSentenceOptions = {
  /** When true, gloss words in the active pool that are not yet mastered. */
  glossActivePool?: boolean;
};

export type ComprehensionSupportMode = "full" | "tap" | "none";
