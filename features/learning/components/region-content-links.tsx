import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getJlptQueryString } from "@/lib/learning/jlpt-content.constants";
import { cn } from "@/lib/utils";

type RegionContentLinksProps = {
  jlptLevel: "n5" | "n4";
  variant?: "buttons" | "chips";
  className?: string;
};

const HUB_LINKS = [
  { key: "vocabulary", label: "Vocab" },
  { key: "grammar", label: "Grammar" },
  { key: "kanji", label: "Kanji" },
  { key: "reading", label: "Reading" },
  { key: "listening", label: "Listening" },
] as const;

export function RegionContentLinks({
  jlptLevel,
  variant = "buttons",
  className,
}: RegionContentLinksProps) {
  const query = getJlptQueryString(jlptLevel);
  const levelLabel = jlptLevel.toUpperCase();

  if (variant === "chips") {
    return (
      <div className={cn("flex flex-wrap gap-2", className)}>
        {HUB_LINKS.map((hub) => (
          <Button key={hub.key} variant="outline" size="sm" asChild>
            <Link href={`/learn/${hub.key}${query}`}>{hub.label}</Link>
          </Button>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Button variant="outline" className="w-full" asChild>
        <Link href={`/learn/vocabulary${query}`}>Open {levelLabel} Vocabulary</Link>
      </Button>
      <Button variant="outline" className="w-full" asChild>
        <Link href={`/learn/grammar${query}`}>Open {levelLabel} Grammar</Link>
      </Button>
      <Button variant="outline" className="w-full" asChild>
        <Link href={`/learn/kanji${query}`}>Open {levelLabel} Kanji Academy</Link>
      </Button>
      <Button variant="outline" className="w-full" asChild>
        <Link href={`/learn/reading${query}`}>Open {levelLabel} Reading</Link>
      </Button>
      <Button variant="outline" className="w-full" asChild>
        <Link href={`/learn/listening${query}`}>Open {levelLabel} Listening</Link>
      </Button>
    </div>
  );
}
