"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BETA_RELEASE } from "@/lib/release/beta.constants";

export function BetaBanner() {
  if (!BETA_RELEASE.enabled) return null;

  return (
    <div className="border-b border-primary/20 bg-primary/5 px-4 py-3">
      <div className="mx-auto flex max-w-lg flex-wrap items-center justify-between gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{BETA_RELEASE.label}</Badge>
            <span className="text-caption text-muted-foreground">
              v{BETA_RELEASE.version}
            </span>
          </div>
          <p className="text-caption text-muted-foreground">{BETA_RELEASE.message}</p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/feedback">Send feedback</Link>
        </Button>
      </div>
    </div>
  );
}
