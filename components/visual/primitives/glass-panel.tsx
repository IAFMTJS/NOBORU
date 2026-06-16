import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type GlassPanelProps = HTMLAttributes<HTMLDivElement> & {
  variant?: "panel" | "header" | "nav";
};

export function GlassPanel({
  variant = "panel",
  className,
  children,
  ...props
}: GlassPanelProps) {
  return (
    <div
      className={cn(
        variant === "header" && "glass-header",
        variant === "nav" && "glass-nav",
        variant === "panel" && "glass-panel",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
