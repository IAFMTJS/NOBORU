"use client";

import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FEEDBACK_CATEGORY_LABELS,
  FEEDBACK_STATUS_LABELS,
} from "@/features/feedback/constants/feedback.constants";
import type {
  FeedbackListEntryViewModel,
  FeedbackStatus,
} from "@/features/feedback/types/feedback.types";

export function FeedbackManager() {
  const [items, setItems] = useState<FeedbackListEntryViewModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/feedback");
      const payload = (await response.json()) as {
        feedback?: FeedbackListEntryViewModel[];
        error?: string;
      };
      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to load feedback.");
      }
      setItems(payload.feedback ?? []);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to load feedback.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function updateStatus(id: string, status: FeedbackStatus) {
    setUpdatingId(id);
    setError(null);
    try {
      const response = await fetch("/api/admin/feedback", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to update feedback.");
      }
      await load();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to update feedback.");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-heading-5">Beta Feedback</h1>
        <p className="text-body-sm text-muted-foreground">
          Review public beta submissions for trail, lesson, audio, and PWA issues.
        </p>
      </div>

      {error ? (
        <p className="text-caption text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="text-body-sm text-muted-foreground">Loading feedback…</p>
      ) : items.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-heading-6">No feedback yet</CardTitle>
          </CardHeader>
        </Card>
      ) : (
        items.map((item) => (
          <Card key={item.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-heading-6">
                {FEEDBACK_CATEGORY_LABELS[item.category]}
              </CardTitle>
              <p className="text-caption text-muted-foreground">
                {new Date(item.createdAt).toLocaleString()} ·{" "}
                {FEEDBACK_STATUS_LABELS[item.status]}
                {item.rating ? ` · ${item.rating}/5` : ""}
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="whitespace-pre-wrap text-body-sm">{item.message}</p>
              {item.route ? (
                <p className="text-caption text-muted-foreground">Route: {item.route}</p>
              ) : null}
              <div className="flex flex-wrap gap-2">
                {(["new", "reviewed", "resolved"] as FeedbackStatus[]).map((status) => (
                  <Button
                    key={status}
                    size="sm"
                    variant={item.status === status ? "default" : "outline"}
                    loading={updatingId === item.id}
                    disabled={item.status === status}
                    onClick={() => void updateStatus(item.id, status)}
                  >
                    {FEEDBACK_STATUS_LABELS[status]}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
