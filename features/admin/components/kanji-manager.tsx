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
import type { KanjiInput, KanjiRow } from "@/features/kanji/types/kanji.types";
import type { JlptLevel } from "@/lib/content/types";
import { JLPT_LEVELS } from "@/lib/content/types";

const EMPTY: KanjiInput = {
  character: "",
  meaning: "",
  jlptLevel: "n5",
  onyomi: "",
  kunyomi: "",
  status: "draft",
};

export function KanjiManager() {
  const { items, loading, error, create, update, remove } = useAdminResource<
    KanjiRow,
    KanjiInput
  >("/api/admin/kanji");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<KanjiRow | null>(null);
  const [form, setForm] = useState<KanjiInput>(EMPTY);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY);
    setFormError(null);
    setOpen(true);
  }

  function openEdit(row: KanjiRow) {
    setEditing(row);
    setForm({
      character: row.character,
      meaning: row.meaning,
      jlptLevel: row.jlpt_level,
      gradeLevel: row.grade_level,
      strokeCount: row.stroke_count,
      status: row.status,
      onyomi: "",
      kunyomi: "",
    });
    setFormError(null);
    setOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    setFormError(null);
    try {
      if (editing) await update(editing.id, form);
      else await create(form);
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
          <h1 className="text-heading-4">Kanji</h1>
          <p className="text-body-sm text-muted-foreground">
            Manage kanji characters and readings.
          </p>
        </div>
        <Button onClick={openCreate}>Add Kanji</Button>
      </div>
      {error ? <p className="text-caption text-destructive">{error}</p> : null}
      <Card>
        <CardHeader>
          <CardTitle className="text-heading-6">All Kanji</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {loading ? (
            <p className="text-body-sm text-muted-foreground">Loading...</p>
          ) : (
            <table className="w-full min-w-[520px] text-left text-body-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="py-2 pr-3">Character</th>
                  <th className="py-2 pr-3">Meaning</th>
                  <th className="py-2 pr-3">JLPT</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((row) => (
                  <tr key={row.id} className="border-b border-border/60">
                    <td className="py-3 pr-3 text-xl">{row.character}</td>
                    <td className="py-3 pr-3">{row.meaning}</td>
                    <td className="py-3 pr-3 uppercase">
                      {row.jlpt_level ?? "—"}
                    </td>
                    <td className="py-3 pr-3">
                      <ContentStatusBadge status={row.status} />
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => openEdit(row)}>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Kanji" : "Add Kanji"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <FormField id="character" label="Character">
              <Input
                id="character"
                value={form.character}
                onChange={(e) => setForm((c) => ({ ...c, character: e.target.value }))}
              />
            </FormField>
            <FormField id="meaning" label="Meaning">
              <Input
                id="meaning"
                value={form.meaning}
                onChange={(e) => setForm((c) => ({ ...c, meaning: e.target.value }))}
              />
            </FormField>
            <FormField id="onyomi" label="Onyomi (comma-separated)">
              <Input
                id="onyomi"
                value={form.onyomi ?? ""}
                onChange={(e) => setForm((c) => ({ ...c, onyomi: e.target.value }))}
              />
            </FormField>
            <FormField id="kunyomi" label="Kunyomi (comma-separated)">
              <Input
                id="kunyomi"
                value={form.kunyomi ?? ""}
                onChange={(e) => setForm((c) => ({ ...c, kunyomi: e.target.value }))}
              />
            </FormField>
            <FormField id="jlptLevel" label="JLPT Level">
              <select
                id="jlptLevel"
                value={form.jlptLevel ?? ""}
                onChange={(e) =>
                  setForm((c) => ({ ...c, jlptLevel: e.target.value as JlptLevel }))
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
                onChange={(status) => setForm((c) => ({ ...c, status }))}
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
