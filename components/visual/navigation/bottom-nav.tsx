"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ArtLibraryImage } from "@/components/media/art-library-image";
import { glassSurface } from "@/components/visual/primitives/glass-surface";
import { isNavActive } from "@/lib/navigation/is-nav-active";
import type { ImmersiveNavTab } from "@/lib/navigation/immersive-nav.constants";
import { PRIMARY_NAV_ITEMS } from "@/lib/navigation/primary-nav";
import { cn } from "@/lib/utils";

const NAV_ICON_BASE: Record<ImmersiveNavTab, string> = {
  journey: "icons/icon_nav_journey_mountain",
  tree: "icons/icon_nav_world_pagoda",
  camp: "icons/icon_nav_camp_tent",
  study: "icons/icon_nav_dojo_torii",
  bag: "icons/icon_nav_bag_backpack",
  profile: "icons/icon_nav_profile_fox",
};

/** Floating glass pill primary navigation. */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary navigation"
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-3",
        "pb-[max(0.5rem,env(safe-area-inset-bottom))]",
      )}
    >
      <div className={cn("pointer-events-auto flex items-center gap-0.5", glassSurface.navShell)}>
        {PRIMARY_NAV_ITEMS.map(({ href, label, navTab }) => {
          const active = isNavActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              prefetch={false}
              aria-current={active ? "page" : undefined}
              aria-label={label}
              className={cn(
                "focus-ring inline-flex h-8 min-w-8 items-center justify-center rounded-full transition-all duration-200",
                active
                  ? cn(glassSurface.navItemActive, "gap-1 px-2.5")
                  : cn(glassSurface.navItemInactive, "px-1.5"),
              )}
            >
              <ArtLibraryImage
                themedBase={NAV_ICON_BASE[navTab]}
                src=""
                alt=""
                width={18}
                height={18}
                className={cn("shrink-0 transition", !active && "opacity-70")}
              />
              {active ? (
                <span className="max-w-[4.25rem] truncate font-sans text-[9px] font-semibold leading-none tracking-wide">
                  {label}
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
