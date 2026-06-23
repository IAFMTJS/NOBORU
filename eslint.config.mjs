import { FlatCompat } from "@eslint/eslintrc";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/** ESLint CLI (v9 flat config) — replaces deprecated `next lint`. Scope matches former Next.js lint dirs. */
export default [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "node_modules.bak.*/**",
      "scripts/**",
      "supabase/**",
      "public/**",
      "Art Library/**",
      "assets/**",
      "docs/**",
      "art-direction/**",
      ".cursor/**",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript").map((config) => ({
    ...config,
    files: [
      "app/**/*.{js,jsx,ts,tsx}",
      "components/**/*.{js,jsx,ts,tsx}",
      "features/**/*.{js,jsx,ts,tsx}",
      "lib/**/*.{js,jsx,ts,tsx}",
      "hooks/**/*.{js,jsx,ts,tsx}",
      "middleware.ts",
      "tailwind.config.ts",
      "next.config.ts",
    ],
  })),
  {
    files: ["tailwind.config.ts", "next.config.ts"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
];
