"use client";

import {
  WORLD_TREE_JLPT_BANDS,
  buildWorldTreeJlptBandLayout,
} from "@/features/journey/constants/world-tree-jlpt-band.constants";
import { cn } from "@/lib/utils";

type WorldTreeRealmBackdropProps = {
  className?: string;
  /** Use five JLPT band atmosphere gradients (tree overview). */
  useJlptBands?: boolean;
};

const JLPT_ATMOSPHERE: Record<
  string,
  { light: { bottom: string; mid: string; top: string }; dark: { bottom: string; mid: string; top: string } }
> = {
  n5: {
    light: { bottom: "#8B4A42", mid: "#C9786A", top: "#E9C4BC" },
    dark: { bottom: "#1A0E12", mid: "#3D2228", top: "#5C3038" },
  },
  n4: {
    light: { bottom: "#8B6B2E", mid: "#C9A04A", top: "#F0DCA0" },
    dark: { bottom: "#141008", mid: "#2A2210", top: "#3D3218" },
  },
  n3: {
    light: { bottom: "#3D6B3A", mid: "#6B9A62", top: "#B8D4B0" },
    dark: { bottom: "#0A120A", mid: "#142014", top: "#1E301E" },
  },
  n2: {
    light: { bottom: "#3A6B8B", mid: "#6A9FC4", top: "#B8D8F0" },
    dark: { bottom: "#081018", mid: "#102030", top: "#183048" },
  },
  n1: {
    light: { bottom: "#5A4A8B", mid: "#8B72C4", top: "#D4C8F0" },
    dark: { bottom: "#0A0814", mid: "#141028", top: "#201840" },
  },
};

/** Sky atmosphere bands — JLPT hero layout on tree overview, legacy realms otherwise. */
export function WorldTreeRealmBackdrop({
  className,
  useJlptBands = false,
}: WorldTreeRealmBackdropProps) {
  const jlptBands = buildWorldTreeJlptBandLayout();

  if (useJlptBands) {
    return (
      <div
        className={cn("pointer-events-none absolute inset-0", className)}
        data-world-tree-realm-backdrop="jlpt"
        aria-hidden
      >
        {WORLD_TREE_JLPT_BANDS.map((band) => {
          const layout = jlptBands.find((entry) => entry.id === band.id)!;
          const height = layout.yMax - layout.yMin;
          const atmosphere = JLPT_ATMOSPHERE[band.id]!;

          return (
            <div key={band.id}>
              <div
                className="absolute inset-x-0 dark:hidden"
                style={{
                  top: `${layout.yMin}%`,
                  height: `${height}%`,
                  background: `linear-gradient(to top, ${atmosphere.light.bottom}, ${atmosphere.light.mid} 45%, ${atmosphere.light.top})`,
                  opacity: 0.5,
                }}
                data-jlpt-atmosphere={band.id}
              />
              <div
                className="absolute inset-x-0 hidden dark:block"
                style={{
                  top: `${layout.yMin}%`,
                  height: `${height}%`,
                  background: `linear-gradient(to top, ${atmosphere.dark.bottom}, ${atmosphere.dark.mid} 45%, ${atmosphere.dark.top})`,
                  opacity: 0.62,
                }}
                data-jlpt-atmosphere={`${band.id}-dark`}
              />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 bg-gradient-to-t from-[#2a1838] via-[#9fd4f0] to-[#e8f4fc] opacity-40 dark:from-[#080510] dark:via-[#131D2D] dark:to-[#0D1320] dark:opacity-55", className)}
      data-world-tree-realm-backdrop="default"
      aria-hidden
    />
  );
}
