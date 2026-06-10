export const RELEASE = {
  version: process.env.NEXT_PUBLIC_APP_VERSION ?? "1.0.0",
  name: "Noboru",
  tagline: "Your climb. Your language. Your journey.",
  isBeta: process.env.NEXT_PUBLIC_BETA_MODE === "true",
  betaVersion: process.env.NEXT_PUBLIC_BETA_VERSION ?? "0.24.0-beta",
  launchedAt: process.env.NEXT_PUBLIC_LAUNCH_DATE ?? "2026-06-08",
} as const;

export const OFFICIAL_RELEASE = {
  label: "Official Release",
  message: "Noboru 1.0 — climb from Foothills through N5 with trail lessons, reviews, and offline support.",
} as const;
