"use client";

import { useTheme } from "next-themes";

import { getAuthAtmospherePath } from "@/lib/assets/registry";

export function AuthAtmosphere() {
  const { resolvedTheme } = useTheme();
  const src = getAuthAtmospherePath(resolvedTheme);

  if (!src) return null;

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element -- Art Library static assets */}
      <img src={src} alt="" className="size-full object-cover object-center opacity-50" />
      <div className="absolute inset-0 bg-background/70" />
    </div>
  );
}
