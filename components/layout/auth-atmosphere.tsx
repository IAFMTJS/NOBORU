"use client";

import Image from "next/image";
import { useTheme } from "next-themes";

import { getAuthAtmospherePath } from "@/lib/assets/registry";

export function AuthAtmosphere() {
  const { resolvedTheme } = useTheme();
  const src = getAuthAtmospherePath(resolvedTheme);

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 opacity-40 dark:opacity-40">
      <Image
        src={src}
        alt=""
        fill
        className="object-cover"
        priority
        aria-hidden
      />
    </div>
  );
}
