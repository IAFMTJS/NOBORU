import Link from "next/link";
import type { ReactNode } from "react";

import { UiIconImage } from "@/components/media/ui-icon-image";

type StudyHubHeaderProps = {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  action?: ReactNode;
};

/** @deprecated Use SecondaryScreenShell — kept for direct imports during migration. */
export function StudyHubHeader({
  title,
  subtitle,
  backHref = "/study",
  backLabel = "Study",
  action,
}: StudyHubHeaderProps) {
  return (
    <>
      <Link
        href={backHref}
        className="focus-ring inline-flex items-center gap-1.5 text-body-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <UiIconImage name="arrow_left" size={16} />
        {backLabel}
      </Link>
      <div className="space-y-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <h1 className="font-sans text-section-header font-semibold tracking-tight">{title}</h1>
            {subtitle ? <p className="text-caption text-muted-foreground">{subtitle}</p> : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      </div>
    </>
  );
}
