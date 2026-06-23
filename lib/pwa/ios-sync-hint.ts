import { isIosDevice } from "@/lib/audio/device-capabilities";

export function usesBackgroundSync(): boolean {
  if (typeof window === "undefined") return false;
  return "SyncManager" in window;
}

export function getOfflineSyncHint(): string {
  if (isIosDevice() && !usesBackgroundSync()) {
    return "Progress syncs when you reopen Noboru with internet.";
  }
  return "Cached lessons, reviews, and progress sync when you reconnect.";
}

export function getOfflineBannerOnlineMessage(): string {
  if (isIosDevice() && !usesBackgroundSync()) {
    return "Back online. Open Noboru to sync your offline progress.";
  }
  return "Back online. Syncing your offline progress…";
}
