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

  const particleCount = tab === "camp" ? 4 : 3;

  return (
    <span className="pointer-events-none absolute inset-0 overflow-visible" aria-hidden>
      {Array.from({ length: particleCount }).map((_, index) => (
        <motion.span
          key={index}
          className={cn("absolute h-1.5 w-1.5 rounded-full", config.particleClass)}
          initial={{ opacity: 0.2, y: 12, x: 6 + index * 8 }}
          animate={{
            opacity: [0.2, 0.85, 0.2],
            y: [12, -4, 12],
            x: [6 + index * 8, 10 + index * 8, 4 + index * 8],
          }}
          transition={{
            duration: tab === "bag" ? 4 : 2.6,
            repeat: Infinity,
            delay: index * 0.35,
            ease: "easeInOut",
          }}
        />
      ))}
    </span>
  );
}

/** Mockup — fox overlaps the active tab with glow emphasis. */
export function NavTabItem({ href, label, navTab, isActive }: NavTabItemProps) {
  const config = IMMERSIVE_NAV_TAB_CONFIG[navTab];
  const prefersReducedMotion = useReducedMotion();

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "focus-ring relative flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl px-0.5 pb-1 pt-0 text-caption font-semibold tracking-wide transition-colors",
        isActive ? config.activeLabelClass : "text-muted-foreground/80 hover:text-foreground/90",
      )}
    >
      {isActive ? (
        <div
          className="pointer-events-none absolute -top-[3.5rem] left-1/2 z-20 flex -translate-x-1/2 flex-col items-center"
          aria-hidden
        >
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.32, ease: "easeOut" }}
            className="relative"
          >
            <span
              className={cn(
                "absolute -inset-3 rounded-full blur-2xl",
                config.activeGlowClass,
                "opacity-70",
              )}
            />
            <NavFoxImage tab={navTab} variant="bar-anchor" priority />
          </motion.div>
        </div>
      ) : null}

      <NavTabParticles tab={navTab} active={isActive} />

      <span
        className={cn(
          "relative z-10 mt-7 flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-transparent transition-all duration-300",
          isActive
            ? cn(
                config.activeIconRingClass,
                config.activeGlowClass,
                "scale-110 ring-2 bg-transparent",
              )
            : "bg-transparent ring-transparent",
        )}
      >
        <NavIconImage
          tab={navTab}
          active={isActive}
          className={cn(
            isActive ? cn("h-[18px] w-[18px]", config.activeIconDropShadow) : "h-5 w-5",
          )}
        />
      </span>

      <span className={cn("relative z-10 truncate leading-none", isActive && "font-bold")}>
        {label}
      </span>

      {isActive ? (
        <motion.span
          aria-hidden
          className={cn("relative z-10 h-1.5 w-1.5 rounded-full", config.activeIndicatorClass)}
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        />
      ) : (
        <span className="h-1.5 w-1.5" aria-hidden />
      )}
    </Link>
  );
}
