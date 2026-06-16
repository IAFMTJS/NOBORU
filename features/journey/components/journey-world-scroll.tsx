"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";

import type {
  JourneyNode,
  JourneyPathViewModel,
} from "@/features/journey/types/journey.types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type JourneyWorldScrollProps = {
  journey: JourneyPathViewModel;
  onNodeSelect?: (node: JourneyNode) => void;
  companionEvolutionSlug?: string;
  scrollToRegionSlug?: string | null;
  scrollToNodeId?: string | null;
  selectedNodeId?: string | null;
  className?: string;
};

const NODE_STATE_LABEL: Record<JourneyNode["state"], string> = {
  locked: "Locked",
  available: "Available",
  in_progress: "In progress",
  completed: "Done",
};

/** Basic lesson list — visuals stripped for rebuild. */
export function JourneyWorldScroll({
  journey,
  onNodeSelect,
  scrollToNodeId = null,
  selectedNodeId = null,
  className,
}: JourneyWorldScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentNodeId = journey.position.currentNodeId;

  const scrollToSelector = useCallback((selector: string) => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;
    const target = scrollEl.querySelector(selector);
    target?.scrollIntoView({ block: "center", behavior: "auto" });
  }, []);

  useEffect(() => {
    if (scrollToNodeId) {
      scrollToSelector(`[data-journey-node-id="${scrollToNodeId}"]`);
      return;
    }
    if (currentNodeId) {
      scrollToSelector(`[data-journey-node-id="${currentNodeId}"]`);
    }
  }, [currentNodeId, scrollToNodeId, scrollToSelector]);

  if (journey.regions.every((region) => region.nodes.length === 0)) {
    return (
      <div className="flex flex-1 items-center justify-center p-4 text-body-sm text-muted-foreground">
        No lessons yet.
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className={cn("h-full min-h-0 flex-1 overflow-y-auto p-4", className)}
    >
      <div className="space-y-6">
        {journey.regions.map((region) => (
          <section key={region.id} data-journey-region-gate={region.slug}>
            <div className="mb-2 flex items-baseline justify-between gap-2">
              <h2 className="text-base font-semibold">{region.name}</h2>
              <span className="text-caption text-muted-foreground">
                {region.completedCount}/{region.lessonCount}
              </span>
            </div>
            {region.description ? (
              <p className="mb-3 text-body-sm text-muted-foreground">{region.description}</p>
            ) : null}
            <ul className="space-y-2">
              {region.nodes.map((node) => {
                const selected = selectedNodeId === node.id;
                const content = (
                  <div
                    data-journey-node-id={node.id}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2 text-body-sm",
                      selected && "border-primary",
                      node.state === "locked" && "opacity-60",
                    )}
                  >
                    <div className="min-w-0">
                      <p className="font-medium">{node.label}</p>
                      {node.subtitle ? (
                        <p className="text-caption text-muted-foreground">{node.subtitle}</p>
                      ) : null}
                    </div>
                    <span className="shrink-0 text-caption text-muted-foreground">
                      {NODE_STATE_LABEL[node.state]}
                    </span>
                  </div>
                );

                if (node.href && node.state !== "locked") {
                  return (
                    <li key={node.id}>
                      <Link href={node.href} className="block focus-ring rounded-lg">
                        {content}
                      </Link>
                    </li>
                  );
                }

                return (
                  <li key={node.id}>
                    {onNodeSelect && node.state !== "locked" ? (
                      <button
                        type="button"
                        className="w-full text-left focus-ring rounded-lg"
                        onClick={() => onNodeSelect(node)}
                      >
                        {content}
                      </button>
                    ) : (
                      content
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      {journey.nextLessonHref ? (
        <div className="sticky bottom-4 mt-6">
          <Button asChild className="w-full">
            <Link href={journey.nextLessonHref}>Continue</Link>
          </Button>
        </div>
      ) : null}
    </div>
  );
}
