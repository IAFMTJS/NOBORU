export type LearningGoal = "anime" | "travel" | "culture" | "work" | "jlpt";

export type JlptPlacement = "none" | "n5" | "n4" | "n3" | "n2" | "n1";

export type ProfileRole =
  | "learner"
  | "viewer"
  | "moderator"
  | "content_manager"
  | "asset_manager"
  | "curriculum_manager"
  | "analytics_manager"
  | "administrator"
  | "super_administrator";

export type ProfileRow = {
  id: string;
  user_id: string;
  username: string | null;
  display_name: string;
  avatar_id: string | null;
  title_id: string | null;
  bio: string | null;
  country: string | null;
  timezone: string;
  language: string;
  theme: string;
  role: ProfileRole;
  onboarding_completed: boolean;
  learning_goal: LearningGoal | null;
  current_level: JlptPlacement | null;
  current_region_slug: string;
  created_at: string;
  updated_at: string;
};

export type ProfileViewModel = {
  userId: string;
  email: string;
  displayName: string;
  levelLabel: string;
  onboardingCompleted: boolean;
  learningGoal: LearningGoal | null;
  currentLevel: JlptPlacement | null;
  currentRegionSlug: string;
  stats: Array<{
    label: string;
    value: string;
  }>;
};

export type UpdateProfileInput = {
  displayName: string;
};
