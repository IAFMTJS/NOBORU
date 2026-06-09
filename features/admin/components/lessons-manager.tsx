"use client";

import { useEffect, useState } from "react";

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
import type {
  LessonInput,
  LessonRow,
  UnitRow,
} from "@/features/learning/types/curriculum.types";
import type { ApiResponse } from "@/lib/api/responses";

const EMPTY: LessonInput = {
  unitId: "",
  type: "vocabulary",
  title: "",
  description: "",
  difficulty: 1,
  xpReward: 10,
  status: "draft",
};

export function LessonsManager() {
  const { items, loading, error, create, update, remove } = useAdminResource<
    LessonRow,
    LessonInput
  >("/api/admin/lessons");
  const [units, setUnits] = useState<UnitRow[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<LessonRow | null>(null);
  const [form, setForm] = useState<LessonInput>(EMPTY);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void (async () => {
      const response = await fetch("/api/admin/units");
      const result = (await response.json()) as ApiResponse<UnitRow[]>;
      if (result.success) setUnits(result.data);
    })();
  }, []);

  function openCreate() {
    setEditing(null);
    setForm({ ...EMPTY, unitId: units[0]?.id ?? "" });
    setFormError(null);
    setOpen(true);
  }

  function openEdit(row: LessonRow) {
    setEditing(row);
    setForm({
      unitId: row.unit_id,
      type: row.type,
      title: row.title,
      description: row.description,
      difficulty: row.difficulty,
      xpReward: row.xp_reward,
      estimatedDuration: row.estimated_duration,
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

  const unitName = (unitId: string) =>
    units.find((unit) => unit.id === unitId)?.name ?? unitId.slice(0, 8);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-heading-4">Lessons</h1>
          <p className="text-body-sm text-muted-foreground">
            Create lessons within curriculum units.
          </p>
        </div>
        <Button onClick={openCreate} disabled={units.length === 0}>
          Add Lesson
        </Button>
      </div>
      {units.length === 0 ? (
        <p className="text-body-sm text-muted-foreground">
          Create a region and unit in the database before adding lessons.
        </p>
      ) : null}
      {error ? <p className="text-caption text-destructive">{error}</p> : null}
      <Card>
        <CardHeader>
          <CardTitle className="text-heading-6">All Lessons</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {loading ? (
            <p className="text-body-sm text-muted-foreground">Loading...</p>
          ) : (
            <table className="w-full min-w-[640px] text-left text-body-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="py-2 pr-3">Title</th>
                  <th className="py-2 pr-3">Unit</th>
                  <th className="py-2 pr-3">Type</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((row) => (
                  <tr key={row.id} className="border-b border-border/60">
                    <td className="py-3 pr-3 font-medium">{row.title}</td>
                    <td className="py-3 pr-3">{unitName(row.unit_id)}</td>
                    <td className="py-3 pr-3 capitalize">{row.type}</td>
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
            <DialogTitle>{editing ? "Edit Lesson" : "Add Lesson"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <FormField id="unitId" label="Unit">
              <select
                id="unitId"
                value={form.unitId}
                onChange={(e) => setForm((c) => ({ ...c, unitId: e.target.value }))}
                className="flex h-11 w-full rounded-xl border border-input bg-background px-4 text-body-sm"
              >
                {units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField id="title" label="Title">
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm((c) => ({ ...c, title: e.target.value }))}
              />
            </FormField>
            <FormField id="type" label="Type">
              <Input
                id="type"
                value={form.type ?? "vocabulary"}
                onChange={(e) => setForm((c) => ({ ...c, type: e.target.value }))}
              />
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
