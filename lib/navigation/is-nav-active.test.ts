import { describe, expect, it } from "vitest";

import { isNavActive } from "@/lib/navigation/is-nav-active";

describe("isNavActive", () => {
  it("highlights the exact tab route", () => {
    expect(isNavActive("/camp", "/camp")).toBe(true);
    expect(isNavActive("/home", "/camp")).toBe(true);
    expect(isNavActive("/learn/lesson/1", "/learn")).toBe(true);
  });

  it("highlights World for child routes", () => {
    expect(isNavActive("/games", "/world")).toBe(true);
    expect(isNavActive("/games/word-match", "/world")).toBe(true);
    expect(isNavActive("/community", "/world")).toBe(true);
    expect(isNavActive("/trials/foothills", "/world")).toBe(true);
    expect(isNavActive("/achievements", "/world")).toBe(true);
    expect(isNavActive("/learn/world", "/world")).toBe(true);
    expect(isNavActive("/world/fox-camp", "/world")).toBe(true);
  });

  it("highlights Dojo for training routes", () => {
    expect(isNavActive("/review", "/dojo")).toBe(true);
    expect(isNavActive("/learn/hiragana", "/dojo")).toBe(true);
    expect(isNavActive("/learn/vocabulary/word-1", "/dojo")).toBe(true);
  });

  it("does not highlight unrelated tabs", () => {
    expect(isNavActive("/games", "/learn")).toBe(false);
    expect(isNavActive("/profile", "/world")).toBe(false);
    expect(isNavActive("/review", "/learn")).toBe(false);
    expect(isNavActive("/learn/hiragana", "/learn")).toBe(false);
    expect(isNavActive("/learn/hiragana", "/dojo")).toBe(true);
    expect(isNavActive("/learn/world", "/learn")).toBe(false);
  });
});
