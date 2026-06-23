import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { isNavActive, resolveNavTabFromPath } from "@/lib/navigation/is-nav-active";
import { PRIMARY_NAV_ITEMS } from "@/lib/navigation/primary-nav";

describe("world tree route", () => {
  it("registers the /tree N5 journey canvas page", () => {
    const page = readFileSync(resolve(process.cwd(), "app/(app)/tree/page.tsx"), "utf8");
    expect(page).toContain("N5WorldScreen");
    expect(page).toContain("getJourneyPathWithContext");
    expect(page).not.toContain("WorldTreeScreen");
  });

  it("includes Journey in primary navigation", () => {
    const treeItem = PRIMARY_NAV_ITEMS.find((item) => item.href === "/tree");
    expect(treeItem?.label).toBe("Journey");
    expect(treeItem?.navTab).toBe("tree");
  });

  it("does not include a separate Journey tab", () => {
    expect(PRIMARY_NAV_ITEMS.some((item) => item.href === "/learn")).toBe(false);
  });

  it("highlights Tree tab on /tree routes", () => {
    expect(isNavActive("/tree", "/tree")).toBe(true);
    expect(isNavActive("/worlds/n5", "/tree")).toBe(true);
    expect(isNavActive("/learn/lesson/1", "/tree")).toBe(true);
    expect(resolveNavTabFromPath("/tree")).toBe("tree");
    expect(resolveNavTabFromPath("/worlds/n5")).toBe("tree");
  });
});

describe("isNavActive", () => {
  it("highlights the exact tab route", () => {
    expect(isNavActive("/camp", "/camp")).toBe(true);
    expect(isNavActive("/home", "/camp")).toBe(true);
    expect(isNavActive("/learn/lesson/1", "/tree")).toBe(true);
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

  it("highlights Tree for trail routes", () => {
    expect(isNavActive("/trials/foothills", "/tree")).toBe(true);
    expect(isNavActive("/learn/world", "/tree")).toBe(true);
    expect(isNavActive("/explore", "/tree")).toBe(true);
  });

  it("highlights Profile for identity routes", () => {
    expect(isNavActive("/settings", "/profile")).toBe(true);
    expect(isNavActive("/achievements", "/profile")).toBe(true);
  });

  it("does not highlight unrelated tabs", () => {
    expect(isNavActive("/games", "/tree")).toBe(false);
    expect(isNavActive("/profile", "/bag")).toBe(false);
    expect(isNavActive("/review", "/tree")).toBe(false);
    expect(isNavActive("/learn/hiragana", "/tree")).toBe(false);
    expect(isNavActive("/learn/hiragana", "/study")).toBe(true);
    expect(isNavActive("/learn/world", "/study")).toBe(false);
  });
});

describe("resolveNavTabFromPath", () => {
  it("resolves the primary tab for nested routes", () => {
    expect(resolveNavTabFromPath("/review")).toBe("study");
    expect(resolveNavTabFromPath("/bag")).toBe("bag");
    expect(resolveNavTabFromPath("/learn/lesson/1")).toBe("tree");
    expect(resolveNavTabFromPath("/camp")).toBe("camp");
    expect(resolveNavTabFromPath("/tree")).toBe("tree");
  });
});
