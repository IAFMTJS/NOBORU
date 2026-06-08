"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ThemePreference } from "@/features/settings/types/settings.types";

const THEME_OPTIONS: Array<{ value: ThemePreference; label: string }> = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

type ThemeSelectorProps = {
  value: ThemePreference;
  onChange: (theme: ThemePreference) => void;
  disabled?: boolean;
};

export function ThemeSelector({ value, onChange, disabled }: ThemeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Theme">
      {THEME_OPTIONS.map((option) => (
        <Button
          key={option.value}
          type="button"
          size="sm"
          variant={value === option.value ? "default" : "outline"}
          disabled={disabled}
          className={cn(value === option.value && "pointer-events-none")}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}
