import { cn } from "@/lib/utils";
import {
  CONTENT_HUB_BANNER_STYLES,
  CONTENT_HUB_ICONS,
  type ContentHubVariant,
} from "@/lib/design-system/content-hub-tokens";

export type { ContentHubVariant } from "@/lib/design-system/content-hub-tokens";

type ContentHubBannerProps = {
  variant: ContentHubVariant;
  title: string;
  subtitle: string;
  className?: string;
};

export function ContentHubBanner({
  variant,
  title,
  subtitle,
  className,
}: ContentHubBannerProps) {
  const styles = CONTENT_HUB_BANNER_STYLES[variant];

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-2xl border bg-gradient-to-br p-4 shadow-elevation-1",
        styles.gradient,
        styles.border,
        className,
      )}
    >
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-card/80 font-japanese text-heading-4 text-primary shadow-elevation-1"
        aria-hidden
      >
        {CONTENT_HUB_ICONS[variant]}
      </div>
      <div className="min-w-0">
        <p className="text-heading-6">{title}</p>
        <p className="text-body-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}
