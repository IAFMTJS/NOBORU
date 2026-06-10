import { cn } from "@/lib/utils";

type JapaneseTextProps = {
  text: string;
  reading?: string | null;
  romaji?: string | null;
  english?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
};

const SIZE_CLASSES = {
  sm: "text-body-sm",
  md: "text-body",
  lg: "text-heading-5",
  xl: "text-heading-3",
} as const;

export function JapaneseText({
  text,
  reading,
  romaji,
  english,
  size = "md",
  className,
}: JapaneseTextProps) {
  const showRuby = Boolean(reading && reading !== text);

  return (
    <div className={cn("space-y-1", className)}>
      {showRuby ? (
        <ruby
          lang="ja"
          className={cn("leading-relaxed", SIZE_CLASSES[size])}
        >
          {text}
          <rt className="text-caption font-normal text-muted-foreground">
            {reading}
          </rt>
        </ruby>
      ) : (
        <p lang="ja" className={cn("leading-relaxed", SIZE_CLASSES[size])}>
          {text}
        </p>
      )}
      {romaji ? (
        <p className="text-caption text-muted-foreground">{romaji}</p>
      ) : null}
      {english ? (
        <p className="text-body-sm text-muted-foreground">{english}</p>
      ) : null}
    </div>
  );
}
