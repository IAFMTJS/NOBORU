import { redirect } from "next/navigation";

import { AUTH_ROUTES } from "@/features/authentication/constants/auth.constants";
import { SettingsScreen } from "@/features/settings/components/settings-screen";
import { settingsServerService } from "@/features/settings/services/settings-server.service";

export default async function SettingsPage() {
  const settings = await settingsServerService.getSettings();

  if (!settings) {
    redirect(AUTH_ROUTES.login);
  }

  return <SettingsScreen settings={settings} />;
}
