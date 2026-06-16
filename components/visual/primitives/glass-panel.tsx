import type { HTMLAttributes } from "react";

import { glassSurface } from "@/components/visual/primitives/glass-surface";
import { cn } from "@/lib/utils";

type GlassPanelProps = HTMLAttributes<HTMLDivElement> & {
  variant?: "panel" | "header" | "nav";
};

const VARIANT_CLASS: Record<NonNullable<GlassPanelProps["variant"]>, string> = {
  panel: glassSurface.card,
  header: glassSurface.hud,
  nav: glassSurface.navShell,
};

/** Glass surface panel — parchment / lacquer (prototype-aligned). */
export function GlassPanel({
  variant = "panel",
  className,
  children,
  ...props
}: GlassPanelProps) {
  return (
    <div className={cn(VARIANT_CLASS[variant], "p-4", className)} {...props}>
      {children}
    </div>
  );
}
