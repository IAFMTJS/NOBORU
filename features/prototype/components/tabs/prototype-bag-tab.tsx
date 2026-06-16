"use client";

import { PrototypeHeading } from "@/features/prototype/components/prototype-typography";
import { ArtLibraryImage } from "@/features/prototype/components/art-library-image";
import {
  PrototypeGlassButton,
  PrototypeGlassCard,
  PrototypeGlassCardButton,
  PrototypeGlassChip,
  PrototypeGlassPanel,
} from "@/features/prototype/components/prototype-glass-panel";
import { PrototypeTabScene } from "@/features/prototype/components/prototype-viewport-background";
import { MOCK_BAG_ITEMS, MOCK_PLAYER } from "@/features/prototype/constants/mock-data";
import { cn } from "@/lib/utils";

const RARITY_RING: Record<(typeof MOCK_BAG_ITEMS)[number]["rarity"], string> = {
  common: "border-white/55",
  uncommon: "border-emerald-400/45",
  rare: "border-violet-400/50",
};

export function PrototypeBagTab() {
  return (
    <PrototypeTabScene className="flex flex-col gap-4 p-4 pb-nav-clearance">
        <PrototypeGlassPanel variant="hud" className="flex items-center justify-between px-3 py-2">
          <div>
            <PrototypeHeading as="h2">Bag</PrototypeHeading>
            <p className="text-caption text-muted-foreground">{MOCK_BAG_ITEMS.length} items · mock</p>
          </div>
          <PrototypeGlassChip className="tabular-nums">
            <ArtLibraryImage themedBase="icons/icon_ui_gem" src="" alt="" width={14} height={14} />
            {MOCK_PLAYER.gems}
          </PrototypeGlassChip>
        </PrototypeGlassPanel>

        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {MOCK_BAG_ITEMS.map((item) => (
            <PrototypeGlassCardButton
              key={item.id}
              padding="sm"
              className={cn("gap-1.5", RARITY_RING[item.rarity])}
            >
              <ArtLibraryImage
                themedBase={item.iconBase}
                src=""
                alt=""
                width={52}
                height={52}
                className="drop-shadow-md"
              />
              <span className="line-clamp-1 w-full text-center text-[10px] font-medium">
                {item.name}
              </span>
              <span className="text-[10px] tabular-nums text-muted-foreground">×{item.qty}</span>
            </PrototypeGlassCardButton>
          ))}
        </div>

        <PrototypeGlassPanel variant="card">
          <p className="text-body-sm text-muted-foreground">
            Inventory uses props from Art Library — lacquer pouch layout per doc 08.
          </p>
          <PrototypeGlassButton className="mt-3">Open shop</PrototypeGlassButton>
        </PrototypeGlassPanel>
    </PrototypeTabScene>
  );
}
