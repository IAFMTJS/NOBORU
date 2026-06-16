import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type IllustratedScreenProps = HTMLAttributes<HTMLDivElement> & {
  background?: ReactNode;
  scrim?: "minimal" | "full" | "none";
  /** Stretch illustrated backgrounds to viewport width inside narrow shells. */
  fullBleedBackground?: boolean;
};

export function IllustratedScreen({
  background,
  scrim = "minimal",
  fullBleedBackground = Boolean(background),
  className,
  children,
  ...props
}: IllustratedScreenProps) {
  return (
    <div className={cn("relative min-h-dvh overflow-hidden", className)} {...props}>
      {background ? (
        <div
          className={cn(
            "pointer-events-none absolute inset-y-0",
            fullBleedBackground
              ? "left-1/2 w-screen max-w-none -translate-x-1/2"
              : "inset-x-0",
          )}
          aria-hidden
        >
          {background}
        </div>
      ) : null}
      {scrim !== "none" ? (
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0",
            scrim === "full"
              ? "bg-gradient-to-b from-background/80 via-background/40 to-background/90"
              : "bg-gradient-to-b from-background/25 via-background/5 to-background/45",
          )}
        />
      ) : null}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
