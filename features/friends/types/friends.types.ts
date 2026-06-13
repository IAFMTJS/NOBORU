export type FriendActivityRow = {
  id: string;
  user_id: string;
  activity_type: string;
  activity_label: string;
  created_at: string;
};

export type FriendViewModel = {
  userId: string;
  displayName: string;
  isFollowing: boolean;
};

export type FriendActivityViewModel = {
  userId: string;
  displayName: string;
  activityType: string;
  activityLabel: string;
  createdAt: string;
};

export type FriendsDashboardViewModel = {
  following: FriendViewModel[];
  followers: FriendViewModel[];
  activityFeed: FriendActivityViewModel[];
};
