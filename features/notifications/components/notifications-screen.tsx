"use client";

import Link from "next/link";

import { SceneImage } from "@/components/media/scene-image";
import { UiIconImage } from "@/components/media/ui-icon-image";
import {
  GlassPanel,
  IllustratedScreen,
  StoryTitle,
} from "@/components/visual";
import { YamaEmptyState } from "@/features/yama/components/yama-empty-state";
import type {
  NotificationKind,
  NotificationViewModel,
  NotificationsViewModel,
} from "@/features/notifications/types/notification.types";
import { ACHIEVEMENT_SLUGS } from "@/features/achievements/constants/achievement.constants";
import { ACHIEVEMENT_ART_ASSETS, resolveArtAsset } from "@/lib/assets/art-mappings";
import { INVENTORY_ITEM_ASSETS } from "@/lib/assets/lesson-node-assets";
import { MessengerBoardRow } from "@/components/visual/world/messenger-board-row";
import Image from "next/image";

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

function notificationArtSrc(kind: NotificationKind): string {
  switch (kind) {
    case "achievement":
      return resolveArtAsset(ACHIEVEMENT_ART_ASSETS[ACHIEVEMENT_SLUGS.firstLesson]);
    case "reward":
      return resolveArtAsset(INVENTORY_ITEM_ASSETS.lantern);
    case "event":
      return resolveArtAsset(INVENTORY_ITEM_ASSETS.sakura);
    case "milestone":
      return resolveArtAsset(INVENTORY_ITEM_ASSETS.scroll);
    case "quest":
      return resolveArtAsset(INVENTORY_ITEM_ASSETS.omamori);
    default:
      return resolveArtAsset(INVENTORY_ITEM_ASSETS.lantern);
  }
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
        <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-900/30 bg-black/40">
          <Image
            src={notificationArtSrc(notification.kind)}
            alt=""
            width={32}
            height={32}
            className="object-contain drop-shadow-sm"
            aria-hidden
          />
        </span>
      }
    />
  );
}

export function NotificationsScreen({ notifications }: NotificationsScreenProps) {
  const { notifications: items, unreadCount } = notifications;

  return (
    <IllustratedScreen
      scrim="none"
      className="min-h-dvh"
      background={
        <SceneImage
          scene="profile_lantern_path"
          alt="Lantern-lit path at dusk"
          className="absolute inset-0 min-h-dvh rounded-none"
        />
      }
    >
      <div className="relative flex min-h-dvh flex-col">
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-black/80"
          aria-hidden
        />

        <header className="relative z-10 shrink-0 space-y-3 p-4 pt-3">
          <Link
            href="/profile"
            className="inline-flex items-center gap-1.5 text-body-sm text-white/70 transition-colors hover:text-white"
          >
            <UiIconImage name="arrow_left" size={16} />
            Profile
          </Link>

          <GlassPanel variant="header" className="space-y-1 rounded-card p-4">
            <StoryTitle as="h1" className="text-base">
              Notifications
            </StoryTitle>
            <p className="text-caption text-muted-foreground">
              Useful trail updates — never noisy, never guilt-driven
            </p>
            {unreadCount > 0 ? (
              <p className="text-caption text-trail-glow">
                {unreadCount} unread update{unreadCount === 1 ? "" : "s"}
              </p>
            ) : null}
          </GlassPanel>
        </header>

        <main className="relative z-10 flex-1 overflow-y-auto px-4 py-2">
          <div className="mx-auto max-w-md space-y-2 pb-4">
            {items.length === 0 ? (
              <YamaEmptyState
                surface="notifications"
                title="All quiet on the trail"
                description="Achievements, rewards, and festival news will appear here when the mountain has word for you."
              />
            ) : (
              <ul className="space-y-2" aria-label="Notification list">
                {items.map((notification) => (
                  <li key={notification.id}>
                    <NotificationRow notification={notification} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>

        <footer className="relative z-10 shrink-0 pb-[calc(6.5rem+env(safe-area-inset-bottom))]" />
      </div>
    </IllustratedScreen>
  );
}
