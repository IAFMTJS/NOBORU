export type ContentHubVariant =
  | "vocabulary"
  | "grammar"
  | "kanji"
  | "reading"
  | "listening"
  | "hiragana"
  | "katakana";

export type ContentHubTokens = {
  progressIndicator: string;
  leadingBg: string;
  leadingText: string;
  progressCardBorder: string;
};

export type ContentHubBannerStyle = {
  gradient: string;
  border: string;
};

export const CONTENT_HUB_TOKENS: Record<ContentHubVariant, ContentHubTokens> = {
  vocabulary: {
    progressIndicator: "bg-primary",
    leadingBg: "border-primary/25 bg-primary/10",
    leadingText: "text-primary",
    progressCardBorder: "border-primary/20",
  },
  grammar: {
    progressIndicator: "bg-reward",
    leadingBg: "border-reward/25 bg-reward/10",
    leadingText: "text-reward",
    progressCardBorder: "border-reward/20",
  },
  kanji: {
    progressIndicator: "bg-trail-glow",
    leadingBg: "border-trail-glow/25 bg-trail-glow/10",
    leadingText: "text-heading-story",
    progressCardBorder: "border-trail-glow/20",
  },
  reading: {
    progressIndicator: "bg-success",
    leadingBg: "border-success/25 bg-success/10",
    leadingText: "text-success",
    progressCardBorder: "border-success/20",
  },
  listening: {
    progressIndicator: "bg-info",
    leadingBg: "border-info/25 bg-info/10",
    leadingText: "text-info",
    progressCardBorder: "border-info/20",
  },
  hiragana: {
    progressIndicator: "bg-primary",
    leadingBg: "border-primary/25 bg-primary/10",
    leadingText: "text-primary",
    progressCardBorder: "border-primary/20",
  },
  katakana: {
    progressIndicator: "bg-trail-glow",
    leadingBg: "border-trail-glow/25 bg-trail-glow/10",
    leadingText: "text-heading-story",
    progressCardBorder: "border-trail-glow/20",
  },
};

export const CONTENT_HUB_BANNER_STYLES: Record<ContentHubVariant, ContentHubBannerStyle> = {
  vocabulary: {
    gradient: "from-primary/15 via-primary/5 to-card",
    border: "border-primary/25",
  },
  grammar: {
    gradient: "from-reward/15 via-primary/5 to-card",
    border: "border-reward/25",
  },
  kanji: {
    gradient: "from-trail-glow/15 via-primary/5 to-card",
    border: "border-trail-glow/25",
  },
  reading: {
    gradient: "from-success/15 via-primary/5 to-card",
    border: "border-success/25",
  },
  listening: {
    gradient: "from-info/15 via-primary/5 to-card",
    border: "border-info/25",
  },
  hiragana: {
    gradient: "from-primary/20 via-primary/5 to-card",
    border: "border-primary/25",
  },
  katakana: {
    gradient: "from-trail-glow/20 via-primary/5 to-card",
    border: "border-trail-glow/25",
  },
};

export const CONTENT_HUB_ICONS: Record<ContentHubVariant, string> = {
  vocabulary: "語",
  grammar: "文",
  kanji: "漢",
  reading: "読",
  listening: "聴",
  hiragana: "あ",
  katakana: "ア",
};
