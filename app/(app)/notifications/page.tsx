import { NotificationsScreen } from "@/features/notifications/components/notifications-screen";
import { notificationsService } from "@/features/notifications/services/notifications.service";

export default function NotificationsPage() {
  const notifications = notificationsService.getNotifications();

  return <NotificationsScreen notifications={notifications} />;
}
