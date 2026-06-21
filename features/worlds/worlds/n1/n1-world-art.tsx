"use client";

import Image from "next/image";
import { useTheme } from "next-themes";

import { resolveHeroObjectPosition } from "@/features/journey/constants/world-tree-jlpt-segment.constants";
import { N1_WORLD } from "@/features/worlds/worlds/n1/n1-world.constants";
import { artLibraryPath } from "@/lib/assets/art-library-paths";
import { cn } from "@/lib/utils";

type N1WorldArtProps = {
  className?: string;
};

/** N1 world background art — loads only N1 assets. */
export function N1WorldArt({ className }: N1WorldArtProps) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "light" ? "light" : "dark";
  const src = artLibraryPath(
    `world-tree/jlpt-bands/n1/${N1_WORLD.art.heroFileBase}_${theme}_v1.png`,
  );

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      data-world-art="n1"
      aria-hidden
    >
      <Image
        src={src}
        alt=""
        fill
        className="object-contain"
        style={{
          objectPosition: resolveHeroObjectPosition(N1_WORLD.art.heroAnchor),
        }}
        sizes="(max-width: 430px) 100vw, 430px"
        priority
      />
    </div>
  );
}

export default N1WorldArt;
