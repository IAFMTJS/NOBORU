"use client";

import { SecondaryScreenShell } from "@/components/visual/shells/secondary-screen-shell";
import { YamaEmptyState } from "@/features/yama/components/yama-empty-state";
import type {
  NotificationViewModel,
  NotificationsViewModel,
} from "@/features/notifications/types/notification.types";
import { MessengerBoardRow } from "@/components/visual/world/messenger-board-row";

type NotificationsScreenProps = {
  notifications: NotificationsViewModel;
};

function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diffMs / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "Yesterday" : `${days}d ago`;
}

function NotificationRow({ notification }: { notification: NotificationViewModel }) {
  return (
    <MessengerBoardRow
      title={notification.title}
      body={notification.body}
      time={formatRelativeTime(notification.createdAt)}
      timeDateTime={notification.createdAt}
      unread={!notification.read}
      href={notification.href}
      leading={
        <span
          className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/55 bg-white/48 text-caption font-medium uppercase backdrop-blur-md"
          aria-hidden
        >
          {notification.kind.slice(0, 1)}
        </span>
      }
    />
  );
}

export function NotificationsScreen({ notifications }: NotificationsScreenProps) {
  const { notifications: items, unreadCount } = notifications;

  return (
    <SecondaryScreenShell
      title="Notifications"
      subtitle={
        unreadCount > 0
          ? `${unreadCount} unread update${unreadCount === 1 ? "" : "s"} — useful trail updates, never guilt-driven`
          : "Useful trail updates — never noisy, never guilt-driven"
      }
      backHref="/profile"
      backLabel="Profile"
      contentClassName="pb-2"
    >
      <div className="mx-auto max-w-md space-y-2">
        {items.length === 0 ? (
          <YamaEmptyState
            surface="generic"
            title="Trail is quiet"
            description="When something meaningful happens on your climb, a lantern message will appear here."
            actionHref="/camp"
            actionLabel="Return to camp"
          />
        ) : (
          items.map((notification) => (
            <NotificationRow key={notification.id} notification={notification} />
          ))
        )}
      </div>
    </SecondaryScreenShell>
  );
}
