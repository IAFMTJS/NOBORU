import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type ImmersiveWorldShellProps = HTMLAttributes<HTMLDivElement> & {
  background?: ReactNode;
  /** Edge vignette over illustrated world */
  vignette?: "trail" | "camp" | "hub" | "none";
  /** Fill content area above nav (not full dvh — parent owns nav clearance). */
  fillContent?: boolean;
};

const VIGNETTE_CLASS: Record<NonNullable<ImmersiveWorldShellProps["vignette"]>, string> = {
  trail:
    "bg-gradient-to-b from-background/80 via-transparent to-background/70",
  camp: "bg-gradient-to-b from-black/62 via-black/20 to-black/76",
  hub: "bg-gradient-to-b from-black/75 via-black/35 to-black/85",
  none: "",
};

/**
 * Full-bleed illustrated world shell for Journey, Camp, and Bag.
 * Uses unified content height — no per-screen nav math.
 */
export function ImmersiveWorldShell({
  background,
  vignette = "trail",
  fillContent = true,
  className,
  children,
  ...props
}: ImmersiveWorldShellProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden",
        fillContent ? "min-h-content h-content" : "min-h-dvh",
        className,
      )}
      {...props}
    >
      {background ? (
        <div
          className="pointer-events-none absolute inset-y-0 left-1/2 w-screen max-w-none -translate-x-1/2"
          aria-hidden
        >
          {background}
        </div>
      ) : null}
      {vignette !== "none" ? (
        <div
          aria-hidden
          className={cn("pointer-events-none absolute inset-0", VIGNETTE_CLASS[vignette])}
        />
      ) : null}
      <div className="relative z-10 flex h-full min-h-0 flex-col">{children}</div>
    </div>
  );
}
