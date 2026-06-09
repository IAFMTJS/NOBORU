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
import type {
  AchievementInput,
  AchievementRow,
} from "@/features/achievements/types/achievement.types";
import type { AchievementRarity } from "@/lib/content/types";
import { ACHIEVEMENT_RARITIES } from "@/lib/content/types";

const EMPTY: AchievementInput = {
  name: "",
  slug: "",
  description: "",
  rarity: "common",
  status: "draft",
};

export function AchievementsManager() {
  const { items, loading, error, create, update, remove } = useAdminResource<
    AchievementRow,
    AchievementInput
  >("/api/admin/achievements");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AchievementRow | null>(null);
  const [form, setForm] = useState<AchievementInput>(EMPTY);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY);
    setFormError(null);
    setOpen(true);
  }

  function openEdit(row: AchievementRow) {
    setEditing(row);
    setForm({
      name: row.name,
      slug: row.slug,
      description: row.description,
      rarity: row.rarity,
      rewardType: row.reward_type,
      rewardValue: row.reward_value,
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
          <h1 className="text-heading-4">Achievements</h1>
          <p className="text-body-sm text-muted-foreground">
            Define badges and unlock rewards.
          </p>
        </div>
        <Button onClick={openCreate}>Add Achievement</Button>
      </div>
      {error ? <p className="text-caption text-destructive">{error}</p> : null}
      <Card>
        <CardHeader>
          <CardTitle className="text-heading-6">All Achievements</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {loading ? (
            <p className="text-body-sm text-muted-foreground">Loading...</p>
          ) : (
            <table className="w-full min-w-[560px] text-left text-body-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="py-2 pr-3">Name</th>
                  <th className="py-2 pr-3">Slug</th>
                  <th className="py-2 pr-3">Rarity</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((row) => (
                  <tr key={row.id} className="border-b border-border/60">
                    <td className="py-3 pr-3 font-medium">{row.name}</td>
                    <td className="py-3 pr-3 text-muted-foreground">{row.slug}</td>
                    <td className="py-3 pr-3 capitalize">{row.rarity}</td>
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
            <DialogTitle>
              {editing ? "Edit Achievement" : "Add Achievement"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <FormField id="name" label="Name">
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm((c) => ({ ...c, name: e.target.value }))}
              />
            </FormField>
            <FormField id="slug" label="Slug">
              <Input
                id="slug"
                value={form.slug}
                onChange={(e) => setForm((c) => ({ ...c, slug: e.target.value }))}
              />
            </FormField>
            <FormField id="description" label="Description">
              <Input
                id="description"
                value={form.description ?? ""}
                onChange={(e) =>
                  setForm((c) => ({ ...c, description: e.target.value }))
                }
              />
            </FormField>
            <FormField id="rarity" label="Rarity">
              <select
                id="rarity"
                value={form.rarity ?? "common"}
                onChange={(e) =>
                  setForm((c) => ({
                    ...c,
                    rarity: e.target.value as AchievementRarity,
                  }))
                }
                className="flex h-11 w-full rounded-xl border border-input bg-background px-4 text-body-sm"
              >
                {ACHIEVEMENT_RARITIES.map((rarity) => (
                  <option key={rarity} value={rarity}>
                    {rarity}
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
