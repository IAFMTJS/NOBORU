"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import { useTheme } from "next-themes";

import { TrailMapArtwork } from "@/components/media/trail-map-artwork";
import { hasTrailScrollArt } from "@/lib/assets/registry";
import { MotionDiv } from "@/components/motion/motion-div";
import { TrailNodeMarker } from "@/features/learning/components/trail/trail-node-marker";
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
  const isCheckpoint = node.nodeKind === "checkpoint";
  const isCurrent = node.state === "in_progress";
  const labelSide =
    immersive || labelsBelow ? "right" : position.x < 48 ? "right" : "left";
  const usePillLabels = immersive && !labelsBelow;
  const ariaLabel = `${STATE_LABELS[node.state]}: ${node.label}${
    node.subtitle ? `, ${node.subtitle}` : ""
  }`;
  const interactive = Boolean(onNodeSelect) || Boolean(node.href);

  const markerSize: "sm" | "md" | "lg" = isCheckpoint
    ? labelsBelow
      ? "lg"
      : "md"
    : labelsBelow && isCurrent
      ? "lg"
      : usePillLabels
        ? "md"
        : compact || minimal
          ? "sm"
          : "md";

  const labelOnLeft = !immersive && !labelsBelow && position.x >= 50;
  const hideLockedLabel = labelsBelow && immersive && node.state === "locked";

  const marker = (
    <div className={cn("relative z-10 shrink-0", labelsBelow && "z-20")}>
      <TrailNodeMarker
        state={node.state}
        nodeKind={node.nodeKind}
        size={markerSize}
      />
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
        "pointer-events-none max-w-[9rem] truncate rounded-full border border-white/10 bg-black/55 px-3 py-1.5",
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
          "pointer-events-none max-w-[7.5rem] rounded-lg border border-border/60 bg-card/92 p-2 shadow-elevation-1 backdrop-blur-md transition-colors sm:max-w-[9rem]",
          node.state === "locked" ? "opacity-75" : null,
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

  const labelTransform =
    labelsBelow || minimal
      ? "translate(-50%, -50%)"
      : `translate(${labelSide === "right" ? "-12%" : "-88%"}, -50%)`;

  const touchTargetClass = cn(
    "inline-flex shrink-0 touch-manipulation items-center justify-center",
    "min-h-11 min-w-11 border-0 bg-transparent p-0",
    interactive && onNodeSelect ? "cursor-pointer" : null,
  );

  const interactiveMarker = interactive ? (
    onNodeSelect ? (
      <button
        type="button"
        className={touchTargetClass}
        aria-label={ariaLabel}
        onClick={() => onNodeSelect(node)}
      >
        {marker}
      </button>
    ) : node.href ? (
      <Link href={node.href} className={touchTargetClass} aria-label={ariaLabel}>
        {marker}
      </Link>
    ) : (
      <div className={touchTargetClass} aria-label={ariaLabel}>
        {marker}
      </div>
    )
  ) : (
    <div aria-label={ariaLabel}>{marker}</div>
  );

  const anchoredLayout = (
    <div
      className={cn(
        "pointer-events-none",
        usePillLabels
          ? "flex items-center gap-2"
          : labelsBelow || minimal
            ? "flex flex-col items-center"
            : cn(
                "flex items-center gap-1.5",
                labelSide === "right" ? "flex-row" : "flex-row-reverse",
              ),
      )}
    >
      <div className="pointer-events-auto">{interactiveMarker}</div>
      {pillLabel}
      {card}
    </div>
  );

  const floatingLayout = (
    <div
      className={cn(
        "absolute",
        labelsBelow || minimal
          ? "flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
          : cn(
              "flex -translate-y-1/2 items-center gap-1.5",
              labelSide === "right" ? "flex-row" : "flex-row-reverse",
            ),
      )}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: labelTransform,
      }}
    >
      {interactiveMarker}
      {pillLabel}
      {card}
    </div>
  );

  return anchored ? anchoredLayout : floatingLayout;
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
  trialHref?: string | null;
  trialTitle?: string | null;
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
  trialHref,
  trialTitle,
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
    ? getTrailNodePositions(placementNodes, { theme: resolvedTheme })
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
    : getTrailNodePositions(placementNodes, { theme: resolvedTheme });
  const mapHeightRem = immersive
    ? undefined
    : trailMapMinHeightRem(nodes.length, compact || minimal);
  const useScrollArt = immersive && hasTrailScrollArt(regionSlug);

  const visibleNodeIndices = useMemo(() => {
    if (!immersive || nodes.length <= 8 || activeNodeIndex < 0) {
      return nodes.map((_, i) => i);
    }
    const window = 3;
    const start = Math.max(0, activeNodeIndex - window);
    const end = Math.min(nodes.length - 1, activeNodeIndex + window);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [activeNodeIndex, immersive, nodes.length]);

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
      {trialHref && trialTitle ? (
        <Link
          href={trialHref}
          className="block rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-body-sm font-medium text-primary"
        >
          Boss Trial · {trialTitle}
        </Link>
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
            if (!visibleNodeIndices.includes(index)) return null;
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
                className="pointer-events-none absolute"
                style={{
                  left: `${nodePosition.x}%`,
                  top: `${nodePosition.y}%`,
                  transform: "translate(-50%, -50%)",
                  zIndex: index + 10,
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
