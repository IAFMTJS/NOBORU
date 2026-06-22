import { describe, expect, it } from "vitest";

import { buildN5GreyboxNodes } from "@/features/worlds/data/n5-greybox-journey.fixture";
import {
  buildN5GreyboxExportDocument,
  renderN5GreyboxSvg,
} from "@/features/worlds/utils/n5-greybox-export.utils";
import { N5_RESERVED_NODE_SLOTS } from "@/features/worlds/constants/n5-reserved-nodes.constants";
import { resolveN5FullSpineSlotMap } from "@/features/worlds/utils/n5-world-layout.utils";

describe("n5-greybox export", () => {
  it("builds a full spine with all landmark anchors represented", () => {
    const nodes = buildN5GreyboxNodes();
    const landmarkLabels = nodes
      .filter((node) => node.kind === "landmark")
      .map((node) => node.label);

    expect(nodes.length).toBeGreaterThan(40);
    expect(landmarkLabels).toContain("Lantern Hamlet");
    expect(landmarkLabels).toContain("Forest Torii");
    expect(landmarkLabels).toContain("First Slope Shrine");
  });

  it("includes reserved slots in the export document", () => {
    const document = buildN5GreyboxExportDocument("dark");
    const slotMap = resolveN5FullSpineSlotMap(buildN5GreyboxNodes());

    expect(document.stats.reservedSlots).toBe(N5_RESERVED_NODE_SLOTS.length);
    expect(document.stats.totalSpineSlots).toBe(slotMap.length);
    expect(document.slots.some((entry) => entry.kind === "reserved")).toBe(true);
    expect(document.heroZones.length).toBeGreaterThanOrEqual(8);
  });

  it("renders an SVG greybox with spine and slot markers", () => {
    const document = buildN5GreyboxExportDocument("dark");
    const svg = renderN5GreyboxSvg(document, "dark");

    expect(svg).toContain("<svg");
    expect(svg).toContain("N5 Greybox");
    expect(svg).toContain('stroke-dasharray="6 6"');
    expect(svg.match(/class="greybox-slot"/g)?.length ?? 0).toBe(
      document.stats.totalSpineSlots,
    );
  });
});
