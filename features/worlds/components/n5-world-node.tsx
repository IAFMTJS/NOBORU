"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { ArtLibraryImage } from "@/components/media/art-library-image";
import { GlassPanel } from "@/components/visual";
import { WorldBossNode, WorldLessonNode } from "@/components/visual/world";
import type { JourneyNode } from "@/features/journey/types/journey.types";
import type { TrailNodeState } from "@/features/learning/types/trail.types";
import { cn } from "@/lib/utils";

import { resolveN5LandmarkSlugByLabel } from "@/features/worlds/constants/n5-landmarks.constants";
import { N5_LANDMARK_ICON_BASES } from "@/features/worlds/constants/n5-world-art.constants";
import type { N5NodeCanvasPosition } from "@/features/worlds/utils/n5-world-layout.utils";

type N5WorldNodeProps = {
  node: JourneyNode;
  position: N5NodeCanvasPosition;
  isCurrent: boolean;
  selected: boolean;
  onSelect: () => void;
};

function toTrailState(state: JourneyNode["state"]): TrailNodeState {
  return state;
}

export function N5WorldNode({
  node,
  position,
  isCurrent,
  selected,
  onSelect,
}: N5WorldNodeProps) {
  const state = toTrailState(node.state);
  const size = isCurrent ? "lg" : node.kind === "landmark" ? "md" : "md";

  if (node.kind === "landmark") {
    const landmarkSlug = resolveN5LandmarkSlugByLabel(node.label);
    const landmarkIconBase = landmarkSlug ? N5_LANDMARK_ICON_BASES[landmarkSlug] : null;

    return (
      <div
        className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${position.x}%`, top: `${position.y}%` }}
      >
        <button
          type="button"
          onClick={onSelect}
          className={cn(
            "focus-ring max-w-[12rem] text-center",
            selected && "ring-2 ring-trail-glow/50 ring-offset-2 ring-offset-transparent",
            state === "locked" && "opacity-55",
          )}
        >
          <span className="flex items-center gap-2 rounded-full border border-trail-glow/40 bg-black/50 px-3 py-2 text-left backdrop-blur-md">
            {landmarkIconBase ? (
              <ArtLibraryImage
                themedBase={landmarkIconBase}
                src=""
                alt=""
                width={28}
                height={28}
                className="shrink-0 drop-shadow-sm"
              />
            ) : null}
            <span className="min-w-0">
              <p className="text-caption font-semibold text-foreground">{node.label}</p>
              {node.subtitle ? (
                <p className="truncate text-[10px] text-muted-foreground">{node.subtitle}</p>
              ) : null}
            </span>
          </span>
        </button>
      </div>
    );
  }

  const nodeVisual =
    node.kind === "trial" ? (
      <WorldBossNode
        state={state}
        isCurrent={isCurrent}
        onClick={node.href ? onSelect : undefined}
      />
    ) : (
      <WorldLessonNode
        state={state}
        lessonType={node.lessonType}
        nodeKind={node.kind === "checkpoint" ? "checkpoint" : "lesson"}
        isCurrent={isCurrent}
        size={size}
        onClick={node.href ? onSelect : undefined}
      />
    );

  return (
    <div
      className={cn(
        "absolute z-10 -translate-x-1/2 -translate-y-1/2",
        selected && "z-20",
      )}
      style={{ left: `${position.x}%`, top: `${position.y}%` }}
    >
      {isCurrent && node.href ? (
        <span className="pointer-events-none absolute -top-9 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full border border-trail-glow/55 bg-black/75 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-trail-glow shadow-sm">
          Continue
        </span>
      ) : null}
      {nodeVisual}
    </div>
  );
}

type N5WorldNodeCardProps = {
  node: JourneyNode;
  isCurrent?: boolean;
  onClose: () => void;
};

export function N5WorldNodeCard({ node, isCurrent = false, onClose }: N5WorldNodeCardProps) {
  const locked = node.state === "locked";

  return (
    <GlassPanel
      variant="panel"
      className="pointer-events-auto absolute inset-x-4 bottom-24 z-30 border border-trail-glow/25 p-4 shadow-lg"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <p className="text-caption font-medium uppercase tracking-wide text-muted-foreground">
            {node.kind === "trial"
              ? "Trial"
              : node.kind === "checkpoint"
                ? "Checkpoint"
                : node.kind === "landmark"
                  ? "Landmark"
                  : "Lesson"}
          </p>
          <h2 className="text-body font-semibold text-foreground">{node.label}</h2>
          {node.subtitle ? (
            <p className="text-body-sm text-muted-foreground">{node.subtitle}</p>
          ) : null}
          {locked ? (
            <p className="text-caption text-muted-foreground">The path continues upward</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="focus-ring text-caption text-muted-foreground"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
      {node.href && !locked ? (
        <Link
          href={node.href}
          className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-button bg-primary text-body font-semibold text-primary-foreground"
        >
          {node.kind === "trial" ? "Enter trial" : isCurrent ? "Continue lesson" : "Start lesson"}
        </Link>
      ) : null}
    </GlassPanel>
  );
}

/** Client wrapper when card needs router refresh after navigation */
export function N5WorldNodeCardRouter({ node, onClose }: N5WorldNodeCardProps) {
  const router = useRouter();
  return (
    <N5WorldNodeCard
      node={node}
      onClose={() => {
        onClose();
        router.refresh();
      }}
    />
  );
}
