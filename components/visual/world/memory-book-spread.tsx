"use client";

import type { ReactNode } from "react";

import { CAMP_WORLD_ASSETS } from "@/lib/assets/art-mappings";
import { cn } from "@/lib/utils";

import { WorldArtImage } from "./world-art-image";

type MemoryBookSpreadProps = {
  children?: ReactNode;
  className?: string;
};

/** Doc 11 — memory book open spread frame. */
export function MemoryBookSpread({ children, className }: MemoryBookSpreadProps) {
  return (
    <div className={cn("relative min-h-[16rem] overflow-hidden rounded-card", className)}>
      <WorldArtImage
        asset={CAMP_WORLD_ASSETS.memory_book}
        alt=""
        width={400}
        height={280}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="relative z-10 p-6">{children}</div>
    </div>
  );
}
