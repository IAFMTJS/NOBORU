import type { ContentHubVariant } from "@/components/ui/content-hub-banner";

export type ContentHubTokens = {
  progressIndicator: string;
  leadingBg: string;
  leadingText: string;
  progressCardBorder: string;
};

export const CONTENT_HUB_TOKENS: Record<ContentHubVariant, ContentHubTokens> = {
  vocabulary: {
    progressIndicator: "bg-primary",
    leadingBg: "border-primary/25 bg-primary/10",
    leadingText: "text-primary",
    progressCardBorder: "border-primary/20",
  },
  grammar: {
    progressIndicator: "bg-violet-500",
    leadingBg: "border-violet-500/25 bg-violet-500/10",
    leadingText: "text-violet-600 dark:text-violet-300",
    progressCardBorder: "border-violet-500/20",
  },
  kanji: {
    progressIndicator: "bg-amber-500",
    leadingBg: "border-amber-500/25 bg-amber-500/10",
    leadingText: "text-amber-700 dark:text-amber-200",
    progressCardBorder: "border-amber-500/20",
  },
  reading: {
    progressIndicator: "bg-emerald-500",
    leadingBg: "border-emerald-500/25 bg-emerald-500/10",
    leadingText: "text-emerald-700 dark:text-emerald-300",
    progressCardBorder: "border-emerald-500/20",
  },
  listening: {
    progressIndicator: "bg-sky-500",
    leadingBg: "border-sky-500/25 bg-sky-500/10",
    leadingText: "text-sky-700 dark:text-sky-300",
    progressCardBorder: "border-sky-500/20",
  },
};

export const CONTENT_HUB_ICONS: Record<ContentHubVariant, string> = {
  vocabulary: "語",
  grammar: "文",
  kanji: "漢",
  reading: "読",
  listening: "聴",
};
