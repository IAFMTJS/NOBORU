"use client";

import type { ContentStatus } from "@/lib/content/types";
import { cn } from "@/lib/utils";
import { CONTENT_STATUSES } from "@/lib/content/types";

const STATUS_LABELS: Record<ContentStatus, string> = {
  draft: "Draft",
  review: "Review",
  approved: "Approved",
  published: "Published",
  archived: "Archived",
};

type ContentStatusBadgeProps = {
  status: ContentStatus;
  className?: string;
};

export function ContentStatusBadge({ status, className }: ContentStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-caption font-medium capitalize",
        status === "published" && "bg-success/15 text-success",
        status === "draft" && "bg-muted text-muted-foreground",
        status === "review" && "bg-warning/15 text-warning",
        status === "approved" && "bg-info/15 text-info",
        status === "archived" && "bg-destructive/10 text-destructive",
        className,
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

type ContentStatusSelectProps = {
  value: ContentStatus;
  onChange: (value: ContentStatus) => void;
  id?: string;
};

export function ContentStatusSelect({
  value,
  onChange,
  id = "status",
}: ContentStatusSelectProps) {
  return (
    <select
      id={id}
      value={value}
      onChange={(event) => onChange(event.target.value as ContentStatus)}
      className="flex h-11 w-full rounded-xl border border-input bg-background px-4 text-body-sm"
    >
      {CONTENT_STATUSES.map((status) => (
        <option key={status} value={status}>
          {STATUS_LABELS[status]}
        </option>
      ))}
    </select>
  );
}
