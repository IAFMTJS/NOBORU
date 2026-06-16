/**
 * Unified viewport / safe-area contract for mobile-first mockup parity.
 */

export const VISUAL_SHELL = {
  navHeightRem: 5.5,
  hudHeightRem: 3.25,
  phoneMaxWidth: "32rem",
  contentHeightClass: "h-content",
  minContentHeightClass: "min-h-content",
  navClearancePaddingClass: "pb-nav-clearance",
  safeBottomClass: "pb-safe-bottom",
} as const;

export const VISUAL_SHELL_CSS_VARS = {
  appHeight: "--app-height",
  safeTop: "--safe-top",
  safeBottom: "--safe-bottom",
  navHeight: "--nav-height",
  navClearance: "--nav-clearance",
  hudHeight: "--hud-height",
  contentHeight: "--content-height",
  phoneMaxWidth: "--phone-max-width",
} as const;
