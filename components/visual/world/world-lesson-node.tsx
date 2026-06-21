"use client";

import type { LessonNodeVisualKind } from "@/lib/assets/lesson-node-assets";
import { resolveLessonNodeAsset } from "@/lib/assets/lesson-node-assets";
import { VISUAL_MOCKUP } from "@/components/visual/tokens";
import type { TrailNodeKind, TrailNodeState } from "@/features/learning/types/trail.types";
import { cn } from "@/lib/utils";

import { WorldArtImage } from "./world-art-image";

type WorldLessonNodeProps = {
  state: TrailNodeState;
  nodeKind?: TrailNodeKind | LessonNodeVisualKind;
  lessonType?: string | null;
  isCurrent?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
};

const SIZE_PX = {
  sm: VISUAL_MOCKUP.node.sizeSmPx,
  md: VISUAL_MOCKUP.node.sizeMdPx,
  lg: VISUAL_MOCKUP.node.sizeLgPx,
} as const;

const GLOW: Record<TrailNodeState, string> = {
  locked: "opacity-50 grayscale",
  available: "trail-glow-warning",
  in_progress: "trail-glow-warm",
  completed: "trail-glow-success",
};

/** Doc 11 — lesson node as approved world art with mockup scale hierarchy. */
export function WorldLessonNode({
  state,
  nodeKind = "lesson",
  lessonType,
  isCurrent = false,
  size = "md",
  className,
  onClick,
}: WorldLessonNodeProps) {
  const px = SIZE_PX[size];
  const asset = resolveLessonNodeAsset({ state, nodeKind, lessonType });
  const interactive = state !== "locked" && onClick;

  const content = (
    <span
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden rounded-full border bg-black/20 p-0.5 transition-opacity duration-300",
        isCurrent
          ? "border-trail-glow/70 ring-2 ring-trail-glow/45 ring-offset-2 ring-offset-transparent"
          : "border-white/10",
        state === "locked" && "border-white/5 bg-black/40",
      )}
    >
      <WorldArtImage
        asset={asset}
        alt=""
        width={px}
        height={px}
        className={cn(
          "rounded-full drop-shadow-md transition-all duration-300 motion-reduce:transition-none",
          GLOW[state],
          isCurrent &&
            "scale-105 animate-[journey-node-pulse_2s_ease-in-out_infinite] motion-reduce:animate-none",
          className,
        )}
      />
    </span>
  );

  if (!interactive) {
    return <div className="flex items-center justify-center">{content}</div>;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="focus-ring flex items-center justify-center rounded-full"
      aria-label="Open lesson"
    >
      {content}
    </button>
  );
}
