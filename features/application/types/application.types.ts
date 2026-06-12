import type { ContentStatus } from "@/lib/content/types";

export type ApplicationDirection = "to_japanese" | "to_english" | "to_romaji";

export type ApplicationScript = "hiragana" | "katakana" | "mixed";

export type ApplicationExerciseRow = {
  id: string;
  title: string;
  direction: ApplicationDirection;
  prompt: string;
  japanese_text: string | null;
  display_hint: string | null;
  accepted_answers: string[];
  script: ApplicationScript;
  difficulty: number;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
};

export type ApplicationLessonContent = {
  type: "application";
  id: string;
  title: string;
  direction: ApplicationDirection;
  prompt: string;
  japaneseText: string | null;
  displayHint: string | null;
  acceptedAnswers: string[];
  script: ApplicationScript;
};
