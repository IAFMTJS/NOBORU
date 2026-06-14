"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { NavFoxImage } from "@/components/media/nav-fox-image";
import type { ImmersiveNavTab } from "@/lib/navigation/immersive-nav.constants";

type NavBarMascotProps = {
  tab: ImmersiveNavTab;
};

export function NavBarMascot({ tab }: NavBarMascotProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="relative w-[4.75rem] shrink-0 self-end pl-0.5" aria-hidden>
      <div className="relative h-[3.25rem]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab}
            className="absolute -top-5 bottom-0 left-1/2 w-[4.75rem] -translate-x-1/2"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 6, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -4, scale: 0.94 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            <NavFoxImage tab={tab} variant="bar-anchor" priority />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
