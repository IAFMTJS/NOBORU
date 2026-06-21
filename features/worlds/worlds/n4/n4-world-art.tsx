"use client";

import Image from "next/image";
import { useMemo } from "react";
import { useTheme } from "next-themes";

import { buildN4WorldArtLayout } from "@/features/worlds/worlds/n4/n4-world-art-layout.utils";
import { N4_WORLD_ART_SPEC } from "@/features/worlds/worlds/n4/n4-world-art.constants";
import { cn } from "@/lib/utils";

type N4WorldArtProps = {
  className?: string;
};

/** N4 world art — puzzle fill, amber base atmosphere, hero foothills mass, crown/base seams. */
export function N4WorldArt({ className }: N4WorldArtProps) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "light" ? "light" : "dark";
  const art = useMemo(() => buildN4WorldArtLayout(theme), [theme]);
  const { worldHeartBase, islandFringeOverlay, islandSeamOverlay, crownSeamOverlay, seamMistTint } =
    N4_WORLD_ART_SPEC;

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      data-world-art="n4"
      aria-hidden
    >
      <div
        className="absolute inset-x-0 bottom-0 z-[1]"
        style={{ height: `${worldHeartBase.heightPercent}%` }}
        data-n4-world-heart
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
            sizes="(max-width: 430px) 50vw, 215px"
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
            sizes="(max-width: 430px) 100vw, 430px"
            priority
          />
        </div>
      ))}

      <div
        className="absolute inset-x-0 bottom-0 z-[30]"
        style={{
          height: `${islandSeamOverlay.heightPercent}%`,
          background: `linear-gradient(to bottom, transparent 0%, ${worldHeartBase.rootMist}55 35%, ${islandSeamOverlay.color}CC 70%, ${worldHeartBase.earthTone} 100%)`,
        }}
        aria-hidden
        data-n4-seam-overlay
      />

      <div
        className="absolute inset-x-0 bottom-0 z-[31]"
        style={{
          height: `${islandFringeOverlay.heightPercent}%`,
          background: `linear-gradient(to bottom, transparent 0%, ${seamMistTint}44 20%, ${islandFringeOverlay.color}AA 50%, ${worldHeartBase.earthTone} 100%)`,
        }}
        aria-hidden
        data-n4-fringe-overlay
      />

      <div
        className="absolute inset-x-0 top-0 z-[32]"
        style={{
          height: `${crownSeamOverlay.heightPercent}%`,
          background: `linear-gradient(to top, transparent 0%, ${crownSeamOverlay.mistColor}55 35%, ${crownSeamOverlay.fadeColor}CC 100%)`,
        }}
        aria-hidden
        data-n4-crown-overlay
      />
    </div>
  );
}

export default N4WorldArt;
