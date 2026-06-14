"use client";

import Image from "next/image";
import { useTheme } from "next-themes";

import { stickerImageClass } from "@/lib/assets/image-presentation";
import { getNavFoxPath } from "@/lib/assets/registry";
import type { ImmersiveNavTab } from "@/lib/navigation/immersive-nav.constants";
import { cn } from "@/lib/utils";

type NavFoxImageProps = {
  tab: ImmersiveNavTab;
  variant?: "bar-anchor" | "trail";
  className?: string;
  priority?: boolean;
};

export function NavFoxImage({
  tab,
  variant = "bar-anchor",
  className,
  priority,
}: NavFoxImageProps) {
  const { resolvedTheme } = useTheme();
  const src = getNavFoxPath(tab, resolvedTheme);

  if (!src) return null;

  const sizeClass =
    variant === "bar-anchor"
      ? "h-[4.75rem] w-[4.75rem] shrink-0 object-contain object-bottom drop-shadow-[0_6px_14px_rgba(0,0,0,0.45)]"
      : "h-14 w-14 shrink-0 object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.45)]";

  return (
    <Image
      src={src}
      alt=""
      width={variant === "bar-anchor" ? 76 : 56}
      height={variant === "bar-anchor" ? 76 : 56}
      priority={priority}
      aria-hidden
      className={cn(stickerImageClass(sizeClass), className)}
    />
  );
}
