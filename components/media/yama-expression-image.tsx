"use client";

import Image from "next/image";
import { useTheme } from "next-themes";

import { getYamaExpressionPath } from "@/lib/assets/registry";
import { resolveCharacterStickerPresentation } from "@/lib/assets/image-presentation";
import { cn } from "@/lib/utils";
import type { YamaExpression } from "@/features/yama/types/yama.types";

type YamaExpressionImageProps = {
  expression?: YamaExpression;
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
  const src = getYamaExpressionPath(expression, resolvedTheme);
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
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes ?? "128px"}
        className={cn(
          fit === "sticker" ? "object-contain object-bottom" : "object-cover",
          className,
        )}
        style={{
          objectFit: presentation.objectFit,
          objectPosition: presentation.objectPosition,
        }}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      sizes={sizes ?? `${width}px`}
      className={cn("shrink-0", className)}
      style={{
        objectFit: presentation.objectFit,
        objectPosition: presentation.objectPosition,
      }}
    />
  );
}
