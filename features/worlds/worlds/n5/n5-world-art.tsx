"use client";

import Image from "next/image";
import { useMemo } from "react";
import { useTheme } from "next-themes";

import { buildN5WorldArtLayout } from "@/features/worlds/worlds/n5/n5-world-art-layout.utils";
import { cn } from "@/lib/utils";

type N5WorldArtProps = {
  className?: string;
};

/** N5 world art — puzzle fill, gap mist, and hero island on full canvas. */
export function N5WorldArt({ className }: N5WorldArtProps) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "light" ? "light" : "dark";
  const art = useMemo(() => buildN5WorldArtLayout(theme), [theme]);

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      data-world-art="n5"
      aria-hidden
    >
      {art.gaps.map((gap) => (
        <div
          key={gap.id}
          className="absolute inset-x-0"
          style={{
            top: `${gap.topPercent}%`,
            height: `${gap.heightPercent}%`,
            background: `linear-gradient(to top, ${gap.tint}66, ${gap.tint}28 45%, transparent)`,
            zIndex: 0,
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
    </div>
  );
}

export default N5WorldArt;
