import Link from "next/link";
import { Check, Lock, Mountain, Play } from "lucide-react";

import { YamaPresence } from "@/features/yama/components/yama-presence";
import { yamaService } from "@/features/yama/services/yama.service";
import { cn } from "@/lib/utils";
import type { TrailNodeState, TrailNodeViewModel } from "@/features/learning/utils/trail-state";

type TrailNodeProps = {
  node: TrailNodeViewModel;
  compact?: boolean;
};

const STATE_STYLES: Record<
  TrailNodeState,
  { ring: string; bg: string; icon: typeof Check }
> = {
  completed: {
    ring: "border-success/40 bg-success/10 text-success",
    bg: "bg-success",
    icon: Check,
  },
  in_progress: {
    ring: "border-primary bg-primary/10 text-primary shadow-elevation-1",
    bg: "bg-primary",
    icon: Play,
  },
  available: {
    ring: "border-primary/40 bg-card text-primary",
    bg: "bg-primary/80",
    icon: Mountain,
  },
  locked: {
    ring: "border-border bg-muted/40 text-muted-foreground",
    bg: "bg-muted-foreground/40",
    icon: Lock,
  },
};

const STATE_LABELS: Record<TrailNodeState, string> = {
  completed: "Completed lesson",
  in_progress: "Continue lesson",
  available: "Start lesson",
  locked: "Locked lesson",
};

export function TrailNode({ node, compact = false }: TrailNodeProps) {
  const styles = STATE_STYLES[node.state];
  const Icon = styles.icon;
  const ariaLabel = `${STATE_LABELS[node.state]}: ${node.label}${
    node.subtitle ? `, ${node.subtitle}` : ""
  }`;
  const content = (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border p-3 transition-colors",
        styles.ring,
        compact ? "p-2.5" : "p-3",
        node.href ? "hover:bg-accent/40" : "cursor-not-allowed opacity-70",
      )}
      aria-label={node.href ? undefined : ariaLabel}
    >
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-primary-foreground",
          styles.bg,
          compact && "h-8 w-8",
        )}
      >
        <Icon className={cn("h-4 w-4", compact && "h-3.5 w-3.5")} aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <p className={cn("truncate font-medium", compact ? "text-body-sm" : "text-body-sm")}>
          {node.label}
        </p>
        {node.subtitle ? (
          <p className="truncate text-caption text-muted-foreground">{node.subtitle}</p>
        ) : null}
      </div>
    </div>
  );

  if (!node.href) {
    return content;
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
  title?: string;
  description?: string;
};

export function TrailMap({ nodes, compact = false, title, description }: TrailMapProps) {
  if (nodes.length === 0) {
    return (
      <p className="text-body-sm text-muted-foreground">No trail nodes available yet.</p>
    );
  }

  const activeNode = nodes.find((node) => node.state === "in_progress");

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
      <div className="relative space-y-2" role="list" aria-label="Trail lessons">
        {nodes.map((node, index) => (
          <div key={node.id} className="relative pl-1" role="listitem">
            {index < nodes.length - 1 ? (
              <span
                aria-hidden
                className="absolute left-5 top-10 h-[calc(100%+0.25rem)] w-px bg-border"
              />
            ) : null}
            <TrailNode node={node} compact={compact} />
          </div>
        ))}
      </div>
    </div>
  );
}
