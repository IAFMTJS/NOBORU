"use client";

import Image from "next/image";
import { useMemo } from "react";
import { useTheme } from "next-themes";

import { buildWorldTreeUndergroundLayout } from "@/features/journey/utils/world-tree-underground-layout.utils";
import { cn } from "@/lib/utils";

type WorldTreeUndergroundLayerProps = {
  className?: string;
};

/**
 * Deep Root Network — sub-base cavern below the N5 hero (World Heart at the bottom).
 */
export function WorldTreeUndergroundLayer({ className }: WorldTreeUndergroundLayerProps) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "light" ? "light" : "dark";
  const layout = useMemo(() => buildWorldTreeUndergroundLayout(theme), [theme]);

  return (
    <div
      className={cn("pointer-events-none relative w-full overflow-hidden", className)}
      data-world-tree-underground
      aria-hidden
    >
      <div
        className="absolute inset-0"
        style={{ background: layout.atmosphere }}
        data-underground-atmosphere
      />

      <div
        className="absolute inset-x-0 top-0 z-[3] h-[38%] -translate-y-[8%]"
        data-underground-roots-banner
      >
        <Image
          src={layout.rootsBannerSrc}
          alt=""
          fill
          className="object-cover object-top"
          sizes="100vw"
          priority
          unoptimized
        />
      </div>

      {layout.pieces.map((piece) => (
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
          data-underground-piece={piece.role}
        >
          <Image
            src={piece.src}
            alt=""
            fill
            className="object-contain object-bottom"
            sizes="60vw"
            unoptimized
          />
        </div>
      ))}

      <div
        className="absolute inset-x-0 bottom-[6%] z-[20] flex flex-col items-center"
        data-world-tree-heart
      >
        <span className="h-5 w-5 rounded-full border-2 border-[#D6A85F]/90 bg-[#D6A85F]/55 shadow-[0_0_20px_rgba(214,168,95,0.75)]" />
        <span className="mt-1.5 font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-[#D6A85F]/80">
          World Heart
        </span>
        <span className="mt-0.5 font-sans text-[8px] font-medium uppercase tracking-[0.18em] text-white/45">
          Deep Root Network
        </span>
      </div>
    </div>
  );
}
