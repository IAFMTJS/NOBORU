import type { ContentStatus } from "@/lib/content/types";

export type ListeningExerciseRow = {
  id: string;
  title: string;
  slug: string;
  audio_url: string | null;
  japanese_text: string;
  romaji: string | null;
  english: string | null;
  question: string;
  options: string[];
  correct_option_index: number;
  jlpt_level: string | null;
  difficulty: number;
  estimated_duration: number;
  status: ContentStatus;
};

export type ListeningChallengeRow = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  jlpt_level: string | null;
  difficulty: number;
  status: ContentStatus;
};

export type ListeningChallengeItemRow = {
  id: string;
  challenge_id: string;
  exercise_id: string;
  order_index: number;
};

export type ListeningProgressRow = {
  id: string;
  user_id: string;
  content_type: "exercise" | "challenge";
  content_id: string;
  status: "not_started" | "in_progress" | "completed";
  score: number;
  completed_at: string | null;
};

export type ListeningExerciseViewModel = {
  id: string;
  title: string;
  slug: string;
  audioUrl: string | null;
  japaneseText: string;
  romaji: string | null;
  english: string | null;
  question: string;
  options: string[];
  correctOptionIndex: number;
};

export type ListeningExerciseListEntryViewModel = {
  id: string;
  title: string;
  slug: string;
  estimatedDuration: number;
  completed: boolean;
  score: number;
};

export type ListeningExerciseDetailViewModel = ListeningExerciseViewModel & {
  jlptLevel: string | null;
  completed: boolean;
  score: number;
};

export type ListeningChallengeListEntryViewModel = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  exerciseCount: number;
  completed: boolean;
  score: number;
};

export type ListeningChallengeDetailViewModel = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  jlptLevel: string | null;
  exercises: ListeningExerciseViewModel[];
  completed: boolean;
  score: number;
};

export type ListeningHubViewModel = {
  exercises: ListeningExerciseListEntryViewModel[];
  challenges: ListeningChallengeListEntryViewModel[];
  completedCount: number;
  totalCount: number;
  progressPercent: number;
};

export type ListeningLessonContent = {
  type: "listening";
  id: string;
  title: string;
  slug: string;
  audioUrl: string | null;
  japaneseText: string;
  romaji: string | null;
  english: string | null;
  question: string;
  options: string[];
  correctOptionIndex: number;
};

export type ListeningChallengeLessonContent = {
  type: "listening_challenge";
  id: string;
  title: string;
  slug: string;
  description: string | null;
  exercises: ListeningExerciseViewModel[];
};
