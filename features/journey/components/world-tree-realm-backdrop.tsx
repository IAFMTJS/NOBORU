"use client";

import {
  WORLD_TREE_REALMS,
  buildWorldTreeRealmBands,
} from "@/features/journey/constants/world-tree-full-ascent.constants";
import { cn } from "@/lib/utils";

type WorldTreeRealmBackdropProps = {
  className?: string;
};

/** CSS-only realm atmosphere bands — art tiles attach later. */
export function WorldTreeRealmBackdrop({ className }: WorldTreeRealmBackdropProps) {
  const bands = buildWorldTreeRealmBands();

  return (
    <div
      className={cn("pointer-events-none absolute inset-0", className)}
      data-world-tree-realm-backdrop
      aria-hidden
    >
      {WORLD_TREE_REALMS.map((realm) => {
        const band = bands[realm.id];
        const height = band.yMax - band.yMin;

        return (
          <div
            key={realm.id}
            className="absolute inset-x-0 dark:hidden"
            style={{
              top: `${band.yMin}%`,
              height: `${height}%`,
              background: `linear-gradient(to top, ${realm.atmosphere.light.bottom}, ${realm.atmosphere.light.mid} 45%, ${realm.atmosphere.light.top})`,
              opacity: 0.55,
            }}
            data-world-tree-realm={realm.id}
          />
        );
      })}

      {WORLD_TREE_REALMS.map((realm) => {
        const band = bands[realm.id];
        const height = band.yMax - band.yMin;

        return (
          <div
            key={`${realm.id}-dark`}
            className="absolute inset-x-0 hidden dark:block"
            style={{
              top: `${band.yMin}%`,
              height: `${height}%`,
              background: `linear-gradient(to top, ${realm.atmosphere.dark.bottom}, ${realm.atmosphere.dark.mid} 45%, ${realm.atmosphere.dark.top})`,
              opacity: 0.65,
            }}
            data-world-tree-realm={realm.id}
          />
        );
      })}
    </div>
  );
}
