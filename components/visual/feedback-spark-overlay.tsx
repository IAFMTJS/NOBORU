"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

import { MotionDiv } from "@/components/motion/motion-div";
import { cn } from "@/lib/utils";

type FeedbackSparkOverlayProps = {
  active: boolean;
  className?: string;
};

const SPARKS = [
  { x: "-20%", y: "-30%", delay: 0 },
  { x: "15%", y: "-25%", delay: 0.05 },
  { x: "-10%", y: "10%", delay: 0.1 },
  { x: "25%", y: "5%", delay: 0.08 },
  { x: "0%", y: "-40%", delay: 0.12 },
  { x: "-25%", y: "0%", delay: 0.06 },
] as const;

export function FeedbackSparkOverlay({
  active,
  className,
}: FeedbackSparkOverlayProps) {
  const reduceMotion = useReducedMotion();
  const [burstKey, setBurstKey] = useState(0);

  useEffect(() => {
    if (!active || reduceMotion) return;
    setBurstKey((key) => key + 1);
  }, [active, reduceMotion]);

  if (!active || reduceMotion) return null;

  return (
    <div
      key={burstKey}
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      {SPARKS.map((spark, index) => (
        <MotionDiv
          key={`${burstKey}-${index}`}
          className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full bg-trail-glow shadow-[0_0_12px_rgba(255,200,100,0.9)]"
          initial={{ opacity: 0, scale: 0.2, x: 0, y: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.2, 1.2, 0.4],
            x: spark.x,
            y: spark.y,
          }}
          transition={{
            duration: 0.65,
            delay: spark.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}
