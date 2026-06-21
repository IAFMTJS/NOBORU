import type {
  NotificationViewModel,
  NotificationsViewModel,
} from "@/features/notifications/types/notification.types";

const PLACEHOLDER_NOTIFICATIONS: NotificationViewModel[] = [
  {
    id: "n1",
    kind: "achievement",
    title: "Achievement earned",
    body: "First Step — you began the climb with purpose.",
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    read: false,
    href: "/achievements",
  },
  {
    id: "n2",
    kind: "milestone",
    title: "Milestone reached",
    body: "Forest Trail region unlocked. New lessons await ahead.",
    createdAt: new Date(Date.now() - 26 * 3600000).toISOString(),
    read: false,
    href: "/tree",
  },
  {
    id: "n3",
    kind: "reward",
    title: "Reward available",
    body: "A camp chest is ready to open when you return to base.",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    read: true,
    href: "/camp",
  },
  {
    id: "n4",
    kind: "event",
    title: "Event started",
    body: "Sakura Trail week has begun — optional festival challenges await.",
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    read: true,
    href: "/world/events",
  },
  {
    id: "n5",
    kind: "quest",
    title: "Quest completed",
    body: "Daily climb goal met. Rest is part of the ascent.",
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    read: true,
    href: "/camp",
  },
];

class NotificationsService {
  getNotifications(): NotificationsViewModel {
    const notifications = PLACEHOLDER_NOTIFICATIONS;
    const unreadCount = notifications.filter((item) => !item.read).length;

    return { notifications, unreadCount };
  }
}

export const notificationsService = new NotificationsService();
