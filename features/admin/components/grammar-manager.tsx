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
import type { GrammarInput, GrammarRow } from "@/features/grammar/types/grammar.types";
import type { JlptLevel } from "@/lib/content/types";
import { JLPT_LEVELS } from "@/lib/content/types";

const EMPTY: GrammarInput = {
  title: "",
  meaning: "",
  explanation: "",
  jlptLevel: "n5",
  difficulty: 1,
  status: "draft",
};

export function GrammarManager() {
  const { items, loading, error, create, update, remove } = useAdminResource<
    GrammarRow,
    GrammarInput
  >("/api/admin/grammar");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<GrammarRow | null>(null);
  const [form, setForm] = useState<GrammarInput>(EMPTY);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY);
    setFormError(null);
    setOpen(true);
  }

  function openEdit(row: GrammarRow) {
    setEditing(row);
    setForm({
      title: row.title,
      meaning: row.meaning,
      explanation: row.explanation,
      jlptLevel: row.jlpt_level,
      difficulty: row.difficulty,
      status: row.status,
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
          <h1 className="text-heading-4">Grammar</h1>
          <p className="text-body-sm text-muted-foreground">
            Manage grammar points and explanations.
          </p>
        </div>
        <Button onClick={openCreate}>Add Grammar</Button>
      </div>
      {error ? <p className="text-caption text-destructive">{error}</p> : null}
      <Card>
        <CardHeader>
          <CardTitle className="text-heading-6">All Grammar Points</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {loading ? (
            <p className="text-body-sm text-muted-foreground">Loading...</p>
          ) : (
            <table className="w-full min-w-[560px] text-left text-body-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="py-2 pr-3">Title</th>
                  <th className="py-2 pr-3">Meaning</th>
                  <th className="py-2 pr-3">JLPT</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((row) => (
                  <tr key={row.id} className="border-b border-border/60">
                    <td className="py-3 pr-3 font-medium">{row.title}</td>
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
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Grammar" : "Add Grammar"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <FormField id="title" label="Title">
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm((c) => ({ ...c, title: e.target.value }))}
              />
            </FormField>
            <FormField id="meaning" label="Meaning">
              <Input
                id="meaning"
                value={form.meaning}
                onChange={(e) => setForm((c) => ({ ...c, meaning: e.target.value }))}
              />
            </FormField>
            <FormField id="explanation" label="Explanation">
              <textarea
                id="explanation"
                value={form.explanation ?? ""}
                onChange={(e) =>
                  setForm((c) => ({ ...c, explanation: e.target.value }))
                }
                className="min-h-24 w-full rounded-xl border border-input bg-background px-4 py-3 text-body-sm"
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
