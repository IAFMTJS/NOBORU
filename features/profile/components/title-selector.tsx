"use client";

import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TitleViewModel } from "@/features/profile/types/title.types";

export function TitleSelector() {
  const [titles, setTitles] = useState<TitleViewModel[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void fetch("/api/titles")
      .then((r) => r.json())
      .then((payload: { success: boolean; data?: TitleViewModel[] }) => {
        if (payload.success && payload.data) setTitles(payload.data);
      });
  }, []);

  async function equip(titleId: string) {
    setLoading(true);
    try {
      const res = await fetch("/api/titles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titleId }),
      });
      const payload = (await res.json()) as { success: boolean; data?: TitleViewModel[] };
      if (payload.success && payload.data) setTitles(payload.data);
    } finally {
      setLoading(false);
    }
  }

  if (titles.length === 0) return null;

  return (
    <CardSection title="Titles" className="space-y-2">
      {titles.map((title) => (
        <div key={title.id} className="flex items-center justify-between gap-2">
          <div>
            <p className="text-body-sm font-medium">{title.title}</p>
            <p className="text-caption text-muted-foreground">Level {title.level}</p>
          </div>
          {title.equipped ? (
            <Badge variant="secondary">Equipped</Badge>
          ) : (
            <Button
              size="sm"
              variant="outline"
              loading={loading}
              onClick={() => void equip(title.id)}
            >
              Equip
            </Button>
          )}
        </div>
      ))}
    </CardSection>
  );
}

function CardSection({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="mb-2 text-body-sm font-medium">{title}</p>
      {children}
    </div>
  );
}
