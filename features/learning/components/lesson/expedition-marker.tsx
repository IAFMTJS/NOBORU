import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type ExpeditionMarkerProps = {
  label: string;
  value: ReactNode;
  className?: string;
};

/** Trail stone marker for lesson briefing rewards and challenge hints. */
export function ExpeditionMarker({ label, value, className }: ExpeditionMarkerProps) {
  return (
    <div
      className={cn(
        "flex min-w-[5.5rem] flex-col items-center gap-1 rounded-xl border border-white/12 bg-black/40 px-3 py-2 text-center backdrop-blur-sm",
        className,
      )}
    >
      <span className="text-[10px] uppercase tracking-wide text-white/55">{label}</span>
      <span className="text-sm font-semibold text-trail-glow">{value}</span>
    </div>
  );
}
