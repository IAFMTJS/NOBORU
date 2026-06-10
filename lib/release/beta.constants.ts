export const BETA_RELEASE = {
  enabled: process.env.NEXT_PUBLIC_BETA_MODE === "true",
  version: process.env.NEXT_PUBLIC_BETA_VERSION ?? "0.24.0-beta",
  label: "Public Beta",
  message:
    "You are using the Noboru public beta. Trail, lessons, audio, and PWA flows are actively being refined.",
} as const;
