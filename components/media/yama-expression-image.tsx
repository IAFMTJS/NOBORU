"use client";

import Image from "next/image";
import { useTheme } from "next-themes";

import { CharacterStickerFrame } from "@/components/media/character-sticker-frame";
import { getYamaExpressionPath } from "@/lib/assets/registry";
import { resolveCharacterStickerPresentation } from "@/lib/assets/image-presentation";
import { cn } from "@/lib/utils";
import type { YamaExpression } from "@/features/yama/types/yama.types";
import type { NoboruPoseId } from "@/lib/assets/art-mappings";

type YamaExpressionImageProps = {
  expression?: YamaExpression;
  poseId?: NoboruPoseId;
  alt?: string;
  className?: string;
  fit?: "sticker" | "full";
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
};

export function YamaExpressionImage({
  expression = "main",
  poseId,
  alt = "Noboru",
  className,
  fit = "sticker",
  fill = false,
  width = 64,
  height = 64,
  priority,
  sizes,
}: YamaExpressionImageProps) {
  const { resolvedTheme } = useTheme();
  const src = getYamaExpressionPath(expression, resolvedTheme, poseId);
  const presentation = resolveCharacterStickerPresentation();

  if (!src) {
    return (
      <div
        role="img"
        aria-label={alt}
        style={fill ? undefined : { width, height }}
        className={cn(
          "shrink-0 rounded-full bg-primary/15 ring-2 ring-primary/25",
          fill && "absolute inset-0 h-full w-full",
          className,
        )}
      />
    );
  }

  if (fill) {
    return (
      <CharacterStickerFrame className={cn("h-full w-full", className)}>
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes ?? "128px"}
          className={cn(
            fit === "sticker"
              ? "object-cover object-bottom mix-blend-screen"
              : "object-cover mix-blend-screen",
          )}
          style={{
            objectFit: presentation.objectFit,
            objectPosition: presentation.objectPosition,
            transform:
              fit === "sticker" ? `scale(${presentation.scale})` : undefined,
            transformOrigin: "center bottom",
          }}
        />
      </CharacterStickerFrame>
    );
  }

  return (
    <CharacterStickerFrame
      className={cn("shrink-0", className)}
      style={fit === "sticker" ? { width, height } : undefined}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        sizes={sizes ?? `${width}px`}
        className="h-full w-full mix-blend-screen"
        style={{
          objectFit: fit === "sticker" ? presentation.objectFit : "cover",
          objectPosition: presentation.objectPosition,
          transform:
            fit === "sticker" ? `scale(${presentation.scale})` : undefined,
          transformOrigin: "center bottom",
        }}
      />
    </CharacterStickerFrame>
  );
}
