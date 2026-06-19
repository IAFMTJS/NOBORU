"use client";

import { Lock } from "lucide-react";

import type { JourneyNodeKind, JourneyNodeState } from "@/features/journey/types/journey.types";
import { cn } from "@/lib/utils";

type SkeletonJourneyNodeProps = {
  state: JourneyNodeState;
  kind: JourneyNodeKind;
  label: string;
  isCurrent?: boolean;
  isDraft?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
};

const SIZE_PX = { sm: 36, md: 44, lg: 52 } as const;

const STATE_RING: Record<JourneyNodeState, string> = {
  locked: "border-muted-foreground/30 bg-muted/40 text-muted-foreground",
  available: "border-primary/70 bg-primary/15 text-primary shadow-[0_0_12px_rgba(214,168,95,0.35)]",
  in_progress: "border-primary bg-primary/25 text-primary-foreground shadow-[0_0_16px_rgba(214,168,95,0.5)]",
  completed: "border-success/60 bg-success/15 text-success",
};

const KIND_LABEL: Record<JourneyNodeKind, string> = {
  lesson: "L",
  checkpoint: "C",
  landmark: "M",
  trial: "B",
};

/** CSS-only journey node — no art library assets. */
export function SkeletonJourneyNode({
  state,
  kind,
  label,
  isCurrent = false,
  isDraft = false,
  size = "md",
  className,
  onClick,
}: SkeletonJourneyNodeProps) {
  const px = SIZE_PX[size];
  const interactive = onClick != null;

  const inner = (
    <span
      className={cn(
        "relative flex items-center justify-center rounded-full border-2 font-semibold transition-transform",
        STATE_RING[state],
        isDraft && "border-dashed opacity-50",
        isCurrent && "scale-110 ring-2 ring-primary/40 ring-offset-1 ring-offset-transparent",
        kind === "trial" && "rounded-lg",
        className,
      )}
      style={{ width: px, height: px, fontSize: px * 0.32 }}
      title={label}
    >
      {state === "locked" ? (
        <Lock className="h-[40%] w-[40%]" strokeWidth={2.5} aria-hidden />
      ) : (
        <span aria-hidden>{KIND_LABEL[kind]}</span>
      )}
    </span>
  );

  if (!interactive) {
    return <div className="flex items-center justify-center">{inner}</div>;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="focus-ring flex min-h-[48px] min-w-[48px] items-center justify-center rounded-full"
      aria-label={label}
    >
      {inner}
    </button>
  );
}
