"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";

import { motionDurations } from "@/lib/motion/presets";

type MotionDivProps = HTMLMotionProps<"div"> & {
  duration?: keyof typeof motionDurations;
};

export function MotionDiv({
  duration = "standard",
  transition,
  ...props
}: MotionDivProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : { duration: motionDurations[duration], ease: "easeOut", ...transition }
      }
      {...props}
    />
  );
}
