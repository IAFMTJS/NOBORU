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
    <span
      className={cn(
        "relative inline-flex shrink-0 overflow-hidden rounded-[0.35rem]",
        className,
      )}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <Image
        src={src}
        alt=""
        width={size}
        height={size}
        aria-hidden
        className="h-full w-full object-cover object-center mix-blend-screen [transform:scale(1.4)]"
      />
    </span>
  );
}
