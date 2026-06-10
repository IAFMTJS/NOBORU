import type { ContentStatus } from "@/lib/content/types";

export type TrialKind = "regional_challenge" | "boss_trial" | "final_trial";
export type TrialStepKind = "typed_recall" | "choice_recall" | "matching";
export type TrialGrade = "pass" | "excellent" | "perfect" | "mastery" | "legendary";
export type TrialAvailability = "locked" | "available" | "passed";

export type TrialTemplateRow = {
  id: string;
  slug: string;
  region_slug: string;
  kind: TrialKind;
  title: string;
  description: string | null;
  boss_name: string;
  pass_score: number;
  time_limit_seconds: number | null;
  ep_reward: number;
  min_region_progress_percent: number;
  prerequisite_trial_slug: string | null;
  sort_order: number;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
};

export type TrialStepRow = {
  id: string;
  trial_template_id: string;
  order_index: number;
  step_kind: TrialStepKind;
  prompt: string;
  display_text: string;
  accepted_answers: string[] | null;
  options: string[] | null;
  correct_index: number | null;
  match_pairs: Array<{ id: string; prompt: string; answer: string }> | null;
  created_at: string;
  updated_at: string;
};

export type UserTrialProgressRow = {
  id: string;
  user_id: string;
  trial_template_id: string;
  best_score: number;
  best_grade: TrialGrade | null;
  passed: boolean;
  passed_at: string | null;
  attempt_count: number;
  last_attempt_at: string | null;
  created_at: string;
  updated_at: string;
};

export type UserTrialAttemptRow = {
  id: string;
  user_id: string;
  trial_template_id: string;
  score_percent: number;
  grade: TrialGrade | null;
  correct_count: number;
  total_count: number;
  time_spent_seconds: number;
  passed: boolean;
  ep_awarded: number | null;
  started_at: string;
  completed_at: string;
};

export type TrialMatchingPair = {
  id: string;
  prompt: string;
  answer: string;
};

export type TrialStepViewModel = {
  id: string;
  index: number;
  total: number;
  kind: TrialStepKind;
  prompt: string;
  display: string;
  acceptedAnswers?: string[];
  options?: string[];
  correctIndex?: number;
  pairs?: TrialMatchingPair[];
};

export type TrialProgressViewModel = {
  bestScore: number;
  bestGrade: TrialGrade | null;
  passed: boolean;
  passedAt: string | null;
  attemptCount: number;
};

export type TrialListEntryViewModel = {
  id: string;
  slug: string;
  regionSlug: string;
  kind: TrialKind;
  title: string;
  description: string | null;
  bossName: string;
  passScore: number;
  timeLimitSeconds: number | null;
  epReward: number;
  availability: TrialAvailability;
  lockReason: string | null;
  progress: TrialProgressViewModel | null;
  stepCount: number;
};

export type TrialSessionViewModel = {
  slug: string;
  title: string;
  description: string | null;
  bossName: string;
  kind: TrialKind;
  regionSlug: string;
  passScore: number;
  timeLimitSeconds: number | null;
  epReward: number;
  steps: TrialStepViewModel[];
  progress: TrialProgressViewModel | null;
};

export type TrialCompleteInput = {
  correctCount: number;
  totalCount: number;
  timeSpentSeconds: number;
  startedAt: string;
};

export type TrialCompleteViewModel = {
  passed: boolean;
  scorePercent: number;
  grade: TrialGrade | null;
  epAwarded: number | null;
  reviewRecommendations: string[];
  progress: TrialProgressViewModel;
};

export type TrialPerformanceViewModel = {
  totalAttempts: number;
  trialsPassed: number;
  trialsAvailable: number;
  bestGrades: Array<{
    slug: string;
    title: string;
    grade: TrialGrade;
    score: number;
  }>;
  recentAttempts: Array<{
    id: string;
    trialTitle: string;
    scorePercent: number;
    grade: TrialGrade | null;
    passed: boolean;
    completedAt: string;
  }>;
};
