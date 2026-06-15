"use client";

import { LESSON_NODE_ASSETS } from "@/lib/assets/lesson-node-assets";
import { cn } from "@/lib/utils";

import { WorldArtImage } from "./world-art-image";

type EventTrailBranchProps = {
  className?: string;
  onClick?: () => void;
};

/** Doc 11 — seasonal event branch node on trail. */
export function EventTrailBranch({ className, onClick }: EventTrailBranchProps) {
  const content = (
    <WorldArtImage
      asset={LESSON_NODE_ASSETS.event}
      alt=""
      width={48}
      height={48}
      className="drop-shadow-lg trail-glow-warm"
    />
  );

  if (!onClick) {
    return <div className={className}>{content}</div>;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("focus-ring rounded-full", className)}
      aria-label="Seasonal event"
    >
      {content}
    </button>
  );
}
