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
  created_at: string;
  updated_at: string;
};

export type ProfileViewModel = {
  userId: string;
  email: string;
  displayName: string;
  levelLabel: string;
  stats: Array<{
    label: string;
    value: string;
  }>;
};

export type UpdateProfileInput = {
  displayName: string;
};
