"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { NavFoxImage } from "@/components/media/nav-fox-image";
import { NavIconImage } from "@/components/media/nav-icon-image";
import {
  IMMERSIVE_NAV_TAB_CONFIG,
  type ImmersiveNavTab,
} from "@/lib/navigation/immersive-nav.constants";
import { cn } from "@/lib/utils";

type NavTabItemProps = {
  href: string;
  label: string;
  navTab: ImmersiveNavTab;
  isActive: boolean;
};

function NavTabParticles({ tab, active }: { tab: ImmersiveNavTab; active: boolean }) {
  const prefersReducedMotion = useReducedMotion();
  const config = IMMERSIVE_NAV_TAB_CONFIG[tab];

  if (!active || prefersReducedMotion) return null;

  const particleCount = tab === "camp" ? 3 : 2;

  return (
    <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl" aria-hidden>
      {Array.from({ length: particleCount }).map((_, index) => (
        <motion.span
          key={index}
          className={cn("absolute h-1 w-1 rounded-full", config.particleClass)}
          initial={{ opacity: 0.2, y: 8, x: 8 + index * 10 }}
          animate={{
            opacity: [0.15, 0.7, 0.15],
            y: [8, -2, 8],
            x: [8 + index * 10, 10 + index * 10, 6 + index * 10],
          }}
          transition={{
            duration: tab === "world" ? 4 : 2.8,
            repeat: Infinity,
            delay: index * 0.4,
            ease: "easeInOut",
          }}
        />
      ))}
    </span>
  );
}

function NavTabGlow({ tab, active }: { tab: ImmersiveNavTab; active: boolean }) {
  const prefersReducedMotion = useReducedMotion();
  const config = IMMERSIVE_NAV_TAB_CONFIG[tab];

  if (!active) return null;

  return (
    <motion.span
      aria-hidden
      className={cn(
        "pointer-events-none absolute -inset-x-1 -top-2 bottom-0 rounded-2xl bg-gradient-to-t from-primary/10 via-transparent to-transparent",
        config.activeGlowClass,
      )}
      initial={prefersReducedMotion ? false : { opacity: 0.6 }}
      animate={prefersReducedMotion ? undefined : { opacity: [0.45, 0.85, 0.45] }}
      transition={
        prefersReducedMotion
          ? undefined
          : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
      }
    />
  );
}

export function NavTabItem({ href, label, navTab, isActive }: NavTabItemProps) {
  const config = IMMERSIVE_NAV_TAB_CONFIG[navTab];
  const prefersReducedMotion = useReducedMotion();

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "focus-ring relative flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-2xl px-1 py-1.5 text-[10px] font-semibold tracking-wide transition-colors",
        isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
      )}
    >
      <NavTabGlow tab={navTab} active={isActive} />
      <NavTabParticles tab={navTab} active={isActive} />

      <span className="relative flex h-10 w-full flex-col items-center justify-end">
        {isActive ? (
          <motion.span
            className="absolute -top-0.5"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 4, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <NavFoxImage tab={navTab} active={isActive} priority />
          </motion.span>
        ) : null}

        <span
          className={cn(
            "relative flex h-7 w-7 items-center justify-center rounded-xl ring-1 ring-transparent transition-all duration-300",
            isActive ? config.activeIconRingClass : "bg-transparent",
            isActive && !prefersReducedMotion && navTab === "world" && "motion-safe:animate-[spin_12s_linear_infinite]",
          )}
        >
          <NavIconImage tab={navTab} active={isActive} className={isActive ? "h-4 w-4" : "h-5 w-5"} />
        </span>
      </span>

      <span className="relative truncate">{label}</span>
    </Link>
  );
}
