import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type LessonLayoutProps = {
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
};

/**
 * Full-height lesson shell without double bottom-nav padding.
 * Sticky footer keeps the primary CTA thumb-reachable.
 */
export function LessonLayout({ children, footer, className }: LessonLayoutProps) {
  return (
    <div
      className={cn(
        "mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-lg flex-col p-4",
        className,
      )}
    >
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pb-4">{children}</div>
      {footer ? (
        <div className="sticky bottom-0 z-10 -mx-4 border-t border-border/60 bg-background/95 px-4 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-sm">
          {footer}
        </div>
      ) : null}
    </div>
  );
}
