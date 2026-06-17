"use client";

import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type DrillRecognitionTimerProps = {
  seconds: number;
  running: boolean;
  enforceTimeout: boolean;
  onExpired: () => void;
  className?: string;
};

export function DrillRecognitionTimer({
  seconds,
  running,
  enforceTimeout,
  onExpired,
  className,
}: DrillRecognitionTimerProps) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    setRemaining(seconds);
  }, [seconds]);

  useEffect(() => {
    if (!running || remaining <= 0) return;

    const timer = window.setInterval(() => {
      setRemaining((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          if (enforceTimeout) onExpired();
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [running, remaining, enforceTimeout, onExpired]);

  if (!running && remaining === seconds) return null;

  return (
    <Badge
      variant={enforceTimeout && remaining <= 5 ? "destructive" : "outline"}
      className={cn("tabular-nums", className)}
    >
      {enforceTimeout ? "Recall" : "Pace"}: {remaining}s
    </Badge>
  );
}
