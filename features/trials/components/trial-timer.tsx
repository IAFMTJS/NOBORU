"use client";

import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type TrialTimerProps = {
  timeLimitSeconds: number | null;
  running: boolean;
  onExpired: () => void;
};

export function TrialTimer({
  timeLimitSeconds,
  running,
  onExpired,
}: TrialTimerProps) {
  const [remaining, setRemaining] = useState(timeLimitSeconds ?? 0);

  useEffect(() => {
    setRemaining(timeLimitSeconds ?? 0);
  }, [timeLimitSeconds]);

  useEffect(() => {
    if (!running || !timeLimitSeconds || remaining <= 0) return;

    const timer = window.setInterval(() => {
      setRemaining((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          onExpired();
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [running, timeLimitSeconds, remaining, onExpired]);

  if (!timeLimitSeconds) return null;

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const lowTime = remaining <= 30;

  return (
    <Badge
      variant={lowTime ? "destructive" : "outline"}
      className={cn("font-mono", lowTime && "animate-pulse motion-reduce:animate-none")}
    >
      {minutes}:{seconds.toString().padStart(2, "0")}
    </Badge>
  );
}
