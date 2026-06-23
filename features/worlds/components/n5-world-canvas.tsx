"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";

import type { JourneyNode, JourneyRegionViewModel } from "@/features/journey/types/journey.types";
import { cn } from "@/lib/utils";

import { resolveN5LayoutScrollMinHeightVh } from "@/features/worlds/utils/n5-world-layout.utils";
import { N5WorldBackdrop } from "@/features/worlds/components/n5-world-backdrop";
import { useN5BackdropScroll } from "@/features/worlds/hooks/use-n5-backdrop-scroll";
import { N5WorldHud } from "@/features/worlds/components/n5-world-hud";
import { N5WorldNode, N5WorldNodeCard } from "@/features/worlds/components/n5-world-node";
import { N5WorldSpinePath } from "@/features/worlds/components/n5-world-spine-path";
import { resolveN5ActLabelFromPathPosition } from "@/features/worlds/utils/n5-act.utils";
import { resolveN5NodeCanvasPositions } from "@/features/worlds/utils/n5-world-layout.utils";

type N5WorldCanvasProps = {
  region: JourneyRegionViewModel;
  currentNodeId: string | null;
  focusNodeId?: string | null;
  hud: {
    displayName?: string | null;
    levelLabel?: string | null;
    currentStreak?: number;
  };
  onNodeFocus?: (nodeId: string) => void;
};

function resolveCurrentNode(
  region: JourneyRegionViewModel,
  currentNodeId: string | null,
): JourneyNode | null {
  if (currentNodeId) {
    return region.nodes.find((node) => node.id === currentNodeId) ?? null;
  }
  if (region.currentNodeIndex != null) {
    return region.nodes[region.currentNodeIndex] ?? null;
  }
  return null;
}

export function N5WorldCanvas({
  region,
  currentNodeId,
  focusNodeId,
  hud,
  onNodeFocus,
}: N5WorldCanvasProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const scrollBehavior = prefersReducedMotion ? "auto" : "smooth";
  const autoOpenedCurrentRef = useRef(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "light" ? "light" : "dark";

  const currentNode = resolveCurrentNode(region, currentNodeId);
  const actPathPosition = currentNode?.pathPosition ?? 0.02;
  const actLabel = resolveN5ActLabelFromPathPosition(actPathPosition);

  const positions = useMemo(
    () => resolveN5NodeCanvasPositions(region.nodes, { theme }),
    [region.nodes, theme],
  );

  const scrollMinHeightVh = useMemo(
    () => resolveN5LayoutScrollMinHeightVh(region.nodes.length, { theme }),
    [region.nodes.length, theme],
  );

  const backdropScrollState = useN5BackdropScroll(scrollRef);

  const selectedNode =
    region.nodes.find((node) => node.id === selectedId) ??
    currentNode ??
    region.nodes[0] ??
    null;

  const scrollToNode = useCallback((nodeId: string) => {
    const container = scrollRef.current;
    if (!container) return;
    const position = positions.get(nodeId);
    if (!position) return;

    const targetY = (position.y / 100) * container.scrollHeight - container.clientHeight * 0.55;
    container.scrollTo({
      top: Math.max(0, targetY),
      behavior: scrollBehavior,
    });
  }, [positions, scrollBehavior]);

  useEffect(() => {
    const targetId = focusNodeId ?? currentNodeId;
    if (!targetId) return;
    const frame = requestAnimationFrame(() => scrollToNode(targetId));
    return () => cancelAnimationFrame(frame);
  }, [focusNodeId, currentNodeId, scrollToNode]);

  useEffect(() => {
    if (autoOpenedCurrentRef.current) return;
    if (!currentNode?.href || currentNode.state === "locked") return;
    if (currentNode.kind === "landmark") return;
    autoOpenedCurrentRef.current = true;
    setSelectedId(currentNode.id);
  }, [currentNode]);

  return (
    <div className="relative h-content w-full overflow-hidden">
      <N5WorldHud
        actLabel={actLabel}
        completedLessons={region.completedCount}
        totalLessons={region.lessonCount}
        displayName={hud.displayName}
        levelLabel={hud.levelLabel}
        currentStreak={hud.currentStreak}
        continueLabel={
          currentNode?.href && currentNode.state !== "locked"
            ? currentNode.label
            : null
        }
      />

      <N5WorldBackdrop scrollState={backdropScrollState} />

      <div
        ref={scrollRef}
        className="relative z-10 h-full w-full snap-y snap-mandatory overflow-y-auto overscroll-contain"
        style={{ scrollBehavior }}
      >
        <div
          className="relative w-full"
          style={{ minHeight: `${scrollMinHeightVh}vh` }}
        >
          <N5WorldSpinePath theme={theme} />

          {region.nodes.map((node) => {
            const position = positions.get(node.id);
            if (!position) return null;
            const isCurrent = currentNode?.id === node.id;
            return (
              <N5WorldNode
                key={node.id}
                node={node}
                position={position}
                isCurrent={isCurrent}
                selected={selectedId === node.id}
                onSelect={() => {
                  setSelectedId(node.id);
                  onNodeFocus?.(node.id);
                  scrollToNode(node.id);
                }}
              />
            );
          })}
        </div>
      </div>

      {selectedNode && selectedId ? (
        <N5WorldNodeCard
          node={selectedNode}
          isCurrent={currentNode?.id === selectedNode.id}
          onClose={() => setSelectedId(null)}
        />
      ) : null}

      <p
        className={cn(
          "pointer-events-none absolute bottom-20 left-0 right-0 z-20 text-center text-caption text-muted-foreground",
        )}
      >
        Scroll to explore
      </p>
    </div>
  );
}
