"use client";

import Link from "next/link";
import { useMemo } from "react";

import { PageContainer } from "@/components/layout/page-container";
import { ScreenHeader } from "@/components/layout/screen-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListRow } from "@/components/ui/list-row";
import {
  AUTH_MESSAGES,
  AUTH_ROUTES,
} from "@/features/authentication/constants/auth.constants";
import { useLogout } from "@/features/authentication/hooks/use-logout";
import { OfflineSyncPanel } from "@/features/offline/components/offline-sync-panel";
import { PwaInstallPrompt } from "@/features/offline/components/pwa-install-prompt";
import { BETA_RELEASE } from "@/lib/release/beta.constants";
import { OFFICIAL_RELEASE, RELEASE } from "@/lib/release/release.constants";
import { ThemeSelector } from "@/features/settings/components/theme-selector";
import { useThemeSetting } from "@/features/settings/hooks/use-theme-setting";
import type { SettingsViewModel } from "@/features/settings/types/settings.types";
import { YamaPresence } from "@/features/yama/components/yama-presence";
import { yamaService } from "@/features/yama/services/yama.service";
import { ChevronLeft } from "lucide-react";

type SettingsScreenProps = {
  settings: SettingsViewModel;
  userId: string;
};

export function SettingsScreen({ settings, userId }: SettingsScreenProps) {
  const { theme, updateTheme, loading, error } = useThemeSetting(
    settings.theme,
  );
  const { logout, loading: logoutLoading, error: logoutError } = useLogout();
  const yama = useMemo(() => yamaService.resolveProfilePresence(), []);

  return (
    <PageContainer>
      <ScreenHeader
        title="Settings"
        action={
          <Link
            href="/profile"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border"
            aria-label="Back to profile"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
        }
      />

      <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card shadow-elevation-1">
        <CardContent className="p-4">
          <YamaPresence
            presence={yama}
            size="sm"
            layout="horizontal"
            bubbleClassName="border-primary/20 bg-card/80"
          />
        </CardContent>
      </Card>

      <PwaInstallPrompt />
      <OfflineSyncPanel userId={userId} />

      <Card className="shadow-elevation-1">
        <CardHeader>
          <CardTitle className="text-heading-6">Support</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ListRow
            primary="Send feedback"
            secondary="Report bugs, trail UX, audio, or PWA issues"
            onClick={() => {
              window.location.href = "/feedback";
            }}
          />
          {BETA_RELEASE.enabled ? (
            <p className="text-caption text-muted-foreground">
              Public beta {BETA_RELEASE.version}
            </p>
          ) : null}
        </CardContent>
      </Card>

      <Card className="shadow-elevation-1">
        <CardHeader>
          <CardTitle className="text-heading-6">About</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <ListRow
            primary={RELEASE.name}
            secondary={
              BETA_RELEASE.enabled
                ? `Beta ${BETA_RELEASE.version}`
                : `${OFFICIAL_RELEASE.label} v${RELEASE.version}`
            }
          />
          <ListRow primary="Launch date" secondary={RELEASE.launchedAt} />
        </CardContent>
      </Card>

      <Card className="shadow-elevation-1">
        <CardHeader>
          <CardTitle className="text-heading-6">Appearance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <p className="text-body-sm font-medium">Theme</p>
            <p className="text-caption">
              Mountain Dawn, Mountain Night, or match your device
            </p>
            <ThemeSelector
              value={theme}
              onChange={updateTheme}
              disabled={loading}
            />
          </div>
          {error ? (
            <p className="text-caption text-destructive" role="alert">
              {error}
            </p>
          ) : null}
        </CardContent>
      </Card>

      <Card className="shadow-elevation-1">
        <CardHeader>
          <CardTitle className="text-heading-6">Study</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <ListRow
            primary="Daily goal"
            secondary={`${settings.dailyGoalMinutes} min`}
          />
          <ListRow
            primary="Notifications"
            secondary={settings.notificationsEnabled ? "Enabled" : "Disabled"}
          />
          <ListRow
            primary="Sound"
            secondary={settings.soundEnabled ? "Enabled" : "Disabled"}
          />
        </CardContent>
      </Card>

      <Card className="shadow-elevation-1">
        <CardHeader>
          <CardTitle className="text-heading-6">Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ListRow primary="Email" secondary={settings.email} />
          <ListRow
            primary="Change password"
            secondary="Reset via email link"
            onClick={() => {
              window.location.href = AUTH_ROUTES.forgotPassword;
            }}
          />
          {logoutError ? (
            <p className="text-caption text-destructive" role="alert">
              {logoutError}
            </p>
          ) : null}
          <Button
            variant="destructive"
            className="w-full"
            loading={logoutLoading}
            onClick={() => void logout()}
          >
            {logoutLoading ? AUTH_MESSAGES.signOutLoading : AUTH_MESSAGES.signOut}
          </Button>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
