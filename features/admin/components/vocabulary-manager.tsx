"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import {
  ContentStatusBadge,
  ContentStatusSelect,
} from "@/features/admin/components/content-status";
import { useAdminResource } from "@/features/admin/hooks/use-admin-resource";
import type { ContentStatus, JlptLevel } from "@/lib/content/types";
import { JLPT_LEVELS } from "@/lib/content/types";
import type {
  VocabularyInput,
  VocabularyRow,
} from "@/features/vocabulary/types/vocabulary.types";

const EMPTY_FORM: VocabularyInput = {
  kana: "",
  kanji: "",
  meaning: "",
  partOfSpeech: "",
  jlptLevel: "n5",
  difficulty: 1,
  audioUrl: "",
  status: "draft",
};

export function VocabularyManager() {
  const { items, loading, error, create, update, remove } = useAdminResource<
    VocabularyRow,
    VocabularyInput
  >("/api/admin/vocabulary");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<VocabularyRow | null>(null);
  const [form, setForm] = useState<VocabularyInput>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setOpen(true);
  }

  function openEdit(row: VocabularyRow) {
    setEditing(row);
    setForm({
      kana: row.kana,
      kanji: row.kanji ?? "",
      meaning: row.meaning,
      partOfSpeech: row.part_of_speech ?? "",
      jlptLevel: row.jlpt_level,
      difficulty: row.difficulty,
      audioUrl: row.audio_url ?? "",
      status: row.status,
    });
    setFormError(null);
    setOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    setFormError(null);
    try {
      if (editing) {
        await update(editing.id, form);
      } else {
        await create(form);
      }
      setOpen(false);
    } catch (caught) {
      setFormError(caught instanceof Error ? caught.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-heading-4">Vocabulary</h1>
          <p className="text-body-sm text-muted-foreground">
            Create and publish vocabulary entries.
          </p>
        </div>
        <Button onClick={openCreate}>Add Word</Button>
      </div>

      {error ? <p className="text-caption text-destructive">{error}</p> : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-heading-6">All Words</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {loading ? (
            <p className="text-body-sm text-muted-foreground">Loading...</p>
          ) : (
            <table className="w-full min-w-[640px] text-left text-body-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="py-2 pr-3">Kana</th>
                  <th className="py-2 pr-3">Meaning</th>
                  <th className="py-2 pr-3">JLPT</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((row) => (
                  <tr key={row.id} className="border-b border-border/60">
                    <td className="py-3 pr-3 font-medium">
                      {row.kana}
                      {row.kanji ? (
                        <span className="ml-2 text-muted-foreground">
                          {row.kanji}
                        </span>
                      ) : null}
                    </td>
                    <td className="py-3 pr-3">{row.meaning}</td>
                    <td className="py-3 pr-3 uppercase">
                      {row.jlpt_level ?? "—"}
                    </td>
                    <td className="py-3 pr-3">
                      <ContentStatusBadge status={row.status} />
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEdit(row)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => void remove(row.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Vocabulary" : "Add Vocabulary"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <FormField id="kana" label="Kana">
              <Input
                id="kana"
                value={form.kana}
                onChange={(event) =>
                  setForm((current) => ({ ...current, kana: event.target.value }))
                }
              />
            </FormField>
            <FormField id="kanji" label="Kanji">
              <Input
                id="kanji"
                value={form.kanji ?? ""}
                onChange={(event) =>
                  setForm((current) => ({ ...current, kanji: event.target.value }))
                }
              />
            </FormField>
            <FormField id="meaning" label="Meaning">
              <Input
                id="meaning"
                value={form.meaning}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    meaning: event.target.value,
                  }))
                }
              />
            </FormField>
            <FormField id="partOfSpeech" label="Part of Speech">
              <Input
                id="partOfSpeech"
                value={form.partOfSpeech ?? ""}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    partOfSpeech: event.target.value,
                  }))
                }
              />
            </FormField>
            <FormField id="audioUrl" label="Audio URL">
              <Input
                id="audioUrl"
                value={form.audioUrl ?? ""}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    audioUrl: event.target.value,
                  }))
                }
                placeholder="https://..."
              />
            </FormField>
            <FormField id="jlptLevel" label="JLPT Level">
              <select
                id="jlptLevel"
                value={form.jlptLevel ?? ""}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    jlptLevel: event.target.value as JlptLevel,
                  }))
                }
                className="flex h-11 w-full rounded-xl border border-input bg-background px-4 text-body-sm"
              >
                {JLPT_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level.toUpperCase()}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField id="status" label="Status">
              <ContentStatusSelect
                value={form.status ?? "draft"}
                onChange={(status) =>
                  setForm((current) => ({ ...current, status }))
                }
              />
            </FormField>
            {formError ? (
              <p className="text-caption text-destructive">{formError}</p>
            ) : null}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button loading={saving} onClick={() => void handleSave()}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
