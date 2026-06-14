"use client";

import Image from "next/image";
import { useTheme } from "next-themes";

import { YamaExpressionImage } from "@/components/media/yama-expression-image";
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

  const sizeClass =
    variant === "bar-anchor"
      ? "h-[3.25rem] w-[3.25rem] shrink-0 object-contain object-bottom drop-shadow-[0_4px_10px_rgba(0,0,0,0.45)]"
      : "h-14 w-14 shrink-0 object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.45)]";

  if (!src) {
    return (
      <YamaExpressionImage
        expression="main"
        width={variant === "bar-anchor" ? 52 : 56}
        height={variant === "bar-anchor" ? 52 : 56}
        className={cn(stickerImageClass(sizeClass), className)}
        priority={priority}
      />
    );
  }

  return (
    <Image
      src={src}
      alt=""
      width={variant === "bar-anchor" ? 52 : 56}
      height={variant === "bar-anchor" ? 52 : 56}
      priority={priority}
      aria-hidden
      className={cn(stickerImageClass(sizeClass), className)}
    />
  );
}
