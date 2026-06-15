import Link from "next/link";
import type { ReactNode } from "react";

import { UiIconImage } from "@/components/media/ui-icon-image";
import { GlassPanel, StoryTitle } from "@/components/visual";

type StudyHubHeaderProps = {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  action?: ReactNode;
};

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
        className="inline-flex items-center gap-1.5 text-body-sm text-white/70 transition-colors hover:text-white"
      >
        <UiIconImage name="arrow_left" size={16} />
        {backLabel}
      </Link>

      <GlassPanel variant="header" className="space-y-1 rounded-card p-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <StoryTitle as="h1" className="text-base">
              {title}
            </StoryTitle>
            {subtitle ? (
              <p className="text-caption text-muted-foreground">{subtitle}</p>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      </GlassPanel>
    </>
  );
}
