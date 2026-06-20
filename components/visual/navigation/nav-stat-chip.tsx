"use client";

import type { ReactNode } from "react";

import { UiIconImage, type UiIconName } from "@/components/media/ui-icon-image";
import { cn } from "@/lib/utils";

import { VISUAL_MOCKUP } from "../tokens";

type NavStatChipProps = {
  icon: UiIconName;
  value: number;
  label: string;
  className?: string;
};

/** Shared HUD stat chip for Journey, Camp, and Bag headers. */
export function NavStatChip({ icon, value, label, className }: NavStatChipProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-1 text-caption font-semibold tabular-nums",
        VISUAL_MOCKUP.glass.borderClass,
        "bg-black/35 backdrop-blur-sm",
        className,
      )}
      aria-label={`${label}: ${value}`}
    >
      <UiIconImage name={icon} size={13} className="opacity-90" />
      {value}
    </span>
  );
}

type HudProfileChipProps = {
  displayName: string;
  levelLabel: string;
  avatar?: ReactNode;
  className?: string;
};

export function HudProfileChip({
  displayName,
  levelLabel,
  avatar,
  className,
}: HudProfileChipProps) {
  return (
    <div className={cn("flex min-w-0 items-center gap-2", className)}>
      {avatar ?? (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-trail-glow/20 ring-1 ring-trail-glow/30">
          <UiIconImage name="mountain" size={16} />
        </span>
      )}
      <div className="min-w-0">
        <p className="truncate text-body-sm font-semibold text-amber-100">{displayName}</p>
        <p className="text-caption uppercase tracking-[0.14em] text-white/60">{levelLabel}</p>
      </div>
    </div>
  );
}
