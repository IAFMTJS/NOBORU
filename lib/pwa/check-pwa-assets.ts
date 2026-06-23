import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import {
  PWA_ICONS_DIR,
  PWA_MANIFEST_PATH,
  PWA_REQUIRED_ICON_FILES,
  PWA_REQUIRED_SPLASH_FILES,
  PWA_SERVICE_WORKER_PATH,
} from "@/lib/pwa/required-assets";

export type PwaAssetCheckResult = {
  ok: boolean;
  missing: string[];
  detail?: string;
};

export function checkPwaAssets(): PwaAssetCheckResult {
  const missing: string[] = [];

  const requiredPaths = [
    PWA_MANIFEST_PATH,
    PWA_SERVICE_WORKER_PATH,
    ...PWA_REQUIRED_ICON_FILES.map((file) => `${PWA_ICONS_DIR}/${file}`),
    ...PWA_REQUIRED_SPLASH_FILES.map((file) => `${PWA_ICONS_DIR}/${file}`),
  ];

  for (const relative of requiredPaths) {
    const absolute = join(process.cwd(), relative);
    if (!existsSync(absolute)) {
      missing.push(relative);
    }
  }

  if (missing.length === 0) {
    try {
      const manifestRaw = readFileSync(
        join(process.cwd(), PWA_MANIFEST_PATH),
        "utf8",
      );
      const manifest = JSON.parse(manifestRaw) as {
        icons?: unknown[];
        display?: string;
        start_url?: string;
      };
      if (!Array.isArray(manifest.icons) || manifest.icons.length < 2) {
        return {
          ok: false,
          missing: [],
          detail: "manifest.json must include at least two icons.",
        };
      }
      if (manifest.display !== "standalone") {
        return {
          ok: false,
          missing: [],
          detail: 'manifest.json display must be "standalone".',
        };
      }
      if (!manifest.start_url) {
        return {
          ok: false,
          missing: [],
          detail: "manifest.json must define start_url.",
        };
      }
    } catch (error) {
      return {
        ok: false,
        missing: [],
        detail:
          error instanceof Error ? error.message : "Invalid manifest.json.",
      };
    }
  }

  return {
    ok: missing.length === 0,
    missing,
    detail:
      missing.length > 0
        ? `Missing PWA assets: ${missing.join(", ")}`
        : undefined,
  };
}
