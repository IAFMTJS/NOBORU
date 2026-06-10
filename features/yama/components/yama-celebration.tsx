import type { ReactNode } from "react";

import { YamaPresence } from "@/features/yama/components/yama-presence";
import type { YamaPresenceViewModel } from "@/features/yama/types/yama.types";
import { cn } from "@/lib/utils";

type YamaCelebrationProps = {
  presence: YamaPresenceViewModel;
  title?: string;
  className?: string;
  children?: ReactNode;
};

export function YamaCelebration({
  presence,
  title,
  className,
  children,
}: YamaCelebrationProps) {
  return (
    <div
      className={cn(
        "space-y-3 rounded-xl border border-primary/25 bg-gradient-to-br from-primary/10 via-card to-card p-4 shadow-elevation-1",
        className,
      )}
    >
      {title ? <p className="text-body-sm font-medium">{title}</p> : null}
      <YamaPresence presence={presence} size="lg" layout="horizontal" priority />
      {children}
    </div>
  );
}
