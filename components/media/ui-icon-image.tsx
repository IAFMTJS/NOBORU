"use client";

import Image from "next/image";

import { getUiIconPath } from "@/lib/assets/registry";
import { cn } from "@/lib/utils";

export type UiIconName =
  | "chevron_down"
  | "map"
  | "settings"
  | "flame"
  | "gem"
  | "trophy"
  | "gear"
  | "checkpoint"
  | "check"
  | "lock"
  | "arrow_left"
  | "clock"
  | "zap"
  | "coins"
  | "mountain";

type UiIconImageProps = {
  name: UiIconName;
  className?: string;
  size?: number;
};

export function UiIconImage({ name, className, size = 20 }: UiIconImageProps) {
  const src = getUiIconPath(name);
  if (!src) return null;

  return (
    <Image
      src={src}
      alt=""
      width={size}
      height={size}
      aria-hidden
      className={cn("shrink-0 object-contain", className)}
    />
  );
}
