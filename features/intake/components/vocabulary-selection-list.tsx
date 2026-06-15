"use client";

import { useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { YamaEmptyState } from "@/features/yama/components/yama-empty-state";
import { SelectionCard } from "@/features/onboarding/components/selection-card";
import type { VocabularyListEntry } from "@/features/vocabulary/types/vocabulary.types";

type VocabularySelectionListProps = {
  title: string;
  subtitle: string;
  entries: VocabularyListEntry[];
  selectedIds: Set<string>;
  onChange: (selectedIds: Set<string>) => void;
};

export function VocabularySelectionList({
  title,
  subtitle,
  entries,
  selectedIds,
  onChange,
}: VocabularySelectionListProps) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return entries;
    return entries.filter(
      (entry) =>
        entry.kana.toLowerCase().includes(query) ||
        entry.meaning.toLowerCase().includes(query) ||
        entry.kanji?.toLowerCase().includes(query),
    );
  }, [entries, search]);

  function toggleEntry(id: string) {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    onChange(next);
  }

  function selectAllVisible() {
    const next = new Set(selectedIds);
    for (const entry of filtered) next.add(entry.id);
    onChange(next);
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-heading-4">{title}</h2>
        <p className="text-body-sm text-muted-foreground">{subtitle}</p>
      </div>

      <Input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search kana, kanji, or meaning"
        aria-label="Search vocabulary"
      />

      <div className="flex items-center justify-between text-body-sm text-muted-foreground">
        <span>
          {selectedIds.size} of {entries.length} selected
        </span>
        <button
          type="button"
          className="text-primary underline-offset-4 hover:underline"
          onClick={selectAllVisible}
        >
          Select visible
        </button>
      </div>

      <div className="max-h-[50dvh] space-y-2 overflow-y-auto pr-1">
        {filtered.map((entry) => (
          <SelectionCard
            key={entry.id}
            label={entry.kanji ?? entry.kana}
            description={`${entry.kana} · ${entry.meaning}`}
            selected={selectedIds.has(entry.id)}
            onClick={() => toggleEntry(entry.id)}
          />
        ))}
        {filtered.length === 0 ? (
          <YamaEmptyState
            surface="search"
            title="No words on this path"
            description="Adjust your search — different characters or a broader term may reveal the word you need."
          />
        ) : null}
      </div>
    </div>
  );
}
