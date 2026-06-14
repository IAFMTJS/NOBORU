"use client";

import { usePathname } from "next/navigation";

import { NavTabItem } from "@/components/layout/nav-tab-item";
import { PRIMARY_NAV_ITEMS } from "@/lib/navigation/primary-nav";
import { isNavActive } from "@/lib/navigation/is-nav-active";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-primary/15 bg-gradient-to-t from-surface via-surface/98 to-surface/95 backdrop-blur-md"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent"
        aria-hidden
      />
      <div className="mx-auto flex max-w-lg items-end justify-around px-1 pb-[env(safe-area-inset-bottom)] pt-1">
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
