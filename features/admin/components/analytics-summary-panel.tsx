"use client";

import { useCallback, useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AnalyticsSummaryEntry } from "@/features/analytics/repositories/analytics.repository";

export function AnalyticsSummaryPanel() {
  const [summary, setSummary] = useState<AnalyticsSummaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/analytics");
      const payload = (await response.json()) as {
        summary?: AnalyticsSummaryEntry[];
        error?: string;
      };
      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to load analytics summary.");
      }
      setSummary(payload.summary ?? []);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to load analytics summary.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-heading-6">Product Analytics (7 days)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <p className="text-body-sm text-muted-foreground">Loading event counts…</p>
        ) : null}
        {error ? (
          <p className="text-caption text-destructive" role="alert">
            {error}
          </p>
        ) : null}
        {!loading && summary.length === 0 ? (
          <p className="text-body-sm text-muted-foreground">No events recorded yet.</p>
        ) : null}
        {summary.map((entry) => (
          <div
            key={entry.name}
            className="flex items-center justify-between rounded-xl border border-border px-3 py-2"
          >
            <span className="text-body-sm">{entry.name}</span>
            <span className="text-body-sm font-medium">{entry.count.toLocaleString()}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
