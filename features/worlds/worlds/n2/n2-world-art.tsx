"use client";

import Image from "next/image";
import { useTheme } from "next-themes";

import { resolveHeroObjectPosition } from "@/features/journey/constants/world-tree-jlpt-segment.constants";
import { N2_WORLD } from "@/features/worlds/worlds/n2/n2-world.constants";
import { artLibraryPath } from "@/lib/assets/art-library-paths";
import { cn } from "@/lib/utils";

type N2WorldArtProps = {
  className?: string;
};

/** N2 world background art — loads only N2 assets. */
export function N2WorldArt({ className }: N2WorldArtProps) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "light" ? "light" : "dark";
  const src = artLibraryPath(
    `world-tree/jlpt-bands/n2/${N2_WORLD.art.heroFileBase}_${theme}_v1.png`,
  );

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      data-world-art="n2"
      aria-hidden
    >
      <Image
        src={src}
        alt=""
        fill
        className="object-contain"
        style={{
          objectPosition: resolveHeroObjectPosition(N2_WORLD.art.heroAnchor),
        }}
        sizes="100vw"
        priority
        unoptimized
      />
    </div>
  );
}

export default N2WorldArt;
