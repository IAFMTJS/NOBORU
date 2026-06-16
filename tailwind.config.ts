import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        surface: "hsl(var(--surface))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        trail: {
          glow: "hsl(var(--trail-glow))",
        },
        heading: {
          story: "hsl(var(--heading-story))",
        },
        reward: {
          DEFAULT: "hsl(var(--reward))",
        },
        xp: {
          gold: "hsl(var(--xp-gold))",
        },
        glass: {
          bg: "hsl(var(--glass-bg))",
          border: "hsl(var(--glass-border))",
        },
        mountain: {
          red: "#D64045",
        },
      },
      spacing: {
        1: "4px",
        2: "8px",
        3: "12px",
        4: "16px",
        6: "24px",
        8: "32px",
        10: "40px",
        12: "48px",
        16: "64px",
        20: "80px",
        24: "96px",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
        card: "var(--radius-card)",
        hero: "var(--radius-hero)",
        nav: "var(--nav-radius)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        japanese: ["var(--font-noto-sans-jp)", "var(--font-inter)", "system-ui", "sans-serif"],
        story: ["var(--font-story)", "Georgia", "serif"],
      },
      boxShadow: {
        "trail-glow": "0 0 14px hsl(var(--trail-glow) / 0.45)",
        "nav-active": "0 0 20px hsl(var(--trail-glow) / 0.35)",
      },
      height: {
        content: "var(--content-height)",
        nav: "var(--nav-height)",
        app: "var(--app-height)",
      },
      minHeight: {
        content: "var(--content-height)",
        nav: "var(--nav-height)",
        app: "var(--app-height)",
      },
      maxWidth: {
        phone: "var(--phone-max-width)",
      },
      fontSize: {
        "heading-1": ["3rem", { lineHeight: "1.1", fontWeight: "600" }],
        "heading-2": ["2.5rem", { lineHeight: "1.15", fontWeight: "600" }],
        "heading-3": ["2rem", { lineHeight: "1.2", fontWeight: "600" }],
        "heading-4": ["1.5rem", { lineHeight: "1.25", fontWeight: "600" }],
        "heading-5": ["1.25rem", { lineHeight: "1.3", fontWeight: "600" }],
        "heading-6": ["1.125rem", { lineHeight: "1.35", fontWeight: "600" }],
        "body-lg": ["1.125rem", { lineHeight: "1.6" }],
        body: ["1rem", { lineHeight: "1.6" }],
        "body-sm": ["0.875rem", { lineHeight: "1.5" }],
        caption: ["0.75rem", { lineHeight: "1.4" }],
      },
      transitionDuration: {
        fast: "var(--motion-fast)",
        standard: "var(--motion-standard)",
        complex: "var(--motion-complex)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        spin: {
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        spin: "spin 1s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
