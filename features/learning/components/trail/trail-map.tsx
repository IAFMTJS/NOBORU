"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Check, Lock, Mountain, Play } from "lucide-react";

import { TrailMapArtwork } from "@/components/media/trail-map-artwork";
import { MotionDiv } from "@/components/motion/motion-div";
import { YamaPresence } from "@/features/yama/components/yama-presence";
import { yamaService } from "@/features/yama/services/yama.service";
import {
  getTrailNodePositions,
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
    icon: Play,
  },
  available: {
    ring: "border-primary/70 bg-card/90 text-primary shadow-elevation-1",
    fill: "bg-primary/90 text-primary-foreground",
    icon: Mountain,
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
  available: "Start lesson",
  locked: "Locked lesson",
};

function TrailPathNode({
  node,
  position,
  compact,
  minimal,
  onNodeSelect,
}: {
  node: TrailNodeViewModel;
  position: { x: number; y: number };
  compact?: boolean;
  minimal?: boolean;
  onNodeSelect?: (node: TrailNodeViewModel) => void;
}) {
  const styles = MARKER_STYLES[node.state];
  const Icon = styles.icon;
  const labelSide = position.x < 48 ? "right" : "left";
  const ariaLabel = `${STATE_LABELS[node.state]}: ${node.label}${
    node.subtitle ? `, ${node.subtitle}` : ""
  }`;
  const interactive = Boolean(onNodeSelect) || Boolean(node.href);

  const marker = (
    <div
      className={cn(
        "relative z-10 flex shrink-0 items-center justify-center rounded-full border-2 backdrop-blur-sm",
        compact || minimal ? "h-8 w-8" : "h-9 w-9",
        styles.ring,
        interactive && onNodeSelect ? "cursor-pointer" : null,
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-full",
          compact || minimal ? "h-5 w-5" : "h-6 w-6",
          styles.fill,
        )}
      >
        <Icon className={compact || minimal ? "h-3 w-3" : "h-3.5 w-3.5"} aria-hidden />
      </div>
    </div>
  );

  const card = minimal ? null : (
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

  const content = (
    <div
      className={cn(
        "absolute flex -translate-y-1/2 items-center gap-1.5",
        labelSide === "right" ? "flex-row" : "flex-row-reverse",
        minimal && "justify-center",
      )}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: minimal
          ? `translate(-50%, -50%)`
          : `translate(${labelSide === "right" ? "-12%" : "-88%"}, -50%)`,
      }}
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
  title?: string;
  description?: string;
  onNodeSelect?: (node: TrailNodeViewModel) => void;
};

export function TrailMap({
  nodes,
  compact = false,
  minimal = false,
  title,
  description,
  onNodeSelect,
}: TrailMapProps) {
  const { resolvedTheme } = useTheme();

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

  const activeNode = nodes.find((node) => node.state === "in_progress");
  const positions = getTrailNodePositions(nodes.length);
  const minHeight = trailMapMinHeightRem(nodes.length, compact || minimal);

  return (
    <div className="space-y-3">
      {title ? (
        <div>
          <p className="text-body-sm font-medium">{title}</p>
          {description ? (
            <p className="text-caption text-muted-foreground">{description}</p>
          ) : null}
        </div>
      ) : null}
      {activeNode && !minimal ? (
        <YamaPresence
          presence={yamaService.resolveTrailProgress(activeNode.id.length)}
          size="sm"
        />
      ) : null}
      <div
        className="relative overflow-hidden rounded-2xl border border-primary/20 shadow-elevation-1 dark:shadow-elevation-2"
        style={{ minHeight: `${minHeight}rem` }}
      >
        <TrailMapArtwork theme={resolvedTheme} />
        <div
          className="relative px-1 py-3 sm:px-2"
          role="list"
          aria-label="Trail lessons"
          style={{ minHeight: `${minHeight}rem` }}
        >
          {nodes.map((node, index) => (
            <MotionDiv
              key={node.id}
              role="listitem"
              className="pointer-events-auto"
              {...trailNodeReveal}
              transition={{ delay: index * 0.04 }}
            >
              <TrailPathNode
                node={node}
                position={positions[index]}
                compact={compact}
                minimal={minimal}
                onNodeSelect={onNodeSelect}
              />
            </MotionDiv>
          ))}
        </div>
      </div>
    </div>
  );
}
