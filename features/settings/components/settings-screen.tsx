"use client";

import Link from "next/link";

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
import { ThemeSelector } from "@/features/settings/components/theme-selector";
import { useThemeSetting } from "@/features/settings/hooks/use-theme-setting";
import type { SettingsViewModel } from "@/features/settings/types/settings.types";
import { ChevronLeft } from "lucide-react";

type SettingsScreenProps = {
  settings: SettingsViewModel;
};

export function SettingsScreen({ settings }: SettingsScreenProps) {
  const { theme, updateTheme, loading, error } = useThemeSetting(
    settings.theme,
  );
  const { logout, loading: logoutLoading, error: logoutError } = useLogout();

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
