"use client";

import { useEffect, useRef, useState } from "react";

import { PrototypeHeading } from "@/features/prototype/components/prototype-typography";
import { ArtLibraryImage } from "@/features/prototype/components/art-library-image";
import {
  PrototypeGlassButton,
  PrototypeGlassChip,
  PrototypeGlassPanel,
  prototypeGlass,
} from "@/features/prototype/components/prototype-glass-panel";
import { PrototypeWorldTreeStack } from "@/features/prototype/components/prototype-world-tree-stack";
import {
  MOCK_JOURNEY_NODES,
  MOCK_PLAYER,
  type MockLessonNode,
} from "@/features/prototype/constants/mock-data";
import { cn } from "@/lib/utils";

const NODE_SIZE: Record<MockLessonNode["state"], number> = {
  completed: 52,
  in_progress: 68,
  available: 56,
  locked: 44,
};

const NODE_GLOW: Record<MockLessonNode["state"], string> = {
  locked: "opacity-45 grayscale",
  available: "trail-glow-warning",
  in_progress: "trail-glow-warm",
  completed: "trail-glow-success",
};

function PrototypeHud({ onRegionClick }: { onRegionClick: () => void }) {
  return (
    <PrototypeGlassPanel
      variant="hud"
      className="pointer-events-auto absolute inset-x-3 top-3 z-30 flex items-center gap-1.5 px-2 py-1.5"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-caption font-semibold text-primary backdrop-blur-sm">
        {MOCK_PLAYER.displayName.charAt(0)}
      </span>
      <button
        type="button"
        onClick={onRegionClick}
        className={cn(prototypeGlass.chip, "focus-ring mx-auto max-w-[48%] px-2.5 py-1")}
      >
        <PrototypeHeading as="h2" size="card" className="truncate uppercase sm:text-body-sm">
          {MOCK_PLAYER.regionName}
        </PrototypeHeading>
      </button>
      <div className="ml-auto flex shrink-0 items-center gap-1">
        <p className="text-caption text-muted-foreground">Lv {MOCK_PLAYER.level}</p>
        <PrototypeGlassChip>
          <ArtLibraryImage themedBase="icons/icon_ui_flame_streak" src="" alt="" width={13} height={13} />
          {MOCK_PLAYER.streak}
        </PrototypeGlassChip>
        <PrototypeGlassChip className="text-violet-700">
          <ArtLibraryImage themedBase="icons/icon_ui_gem" src="" alt="" width={13} height={13} />
          {MOCK_PLAYER.gems}
        </PrototypeGlassChip>
      </div>
    </PrototypeGlassPanel>
  );
}

function PrototypeNode({
  node,
  selected,
  onSelect,
}: {
  node: MockLessonNode;
  selected: boolean;
  onSelect: () => void;
}) {
  const size = NODE_SIZE[node.state];

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "focus-ring absolute -translate-x-1/2 -translate-y-1/2",
        selected && "z-20",
      )}
      style={{ left: `${node.xPercent}%`, top: `${node.yPercent}%` }}
      aria-label={node.label}
    >
      <span
        className={cn(
          "relative inline-flex items-center justify-center rounded-full border border-white/55 bg-white/50 p-0.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] backdrop-blur-md",
          node.state === "in_progress" && "ring-2 ring-primary/35 ring-offset-1 ring-offset-transparent",
          selected && "scale-110",
        )}
      >
        <ArtLibraryImage
          themedBase={node.iconBase}
          src=""
          alt=""
          width={size}
          height={size}
          className={cn("rounded-full drop-shadow-md transition-all", NODE_GLOW[node.state])}
        />
      </span>
    </button>
  );
}

export function PrototypeJourneyTab() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState<string>("n3");
  const selected = MOCK_JOURNEY_NODES.find((n) => n.id === selectedId) ?? MOCK_JOURNEY_NODES[2];
  const focusNode = MOCK_JOURNEY_NODES.find((n) => n.state === "in_progress") ?? selected;

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    // Journey starts at the roots — scroll to bottom on first paint.
    container.scrollTop = container.scrollHeight - container.clientHeight;

    const focusY = (focusNode.yPercent / 100) * container.scrollHeight;
    const targetTop = focusY - container.clientHeight * 0.55;
    container.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
  }, [focusNode.yPercent]);

  return (
    <div className="relative z-10 h-full min-h-0 overflow-hidden bg-[#E9E1D0]">
      <div
        ref={scrollRef}
        className="absolute inset-0 overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]"
      >
        <div className="relative mx-auto w-full min-w-full max-w-phone">
          <PrototypeWorldTreeStack />

          <div className="pointer-events-none absolute inset-0">
            <div className="pointer-events-auto relative h-full w-full min-h-full">
              {MOCK_JOURNEY_NODES.map((node) => (
                <PrototypeNode
                  key={node.id}
                  node={node}
                  selected={node.id === selectedId}
                  onSelect={() => setSelectedId(node.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <PrototypeHud onRegionClick={() => undefined} />

      {selected ? (
        <PrototypeGlassPanel
          variant="sheet"
          className="pointer-events-auto absolute inset-x-0 bottom-0 z-40 border-x-0 pb-[calc(var(--nav-clearance)+0.75rem)]"
        >
          <div className="mb-3 flex items-start gap-3">
            <ArtLibraryImage
              themedBase={selected.iconBase}
              src=""
              alt=""
              width={48}
              height={48}
              className="shrink-0 drop-shadow-md"
            />
            <div className="min-w-0 flex-1">
              <PrototypeHeading as="h3" size="card">
                {selected.label}
              </PrototypeHeading>
              <p className="text-body-sm text-muted-foreground">{selected.subtitle}</p>
              <p className="mt-1 text-caption uppercase tracking-wide text-trail-glow">
                {selected.state.replace("_", " ")}
              </p>
            </div>
          </div>
          <PrototypeGlassButton disabled={selected.state === "locked"}>
            {selected.state === "locked" ? "Complete previous lesson" : "Continue climb"}
          </PrototypeGlassButton>
        </PrototypeGlassPanel>
      ) : null}
    </div>
  );
}
