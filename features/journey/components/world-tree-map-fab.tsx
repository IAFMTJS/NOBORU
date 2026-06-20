"use client";

import Link from "next/link";

import { ArtLibraryImage } from "@/components/media/art-library-image";
import { glassSurface } from "@/components/visual/primitives/glass-surface";
import { cn } from "@/lib/utils";

type WorldTreeMapFabProps = {
  href: string;
  label?: string;
  className?: string;
};

/** Floating action — jump to focused journey climb or region map. */
export function WorldTreeMapFab({
  href,
  label = "Continue climb",
  className,
}: WorldTreeMapFabProps) {
  return (
    <Link
      href={href}
      className={cn(
        "pointer-events-auto absolute bottom-[calc(var(--nav-clearance)+0.75rem)] right-3 z-30",
        "focus-ring inline-flex items-center gap-2 rounded-full px-3 py-2",
        glassSurface.chip,
        className,
      )}
      data-world-tree-map-fab
    >
      <ArtLibraryImage themedBase="icons/icon_nav_journey_mountain" src="" alt="" width={18} height={18} />
      <span className="font-sans text-[10px] font-semibold uppercase tracking-wide">{label}</span>
    </Link>
  );
}
