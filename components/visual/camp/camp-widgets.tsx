import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { VISUAL_MOCKUP } from "../tokens";

type CampFloatingWidgetProps = {
  title: string;
  children: ReactNode;
  className?: string;
};

/** Parchment-style floating widget (Today's Plan, streak) per camp mockup. */
export function CampFloatingWidget({ title, children, className }: CampFloatingWidgetProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-3 shadow-elevation-2",
        VISUAL_MOCKUP.glass.panelClass,
        className,
      )}
    >
      <p className="mb-2 font-story text-caption font-semibold uppercase tracking-wide text-trail-glow">
        {title}
      </p>
      {children}
    </div>
  );
}

type CampDialogueChipProps = {
  children: ReactNode;
  className?: string;
};

export function CampDialogueChip({ children, className }: CampDialogueChipProps) {
  return (
    <div
      className={cn(
        "max-w-[9rem] rounded-xl border px-2.5 py-1.5 backdrop-blur-sm sm:max-w-[10rem]",
        VISUAL_MOCKUP.glass.borderClass,
        "bg-black/55",
        className,
      )}
    >
      <p className="text-caption leading-snug text-white/85">{children}</p>
    </div>
  );
}
