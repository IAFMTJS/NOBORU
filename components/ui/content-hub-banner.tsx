import { cn } from "@/lib/utils";

export type ContentHubVariant =
  | "vocabulary"
  | "grammar"
  | "kanji"
  | "reading"
  | "listening";

const HUB_STYLES: Record<
  ContentHubVariant,
  { gradient: string; border: string; icon: string }
> = {
  vocabulary: {
    gradient: "from-primary/15 via-rose-500/5 to-card",
    border: "border-primary/25",
    icon: "語",
  },
  grammar: {
    gradient: "from-violet-500/15 via-primary/5 to-card",
    border: "border-violet-500/25",
    icon: "文",
  },
  kanji: {
    gradient: "from-amber-500/15 via-primary/5 to-card",
    border: "border-amber-500/25",
    icon: "漢",
  },
  reading: {
    gradient: "from-emerald-500/15 via-primary/5 to-card",
    border: "border-emerald-500/25",
    icon: "読",
  },
  listening: {
    gradient: "from-sky-500/15 via-primary/5 to-card",
    border: "border-sky-500/25",
    icon: "聴",
  },
};

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
  const styles = HUB_STYLES[variant];

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
        {styles.icon}
      </div>
      <div className="min-w-0">
        <p className="text-heading-6">{title}</p>
        <p className="text-body-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}
