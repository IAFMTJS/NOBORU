"use client";

import Image from "next/image";
import { useMemo } from "react";
import { useTheme } from "next-themes";

import { WorldTreeDepthLayer } from "@/features/journey/components/world-tree-depth-layer";
import {
  WORLD_TREE_JLPT_BANDS,
  buildWorldTreeJlptBandLayout,
  type WorldTreeJlptBandId,
} from "@/features/journey/constants/world-tree-jlpt-band.constants";
import { buildJlptZoneArtLayout } from "@/features/journey/utils/world-tree-jlpt-zone-layout.utils";
import { cn } from "@/lib/utils";

type WorldTreeJlptArtStackProps = {
  className?: string;
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

function resolveHeroObjectFitClass(objectPosition: string): string {
  if (objectPosition.includes("bottom")) return "object-cover object-bottom";
  if (objectPosition.includes("top")) return "object-cover object-top";
  return "object-cover object-center";
}

/**
 * Full JLPT zone art stack — gap mist, puzzle fill, transition seams, hero bands.
 */
export function WorldTreeJlptArtStack({
  className,
  showJlptChrome = true,
}: WorldTreeJlptArtStackProps) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "light" ? "light" : "dark";
  const jlptBands = buildWorldTreeJlptBandLayout();

  const art = useMemo(() => buildJlptZoneArtLayout(theme), [theme]);

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      data-world-tree-jlpt-band-art
      aria-hidden
    >
      <WorldTreeDepthLayer />

      {art.gaps.map((gap) => (
        <div
          key={gap.id}
          className="absolute inset-x-0"
          style={{
            top: `${gap.topPercent}%`,
            height: `${gap.heightPercent}%`,
            background: `linear-gradient(to top, ${gap.tint}40, ${gap.tint}18 40%, transparent)`,
            zIndex: 0,
          }}
          data-jlpt-gap={gap.bandId}
        />
      ))}

      {art.fill.map((piece) => (
        <div
          key={piece.id}
          className="absolute -translate-x-1/2"
          style={{
            top: `${piece.topPercent}%`,
            left: `${piece.leftPercent}%`,
            width: `${piece.widthPercent}%`,
            height: `${piece.heightPercent}%`,
            zIndex: piece.zIndex,
          }}
          data-segment-piece={piece.id}
        >
          <Image
            src={piece.src}
            alt=""
            fill
            className="object-contain object-bottom"
            sizes="50vw"
            unoptimized
          />
        </div>
      ))}

      {art.heroes.map((hero) => (
        <div
          key={hero.id}
          className="absolute -translate-x-1/2"
          style={{
            top: `${hero.topPercent}%`,
            left: `${hero.leftPercent}%`,
            width: `${hero.widthPercent}%`,
            height: `${hero.heightPercent}%`,
            zIndex: hero.zIndex,
            transform: `translateX(-50%) scale(${hero.scale})`,
            transformOrigin: hero.objectPosition.includes("bottom")
              ? "center bottom"
              : hero.objectPosition.includes("top")
                ? "center top"
                : "center center",
          }}
          data-jlpt-band={hero.bandId}
          data-jlpt-hero
        >
          <Image
            src={hero.src}
            alt=""
            fill
            className={resolveHeroObjectFitClass(hero.objectPosition)}
            sizes="100vw"
            priority={hero.bandId === "n5" || hero.bandId === "n4"}
            unoptimized
          />
        </div>
      ))}

      {art.overlays.map((overlay) => (
        <div
          key={overlay.id}
          className="absolute inset-x-0"
          style={{
            top: `${overlay.topPercent}%`,
            height: `${overlay.heightPercent}%`,
            background: overlay.background,
            zIndex: overlay.zIndex,
          }}
          data-jlpt-overlay={overlay.kind}
          data-jlpt-junction={overlay.kind === "junction" ? overlay.id : undefined}
          data-jlpt-overlay-band={overlay.bandId}
        />
      ))}

      {showJlptChrome
        ? WORLD_TREE_JLPT_BANDS.map((band) => {
            const layout = jlptBands.find((entry) => entry.id === band.id)!;
            const centerY = (layout.yMin + layout.yMax) / 2;

            return (
              <div key={`${band.id}-chrome`}>
                <div
                  className="absolute inset-x-0 z-[3] h-px"
                  style={{
                    top: `${layout.yMin}%`,
                    background: `linear-gradient(90deg, transparent, ${band.accentColor}88, transparent)`,
                    boxShadow: `0 0 6px ${band.accentGlow}`,
                  }}
                  data-jlpt-band-divider
                />
                <JlptBadge
                  bandId={band.id}
                  label={band.label}
                  accentColor={band.accentColor}
                  yPercent={centerY}
                />
              </div>
            );
          })
        : null}
    </div>
  );
}
