"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { PRIMARY_NAV_ITEMS } from "@/lib/navigation/primary-nav";
import { isNavActive } from "@/lib/navigation/is-nav-active";
import { NavIconImage } from "@/components/media/nav-icon-image";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface"
    >
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 pb-[env(safe-area-inset-bottom)] pt-2">
        {PRIMARY_NAV_ITEMS.map(({ href, label, navTab }) => {
          const isActive = isNavActive(pathname, href);

          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "focus-ring flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] font-medium transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-xl transition-colors",
                  isActive && "bg-primary/10",
                )}
              >
                <NavIconImage tab={navTab} active={isActive} className="h-5 w-5" />
              </span>
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
