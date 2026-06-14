import Image from "next/image";

import { getRegionArtPath } from "@/lib/assets/registry";
import { cn } from "@/lib/utils";

type RegionHeroImageProps = {
  regionSlug: string;
  alt: string;
  className?: string;
  hideOverlay?: boolean;
  size?: "hero" | "thumbnail";
};

const SIZE_CLASSES = {
  hero: "relative h-32 w-full overflow-hidden rounded-xl sm:h-36",
  thumbnail: "relative h-12 w-12 shrink-0 overflow-hidden rounded-lg",
} as const;

export function RegionHeroImage({
  regionSlug,
  alt,
  className,
  hideOverlay = false,
  size = "hero",
}: RegionHeroImageProps) {
  const src = getRegionArtPath(regionSlug);
  if (!src) return null;

  return (
    <div className={cn(SIZE_CLASSES[size], className)}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover object-center"
        sizes={size === "thumbnail" ? "48px" : "(max-width: 512px) 100vw, 512px"}
      />
      {hideOverlay || size === "thumbnail" ? null : (
        <div className="absolute inset-0 bg-gradient-to-t from-card/95 via-card/25 to-transparent" />
      )}
    </div>
  );
}
