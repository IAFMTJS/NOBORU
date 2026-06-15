export type NotificationKind =
  | "achievement"
  | "reward"
  | "event"
  | "milestone"
  | "quest";

export type NotificationViewModel = {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  href?: string;
};

export type NotificationsViewModel = {
  notifications: NotificationViewModel[];
  unreadCount: number;
};
