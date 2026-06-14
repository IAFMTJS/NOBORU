"use client";

import Image from "next/image";
import { useTheme } from "next-themes";

import { getNavFoxPath } from "@/lib/assets/registry";
import { resolveCharacterStickerPresentation } from "@/lib/assets/image-presentation";
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
  const presentation = resolveCharacterStickerPresentation();

  const sizeClass =
    variant === "bar-anchor"
      ? "h-[3.25rem] w-[3.25rem] shrink-0"
      : "h-14 w-14 shrink-0";

  if (!src) {
    return (
      <div
        aria-hidden
        className={cn(
          sizeClass,
          "rounded-full bg-primary/20 ring-2 ring-primary/30",
          className,
        )}
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
      className={cn(sizeClass, "object-contain drop-shadow-md", className)}
      style={{
        objectFit: presentation.objectFit,
        objectPosition: presentation.objectPosition,
      }}
    />
  );
}
