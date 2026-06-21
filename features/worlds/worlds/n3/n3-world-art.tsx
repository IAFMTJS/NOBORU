"use client";

import Image from "next/image";
import { useTheme } from "next-themes";

import { resolveHeroObjectPosition } from "@/features/journey/constants/world-tree-jlpt-segment.constants";
import { N3_WORLD } from "@/features/worlds/worlds/n3/n3-world.constants";
import { artLibraryPath } from "@/lib/assets/art-library-paths";
import { cn } from "@/lib/utils";

type N3WorldArtProps = {
  className?: string;
};

/** N3 world background art — loads only N3 assets. */
export function N3WorldArt({ className }: N3WorldArtProps) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "light" ? "light" : "dark";
  const src = artLibraryPath(
    `world-tree/jlpt-bands/n3/${N3_WORLD.art.heroFileBase}_${theme}_v1.png`,
  );

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      data-world-art="n3"
      aria-hidden
    >
      <Image
        src={src}
        alt=""
        fill
        className="object-contain"
        style={{
          objectPosition: resolveHeroObjectPosition(N3_WORLD.art.heroAnchor),
        }}
        sizes="(max-width: 430px) 100vw, 430px"
        priority
      />
    </div>
  );
}

export default N3WorldArt;
