"use client";



import Image from "next/image";

import { useTheme } from "next-themes";



import { CharacterStickerFrame } from "@/components/media/character-sticker-frame";
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
      ? "h-16 w-16 shrink-0"
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



  const px = variant === "bar-anchor" ? 64 : 56;

  return (
    <CharacterStickerFrame className={cn(sizeClass, className)}>
      <Image
        src={src}
        alt=""
        width={px}
        height={px}
        priority={priority}
        aria-hidden
        className="h-full w-full drop-shadow-md mix-blend-screen"
        style={{
          objectFit: presentation.objectFit,
          objectPosition: presentation.objectPosition,
          transform: `scale(${presentation.scale})`,
          transformOrigin: "center bottom",
        }}
      />
    </CharacterStickerFrame>
  );

}

