"use client";

import { useMemo, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { YamaExpressionImage } from "@/components/media/yama-expression-image";
import {
  computePathCoordinates,
  type PathGeometryOptions,
} from "@/features/journey/components/path-geometry";
import type { JourneyNode } from "@/features/journey/types/journey.types";
import type { CompanionEvolutionSlug } from "@/features/companion/types/companion.types";
import { yamaService } from "@/features/yama/services/yama.service";
import { cn } from "@/lib/utils";

type JourneyFoxCompanionProps = {
  currentNode: JourneyNode;
  geometryOptions: PathGeometryOptions;
  evolutionSlug?: CompanionEvolutionSlug;
  interactionsEnabled?: boolean;
  idleMotionEnabled?: boolean;
};

function resolveFoxOffset(x: number): number {
  const offsetX = x <= 50 ? x + 11 : x - 11;
  return Math.min(86, Math.max(14, offsetX));
}

function resolveFoxPresence(node: JourneyNode) {
  if (node.kind === "checkpoint") {
    return yamaService.resolveCheckpointPresence(node.state === "completed");
  }
  return yamaService.resolveTrailProgress(node.pathPosition * 100);
}

export function JourneyFoxCompanion({
  currentNode,
  geometryOptions,
  interactionsEnabled = false,
  idleMotionEnabled = false,
}: JourneyFoxCompanionProps) {
  const prefersReducedMotion = useReducedMotion();
  const [bubbleOpen, setBubbleOpen] = useState(false);
  const { x, y } = computePathCoordinates(
    currentNode.pathPosition,
    geometryOptions,
  );
  const foxX = resolveFoxOffset(x);
  const presence = useMemo(
    () => resolveFoxPresence(currentNode),
    [currentNode],
  );

  const idleAnimation =
    idleMotionEnabled && !prefersReducedMotion
      ? { y: ["-72%", "-76%", "-72%"] }
      : { y: "-72%" };

  const wrapperProps = interactionsEnabled
    ? {
        role: "button" as const,
        tabIndex: 0,
        "aria-expanded": bubbleOpen,
        "aria-label": "Yama, your mountain companion. Tap for encouragement.",
        onClick: () => setBubbleOpen((open) => !open),
        onKeyDown: (event: KeyboardEvent) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setBubbleOpen((open) => !open);
          }
        },
        className: cn(
          "absolute z-[8] cursor-pointer rounded-full outline-none",
          "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
        ),
      }
    : {
        role: "img" as const,
        "aria-label": "Yama, your mountain companion",
        className: "pointer-events-none absolute z-[8]",
      };

  return (
    <>
      <motion.div
        key={currentNode.id}
        {...wrapperProps}
        style={{
          left: `${foxX}%`,
          top: `${y}%`,
        }}
        initial={
          prefersReducedMotion
            ? false
            : { opacity: 0, scale: 0.88, x: "-50%", y: "-72%" }
        }
        animate={{
          opacity: 1,
          scale: 1,
          x: "-50%",
          ...idleAnimation,
        }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : idleMotionEnabled
              ? {
                  opacity: { duration: 0.42, ease: "easeOut" },
                  scale: { duration: 0.42, ease: "easeOut" },
                  y: { duration: 2.8, repeat: Infinity, ease: "easeInOut" },
                }
              : { duration: 0.42, ease: "easeOut" }
        }
      >
        <YamaExpressionImage
          expression="adventure"
          fit="sticker"
          width={56}
          height={56}
          priority
          className="h-14 w-14 drop-shadow-[0_4px_12px_rgba(0,0,0,0.45)]"
        />
      </motion.div>

      <AnimatePresence>
        {interactionsEnabled && bubbleOpen ? (
          <motion.div
            key={`bubble-${currentNode.id}`}
            className="pointer-events-none absolute z-[9] max-w-[min(16rem,calc(100%-2rem))]"
            style={{
              left: `${foxX}%`,
              top: `${Math.max(8, y - 14)}%`,
              transform: "translate(-50%, -100%)",
            }}
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <div className="rounded-xl border border-white/15 bg-black/75 px-3 py-2 text-caption text-white shadow-elevation-2 backdrop-blur-md">
              <p>{presence.message}</p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
