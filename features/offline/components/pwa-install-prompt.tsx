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
import {
  isStandalonePwa,
  shouldShowIosInstallPrompt,
  shouldShowNativeInstallPrompt,
} from "@/lib/pwa/install-detection";
import { preloadJapaneseSpeechVoices } from "@/lib/audio/japanese-speech";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    if (isStandalonePwa()) {
      setInstalled(true);
      return;
    }

    const dismissedAt = window.localStorage.getItem("noboru-pwa-dismissed");
    if (dismissedAt) setDismissed(true);

    setShowIosGuide(shouldShowIosInstallPrompt());

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

  const showNativePrompt = shouldShowNativeInstallPrompt(Boolean(deferredPrompt));

  if (installed || dismissed || (!showNativePrompt && !showIosGuide)) {
    return null;
  }

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      setDeferredPrompt(null);
      void analyticsService.track({ name: "pwa_install_prompt_accepted" });
      void preloadJapaneseSpeechVoices();
    } else {
      void analyticsService.track({ name: "pwa_install_prompt_dismissed" });
    }
  }

  function handleDismiss() {
    window.localStorage.setItem("noboru-pwa-dismissed", new Date().toISOString());
    setDismissed(true);
    void analyticsService.track({ name: "pwa_install_prompt_dismissed" });
  }

  if (showIosGuide && !showNativePrompt) {
    return (
      <Card className="border-primary/20 shadow-elevation-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-heading-6">Install Noboru on iPhone</CardTitle>
          <CardDescription>
            Add Noboru to your Home Screen for full-screen lessons, offline study,
            and reliable Japanese audio in standalone mode.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <ol className="list-decimal space-y-1 pl-5 text-body-sm text-muted-foreground">
            <li>Tap the Share button in Safari (square with arrow).</li>
            <li>Scroll down and choose <strong>Add to Home Screen</strong>.</li>
            <li>Open Noboru from your Home Screen before starting listening drills.</li>
          </ol>
          <div className="flex gap-2">
            <Button className="flex-1" onClick={handleDismiss}>
              Got it
            </Button>
            <Button variant="ghost" onClick={handleDismiss}>
              Not now
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 shadow-elevation-1">
      <CardHeader className="pb-3">
        <CardTitle className="text-heading-6">Install Noboru</CardTitle>
        <CardDescription>
          Add Noboru to your home screen for a standalone climbing companion with
          offline lessons and Japanese audio.
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
