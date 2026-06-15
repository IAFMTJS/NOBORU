"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { YamaPresence } from "@/features/yama/components/yama-presence";
import {
  computePathCoordinates,
  type PathGeometryOptions,
} from "@/features/journey/components/path-geometry";
import type { JourneyNode } from "@/features/journey/types/journey.types";
import type { CompanionEvolutionSlug } from "@/features/companion/types/companion.types";
import { yamaService } from "@/features/yama/services/yama.service";

type JourneyFoxCompanionProps = {
  currentNode: JourneyNode;
  focusNode?: JourneyNode | null;
  geometryOptions: PathGeometryOptions;
  evolutionSlug?: CompanionEvolutionSlug;
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
  focusNode = null,
  geometryOptions,
  idleMotionEnabled = false,
}: JourneyFoxCompanionProps) {
  const prefersReducedMotion = useReducedMotion();
  const anchorNode = focusNode ?? currentNode;
  const { x, y } = computePathCoordinates(
    anchorNode.pathPosition,
    geometryOptions,
  );
  const foxX = resolveFoxOffset(x);
  const presence = useMemo(
    () => resolveFoxPresence(anchorNode),
    [anchorNode],
  );

  const idleAnimation =
    idleMotionEnabled && !prefersReducedMotion
      ? { y: ["-72%", "-76%", "-72%"] }
      : { y: "-72%" };

  return (
    <motion.div
      key={anchorNode.id}
      role="img"
      aria-label="Yama, your mountain companion"
      className="pointer-events-none absolute z-[8]"
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
      <YamaPresence
        presence={presence}
        size="md"
        fit="sticker"
        showMessage={false}
        priority
        className="drop-shadow-[0_4px_12px_rgba(0,0,0,0.45)]"
      />
    </motion.div>
  );
}
