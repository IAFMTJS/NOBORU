"use client";

import { usePathname } from "next/navigation";

import { NavBarMascot } from "@/components/layout/nav-bar-mascot";
import { NavTabItem } from "@/components/layout/nav-tab-item";
import { IMMERSIVE_NAV_TAB_CONFIG } from "@/lib/navigation/immersive-nav.constants";
import { isNavActive } from "@/lib/navigation/is-nav-active";
import { PRIMARY_NAV_ITEMS } from "@/lib/navigation/primary-nav";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();
  const activeItem =
    PRIMARY_NAV_ITEMS.find((item) => isNavActive(pathname, item.href)) ??
    PRIMARY_NAV_ITEMS[0];
  const activeConfig = IMMERSIVE_NAV_TAB_CONFIG[activeItem.navTab];

  return (
    <nav
      aria-label="Primary navigation"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-8"
    >
      <div
        className={cn(
          "pointer-events-auto relative mx-auto flex max-w-lg items-end overflow-visible rounded-[1.35rem] border backdrop-blur-md transition-[background-color,border-color,box-shadow] duration-500",
          activeConfig.barBorderClass,
          "shadow-[0_10px_40px_rgba(0,0,0,0.35)]",
        )}
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0.75)), url(${activeConfig.barTexturePath})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <NavBarMascot tab={activeItem.navTab} />

        <div className="flex min-h-[3.65rem] flex-1 items-end justify-around gap-0 px-1 pb-1.5 pt-1.5">
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
      </div>
    </nav>
  );
}
