"use client";

import { useEffect } from "react";

import { loadAuthService } from "@/features/authentication/utils/load-auth-service";

/** Warms the auth service chunk during idle time — faster submit without blocking first paint. */
export function AuthServiceWarmup() {
  useEffect(() => {
    const warm = () => {
      void loadAuthService().catch(() => undefined);
    };

    if (typeof requestIdleCallback === "function") {
      const idleId = requestIdleCallback(warm);
      return () => cancelIdleCallback(idleId);
    }

    const timeoutId = setTimeout(warm, 2000);
    return () => clearTimeout(timeoutId);
  }, []);

  return null;
}
