"use client";

import {
  WORLD_TREE_MANIFEST_ANCHORS,
  WORLD_TREE_SKELETON_ZONES,
} from "@/features/journey/constants/world-tree-skeleton.constants";
import { listTrunkRingHubStubs } from "@/features/journey/constants/world-tree-trunk-hubs.constants";
import { buildWorldTreeZoneBands } from "@/features/journey/utils/world-tree-layout.utils";
import { cn } from "@/lib/utils";

type WorldTreeTrunkSkeletonProps = {
  className?: string;
};

const ROOT_ARMS = [
  { rotate: -52, width: 22, offsetX: -18 },
  { rotate: -28, width: 18, offsetX: -8 },
  { rotate: 0, width: 14, offsetX: 0 },
  { rotate: 28, width: 18, offsetX: 8 },
  { rotate: 52, width: 22, offsetX: 18 },
] as const;

/** CSS-only World Tree trunk, roots, rings, and crown — readable skeleton scaffold. */
export function WorldTreeTrunkSkeleton({ className }: WorldTreeTrunkSkeletonProps) {
  const bands = buildWorldTreeZoneBands();
  const hubStubs = listTrunkRingHubStubs(bands);
  const { trunkCenterXPercent, trunkWidthPercent } = WORLD_TREE_MANIFEST_ANCHORS;
  const trunkLeft = trunkCenterXPercent - trunkWidthPercent / 2;
  const innerWidth = trunkWidthPercent * 0.55;

  const ringPositions = WORLD_TREE_SKELETON_ZONES.map((zone) => bands[zone.id]!.yMin).filter(
    (y) => y > 0,
  );

  return (
    <div
      className={cn("pointer-events-none absolute inset-0", className)}
      data-world-tree-trunk-skeleton
      aria-hidden
    >
      {/* Root spread — fans outward from World Heart */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{ bottom: "0.5%", width: "48%", height: "9%" }}
        data-world-tree-roots
      >
        {ROOT_ARMS.map((arm, index) => (
          <span
            key={index}
            className="absolute bottom-0 left-1/2 block origin-bottom rounded-full border-b-[3px] border-[#8B7355]/70 bg-gradient-to-t from-[#6B5344]/35 to-transparent dark:border-[#A0896C]/60 dark:from-[#4A3828]/45"
            style={{
              width: `${arm.width}%`,
              height: `${55 + index * 8}%`,
              transform: `translateX(calc(-50% + ${arm.offsetX}%)) rotate(${arm.rotate}deg)`,
            }}
          />
        ))}
      </div>

      {/* Outer trunk shell — bark mass with crown taper */}
      <div
        className="absolute inset-y-0 overflow-hidden rounded-sm border-x-[3px] border-[#6B5344]/55 bg-gradient-to-b from-[#5C4638]/30 via-[#8B7355]/40 to-[#5C4638]/35 shadow-[inset_0_0_40px_rgba(0,0,0,0.25)] dark:border-[#A0896C]/45 dark:from-[#3A2C22]/50 dark:via-[#6B5344]/55 dark:to-[#3A2C22]/45"
        style={{
          left: `${trunkLeft}%`,
          width: `${trunkWidthPercent}%`,
          clipPath: "polygon(18% 0%, 82% 0%, 100% 100%, 0% 100%)",
        }}
        data-world-tree-trunk-shell
      >
        {/* Bark striations */}
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage: [
              "repeating-linear-gradient(90deg, transparent 0, transparent 7%, rgba(74,56,40,0.35) 7%, rgba(74,56,40,0.35) 8%)",
              "repeating-linear-gradient(180deg, transparent 0, transparent 4%, rgba(0,0,0,0.08) 4%, rgba(0,0,0,0.08) 5%)",
            ].join(", "),
          }}
        />

        {/* Inner trunk channel — stone staircase corridor */}
        <div
          className="absolute inset-y-[1%] left-1/2 -translate-x-1/2 rounded-sm border-x border-[#D6A85F]/25 bg-gradient-to-b from-[#C4A882]/20 via-[#D6A85F]/15 to-[#C4A882]/20 dark:border-[#D6A85F]/20 dark:from-[#8B7355]/25 dark:via-[#D6A85F]/12 dark:to-[#8B7355]/25"
          style={{ width: `${(innerWidth / trunkWidthPercent) * 100}%` }}
          data-world-tree-trunk-channel
        />
      </div>

      {/* Limb buds at trunk ring hubs — aligned with layout fork points */}
      {hubStubs.map((hub) => {
        const side = hub.forkSlot % 2 === 0 ? -1 : 1;
        const length =
          hub.profile === "canopy" ? 14 : hub.profile === "crown" ? 12 : hub.profile === "root" ? 10 : 11;
        const rotate =
          hub.profile === "root"
            ? side * (38 + (hub.forkSlot % 2) * 6)
            : side * (24 + (hub.forkSlot % 3) * 6);

        return (
          <span
            key={hub.hubKey}
            className="absolute left-1/2 block origin-left rounded-full border-b-[2px] border-[#8B7355]/45 bg-gradient-to-r from-[#6B5344]/25 to-transparent dark:border-[#A0896C]/35 dark:from-[#4A3828]/30"
            style={{
              top: `${hub.yPercent}%`,
              width: `${length}%`,
              height: "0.45%",
              transform: `translateX(${side * 10}%) rotate(${rotate}deg)`,
            }}
            data-world-tree-limb-stub
            data-hub-key={hub.hubKey}
          />
        );
      })}

      {/* Trunk rings at zone transitions (N3 rings, root collar, etc.) */}
      {ringPositions.map((yMin) => (
        <div
          key={yMin}
          className="absolute inset-x-0"
          style={{ top: `${yMin}%` }}
          data-world-tree-ring
        >
          <div
            className="absolute -translate-y-1/2 border-y-2 border-[#8B7355]/50 bg-[#6B5344]/10 dark:border-[#A0896C]/40 dark:bg-[#4A3828]/15"
            style={{
              left: `${trunkLeft - 4}%`,
              width: `${trunkWidthPercent + 8}%`,
              height: "0.55%",
            }}
          />
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#D6A85F]/40 bg-[#D6A85F]/15"
            style={{
              left: `${trunkCenterXPercent}%`,
              width: "1.1%",
              height: "1.1%",
            }}
          />
        </div>
      ))}

      {/* Canopy crown marker */}
      <div
        className="absolute left-1/2 flex -translate-x-1/2 flex-col items-center"
        style={{ top: "0.8%" }}
        data-world-tree-crown
      >
        <span className="text-[#D6A85F]/70">✦</span>
        <span className="mt-0.5 text-[9px] font-medium uppercase tracking-widest text-black/30 dark:text-white/25">
          Celestial Spire
        </span>
      </div>
    </div>
  );
}
