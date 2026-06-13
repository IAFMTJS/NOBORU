import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { NextUnlockViewModel } from "@/lib/progression/preview.types";
import { cn } from "@/lib/utils";

type NextUnlockPreviewProps = {
  unlock: NextUnlockViewModel;
  className?: string;
  compact?: boolean;
};

const KIND_LABELS: Record<NextUnlockViewModel["kind"], string> = {
  companion: "Companion",
  region: "Trail",
  trial: "Trial",
  title: "Title",
  collectible: "Collectible",
  chest: "Chest",
};

export function NextUnlockPreview({
  unlock,
  className,
  compact = false,
}: NextUnlockPreviewProps) {
  const content = (
    <div
      className={cn(
        "rounded-xl border border-primary/15 bg-primary/5 p-3",
        compact ? "space-y-1" : "space-y-2",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <Badge variant="outline" className="text-caption">
          {KIND_LABELS[unlock.kind]}
        </Badge>
        <span className="text-caption text-muted-foreground">
          {unlock.progressPercent}%
        </span>
      </div>
      <p className={cn("font-medium text-foreground", compact ? "text-body-sm" : "text-body")}>
        {unlock.label}
      </p>
      {unlock.remainingLabel ? (
        <p className="text-caption text-muted-foreground">{unlock.remainingLabel}</p>
      ) : null}
      {!compact ? (
        <ProgressBar value={unlock.progressPercent} showValue={false} />
      ) : null}
    </div>
  );

  if (unlock.href) {
    return (
      <Link href={unlock.href} className="block transition-opacity hover:opacity-90">
        {content}
      </Link>
    );
  }

  return content;
}
