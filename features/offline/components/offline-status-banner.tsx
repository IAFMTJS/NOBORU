"use client";

import { WifiOff } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { getOfflineBannerOnlineMessage } from "@/lib/pwa/ios-sync-hint";
import { cn } from "@/lib/utils";

type OfflineStatusBannerProps = {
  isOnline: boolean;
  pendingMutations: number;
  className?: string;
};

export function OfflineStatusBanner({
  isOnline,
  pendingMutations,
  className,
}: OfflineStatusBannerProps) {
  if (isOnline && pendingMutations === 0) return null;

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 border-b px-4 py-2 text-body-sm",
        isOnline
          ? "border-warning/30 bg-warning/10 text-warning-foreground"
          : "border-border bg-muted/60 text-muted-foreground",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-2">
        {!isOnline ? <WifiOff className="h-4 w-4" aria-hidden /> : null}
        <span>
          {isOnline
            ? getOfflineBannerOnlineMessage()
            : "You are offline. Cached lessons and reviews remain available."}
        </span>
      </div>
      {pendingMutations > 0 ? (
        <Badge variant="outline">{pendingMutations} pending</Badge>
      ) : null}
    </div>
  );
}
