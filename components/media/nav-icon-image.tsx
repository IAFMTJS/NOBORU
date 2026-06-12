"use client";

import Image from "next/image";

import { getNavIconPath } from "@/lib/assets/registry";
import { cn } from "@/lib/utils";

type NavIconImageProps = {
  tab: "home" | "learn" | "review" | "explore" | "profile";
  active?: boolean;
  className?: string;
};

export function NavIconImage({ tab, active = false, className }: NavIconImageProps) {
  const src = getNavIconPath(tab);
  if (!src) return null;

  return (
    <Image
      src={src}
      alt=""
      width={24}
      height={24}
      aria-hidden
      className={cn(
        "h-5 w-5 shrink-0 object-contain transition-all",
        active ? "opacity-100" : "opacity-45 grayscale",
        className,
      )}
    />
  );
}
