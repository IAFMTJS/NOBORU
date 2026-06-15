import { StudyShelfRow } from "@/features/dojo/components/study-shelf-row";
import { Badge } from "@/components/ui/badge";
import type { VocabularyListEntry } from "@/features/vocabulary/types/vocabulary.types";

function vocabularyLeadingGlyph(entry: { kana: string; kanji: string | null }) {
  return entry.kanji?.[0] ?? entry.kana[0] ?? "語";
}

type VocabularyListRowProps = {
  entry: VocabularyListEntry;
  href: string;
};

export function VocabularyListRow({ entry, href }: VocabularyListRowProps) {
  const glyph = vocabularyLeadingGlyph(entry);

  return (
    <StudyShelfRow
      href={href}
      variant="vocabulary"
      glyph={glyph}
      primary={
        <span lang="ja">
          {entry.kanji ? `${entry.kana} · ${entry.kanji}` : entry.kana}
        </span>
      }
      secondary={entry.meaning}
      trailing={
        entry.learned ? (
          <Badge variant="secondary">Learned</Badge>
        ) : (
          <Badge variant="outline">New</Badge>
        )
      }
    />
  );
}
