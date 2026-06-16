"use client";

import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";

import { ViewportBackground } from "@/components/visual/shells/viewport-background";
import { resolvePrimaryTabBackground } from "@/lib/navigation/primary-tab-backgrounds";

/** Per-tab illustrated backdrop behind primary navigation destinations. */
export function AppViewportBackground() {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "light" ? "light" : "dark";
  const background = resolvePrimaryTabBackground(pathname, theme);

  if (!background) return null;

  return (
    <ViewportBackground
      src={background.src}
      scrimClassName={background.scrimClassName}
    />
  );
}
