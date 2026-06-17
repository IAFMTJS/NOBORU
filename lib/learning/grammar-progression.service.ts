import type { JlptLevel } from "@/lib/content/types";
import { getVocabIntroLimit } from "@/lib/learning/learning-architecture.constants";
import type { LessonContent } from "@/features/learning/types/lesson.types";

/** Grammar points introduced per mini chapter — proportional to vocab limits. */
export const GRAMMAR_INTRO_LIMITS_BY_JLPT: Readonly<Record<JlptLevel, number>> = {
  n5: 1,
  n4: 2,
  n3: 2,
  n2: 3,
  n1: 4,
};

export function getGrammarIntroLimit(jlptLevel: JlptLevel): number {
  return GRAMMAR_INTRO_LIMITS_BY_JLPT[jlptLevel];
}

export function capNewGrammarInLessonContents(
  contents: LessonContent[],
  jlptLevel: JlptLevel,
  knownGrammarIds: ReadonlySet<string>,
): LessonContent[] {
  const introLimit = getGrammarIntroLimit(jlptLevel);
  let newGrammarCount = 0;
  const capped: LessonContent[] = [];

  for (const content of contents) {
    if (content.type !== "grammar") {
      capped.push(content);
      continue;
    }

    if (knownGrammarIds.has(content.id)) {
      capped.push(content);
      continue;
    }

    if (newGrammarCount >= introLimit) continue;

    newGrammarCount += 1;
    capped.push(content);
  }

  return capped;
}

export function filterGrammarIdsToKnown(
  grammarIds: string[],
  knownGrammarIds: ReadonlySet<string>,
): string[] {
  return grammarIds.filter((id) => knownGrammarIds.has(id));
}

export function isWithinGrammarIntroLimit(
  jlptLevel: JlptLevel,
  newGrammarCount: number,
): boolean {
  return newGrammarCount <= GRAMMAR_INTRO_LIMITS_BY_JLPT[jlptLevel];
}

/** Vocab limit helper re-exported for curriculum tooling. */
export { getVocabIntroLimit };
