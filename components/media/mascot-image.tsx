"use client";

import Image from "next/image";
import { useTheme } from "next-themes";

import { getMascotPath } from "@/lib/assets/registry";
import { cn } from "@/lib/utils";

type MascotImageProps = {
  alt?: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
};

export function MascotImage({
  alt = "Yama",
  className,
  fill,
  width,
  height,
  priority,
  sizes = "(max-width: 512px) 80px, 160px",
}: MascotImageProps) {
  const { resolvedTheme } = useTheme();
  const src = getMascotPath(resolvedTheme);

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      priority={priority}
      sizes={fill ? sizes : undefined}
      className={cn(className)}
    />
  );
}
