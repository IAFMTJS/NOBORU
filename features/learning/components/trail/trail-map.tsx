"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Check, Lock, Mountain, Play } from "lucide-react";

import { MotionDiv } from "@/components/motion/motion-div";
import { YamaPresence } from "@/features/yama/components/yama-presence";
import { yamaService } from "@/features/yama/services/yama.service";
import {
  TRAIL_SPINE_FRAME_CLASS,
  TRAIL_SPINE_IMAGE_CLASS,
} from "@/lib/assets/image-presentation";
import { getTrailSpinePath } from "@/lib/assets/registry";
import { trailNodeReveal } from "@/lib/motion/presets";
import { cn } from "@/lib/utils";
import type { TrailNodeState, TrailNodeViewModel } from "@/features/learning/utils/trail-state";

const MARKER_STYLES: Record<
  TrailNodeState,
  { ring: string; fill: string; icon: typeof Check }
> = {
  completed: {
    ring: "border-success bg-success/15 text-success",
    fill: "bg-success text-success-foreground",
    icon: Check,
  },
  in_progress: {
    ring: "border-primary bg-primary/15 text-primary shadow-elevation-1",
    fill: "bg-primary text-primary-foreground",
    icon: Play,
  },
  available: {
    ring: "border-primary/50 bg-card/90 text-primary",
    fill: "bg-primary/85 text-primary-foreground",
    icon: Mountain,
  },
  locked: {
    ring: "border-border bg-muted/50 text-muted-foreground",
    fill: "bg-muted-foreground/50 text-background",
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
  side,
  compact,
}: {
  node: TrailNodeViewModel;
  side: "left" | "right";
  compact?: boolean;
}) {
  const styles = MARKER_STYLES[node.state];
  const Icon = styles.icon;
  const ariaLabel = `${STATE_LABELS[node.state]}: ${node.label}${
    node.subtitle ? `, ${node.subtitle}` : ""
  }`;

  const card = (
    <div
      className={cn(
        "max-w-[calc(50%-1.75rem)] rounded-xl border bg-card/90 p-2.5 backdrop-blur-sm transition-colors",
        styles.ring,
        node.href ? "hover:bg-accent/30" : "cursor-not-allowed opacity-70",
        compact && "p-2",
      )}
    >
      <p className={cn("truncate font-medium", compact ? "text-caption" : "text-body-sm")}>
        {node.label}
      </p>
      {node.subtitle ? (
        <p className="truncate text-caption text-muted-foreground">{node.subtitle}</p>
      ) : null}
    </div>
  );

  const marker = (
    <div
      className={cn(
        "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2",
        styles.ring,
      )}
    >
      <div
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-full",
          styles.fill,
        )}
      >
        <Icon className="h-3.5 w-3.5" aria-hidden />
      </div>
    </div>
  );

  const row = (
    <div
      className={cn(
        "relative flex min-h-[3.25rem] items-center",
        side === "left" ? "justify-start" : "justify-end",
      )}
    >
      {side === "left" ? (
        <>
          {card}
          <div className="w-4 shrink-0" />
          {marker}
        </>
      ) : (
        <>
          {marker}
          <div className="w-4 shrink-0" />
          {card}
        </>
      )}
    </div>
  );

  if (!node.href) {
    return (
      <div aria-label={ariaLabel} className="relative">
        {row}
      </div>
    );
  }

  return (
    <Link href={node.href} className="relative block" aria-label={ariaLabel}>
      {row}
    </Link>
  );
}

type TrailMapProps = {
  nodes: TrailNodeViewModel[];
  compact?: boolean;
  title?: string;
  description?: string;
};

export function TrailMap({ nodes, compact = false, title, description }: TrailMapProps) {
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
  const spineSrc = getTrailSpinePath(resolvedTheme);

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
      {activeNode ? (
        <YamaPresence
          presence={yamaService.resolveTrailProgress(activeNode.id.length)}
          size="sm"
        />
      ) : null}
      <div className="relative overflow-hidden rounded-2xl border border-primary/15 bg-card/50 py-4 shadow-elevation-1 dark:shadow-elevation-2">
        <div className={TRAIL_SPINE_FRAME_CLASS} aria-hidden>
          <Image
            src={spineSrc}
            alt=""
            fill
            className={TRAIL_SPINE_IMAGE_CLASS}
            sizes="160px"
          />
        </div>
        <div
          className="pointer-events-none absolute inset-y-4 left-1/2 w-0.5 -translate-x-1/2 bg-gradient-to-b from-primary/10 via-primary/40 to-primary/10"
          aria-hidden
        />
        <div className="relative space-y-1 px-2" role="list" aria-label="Trail lessons">
          {nodes.map((node, index) => (
            <MotionDiv
              key={node.id}
              role="listitem"
              {...trailNodeReveal}
              transition={{ delay: index * 0.04 }}
            >
              <TrailPathNode
                node={node}
                side={index % 2 === 0 ? "left" : "right"}
                compact={compact}
              />
            </MotionDiv>
          ))}
        </div>
      </div>
    </div>
  );
}
