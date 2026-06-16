"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { UiIconImage } from "@/components/media/ui-icon-image";
import { GlassSurfacePanel } from "@/components/visual/primitives/glass-surface";
import { TabScene } from "@/components/visual/shells/viewport-background";
import { cn } from "@/lib/utils";

export type SecondaryScreenShellProps = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  headerAction?: ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  /** When false, only TabScene + children (no header chrome). */
  showHeader?: boolean;
};

/** Shared layout for secondary routes — glass HUD header over tab viewport backgrounds. */
export function SecondaryScreenShell({
  children,
  title,
  subtitle,
  backHref,
  backLabel,
  headerAction,
  className,
  headerClassName,
  contentClassName,
  showHeader = true,
}: SecondaryScreenShellProps) {
  const hasHeader = showHeader && (title || backHref);

  return (
    <TabScene className={cn("flex min-h-dvh flex-col pb-nav-clearance", className)}>
      {hasHeader ? (
        <header className={cn("shrink-0 space-y-3 p-4 pt-3", headerClassName)}>
          {backHref ? (
            <Link
              href={backHref}
              className="focus-ring inline-flex items-center gap-1.5 text-body-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <UiIconImage name="arrow_left" size={16} />
              {backLabel ?? "Back"}
            </Link>
          ) : null}
          {title ? (
            <GlassSurfacePanel variant="hud" className="space-y-1 px-3 py-2">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 space-y-1">
                  <h1 className="font-sans text-section-header font-semibold tracking-tight">{title}</h1>
                  {subtitle ? <p className="text-caption text-muted-foreground">{subtitle}</p> : null}
                </div>
                {headerAction ? <div className="shrink-0">{headerAction}</div> : null}
              </div>
            </GlassSurfacePanel>
          ) : null}
        </header>
      ) : null}

      <main className={cn("flex-1 overflow-y-auto px-4 py-2", contentClassName)}>{children}</main>
    </TabScene>
  );
}
