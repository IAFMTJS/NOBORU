"use client";

import { YamaAvatar } from "@/features/yama/components/yama-avatar";
import { yamaService } from "@/features/yama/services/yama.service";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

type YamaLoadingProps = {
  message?: string;
  className?: string;
  showSpinner?: boolean;
  seed?: number;
};

export function YamaLoading({
  message,
  className,
  showSpinner = true,
  seed = 0,
}: YamaLoadingProps) {
  const presence = yamaService.resolveLoadingMessage(seed);
  const displayMessage = message ?? presence.message;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center gap-4 px-6 py-12 text-center",
        className,
      )}
    >
      <YamaAvatar expression="loading" size="lg" alt="" priority />
      <p className="text-body-sm text-muted-foreground">{displayMessage}</p>
      {showSpinner ? <Spinner size="sm" /> : null}
    </div>
  );
}
