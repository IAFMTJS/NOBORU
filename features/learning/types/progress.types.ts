export const PROGRESS_STATUSES = [
  "not_started",
  "in_progress",
  "completed",
] as const;

export type ProgressStatus = (typeof PROGRESS_STATUSES)[number];

export type UserProgressRow = {
  id: string;
  user_id: string;
  region_id: string | null;
  unit_id: string | null;
  lesson_id: string;
  status: ProgressStatus;
  score: number;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type StartProgressInput = {
  userId: string;
  lessonId: string;
};

export type CompleteProgressInput = {
  userId: string;
  lessonId: string;
  score: number;
};
