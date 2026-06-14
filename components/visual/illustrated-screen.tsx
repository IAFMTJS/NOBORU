import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type IllustratedScreenProps = HTMLAttributes<HTMLDivElement> & {
  background?: ReactNode;
  scrim?: "minimal" | "full" | "none";
};

export function IllustratedScreen({
  background,
  scrim = "minimal",
  className,
  children,
  ...props
}: IllustratedScreenProps) {
  return (
    <div className={cn("relative min-h-dvh overflow-hidden", className)} {...props}>
      {background ? (
        <div className="pointer-events-none absolute inset-0" aria-hidden>
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
