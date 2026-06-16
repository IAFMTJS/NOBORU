"use client";

import { LESSON_NODE_ASSETS } from "@/lib/assets/lesson-node-assets";
import { cn } from "@/lib/utils";

import { WorldArtImage } from "./world-art-image";

type EventTrailBranchProps = {
  className?: string;
  onClick?: () => void;
};

/** Doc 11 — seasonal event branch node with sakura glow (mockup event path). */
export function EventTrailBranch({ className, onClick }: EventTrailBranchProps) {
  const content = (
    <div className="relative">
      <span
        className="pointer-events-none absolute -inset-2 rounded-full bg-pink-500/25 blur-md motion-safe:animate-pulse motion-reduce:animate-none"
        aria-hidden
      />
      <WorldArtImage
        asset={LESSON_NODE_ASSETS.event}
        alt=""
        width={52}
        height={52}
        className="relative drop-shadow-lg ring-2 ring-pink-400/40 trail-glow-warm"
      />
    </div>
  );

  if (!onClick) {
    return <div className={cn(className)}>{content}</div>;
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
