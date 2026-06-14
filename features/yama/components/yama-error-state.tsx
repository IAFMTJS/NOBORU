"use client";

import Link from "next/link";

import { YamaPresence } from "@/features/yama/components/yama-presence";
import { yamaService } from "@/features/yama/services/yama.service";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type YamaErrorStateProps = {
  message: string;
  title?: string;
  recoverable?: boolean;
  seed?: number;
  onRetry?: () => void;
  retryLabel?: string;
  actionHref?: string;
  actionLabel?: string;
  className?: string;
};

export function YamaErrorState({
  message,
  title = "Path blocked",
  recoverable = true,
  seed = 0,
  onRetry,
  retryLabel = "Try again",
  actionHref,
  actionLabel,
  className,
}: YamaErrorStateProps) {
  const presence = yamaService.resolveErrorPresence(recoverable, seed);

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center gap-4 px-6 py-12 text-center",
        className,
      )}
    >
      <YamaPresence
        presence={presence}
        size="md"
        layout="vertical"
        className="items-center"
      />
      <div className="space-y-2">
        <h3 className="text-heading-5">{title}</h3>
        <p className="max-w-sm text-body-sm text-muted-foreground">{message}</p>
      </div>
      {onRetry ? (
        <Button className="mt-2" onClick={onRetry}>
          {retryLabel}
        </Button>
      ) : null}
      {actionLabel && actionHref ? (
        <Button variant="outline" className="mt-2" asChild>
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      ) : null}
    </div>
  );
}
