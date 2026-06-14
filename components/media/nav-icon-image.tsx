"use client";

import Image from "next/image";

import { getNavIconPath } from "@/lib/assets/registry";
import type { ImmersiveNavTab } from "@/lib/navigation/immersive-nav.constants";
import { cn } from "@/lib/utils";

type NavIconImageProps = {
  tab: ImmersiveNavTab;
  active?: boolean;
  className?: string;
};

export function NavIconImage({ tab, active = false, className }: NavIconImageProps) {
  const src = getNavIconPath(tab);
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
        active
          ? "scale-110 opacity-100 drop-shadow-[0_0_6px_rgba(214,64,69,0.45)]"
          : "opacity-40 grayscale",
        className,
      )}
    />
  );
}
