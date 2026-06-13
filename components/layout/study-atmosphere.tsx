import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type StudyAtmosphereProps = {
  children: ReactNode;
  className?: string;
};

export function StudyAtmosphere({ children, className }: StudyAtmosphereProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/60 bg-gradient-to-b from-primary/[0.06] via-card to-card p-3 shadow-elevation-1 dark:from-primary/[0.08]",
        className,
      )}
    >
      {children}
    </div>
  );
}
