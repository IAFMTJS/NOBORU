import { describe, expect, it } from "vitest";

import { isNavActive } from "@/lib/navigation/is-nav-active";

describe("isNavActive", () => {
  it("highlights the exact tab route", () => {
    expect(isNavActive("/home", "/home")).toBe(true);
    expect(isNavActive("/learn/lesson/1", "/learn")).toBe(true);
  });

  it("highlights Explore for child routes", () => {
    expect(isNavActive("/games", "/explore")).toBe(true);
    expect(isNavActive("/games/word-match", "/explore")).toBe(true);
    expect(isNavActive("/community", "/explore")).toBe(true);
    expect(isNavActive("/trials/foothills", "/explore")).toBe(true);
  });

  it("does not highlight unrelated tabs", () => {
    expect(isNavActive("/games", "/learn")).toBe(false);
    expect(isNavActive("/profile", "/explore")).toBe(false);
  });
});
