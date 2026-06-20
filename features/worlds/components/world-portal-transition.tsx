"use client";

import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useState, type ReactNode } from "react";

import { motionDurations } from "@/lib/motion/presets";

type WorldPortalTransitionProps = {
  children: ReactNode;
  worldKey: string;
};

type PendingNavigation = {
  href: string;
};

/**
 * Wraps a world screen and plays fade/zoom portal transitions between worlds.
 */
export function WorldPortalTransitionProvider({
  children,
  worldKey,
}: WorldPortalTransitionProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={worldKey}
        className="relative h-full min-h-0 w-full"
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 1.06 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={
          prefersReducedMotion
            ? { opacity: 0 }
            : { opacity: 0, scale: 0.94, filter: "blur(4px)" }
        }
        transition={{
          duration: prefersReducedMotion ? 0 : motionDurations.complex,
          ease: "easeInOut",
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export function useWorldPortalNavigation() {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const [pending, setPending] = useState<PendingNavigation | null>(null);

  const navigateToWorld = useCallback(
    (href: string) => {
      if (prefersReducedMotion) {
        router.push(href);
        return;
      }

      setPending({ href });

      window.setTimeout(() => {
        router.push(href);
        setPending(null);
      }, motionDurations.complex * 1000);
    },
    [prefersReducedMotion, router],
  );

  const overlay = (
    <AnimatePresence>
      {pending ? (
        <motion.div
          className="pointer-events-none fixed inset-0 z-50 bg-background"
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1.08 }}
          exit={{ opacity: 0 }}
          transition={{ duration: motionDurations.complex, ease: "easeInOut" }}
          aria-hidden
        />
      ) : null}
    </AnimatePresence>
  );

  return { navigateToWorld, transitionOverlay: overlay };
}
