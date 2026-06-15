"use client";

import { usePathname } from "next/navigation";

import { NavTabItem } from "@/components/layout/nav-tab-item";
import { resolveNavSkinWithContext } from "@/lib/navigation/nav-skin.resolver";
import { isNavActive } from "@/lib/navigation/is-nav-active";
import { PRIMARY_NAV_ITEMS } from "@/lib/navigation/primary-nav";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();
  const activeConfig = resolveNavSkinWithContext(pathname ?? "/learn");

  return (
    <nav
      aria-label="Primary navigation"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-10"
    >
      <div
        className={cn(
          "pointer-events-auto relative mx-auto flex max-w-lg items-end overflow-visible rounded-[1.35rem] border backdrop-blur-md transition-[background-color,border-color,box-shadow] duration-500",
          activeConfig.barSurfaceClass,
          activeConfig.barBorderClass,
          "shadow-[0_10px_40px_rgba(0,0,0,0.35)]",
        )}
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0.75)), url(${activeConfig.barTexturePath})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex min-h-[5.5rem] w-full items-end justify-around gap-0 px-1 pb-1.5 pt-2">
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
