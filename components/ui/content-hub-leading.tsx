import type { ContentHubVariant } from "@/components/ui/content-hub-banner";
import {
  CONTENT_HUB_ICONS,
  CONTENT_HUB_TOKENS,
} from "@/lib/design-system/content-hub-tokens";
import { cn } from "@/lib/utils";

type ContentHubLeadingProps = {
  variant: ContentHubVariant;
  glyph?: string;
  className?: string;
};

export function ContentHubLeading({
  variant,
  glyph,
  className,
}: ContentHubLeadingProps) {
  const tokens = CONTENT_HUB_TOKENS[variant];
  const display = glyph ?? CONTENT_HUB_ICONS[variant];

  return (
    <div
      className={cn(
        "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border font-japanese text-heading-5",
        tokens.leadingBg,
        tokens.leadingText,
        className,
      )}
      aria-hidden
    >
      <span lang="ja">{display}</span>
    </div>
  );
}
