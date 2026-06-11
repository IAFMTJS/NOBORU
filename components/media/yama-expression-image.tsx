"use client";

import Image from "next/image";
import { useTheme } from "next-themes";

import { stickerImageClass } from "@/lib/assets/image-presentation";
import { getYamaExpressionPath } from "@/lib/assets/registry";
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
  alt = "Yama",
  className,
  fit = "sticker",
  fill,
  width,
  height,
  priority,
  sizes = "(max-width: 512px) 80px, 160px",
}: YamaExpressionImageProps) {
  const { resolvedTheme } = useTheme();
  const src = getYamaExpressionPath(expression, resolvedTheme);

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      priority={priority}
      sizes={fill ? sizes : undefined}
      className={
        fit === "full"
          ? cn("object-contain object-bottom scale-100", className)
          : stickerImageClass(className)
      }
    />
  );
}
