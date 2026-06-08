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
};

export function MascotImage({
  alt = "Yama",
  className,
  fill,
  width,
  height,
  priority,
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
      className={cn(className)}
    />
  );
}
