"use client";

import Image from "next/image";
import { useTheme } from "next-themes";

import { getWordmarkPath } from "@/lib/assets/registry";
import { cn } from "@/lib/utils";

type NoboruWordmarkProps = {
  className?: string;
  priority?: boolean;
};

export function NoboruWordmark({ className, priority }: NoboruWordmarkProps) {
  const { resolvedTheme } = useTheme();
  const src = getWordmarkPath(resolvedTheme);

  return (
    <div className={cn("relative h-12 w-40", className)}>
      <Image
        src={src}
        alt="NOBORU"
        fill
        className="object-contain"
        priority={priority}
      />
    </div>
  );
}
