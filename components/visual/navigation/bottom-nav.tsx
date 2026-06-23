"use client";

import { usePathname } from "next/navigation";

import { glassSurface } from "@/components/visual/primitives/glass-surface";
import { NavTabItem } from "@/components/visual/navigation/nav-tab-item";
import { isNavActive } from "@/lib/navigation/is-nav-active";
import { PRIMARY_NAV_ITEMS } from "@/lib/navigation/primary-nav";
import { cn } from "@/lib/utils";

/** Floating glass pill primary navigation with mockup-aligned active tab treatment. */
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
      <div
        className={cn(
          "pointer-events-auto flex w-full max-w-phone items-end justify-between gap-0.5 px-1 pt-6",
          glassSurface.navShell,
        )}
      >
        {PRIMARY_NAV_ITEMS.map(({ href, label, navTab }) => (
          <NavTabItem
            key={href}
            href={href}
            label={label}
            navTab={navTab}
            isActive={isNavActive(pathname, href)}
          />
        ))}
      </div>
    </nav>
  );
}
