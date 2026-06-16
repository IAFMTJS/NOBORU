"use client";

import type { ImmersiveNavTab } from "@/lib/navigation/immersive-nav.constants";
import { cn } from "@/lib/utils";

import { ArtLibraryImage } from "@/features/prototype/components/art-library-image";
import { prototypeGlass } from "@/features/prototype/components/prototype-glass-panel";

const NAV_ICON_BASE: Record<ImmersiveNavTab, string> = {
  journey: "icons/icon_nav_journey_mountain",
  camp: "icons/icon_nav_camp_tent",
  study: "icons/icon_nav_dojo_torii",
  bag: "icons/icon_nav_bag_backpack",
  profile: "icons/icon_nav_profile_fox",
};

const NAV_LABELS: Record<ImmersiveNavTab, string> = {
  journey: "Journey",
  camp: "Camp",
  study: "Study",
  bag: "Bag",
  profile: "Profile",
};

type PrototypeBottomNavProps = {
  activeTab: ImmersiveNavTab;
  onTabChange: (tab: ImmersiveNavTab) => void;
  className?: string;
};

/** Compact floating glass pill nav for UI Lab. */
export function PrototypeBottomNav({
  activeTab,
  onTabChange,
  className,
}: PrototypeBottomNavProps) {
  return (
    <nav
      aria-label="Prototype primary navigation"
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-3",
        "pb-[max(0.5rem,env(safe-area-inset-bottom))]",
        className,
      )}
    >
      <div className={cn("pointer-events-auto flex items-center gap-0.5", prototypeGlass.navShell)}>
        {(Object.keys(NAV_ICON_BASE) as ImmersiveNavTab[]).map((tab) => {
          const active = tab === activeTab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange(tab)}
              aria-current={active ? "page" : undefined}
              aria-label={NAV_LABELS[tab]}
              className={cn(
                "focus-ring inline-flex h-8 min-w-8 items-center justify-center rounded-full transition-all duration-200",
                active ? cn(prototypeGlass.navItemActive, "gap-1 px-2.5") : cn(prototypeGlass.navItemInactive, "px-1.5"),
              )}
            >
              <ArtLibraryImage
                themedBase={NAV_ICON_BASE[tab]}
                src=""
                alt=""
                width={18}
                height={18}
                className={cn("shrink-0 transition", !active && "opacity-70")}
              />
              {active ? (
                <span className="max-w-[4.25rem] truncate font-sans text-[9px] font-semibold leading-none tracking-wide">
                  {NAV_LABELS[tab]}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
