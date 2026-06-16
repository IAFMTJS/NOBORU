import Link from "next/link";

import type { ArtAssetRef } from "@/lib/assets/art-mappings";
import { cn } from "@/lib/utils";

import { WorldArtImage } from "../art/world-art-image";
import { VISUAL_MOCKUP } from "../tokens";

type CampWorldHotspotProps = {
  label: string;
  asset: ArtAssetRef;
  className?: string;
  glow?: boolean;
  href?: string;
  onClick?: () => void;
};

/** Art-anchored camp hotspot — transparent prop compositing (mockup). */
export function CampWorldHotspot({
  label,
  asset,
  className,
  glow = false,
  href,
  onClick,
}: CampWorldHotspotProps) {
  const content = (
    <>
      <div
        className={cn(
          "relative shrink-0 rounded-full bg-black/35 p-1 transition group-hover:drop-shadow-[0_8px_16px_rgba(0,0,0,0.45)]",
          glow && VISUAL_MOCKUP.glow.warmHalo,
        )}
      >
        <WorldArtImage
          asset={asset}
          alt=""
          width={28}
          height={28}
          presentation="prop"
          className="h-7 w-7"
        />
      </div>
      <span className="truncate text-caption font-semibold tracking-wide text-white/90">
        {label}
      </span>
    </>
  );

  const classNames = cn(
    "focus-ring group absolute inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 backdrop-blur-md transition hover:scale-[1.02] active:scale-[0.98]",
    VISUAL_MOCKUP.glass.borderClass,
    "bg-black/55 hover:bg-black/65",
    className,
  );

  if (href) {
    return (
      <Link href={href} aria-label={label} className={classNames}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} aria-label={label} className={classNames}>
      {content}
    </button>
  );
}
