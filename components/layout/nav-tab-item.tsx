"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

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

export function NavTabItem({ href, label, navTab, isActive }: NavTabItemProps) {
  const config = IMMERSIVE_NAV_TAB_CONFIG[navTab];
  const prefersReducedMotion = useReducedMotion();

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "focus-ring relative flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-0.5 py-1 text-[10px] font-semibold tracking-wide transition-colors",
        isActive ? config.activeLabelClass : "text-muted-foreground/80 hover:text-foreground/90",
      )}
    >
      <NavTabParticles tab={navTab} active={isActive} />

      <span
        className={cn(
          "relative flex h-8 w-8 items-center justify-center rounded-xl ring-1 ring-transparent transition-all duration-300",
          isActive ? cn(config.activeIconRingClass, config.activeGlowClass) : "bg-transparent",
        )}
      >
        <NavIconImage tab={navTab} active={isActive} className={isActive ? "h-[18px] w-[18px]" : "h-5 w-5"} />
      </span>

      <span className="relative truncate leading-none">{label}</span>

      {isActive ? (
        <motion.span
          aria-hidden
          layoutId="nav-active-indicator"
          className={cn("h-1 w-1 rounded-full", config.activeIndicatorClass)}
          transition={{ type: "spring", stiffness: 420, damping: 32 }}
        />
      ) : (
        <span className="h-1 w-1" aria-hidden />
      )}
    </Link>
  );
}
