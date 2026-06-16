import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type ImmersiveWorldShellProps = HTMLAttributes<HTMLDivElement> & {
  background?: ReactNode;
  vignette?: "trail" | "camp" | "hub" | "none";
  fillContent?: boolean;
};

/** Minimal content shell — visuals stripped for rebuild. */
export function ImmersiveWorldShell({
  fillContent = true,
  className,
  children,
  ...props
}: ImmersiveWorldShellProps) {
  return (
    <div
      className={cn(
        "relative bg-background",
        fillContent ? "min-h-content h-content" : "min-h-dvh",
        className,
      )}
      {...props}
    >
      <div className="relative flex h-full min-h-0 flex-col">{children}</div>
    </div>
  );
}
