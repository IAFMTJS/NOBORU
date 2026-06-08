/**
 * Noboru design tokens — single source of truth for programmatic token access.
 * CSS variables in app/globals.css are authoritative for styling.
 * @see docs/design-system.md
 */

export const colors = {
  mountainRed: "#D64045",
  dark: {
    background: "#0F1115",
    surface: "#171A21",
    card: "#1E232D",
  },
  light: {
    background: "#F7F8FA",
    surface: "#FFFFFF",
    card: "#FFFFFF",
  },
  success: "#2FBF71",
  warning: "#F6AE2D",
  error: "#E63946",
  info: "#3D7DFF",
} as const;

export const spacing = [4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96] as const;

export const radius = {
  sm: "8px",
  md: "16px",
  lg: "24px",
  hero: "32px",
  button: "12px",
} as const;

export const typography = {
  heading: {
    h1: "3rem",
    h2: "2.5rem",
    h3: "2rem",
    h4: "1.5rem",
    h5: "1.25rem",
    h6: "1.125rem",
  },
  body: {
    lg: "1.125rem",
    default: "1rem",
    sm: "0.875rem",
    caption: "0.75rem",
  },
} as const;

export const motion = {
  fast: "150ms",
  standard: "250ms",
  complex: "350ms",
  max: "500ms",
} as const;

export const elevation = {
  0: "none",
  1: "var(--shadow-elevation-1)",
  2: "var(--shadow-elevation-2)",
  3: "var(--shadow-elevation-3)",
  4: "var(--shadow-elevation-4)",
} as const;
