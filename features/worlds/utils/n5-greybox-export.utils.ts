import contract from "@/lib/design-system/journey-path-contracts.json";
import {
  getJourneyPathSpine,
  JOURNEY_SCROLL_ART_HEIGHT,
  JOURNEY_SCROLL_ART_WIDTH,
} from "@/lib/design-system/journey-path-contracts";

import { buildN5GreyboxRegion } from "@/features/worlds/data/n5-greybox-journey.fixture";
import {
  N5_ACT_BANDS,
  N5_WORLD_TITLE,
} from "@/features/worlds/constants/n5-world.constants";
import {
  resolveN5FullSpineSlotMap,
  resolveN5LayoutScrollMinHeightVh,
  type N5SpineSlotMapEntry,
} from "@/features/worlds/utils/n5-world-layout.utils";

import layoutSpec from "../../../scripts/art-direction/n5-world-layout.json";

export const N5_GREYBOX_EXPORT_WIDTH = JOURNEY_SCROLL_ART_WIDTH;
export const N5_GREYBOX_EXPORT_HEIGHT = JOURNEY_SCROLL_ART_HEIGHT;

export type N5GreyboxExportDocument = {
  version: 1;
  world: "n5";
  title: string;
  generatedAt: string;
  canvas: {
    width: number;
    height: number;
    scrollMinHeightVh: number;
    coordinateSystem: string;
  };
  acts: typeof layoutSpec.acts;
  heroZones: typeof layoutSpec.heroZones;
  reservedSlots: typeof layoutSpec.reservedSlots;
  spine: {
    dark: ReturnType<typeof getJourneyPathSpine>;
    light: ReturnType<typeof getJourneyPathSpine>;
  };
  slots: N5SpineSlotMapEntry[];
  stats: {
    visibleSlots: number;
    reservedSlots: number;
    totalSpineSlots: number;
    lessonNodes: number;
    landmarkNodes: number;
    trialNodes: number;
    checkpointNodes: number;
  };
};

function pctToPx(x: number, y: number, width: number, height: number) {
  return {
    x: (x / 100) * width,
    y: (y / 100) * height,
  };
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function spineToSvgPath(
  spine: ReadonlyArray<{ x: number; y: number }>,
  width: number,
  height: number,
): string {
  if (spine.length === 0) return "";
  const points = spine.map((point) => pctToPx(point.x, point.y, width, height));
  const [first, ...rest] = points;
  return `M ${first!.x.toFixed(1)} ${first!.y.toFixed(1)} ${rest
    .map((point) => `L ${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
    .join(" ")}`;
}

function nodeRadius(entry: N5SpineSlotMapEntry): number {
  if (entry.kind === "reserved") return 14;
  if (entry.label.includes("Trial") || entry.label.includes("Guardian") || entry.label.includes("Sentinel") || entry.label.includes("Warden")) {
    return 22;
  }
  if (entry.id.startsWith("greybox-landmark")) return 18;
  return 16;
}

function nodeFill(entry: N5SpineSlotMapEntry): string {
  if (entry.kind === "reserved") return "none";
  if (entry.id.includes("trial")) return "#C96B3D";
  if (entry.id.includes("landmark")) return "#D6A85F";
  if (entry.id.includes("checkpoint")) return "#8A7B5A";
  return "#7B8D5A";
}

function nodeStroke(entry: N5SpineSlotMapEntry): string {
  if (entry.kind === "reserved") {
    if (entry.purpose === "side_path") return "#73A7D6";
    if (entry.purpose === "seasonal") return "#B48AD6";
    if (entry.purpose === "junction") return "#D6A85F";
    return "#9AA3B2";
  }
  return "#F4E8D0";
}

function actBandRect(
  act: (typeof N5_ACT_BANDS)[number],
  width: number,
  height: number,
): { y: number; h: number; fill: string; label: string } {
  const yTop = pctToPx(50, act.yEnd, width, height).y;
  const yBottom = pctToPx(50, act.yStart, width, height).y;
  const fills: Record<1 | 2 | 3, string> = {
    1: "#2a2238",
    2: "#243828",
    3: "#354858",
  };
  return {
    y: yTop,
    h: Math.max(0, yBottom - yTop),
    fill: fills[act.actIndex],
    label: `Act ${act.actIndex}`,
  };
}

export function buildN5GreyboxExportDocument(
  theme: "dark" | "light" = "dark",
): N5GreyboxExportDocument {
  const region = buildN5GreyboxRegion();
  const slots = resolveN5FullSpineSlotMap(region.nodes, { theme });
  const visibleSlots = slots.filter((entry) => entry.kind === "visible");
  const reservedSlots = slots.filter((entry) => entry.kind === "reserved");
  const scrollMinHeightVh = resolveN5LayoutScrollMinHeightVh(
    region.nodes.length,
    { theme },
  );

  return {
    version: 1,
    world: "n5",
    title: N5_WORLD_TITLE,
    generatedAt: new Date().toISOString(),
    canvas: {
      width: N5_GREYBOX_EXPORT_WIDTH,
      height: N5_GREYBOX_EXPORT_HEIGHT,
      scrollMinHeightVh,
      coordinateSystem: contract.coordinateSystem,
    },
    acts: layoutSpec.acts,
    heroZones: layoutSpec.heroZones,
    reservedSlots: layoutSpec.reservedSlots,
    spine: {
      dark: [...getJourneyPathSpine("n5", { theme: "dark" })],
      light: [...getJourneyPathSpine("n5", { theme: "light" })],
    },
    slots,
    stats: {
      visibleSlots: visibleSlots.length,
      reservedSlots: reservedSlots.length,
      totalSpineSlots: slots.length,
      lessonNodes: visibleSlots.filter((entry) => entry.id.includes("lesson")).length,
      landmarkNodes: visibleSlots.filter((entry) => entry.id.includes("landmark")).length,
      trialNodes: visibleSlots.filter((entry) => entry.id.includes("trial")).length,
      checkpointNodes: visibleSlots.filter((entry) => entry.id.includes("checkpoint")).length,
    },
  };
}

export function renderN5GreyboxSvg(
  document: N5GreyboxExportDocument,
  theme: "dark" | "light" = "dark",
): string {
  const width = N5_GREYBOX_EXPORT_WIDTH;
  const height = N5_GREYBOX_EXPORT_HEIGHT;
  const spine = document.spine[theme];
  const pathD = spineToSvgPath(spine, width, height);

  const actBands = N5_ACT_BANDS.map((act) => actBandRect(act, width, height))
    .map(
      (band) => `
        <rect x="0" y="${band.y.toFixed(1)}" width="${width}" height="${band.h.toFixed(1)}" fill="${band.fill}" opacity="0.92"/>
        <text x="48" y="${(band.y + 48).toFixed(1)}" fill="#E8DFD0" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="700">${band.label}</text>
      `,
    )
    .join("");

  const heroZones = document.heroZones
    .map((zone) => {
      const point = pctToPx(zone.anchor.x, zone.anchor.y, width, height);
      return `
        <rect x="${(point.x - 36).toFixed(1)}" y="${(point.y - 12).toFixed(1)}" width="72" height="24" rx="12" fill="#00000055"/>
        <text x="${point.x.toFixed(1)}" y="${(point.y + 5).toFixed(1)}" text-anchor="middle" fill="#F4E8D0" font-family="Inter, Arial, sans-serif" font-size="14">${escapeXml(zone.id)}</text>
      `;
    })
    .join("");

  const slotMarkers = document.slots
    .map((entry) => {
      const point = pctToPx(entry.x, entry.y, width, height);
      const radius = nodeRadius(entry);
      const fill = nodeFill(entry);
      const stroke = nodeStroke(entry);
      const dash = entry.kind === "reserved" ? 'stroke-dasharray="6 6"' : "";
      const labelY = point.y - radius - 8;
      const shortLabel =
        entry.kind === "reserved"
          ? entry.label.replace(" slot", "").replace("Act ", "A")
          : entry.label.length > 22
            ? `${entry.label.slice(0, 20)}…`
            : entry.label;

      return `
        <g>
          <circle class="greybox-slot" cx="${point.x.toFixed(1)}" cy="${point.y.toFixed(1)}" r="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="3" ${dash}/>
          <text x="${point.x.toFixed(1)}" y="${labelY.toFixed(1)}" text-anchor="middle" fill="${entry.kind === "reserved" ? stroke : "#F4E8D0"}" font-family="Inter, Arial, sans-serif" font-size="12">${escapeXml(shortLabel)}</text>
        </g>
      `;
    })
    .join("");

  const legend = `
    <rect x="40" y="40" width="360" height="168" rx="16" fill="#00000088"/>
    <text x="64" y="76" fill="#F4E8D0" font-family="Inter, Arial, sans-serif" font-size="20" font-weight="700">N5 Greybox</text>
    <circle cx="76" cy="104" r="8" fill="#7B8D5A" stroke="#F4E8D0" stroke-width="2"/><text x="96" y="109" fill="#E8DFD0" font-size="14" font-family="Inter, Arial, sans-serif">Lesson</text>
    <circle cx="196" cy="104" r="8" fill="#D6A85F" stroke="#F4E8D0" stroke-width="2"/><text x="216" y="109" fill="#E8DFD0" font-size="14" font-family="Inter, Arial, sans-serif">Landmark</text>
    <circle cx="76" cy="132" r="8" fill="#C96B3D" stroke="#F4E8D0" stroke-width="2"/><text x="96" y="137" fill="#E8DFD0" font-size="14" font-family="Inter, Arial, sans-serif">Trial</text>
    <circle cx="196" cy="132" r="8" fill="none" stroke="#73A7D6" stroke-width="2" stroke-dasharray="4 4"/><text x="216" y="137" fill="#E8DFD0" font-size="14" font-family="Inter, Arial, sans-serif">Reserved</text>
    <text x="64" y="176" fill="#B9B2A8" font-size="13" font-family="Inter, Arial, sans-serif">${document.stats.totalSpineSlots} spine slots · ${document.canvas.scrollMinHeightVh}vh scroll · ${width}×${height}px</text>
  `;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="#14121C"/>
  ${actBands}
  <path d="${pathD}" fill="none" stroke="#D6A85F" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" opacity="0.35"/>
  <path d="${pathD}" fill="none" stroke="#D6A85F" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="10 16" opacity="0.8"/>
  ${heroZones}
  ${slotMarkers}
  ${legend}
</svg>`;
}
