import { describe, expect, it } from "vitest";

import { isNavActive, resolveNavTabFromPath } from "@/lib/navigation/is-nav-active";

describe("isNavActive", () => {
  it("highlights the exact tab route", () => {
    expect(isNavActive("/learn", "/learn")).toBe(true);
    expect(isNavActive("/camp", "/camp")).toBe(true);
    expect(isNavActive("/home", "/camp")).toBe(true);
    expect(isNavActive("/learn/lesson/1", "/learn")).toBe(true);
  });

  it("highlights Study for training routes", () => {
    expect(isNavActive("/study", "/study")).toBe(true);
    expect(isNavActive("/dojo", "/study")).toBe(true);
    expect(isNavActive("/review", "/study")).toBe(true);
    expect(isNavActive("/learn/hiragana", "/study")).toBe(true);
    expect(isNavActive("/learn/vocabulary/word-1", "/study")).toBe(true);
    expect(isNavActive("/games", "/study")).toBe(true);
  });

  it("highlights Bag for inventory routes", () => {
    expect(isNavActive("/bag", "/bag")).toBe(true);
    expect(isNavActive("/world/inventory", "/bag")).toBe(true);
  });

  it("highlights Camp for homebase routes", () => {
    expect(isNavActive("/world/shop", "/camp")).toBe(true);
    expect(isNavActive("/community", "/camp")).toBe(true);
  });

  it("highlights Journey for trail routes", () => {
    expect(isNavActive("/trials/foothills", "/learn")).toBe(true);
    expect(isNavActive("/learn/world", "/learn")).toBe(true);
  });

  it("highlights Profile for identity routes", () => {
    expect(isNavActive("/settings", "/profile")).toBe(true);
    expect(isNavActive("/achievements", "/profile")).toBe(true);
  });

  it("does not highlight unrelated tabs", () => {
    expect(isNavActive("/games", "/learn")).toBe(false);
    expect(isNavActive("/profile", "/bag")).toBe(false);
    expect(isNavActive("/review", "/learn")).toBe(false);
    expect(isNavActive("/learn/hiragana", "/learn")).toBe(false);
    expect(isNavActive("/learn/hiragana", "/study")).toBe(true);
    expect(isNavActive("/learn/world", "/study")).toBe(false);
  });
});

describe("resolveNavTabFromPath", () => {
  it("resolves the primary tab for nested routes", () => {
    expect(resolveNavTabFromPath("/review")).toBe("study");
    expect(resolveNavTabFromPath("/bag")).toBe("bag");
    expect(resolveNavTabFromPath("/learn/lesson/1")).toBe("journey");
    expect(resolveNavTabFromPath("/camp")).toBe("camp");
  });
});
