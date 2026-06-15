"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { YamaExpressionImage } from "@/components/media/yama-expression-image";
import type { YamaExpression } from "@/features/yama/types/yama.types";
import { cn } from "@/lib/utils";

type DrillCompanionReactionProps = {
  result: "correct" | "incorrect" | null;
  className?: string;
};

function resolveExpression(result: DrillCompanionReactionProps["result"]): YamaExpression {
  if (result === "correct") return "happy";
  if (result === "incorrect") return "concerned";
  return "encouraging";
}

/** Doc 03 — corner fox micro-reactions during drills. */
export function DrillCompanionReaction({ result, className }: DrillCompanionReactionProps) {
  const prefersReducedMotion = useReducedMotion();
  const expression = resolveExpression(result);

  return (
    <div
      className={cn(
        "pointer-events-none absolute bottom-2 right-2 z-20 sm:bottom-3 sm:right-3",
        className,
      )}
      aria-hidden
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={result ?? "idle"}
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.85, y: 6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          <YamaExpressionImage
            expression={expression}
            fit="sticker"
            width={52}
            height={52}
            className="drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
