import type { NotificationsViewModel } from "@/features/notifications/types/notification.types";

/** Returns empty until live notifications repository is wired (see feature-flags). */
class NotificationsService {
  getNotifications(): NotificationsViewModel {
    return { notifications: [], unreadCount: 0 };
  }
}

export const notificationsService = new NotificationsService();
