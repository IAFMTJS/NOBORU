"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { INTAKE_ROW_SHORTCUTS } from "@/features/intake/constants/intake.constants";
import { cn } from "@/lib/utils";

type KanaEntry = {
  id: string;
  character: string;
  romaji: string;
  rowLabel: string;
};

type KanaSelectionGridProps = {
  title: string;
  subtitle: string;
  entries: KanaEntry[];
  selectedIds: Set<string>;
  onChange: (selectedIds: Set<string>) => void;
};

export function KanaSelectionGrid({
  title,
  subtitle,
  entries,
  selectedIds,
  onChange,
}: KanaSelectionGridProps) {
  const rowLabels = Array.from(new Set(entries.map((entry) => entry.rowLabel)));

  function toggleEntry(id: string) {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    onChange(next);
  }

  function selectRow(rowLabel: string) {
    const rowIds = entries
      .filter((entry) => entry.rowLabel === rowLabel)
      .map((entry) => entry.id);
    const allSelected = rowIds.every((id) => selectedIds.has(id));
    const next = new Set(selectedIds);

    if (allSelected) {
      for (const id of rowIds) next.delete(id);
    } else {
      for (const id of rowIds) next.add(id);
    }

    onChange(next);
  }

  function selectAll() {
    onChange(new Set(entries.map((entry) => entry.id)));
  }

  function clearAll() {
    onChange(new Set());
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-heading-4">{title}</h2>
        <p className="text-body-sm text-muted-foreground">{subtitle}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={selectAll}>
          Select all
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={clearAll}>
          Clear
        </Button>
        {INTAKE_ROW_SHORTCUTS.filter((shortcut) =>
          rowLabels.some((label) => label.includes(shortcut.match)),
        ).map((shortcut) => {
          const rowLabel = rowLabels.find((label) => label.includes(shortcut.match));
          if (!rowLabel) return null;
          return (
            <Button
              key={shortcut.label}
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => selectRow(rowLabel)}
            >
              {shortcut.label}
            </Button>
          );
        })}
      </div>

      <p className="text-body-sm text-muted-foreground">
        {selectedIds.size} of {entries.length} selected
      </p>

      <div className="space-y-4">
        {rowLabels.map((rowLabel) => {
          const rowEntries = entries.filter((entry) => entry.rowLabel === rowLabel);
          if (rowEntries.length === 0) return null;

          return (
            <Card key={rowLabel} className="shadow-elevation-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-heading-6">{rowLabel}</CardTitle>
                <CardDescription>Tap characters you can read</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {rowEntries.map((entry) => {
                    const selected = selectedIds.has(entry.id);
                    return (
                      <button
                        key={entry.id}
                        type="button"
                        aria-pressed={selected}
                        aria-label={`${entry.character}, ${entry.romaji}`}
                        onClick={() => toggleEntry(entry.id)}
                        className={cn(
                          "flex flex-col items-center rounded-xl border p-3 transition-colors motion-standard",
                          selected
                            ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                            : "border-border bg-card hover:border-primary/30",
                        )}
                      >
                        <span className="text-heading-4">{entry.character}</span>
                        <span className="text-caption text-muted-foreground">
                          {entry.romaji}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
