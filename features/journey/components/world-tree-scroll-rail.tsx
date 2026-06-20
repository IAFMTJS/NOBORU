"use client";

import {
  WORLD_TREE_SKELETON_ZONES,
  type WorldTreeZoneId,
} from "@/features/journey/constants/world-tree-skeleton.constants";
import { buildWorldTreeZoneBands } from "@/features/journey/utils/world-tree-layout.utils";
import { cn } from "@/lib/utils";

type WorldTreeScrollRailProps = {
  activeZoneId?: WorldTreeZoneId | null;
  onZoneSelect?: (zoneId: WorldTreeZoneId, centerYPercent: number) => void;
  className?: string;
};

/** Right-edge zone rail — scroll markers for the full World Tree ascent. */
export function WorldTreeScrollRail({
  activeZoneId = null,
  onZoneSelect,
  className,
}: WorldTreeScrollRailProps) {
  const bands = buildWorldTreeZoneBands();

  return (
    <nav
      aria-label="World tree zones"
      className={cn(
        "pointer-events-auto absolute right-2 top-1/2 z-30 flex -translate-y-1/2 flex-col items-center gap-1",
        className,
      )}
      data-world-tree-scroll-rail
    >
      <div className="relative flex h-[min(72vh,520px)] w-1 flex-col rounded-full bg-black/10 dark:bg-white/10">
        {WORLD_TREE_SKELETON_ZONES.map((zone) => {
          const band = bands[zone.id];
          const centerY = (band.yMin + band.yMax) / 2;
          const markerBottom = `${100 - centerY}%`;
          const isActive = activeZoneId === zone.id;

          return (
            <button
              key={zone.id}
              type="button"
              title={zone.label}
              aria-label={zone.label}
              aria-current={isActive ? "true" : undefined}
              onClick={() => onZoneSelect?.(zone.id, centerY)}
              className={cn(
                "absolute left-1/2 -translate-x-1/2 rounded-full border transition-transform",
                isActive
                  ? "h-2.5 w-2.5 border-[#D6A85F] bg-[#D6A85F] shadow-[0_0_8px_rgba(214,168,95,0.65)]"
                  : "h-1.5 w-1.5 border-[#8B7355]/60 bg-[#D6A85F]/40 hover:scale-125",
              )}
              style={{ bottom: markerBottom }}
              data-world-tree-zone-marker={zone.id}
            />
          );
        })}
      </div>
    </nav>
  );
}
