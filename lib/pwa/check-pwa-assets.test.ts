import { describe, expect, it } from "vitest";

import { checkPwaAssets } from "@/lib/pwa/check-pwa-assets";

describe("checkPwaAssets", () => {
  it("passes when manifest, service worker, icons, and splash screens exist", () => {
    const result = checkPwaAssets();
    expect(result.ok).toBe(true);
    expect(result.missing).toEqual([]);
  });
});
