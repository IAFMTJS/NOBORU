"use client";

import Image from "next/image";
import { useMemo } from "react";
import { useTheme } from "next-themes";

import { buildN5WorldArtLayout } from "@/features/worlds/worlds/n5/n5-world-art-layout.utils";
import { N5_WORLD_ART_SPEC } from "@/features/worlds/worlds/n5/n5-world-art.constants";
import { cn } from "@/lib/utils";

type N5WorldArtProps = {
  className?: string;
};

/** N5 world art — puzzle fill, gap mist, World Heart base, and hero island. */
export function N5WorldArt({ className }: N5WorldArtProps) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "light" ? "light" : "dark";
  const art = useMemo(() => buildN5WorldArtLayout(theme), [theme]);
  const { worldHeartBase, islandFringeOverlay, islandSeamOverlay } = N5_WORLD_ART_SPEC;

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      data-world-art="n5"
      aria-hidden
    >
      {/* World Heart — golden root glow fills the void beneath the island. */}
      <div
        className="absolute inset-x-0 bottom-0 z-[1]"
        style={{ height: `${worldHeartBase.heightPercent}%` }}
        data-n5-world-heart
      >
        <div
          className="absolute inset-0 dark:hidden"
          style={{
            background: `radial-gradient(ellipse 90% 100% at 50% 100%, ${worldHeartBase.goldenGlow}55, ${worldHeartBase.rootMist}33 45%, ${worldHeartBase.earthTone}88 100%)`,
          }}
        />
        <div
          className="absolute inset-0 hidden dark:block"
          style={{
            background: `radial-gradient(ellipse 90% 100% at 50% 100%, ${worldHeartBase.goldenGlow}44, ${worldHeartBase.rootMist}55 40%, ${worldHeartBase.earthTone} 100%)`,
          }}
        />
      </div>

      {art.gaps.map((gap) => (
        <div
          key={gap.id}
          className="absolute inset-x-0"
          style={{
            top: `${gap.topPercent}%`,
            height: `${gap.heightPercent}%`,
            background: `linear-gradient(to top, ${gap.tint}99, ${gap.tint}44 55%, transparent)`,
            zIndex: 2,
          }}
          data-jlpt-gap={gap.id}
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
          data-jlpt-hero
        >
          <Image
            src={hero.src}
            alt=""
            fill
            className="object-contain"
            style={{ objectPosition: hero.objectPosition }}
            sizes="100vw"
            priority
            unoptimized
          />
        </div>
      ))}

      {/* Warm seam above roots — sits on top of hero PNG. */}
      <div
        className="absolute inset-x-0 bottom-0 z-[30]"
        style={{
          height: `${islandSeamOverlay.heightPercent}%`,
          background: `linear-gradient(to bottom, transparent 0%, ${worldHeartBase.rootMist}55 35%, ${islandSeamOverlay.color}CC 70%, ${worldHeartBase.earthTone} 100%)`,
        }}
        aria-hidden
        data-n5-seam-overlay
      />

      {/* Hides the purple asset fringe at the island underhang. */}
      <div
        className="absolute inset-x-0 bottom-0 z-[31]"
        style={{
          height: `${islandFringeOverlay.heightPercent}%`,
          background: `linear-gradient(to bottom, transparent 0%, ${islandFringeOverlay.color}66 25%, ${islandFringeOverlay.color}EE 55%, ${worldHeartBase.earthTone} 100%)`,
        }}
        aria-hidden
        data-n5-fringe-overlay
      />
    </div>
  );
}

export default N5WorldArt;
