"use client";

import { useEffect, useState } from "react";

import { analyticsService } from "@/features/analytics/services/analytics.service";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setInstalled(true);
      return;
    }

    const dismissedAt = window.localStorage.getItem("noboru-pwa-dismissed");
    if (dismissedAt) setDismissed(true);

    function handleBeforeInstall(event: Event) {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    }

    function handleInstalled() {
      setInstalled(true);
      setDeferredPrompt(null);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  if (installed || dismissed || !deferredPrompt) return null;

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      setDeferredPrompt(null);
      void analyticsService.track({ name: "pwa_install_prompt_accepted" });
    } else {
      void analyticsService.track({ name: "pwa_install_prompt_dismissed" });
    }
  }

  function handleDismiss() {
    window.localStorage.setItem("noboru-pwa-dismissed", new Date().toISOString());
    setDismissed(true);
    void analyticsService.track({ name: "pwa_install_prompt_dismissed" });
  }

  return (
    <Card className="border-primary/20 shadow-elevation-1">
      <CardHeader className="pb-3">
        <CardTitle className="text-heading-6">Install Noboru</CardTitle>
        <CardDescription>
          Add Noboru to your home screen for a standalone climbing companion.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex gap-2">
        <Button className="flex-1" onClick={() => void handleInstall()}>
          Install App
        </Button>
        <Button variant="ghost" onClick={handleDismiss}>
          Not now
        </Button>
      </CardContent>
    </Card>
  );
}
