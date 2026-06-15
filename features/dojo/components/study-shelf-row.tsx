import type { ReactNode } from "react";
import Link from "next/link";
import type { ContentHubVariant } from "@/lib/design-system/content-hub-tokens";
import { ContentHubLeading } from "@/components/ui/content-hub-leading";
import { GlassPanel } from "@/components/visual";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StudyShelfRowProps = {
  href: string;
  glyph: string;
  variant: ContentHubVariant;
  primary: ReactNode;
  secondary?: string;
  trailing?: ReactNode;
  className?: string;
};

export function StudyShelfRow({
  href,
  glyph,
  variant,
  primary,
  secondary,
  trailing,
  className,
}: StudyShelfRowProps) {
  return (
    <Link href={href} className={cn("focus-ring block rounded-card", className)}>
      <GlassPanel className="flex items-center gap-3 p-3 transition-colors hover:border-trail-glow/30">
        <ContentHubLeading variant={variant} glyph={glyph} />
        <div className="min-w-0 flex-1 space-y-0.5">
          <p className="truncate text-body-sm font-medium">{primary}</p>
          {secondary ? (
            <p className="truncate text-caption text-muted-foreground">{secondary}</p>
          ) : null}
        </div>
        {trailing ? <div className="shrink-0">{trailing}</div> : null}
      </GlassPanel>
    </Link>
  );
}
