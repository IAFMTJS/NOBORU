import { describe, expect, it } from "vitest";

import {
  resolveWorldTreeNodeAriaLabel,
  resolveWorldTreeNodeOpacity,
} from "@/features/journey/utils/world-tree-node-visual.utils";

describe("world tree node visual utils", () => {
  it("keeps the current node fully opaque", () => {
    expect(resolveWorldTreeNodeOpacity("completed", true)).toBe(1);
    expect(resolveWorldTreeNodeOpacity("locked", true)).toBe(1);
  });

  it("dims completed and locked nodes", () => {
    expect(resolveWorldTreeNodeOpacity("completed", false)).toBe(0.55);
    expect(resolveWorldTreeNodeOpacity("locked", false)).toBe(0.38);
  });

  it("labels the current node for assistive tech", () => {
    expect(
      resolveWorldTreeNodeAriaLabel({
        label: "食べる",
        state: "available",
        isCurrent: true,
      }),
    ).toBe("Next lesson: 食べる");
  });
});
