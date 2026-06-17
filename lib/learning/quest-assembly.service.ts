import type { PlayerKnowledgeContext } from "@/lib/learning/learning-architecture.types";

export const LANGUAGE_QUEST_OBJECTIVE_TYPES = [
  "deliver_item",
  "read_sign",
  "answer_npc",
  "choose_dialogue",
  "identify_object",
  "translate_clue",
] as const;

export type LanguageQuestObjectiveType =
  (typeof LANGUAGE_QUEST_OBJECTIVE_TYPES)[number];

export type LanguageQuestObjective = {
  type: LanguageQuestObjectiveType;
  vocabularyIds: string[];
  grammarIds: string[];
  prompt: string;
};

const OBJECTIVE_ROTATION: LanguageQuestObjectiveType[] = [
  "read_sign",
  "answer_npc",
  "identify_object",
  "translate_clue",
  "choose_dialogue",
  "deliver_item",
];

export function buildLanguageQuestObjectives(
  context: PlayerKnowledgeContext,
  count = 3,
): LanguageQuestObjective[] {
  const vocabularyIds = context.activeVocabularyPool.slice(0, count * 2);
  if (vocabularyIds.length === 0) return [];

  const objectives: LanguageQuestObjective[] = [];

  for (let index = 0; index < count; index += 1) {
    const type = OBJECTIVE_ROTATION[index % OBJECTIVE_ROTATION.length]!;
    const vocabSlice = vocabularyIds.slice(index, index + 2);
    if (vocabSlice.length === 0) continue;

    objectives.push({
      type,
      vocabularyIds: vocabSlice,
      grammarIds: context.knownGrammarIds.slice(0, 1),
      prompt: buildObjectivePrompt(type, vocabSlice.length),
    });
  }

  return objectives;
}

function buildObjectivePrompt(
  type: LanguageQuestObjectiveType,
  wordCount: number,
): string {
  switch (type) {
    case "deliver_item":
      return `Deliver the item using ${wordCount} learned word(s).`;
    case "read_sign":
      return "Read the trail sign and choose the correct meaning.";
    case "answer_npc":
      return "Answer the shrine keeper in natural Japanese.";
    case "choose_dialogue":
      return "Pick the dialogue option that fits the scene.";
    case "identify_object":
      return "Identify the object from the learned words.";
    case "translate_clue":
      return "Translate the clue to continue on the trail.";
    default:
      return "Apply what you have learned on the trail.";
  }
}
