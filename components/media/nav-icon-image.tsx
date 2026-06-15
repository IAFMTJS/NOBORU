"use client";

import Image from "next/image";

import { getNavIconPath } from "@/lib/assets/registry";
import {
  IMMERSIVE_NAV_TAB_CONFIG,
  type ImmersiveNavTab,
} from "@/lib/navigation/immersive-nav.constants";
import { cn } from "@/lib/utils";

type NavIconImageProps = {
  tab: ImmersiveNavTab;
  active?: boolean;
  className?: string;
};

export function NavIconImage({ tab, active = false, className }: NavIconImageProps) {
  const src = getNavIconPath(tab, active);
  const config = IMMERSIVE_NAV_TAB_CONFIG[tab];
  if (!src) return null;

  return (
    <Image
      src={src}
      alt=""
      width={24}
      height={24}
      aria-hidden
      className={cn(
        "h-5 w-5 shrink-0 object-contain transition-all duration-300",
        active ? cn("scale-110 opacity-100", config.activeIconDropShadow) : "opacity-50",
        className,
      )}
    />
  );
}
