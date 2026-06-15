"use client";

import type { ReactNode } from "react";

import { CAMP_WORLD_ASSETS } from "@/lib/assets/art-mappings";
import { cn } from "@/lib/utils";

import { WorldArtImage } from "./world-art-image";

type MerchantStandProps = {
  children?: ReactNode;
  className?: string;
  merchantAlt?: string;
};

/** Doc 11 — merchant counter with stand backdrop; merchant always visible at the counter. */
export function MerchantStand({
  children,
  className,
  merchantAlt = "Noboru the trail merchant",
}: MerchantStandProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-card border border-amber-900/40",
        "bg-gradient-to-b from-amber-950/75 via-amber-950/85 to-stone-950/90",
        className,
      )}
    >
      <WorldArtImage
        asset={CAMP_WORLD_ASSETS.merchant_scene}
        alt=""
        width={320}
        height={180}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-50"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-amber-200/20 to-transparent"
      />
      <div className="relative z-10 flex items-end gap-3 p-3 sm:gap-4 sm:p-4">
        <WorldArtImage
          asset={CAMP_WORLD_ASSETS.merchant}
          alt={merchantAlt}
          width={140}
          height={180}
          className="h-36 w-28 shrink-0 object-contain object-bottom drop-shadow-[0_12px_24px_rgba(0,0,0,0.55)] sm:h-44 sm:w-32"
        />
        {children ? <div className="min-w-0 flex-1 pb-1">{children}</div> : null}
      </div>
    </div>
  );
}
