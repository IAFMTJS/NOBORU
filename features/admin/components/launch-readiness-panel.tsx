"use client";

import { useCallback, useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LaunchCheckResult } from "@/lib/release/launch-readiness";
import { OFFICIAL_RELEASE, RELEASE } from "@/lib/release/release.constants";

type LaunchReadinessReport = {
  ready: boolean;
  passed: number;
  total: number;
  checks: LaunchCheckResult[];
};

export function LaunchReadinessPanel() {
  const [report, setReport] = useState<LaunchReadinessReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/launch-readiness");
      const payload = (await response.json()) as LaunchReadinessReport & { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to load launch readiness.");
      }
      setReport(payload);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to load launch readiness.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle className="text-heading-6">Launch Readiness</CardTitle>
            <p className="text-body-sm text-muted-foreground">
              Official release v{RELEASE.version} · {OFFICIAL_RELEASE.label}
            </p>
          </div>
          {report ? (
            <Badge variant={report.ready ? "default" : "secondary"}>
              {report.ready ? "Ready to launch" : `${report.passed}/${report.total} checks passing`}
            </Badge>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <p className="text-body-sm text-muted-foreground">Checking launch criteria…</p>
        ) : null}
        {error ? (
          <p className="text-caption text-destructive" role="alert">
            {error}
          </p>
        ) : null}
        {report?.checks.map((check) => (
          <div
            key={check.id}
            className="flex items-start justify-between gap-3 rounded-xl border border-border p-3"
          >
            <div>
              <p className="text-body-sm font-medium">{check.label}</p>
              <p className="text-caption text-muted-foreground">{check.description}</p>
              {check.detail ? (
                <p className="mt-1 text-caption text-muted-foreground">{check.detail}</p>
              ) : null}
            </div>
            <Badge variant={check.status === "pass" ? "default" : "destructive"}>
              {check.status}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
