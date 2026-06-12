"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { Check, Flag, Lock, Mountain, Play, Sparkles } from "lucide-react";

import { TrailMapArtwork } from "@/components/media/trail-map-artwork";
import { hasTrailScrollArt } from "@/lib/assets/registry";
import { MotionDiv } from "@/components/motion/motion-div";
import { TrailSpineConnector } from "@/features/learning/components/trail/trail-spine-connector";
import { YamaPresence } from "@/features/yama/components/yama-presence";
import { yamaService } from "@/features/yama/services/yama.service";
import {
  getTrailNodePositions,
  TRAIL_SCROLL_ART_HEIGHT,
  TRAIL_SCROLL_ART_WIDTH,
  trailMapMinHeightRem,
} from "@/lib/design-system/trail-path-anchors";
import { trailNodeReveal } from "@/lib/motion/presets";
import { cn } from "@/lib/utils";
import type { TrailNodeState, TrailNodeViewModel } from "@/features/learning/utils/trail-state";

const MARKER_STYLES: Record<
  TrailNodeState,
  { ring: string; fill: string; icon: typeof Check }
> = {
  completed: {
    ring: "border-success bg-success/20 text-success shadow-[0_0_12px_rgba(47,191,113,0.35)]",
    fill: "bg-success text-success-foreground",
    icon: Check,
  },
  in_progress: {
    ring: "border-primary bg-primary/20 text-primary shadow-[0_0_14px_rgba(214,64,69,0.45)]",
    fill: "bg-primary text-primary-foreground",
    icon: Mountain,
  },
  available: {
    ring: "border-warning bg-warning/20 text-warning shadow-[0_0_12px_rgba(246,174,45,0.4)]",
    fill: "bg-warning text-warning-foreground",
    icon: Play,
  },
  locked: {
    ring: "border-border/80 bg-background/70 text-muted-foreground",
    fill: "bg-muted-foreground/60 text-background",
    icon: Lock,
  },
};

const STATE_LABELS: Record<TrailNodeState, string> = {
  completed: "Completed lesson",
  in_progress: "Continue lesson",
  available: "Next lesson",
  locked: "Locked lesson",
};

function TrailPathNode({
  node,
  position,
  nodeIndex: _nodeIndex,
  compact,
  minimal,
  labelsBelow,
  immersive,
  anchored = false,
  onNodeSelect,
}: {
  node: TrailNodeViewModel;
  position: { x: number; y: number };
  nodeIndex: number;
  compact?: boolean;
  minimal?: boolean;
  labelsBelow?: boolean;
  immersive?: boolean;
  /** When true, the parent wrapper owns left/top placement along the trail. */
  anchored?: boolean;
  onNodeSelect?: (node: TrailNodeViewModel) => void;
}) {
  const styles = MARKER_STYLES[node.state];
  const isCheckpoint = node.nodeKind === "checkpoint";
  const isApplication = node.nodeKind === "application";
  const isCurrent = node.state === "in_progress";
  const Icon = isCheckpoint
    ? Flag
    : isApplication
      ? Sparkles
      : isCurrent || node.state === "available"
        ? Play
        : styles.icon;
  const labelSide =
    immersive || labelsBelow ? "right" : position.x < 48 ? "right" : "left";
  const usePillLabels = immersive && !labelsBelow;
  const ariaLabel = `${STATE_LABELS[node.state]}: ${node.label}${
    node.subtitle ? `, ${node.subtitle}` : ""
  }`;
  const interactive = Boolean(onNodeSelect) || Boolean(node.href);

  const markerSize = isCheckpoint
    ? labelsBelow
      ? "h-11 w-11"
      : "h-10 w-10"
    : labelsBelow && isCurrent
      ? "h-11 w-11"
      : usePillLabels
        ? "h-10 w-10"
        : compact || minimal
          ? "h-8 w-8"
          : "h-9 w-9";
  const innerSize = isCheckpoint
    ? labelsBelow
      ? "h-8 w-8"
      : "h-7 w-7"
    : labelsBelow && isCurrent
      ? "h-7 w-7"
      : usePillLabels
        ? "h-7 w-7"
        : compact || minimal
          ? "h-5 w-5"
          : "h-6 w-6";
  const iconSize = isCheckpoint
    ? "h-4 w-4"
    : labelsBelow && isCurrent
      ? "h-4 w-4"
      : usePillLabels
        ? "h-4 w-4"
        : compact || minimal
          ? "h-3 w-3"
          : "h-3.5 w-3.5";

  const labelOnLeft = !immersive && !labelsBelow && position.x >= 50;
  const hideLockedLabel = labelsBelow && immersive && node.state === "locked";

  const marker = (
    <div
      className={cn(
        "relative z-10 flex shrink-0 items-center justify-center rounded-full border-2 backdrop-blur-sm",
        markerSize,
        styles.ring,
        isCheckpoint && node.state !== "locked" && "border-warning/90 shadow-[0_0_12px_rgba(245,158,11,0.35)]",
        interactive && onNodeSelect ? "cursor-pointer" : null,
        labelsBelow && "z-20",
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-full",
          innerSize,
          styles.fill,
        )}
      >
        <Icon className={iconSize} aria-hidden />
      </div>
      {labelsBelow && !hideLockedLabel ? (
        <span
          className={cn(
            "pointer-events-none absolute top-[calc(100%+0.35rem)] max-w-[5.5rem] truncate text-[0.6875rem] font-medium leading-tight",
            immersive ? "text-white/90 drop-shadow-sm" : "text-foreground",
            node.state === "locked" ? "text-muted-foreground/80" : null,
            labelOnLeft
              ? "right-full mr-1.5 text-right"
              : "left-full ml-1.5 text-left",
          )}
        >
          {node.label}
        </span>
      ) : null}
    </div>
  );

  const pillLabel = usePillLabels ? (
    <span
      className={cn(
        "max-w-[9rem] truncate rounded-full border border-white/10 bg-black/55 px-3 py-1.5",
        "text-body-sm font-medium text-white shadow-sm backdrop-blur-md",
        node.state === "locked" && "text-white/75",
      )}
    >
      {node.label}
    </span>
  ) : null;

  const card =
    minimal || labelsBelow || usePillLabels ? null : (
      <div
        className={cn(
          "max-w-[7.5rem] rounded-lg border bg-card/92 p-2 shadow-elevation-1 backdrop-blur-md transition-colors sm:max-w-[9rem]",
          styles.ring,
          interactive ? "hover:bg-accent/35" : "cursor-not-allowed opacity-75",
          compact && "max-w-[6.5rem] p-1.5",
        )}
      >
        <p
          className={cn(
            "line-clamp-2 font-medium leading-tight",
            compact ? "text-[0.65rem]" : "text-caption",
          )}
        >
          {node.label}
        </p>
        {!compact && node.subtitle ? (
          <p className="mt-0.5 truncate text-[0.65rem] text-muted-foreground">
            {node.subtitle}
          </p>
        ) : null}
      </div>
    );

  const labelTransform = usePillLabels
    ? undefined
    : labelsBelow || minimal
      ? "translate(-50%, -50%)"
      : `translate(${labelSide === "right" ? "-12%" : "-88%"}, -50%)`;

  const pillLabelRow = usePillLabels ? (
    <div className="flex -translate-y-1/2 items-center gap-2">
      <div className="-translate-x-1/2 shrink-0">{marker}</div>
      {pillLabel}
    </div>
  ) : null;

  const content = usePillLabels ? (
    <div
      className={cn(anchored ? null : "absolute")}
      style={
        anchored
          ? undefined
          : {
              left: `${position.x}%`,
              top: `${position.y}%`,
            }
      }
    >
      {pillLabelRow}
    </div>
  ) : (
    <div
      className={cn(
        anchored ? null : "absolute",
        labelsBelow || minimal
          ? "flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
          : cn(
              "flex -translate-y-1/2 items-center gap-1.5",
              labelSide === "right" ? "flex-row" : "flex-row-reverse",
            ),
      )}
      style={
        anchored
          ? { transform: labelTransform }
          : {
              left: `${position.x}%`,
              top: `${position.y}%`,
              transform: labelTransform,
            }
      }
    >
      {marker}
      {card}
    </div>
  );

  if (onNodeSelect) {
    return (
      <button
        type="button"
        className="block border-0 bg-transparent p-0 text-left"
        aria-label={ariaLabel}
        onClick={() => onNodeSelect(node)}
      >
        {content}
      </button>
    );
  }

  if (!node.href) {
    return <div aria-label={ariaLabel}>{content}</div>;
  }

  return (
    <Link href={node.href} className="block" aria-label={ariaLabel}>
      {content}
    </Link>
  );
}

type TrailMapProps = {
  nodes: TrailNodeViewModel[];
  compact?: boolean;
  minimal?: boolean;
  labelsBelow?: boolean;
  immersive?: boolean;
  regionSlug?: string;
  title?: string;
  description?: string;
  className?: string;
  onNodeSelect?: (node: TrailNodeViewModel) => void;
};

export function TrailMap({
  nodes,
  compact = false,
  minimal = false,
  labelsBelow = false,
  immersive = false,
  regionSlug,
  title,
  description,
  className,
  onNodeSelect,
}: TrailMapProps) {
  const { resolvedTheme } = useTheme();
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeNode =
    nodes.find((node) => node.state === "in_progress") ??
    nodes.find((node) => node.state === "available");
  const activeNodeIndex = activeNode
    ? nodes.findIndex((node) => node.id === activeNode.id)
    : -1;
  const placementNodes: Array<{ nodeKind: "lesson" | "checkpoint" }> =
    nodes.map((node) => ({
      nodeKind:
        node.nodeKind === "checkpoint"
          ? ("checkpoint" as const)
          : ("lesson" as const),
    }));
  const immersivePositions = immersive
    ? getTrailNodePositions(placementNodes)
    : null;
  const immersiveLayout =
    immersive && immersivePositions && immersivePositions.length > 0
      ? {
          positions: immersivePositions,
          canvasAspectRatio: TRAIL_SCROLL_ART_WIDTH / TRAIL_SCROLL_ART_HEIGHT,
        }
      : null;
  const cardPositions = immersive
    ? null
    : getTrailNodePositions(placementNodes);
  const mapHeightRem = immersive
    ? undefined
    : trailMapMinHeightRem(nodes.length, compact || minimal);
  const useScrollArt = immersive && hasTrailScrollArt(regionSlug);

  useEffect(() => {
    if (!immersive || activeNodeIndex < 0 || !scrollRef.current) return;

    const activeElement = scrollRef.current.querySelector(
      `[data-trail-node-index="${activeNodeIndex}"]`,
    );
    if (!activeElement) return;

    activeElement.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [activeNodeIndex, immersive, nodes.length]);

  if (nodes.length === 0) {
    return (
      <YamaPresence
        presence={yamaService.resolveTrailProgress(0)}
        size="sm"
        layout="vertical"
        className="items-center"
      />
    );
  }

  return (
    <div
      ref={scrollRef}
      className={cn(
        "space-y-3",
        immersive && "min-h-0 flex-1 overflow-y-auto overscroll-contain",
        className,
      )}
    >
      {title ? (
        <div>
          <p className="text-body-sm font-medium">{title}</p>
          {description ? (
            <p className="text-caption text-muted-foreground">{description}</p>
          ) : null}
        </div>
      ) : null}
      {activeNode && !minimal && !labelsBelow ? (
        <YamaPresence
          presence={yamaService.resolveTrailProgress(activeNode.id.length)}
          size="sm"
        />
      ) : null}
      <div
        className={cn(
          "relative w-full",
          immersive
            ? "shrink-0 rounded-none border-0 shadow-none"
            : "overflow-hidden rounded-2xl border border-primary/20 shadow-elevation-1 dark:shadow-elevation-2",
        )}
        data-trail-map-canvas
        style={
          immersive && immersiveLayout
            ? { aspectRatio: `${TRAIL_SCROLL_ART_WIDTH} / ${TRAIL_SCROLL_ART_HEIGHT}` }
            : mapHeightRem
              ? { minHeight: `${mapHeightRem}rem` }
              : undefined
        }
      >
        <TrailMapArtwork
          theme={resolvedTheme}
          immersive={immersive}
          regionSlug={regionSlug}
          priority={useScrollArt}
        />
        {immersive && immersiveLayout && !useScrollArt ? (
          <TrailSpineConnector
            points={[...immersiveLayout.positions]}
            nodes={nodes}
          />
        ) : null}
        <div
          className={cn(
            "absolute inset-0",
            immersive ? "px-0 py-0" : "px-1 py-3 sm:px-2",
          )}
          role="list"
          aria-label="Trail lessons"
          style={
            immersive && immersiveLayout
              ? { aspectRatio: `${TRAIL_SCROLL_ART_WIDTH} / ${TRAIL_SCROLL_ART_HEIGHT}` }
              : mapHeightRem
                ? { minHeight: `${mapHeightRem}rem` }
                : undefined
          }
        >
          {nodes.map((node, index) => {
            const immersivePosition = immersiveLayout?.positions[index];
            const cardPosition = cardPositions?.[index];
            if (immersive && !immersivePosition) return null;
            if (!immersive && !cardPosition) return null;

            const labelPosition = immersivePosition ?? cardPosition!;
            const nodePosition = immersivePosition ?? cardPosition!;

            return (
              <div
                key={node.id}
                role="listitem"
                data-trail-node-index={index}
                className="pointer-events-auto absolute"
                style={{
                  left: `${nodePosition.x}%`,
                  top: `${nodePosition.y}%`,
                }}
              >
                <MotionDiv
                  {...trailNodeReveal}
                  transition={{ delay: Math.min(index * 0.03, 0.6) }}
                >
                  <TrailPathNode
                    node={node}
                    position={labelPosition}
                    nodeIndex={index}
                    compact={compact}
                    minimal={minimal}
                    labelsBelow={labelsBelow}
                    immersive={immersive}
                    anchored
                    onNodeSelect={onNodeSelect}
                  />
                </MotionDiv>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
