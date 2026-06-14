"use client";

import Image from "next/image";
import { useTheme } from "next-themes";

import { stickerImageClass } from "@/lib/assets/image-presentation";
import { getNavFoxPath } from "@/lib/assets/registry";
import type { ImmersiveNavTab } from "@/lib/navigation/immersive-nav.constants";
import { cn } from "@/lib/utils";

type NavFoxImageProps = {
  tab: ImmersiveNavTab;
  active?: boolean;
  className?: string;
  priority?: boolean;
};

export function NavFoxImage({
  tab,
  active = true,
  className,
  priority,
}: NavFoxImageProps) {
  const { resolvedTheme } = useTheme();
  const src = getNavFoxPath(tab, resolvedTheme);

  if (!src) return null;

  return (
    <Image
      src={src}
      alt=""
      width={40}
      height={40}
      priority={priority}
      aria-hidden
      className={cn(
        stickerImageClass("h-9 w-9 shrink-0 object-contain transition-all duration-300"),
        active ? "scale-105 opacity-100 drop-shadow-[0_0_8px_rgba(214,64,69,0.35)]" : "opacity-80",
        className,
      )}
    />
  );
}
