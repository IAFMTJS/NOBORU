import Image from "next/image";

import { REGION_HERO_IMAGE_CLASS } from "@/lib/assets/image-presentation";
import { getRegionArtPath } from "@/lib/assets/registry";
import { cn } from "@/lib/utils";

type RegionHeroImageProps = {
  regionSlug: string;
  alt: string;
  className?: string;
};

export function RegionHeroImage({
  regionSlug,
  alt,
  className,
}: RegionHeroImageProps) {
  const src = getRegionArtPath(regionSlug);
  if (!src) return null;

  return (
    <div
      className={cn(
        "relative h-32 w-full overflow-hidden rounded-xl sm:h-36",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className={REGION_HERO_IMAGE_CLASS}
        sizes="(max-width: 512px) 100vw, 512px"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-card/95 via-card/25 to-transparent" />
    </div>
  );
}
