"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ServiceWorkerUpdateBannerProps = {
  className?: string;
};

export function ServiceWorkerUpdateBanner({
  className,
}: ServiceWorkerUpdateBannerProps) {
  const [waitingWorker, setWaitingWorker] =
    useState<ServiceWorker | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const onControllerChange = () => {
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);

    void navigator.serviceWorker.ready.then((registration) => {
      if (registration.waiting) {
        setWaitingWorker(registration.waiting);
      }

      registration.addEventListener("updatefound", () => {
        const installing = registration.installing;
        if (!installing) return;

        installing.addEventListener("statechange", () => {
          if (
            installing.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            setWaitingWorker(registration.waiting);
          }
        });
      });
    });

    const onFocus = () => {
      void navigator.serviceWorker.ready.then((registration) => {
        void registration.update();
      });
    };

    window.addEventListener("focus", onFocus);

    return () => {
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        onControllerChange,
      );
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  if (!waitingWorker || dismissed) return null;

  function handleRefresh() {
    waitingWorker?.postMessage({ type: "SKIP_WAITING" });
  }

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 border-b border-primary/30 bg-primary/10 px-4 py-2 text-body-sm",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <span>Update available — refresh to get the latest Noboru.</span>
      <div className="flex shrink-0 gap-2">
        <Button size="sm" onClick={handleRefresh}>
          Refresh
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setDismissed(true)}>
          Later
        </Button>
      </div>
    </div>
  );
}
