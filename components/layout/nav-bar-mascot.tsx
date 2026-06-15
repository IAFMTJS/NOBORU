"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { NavFoxImage } from "@/components/media/nav-fox-image";
import type { ImmersiveNavTab } from "@/lib/navigation/immersive-nav.constants";

type NavBarMascotProps = {
  tab: ImmersiveNavTab;
};

/** Dedicated left mascot slot — fox never overlaps tab labels (mockup navbar concepts). */
export function NavBarMascot({ tab }: NavBarMascotProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className="pointer-events-none relative z-10 w-[5.25rem] shrink-0 self-end"
      aria-hidden
    >
      <div className="relative flex h-[4.75rem] items-end justify-center pb-0.5">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab}
            className="absolute bottom-0 left-1/2 -translate-x-1/2"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 4, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -3, scale: 0.96 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            <NavFoxImage tab={tab} variant="bar-anchor" priority />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
