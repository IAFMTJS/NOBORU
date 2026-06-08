"use client";

import { MascotImage } from "@/components/media/mascot-image";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

type YamaLoadingProps = {
  message?: string;
  className?: string;
  showSpinner?: boolean;
};

export function YamaLoading({
  message = "Preparing your trail…",
  className,
  showSpinner = true,
}: YamaLoadingProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center gap-4 px-6 py-12 text-center",
        className,
      )}
    >
      <div className="relative h-24 w-24">
        <MascotImage alt="" fill className="object-contain" priority />
      </div>
      <p className="text-body-sm text-muted-foreground">{message}</p>
      {showSpinner ? <Spinner size="sm" /> : null}
    </div>
  );
}
