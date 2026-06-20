"use client";

import Image from "next/image";
import { useTheme } from "next-themes";

import {
  WORLD_TREE_JLPT_BANDS,
  buildWorldTreeJlptBandLayout,
  worldTreeJlptBandArtPath,
  type WorldTreeJlptBandId,
} from "@/features/journey/constants/world-tree-jlpt-band.constants";
import { artLibraryPath } from "@/lib/assets/art-library-paths";
import { cn } from "@/lib/utils";

type WorldTreeJlptBandArtLayerProps = {
  className?: string;
  /** Show hex JLPT badges and colored dividers (overview mode). */
  showJlptChrome?: boolean;
};

function JlptBadge({
  bandId,
  label,
  accentColor,
  yPercent,
}: {
  bandId: WorldTreeJlptBandId;
  label: string;
  accentColor: string;
  yPercent: number;
}) {
  return (
    <div
      className="pointer-events-none absolute left-2 z-[4] flex -translate-y-1/2 items-center gap-2"
      style={{ top: `${yPercent}%` }}
      data-jlpt-band-badge={bandId}
    >
      <span
        className="flex h-8 w-8 items-center justify-center rounded-md border-2 text-[11px] font-bold uppercase text-white shadow-md"
        style={{
          borderColor: accentColor,
          backgroundColor: accentColor,
          boxShadow: `0 0 12px ${accentColor}88`,
        }}
      >
        {bandId.toUpperCase()}
      </span>
      <span
        className="hidden h-0.5 flex-1 rounded-full sm:block sm:w-16 md:w-24"
        style={{
          background: `linear-gradient(90deg, ${accentColor}, transparent)`,
          boxShadow: `0 0 8px ${accentColor}66`,
        }}
        aria-hidden
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}

/**
 * Five JLPT hero bands — transparent tree art stacked vertically.
 * Sky/backdrop comes from WorldTreeRealmBackdrop; path + nodes are separate layers.
 */
export function WorldTreeJlptBandArtLayer({
  className,
  showJlptChrome = true,
}: WorldTreeJlptBandArtLayerProps) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "light" ? "light" : "dark";
  const bands = buildWorldTreeJlptBandLayout();

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      data-world-tree-jlpt-band-art
      aria-hidden
    >
      {WORLD_TREE_JLPT_BANDS.map((band) => {
        const layout = bands.find((entry) => entry.id === band.id)!;
        const height = layout.yMax - layout.yMin;
        const centerY = (layout.yMin + layout.yMax) / 2;
        const src = artLibraryPath(worldTreeJlptBandArtPath(band.id, theme));

        return (
          <div
            key={band.id}
            className="absolute inset-x-0"
            style={{ top: `${layout.yMin}%`, height: `${height}%` }}
            data-jlpt-band={band.id}
          >
            {showJlptChrome ? (
              <>
                <div
                  className="absolute inset-x-0 top-0 z-[3] h-px"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${band.accentColor}88, transparent)`,
                    boxShadow: `0 0 6px ${band.accentGlow}`,
                  }}
                  data-jlpt-band-divider
                />
                <JlptBadge
                  bandId={band.id}
                  label={band.label}
                  accentColor={band.accentColor}
                  yPercent={((centerY - layout.yMin) / height) * 100}
                />
              </>
            ) : null}

            <div className="relative h-full w-full">
              <Image
                src={src}
                alt=""
                fill
                className="object-contain object-center"
                sizes="100vw"
                priority={band.id === "n5" || band.id === "n4"}
                unoptimized
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
