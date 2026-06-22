/**
 * Invisible spine slots — reserve path geometry for future lessons, side paths, and seasonal nodes.
 * Art authors use the full slot map (visible + reserved); learners only see visible nodes.
 *
 * Reserved slots use fixed pathPositionHint anchors — they do NOT compress visible node spacing.
 * @see docs/JWorld/12-n5-art-and-node-placement.md
 */

export type N5ReservedNodePurpose =
  | "side_path"
  | "seasonal"
  | "expansion"
  | "junction";

export type N5ReservedNodeAnchor =
  | { type: "after_landmark"; landmarkSlug: string }
  | { type: "before_landmark"; landmarkSlug: string };

export type N5ReservedNodeSlot = {
  id: string;
  label: string;
  purpose: N5ReservedNodePurpose;
  anchor: N5ReservedNodeAnchor;
  /** Fixed spine position for art / greybox (0–1 along path). */
  pathPositionHint: number;
  branchId?: string;
};

/** Ordered registry — insertion order matters when multiple slots share an anchor. */
export const N5_RESERVED_NODE_SLOTS: readonly N5ReservedNodeSlot[] = [
  {
    id: "n5-reserved-act1-expansion",
    label: "Act I expansion slot",
    purpose: "expansion",
    anchor: { type: "before_landmark", landmarkSlug: "kana-bridge" },
    pathPositionHint: 0.22,
  },
  {
    id: "n5-reserved-greeting-quarter",
    label: "Greeting Quarter",
    purpose: "side_path",
    anchor: { type: "after_landmark", landmarkSlug: "lantern-hamlet" },
    pathPositionHint: 0.392,
    branchId: "hamlet-greeting",
  },
  {
    id: "n5-reserved-food-stall-row",
    label: "Food Stall Row",
    purpose: "side_path",
    anchor: { type: "after_landmark", landmarkSlug: "lantern-hamlet" },
    pathPositionHint: 0.404,
    branchId: "hamlet-food",
  },
  {
    id: "n5-reserved-home-hearth-lane",
    label: "Home Hearth Lane",
    purpose: "side_path",
    anchor: { type: "after_landmark", landmarkSlug: "market-bend" },
    pathPositionHint: 0.518,
    branchId: "hamlet-home",
  },
  {
    id: "n5-reserved-seasonal-act2",
    label: "Act II seasonal event",
    purpose: "seasonal",
    anchor: { type: "before_landmark", landmarkSlug: "forest-torii" },
    pathPositionHint: 0.602,
    branchId: "seasonal",
  },
  {
    id: "n5-reserved-hamlet-return",
    label: "Hamlet return junction",
    purpose: "junction",
    anchor: { type: "before_landmark", landmarkSlug: "forest-torii" },
    pathPositionHint: 0.614,
    branchId: "hamlet-return",
  },
  {
    id: "n5-reserved-expansion-act3",
    label: "Act III expansion slot",
    purpose: "expansion",
    anchor: { type: "after_landmark", landmarkSlug: "kanji-grove" },
    pathPositionHint: 0.742,
  },
  {
    id: "n5-reserved-seasonal-act3",
    label: "Act III seasonal event",
    purpose: "seasonal",
    anchor: { type: "before_landmark", landmarkSlug: "first-slope-shrine" },
    pathPositionHint: 0.822,
    branchId: "seasonal",
  },
  {
    id: "n5-reserved-pre-gate-buffer",
    label: "Pre-gate expansion slot",
    purpose: "expansion",
    anchor: { type: "after_landmark", landmarkSlug: "first-slope-shrine" },
    pathPositionHint: 0.872,
  },
] as const;
