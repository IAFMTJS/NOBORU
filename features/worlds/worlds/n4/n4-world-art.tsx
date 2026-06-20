"use client";

import Image from "next/image";
import { useTheme } from "next-themes";

import { resolveHeroObjectPosition } from "@/features/journey/constants/world-tree-jlpt-segment.constants";
import { N4_WORLD } from "@/features/worlds/worlds/n4/n4-world.constants";
import { artLibraryPath } from "@/lib/assets/art-library-paths";
import { cn } from "@/lib/utils";

type N4WorldArtProps = {
  className?: string;
};

/** N4 world background art — loads only N4 assets. */
export function N4WorldArt({ className }: N4WorldArtProps) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "light" ? "light" : "dark";
  const src = artLibraryPath(
    `world-tree/jlpt-bands/n4/${N4_WORLD.art.heroFileBase}_${theme}_v1.png`,
  );

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      data-world-art="n4"
      aria-hidden
    >
      <Image
        src={src}
        alt=""
        fill
        className="object-contain"
        style={{
          objectPosition: resolveHeroObjectPosition(N4_WORLD.art.heroAnchor),
        }}
        sizes="100vw"
        priority
        unoptimized
      />
    </div>
  );
}

export default N4WorldArt;
