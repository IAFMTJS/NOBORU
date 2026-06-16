"use client";

import type { CSSProperties } from "react";
import { usePathname } from "next/navigation";

import { resolveNavSkinWithContext } from "@/lib/navigation/nav-skin.resolver";
import { isNavActive } from "@/lib/navigation/is-nav-active";
import { PRIMARY_NAV_ITEMS } from "@/lib/navigation/primary-nav";
import { cn } from "@/lib/utils";

import { NavTabItem } from "./nav-tab-item";

/** Single shared bottom nav — theme art/color varies per active route only. */
export function BottomNav() {
  const pathname = usePathname();
  const activeConfig = resolveNavSkinWithContext(pathname ?? "/learn");

  return (
    <nav
      aria-label="Primary navigation"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-3 pb-safe-bottom pt-10"
    >
      <div
        className={cn(
          "pointer-events-auto relative mx-auto flex max-w-phone items-end overflow-visible rounded-nav border backdrop-blur-md transition-[background-color,border-color,box-shadow] duration-500",
          activeConfig.barSurfaceClass,
          activeConfig.barBorderClass,
          "shadow-[0_10px_40px_rgba(0,0,0,0.35)]",
          "nav-bar-texture",
        )}
        style={
          {
            "--nav-texture-url": `url(${activeConfig.barTexturePath})`,
          } as CSSProperties
        }
      >
        <div className="flex min-h-nav w-full items-end justify-around gap-0 px-1 pb-1.5 pt-2">
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
