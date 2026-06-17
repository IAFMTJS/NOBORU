#!/usr/bin/env node
/**
 * Materialize Git LFS objects when a checkout contains pointer files (common on Vercel
 * unless Project Settings → Git → Git Large File Storage is enabled).
 */
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");
const LFS_POINTER_PREFIX = "version https://git-lfs.github.com/spec/v1";

const SAMPLE_FILES = [
  "Art Library/icons/icon_nav_journey_mountain_dark_v1.png",
  "Art Library/backgrounds/trail/bg_trail_dark_v1.png",
  "Art Library/characters/kitsune/base/kitsune_standing_traveler_dark_v1.png",
];

function run(command) {
  execSync(command, { cwd: ROOT, stdio: "inherit", env: process.env });
}

function runQuiet(command) {
  return execSync(command, { cwd: ROOT, encoding: "utf8", env: process.env }).trim();
}

function isPointerFile(relativePath) {
  try {
    const head = readFileSync(join(ROOT, relativePath), { encoding: "utf8" }).slice(0, 80);
    return head.startsWith(LFS_POINTER_PREFIX);
  } catch {
    return false;
  }
}

function hasArtLibraryPointers() {
  const existing = SAMPLE_FILES.filter((path) => {
    try {
      readFileSync(join(ROOT, path));
      return true;
    } catch {
      return false;
    }
  });
  if (existing.length === 0) return false;
  return existing.some(isPointerFile);
}

function resolveLfsUrl(originUrl) {
  if (!originUrl) return null;

  if (originUrl.startsWith("git@github.com:")) {
    const slug = originUrl.slice("git@github.com:".length).replace(/\.git$/, "");
    return `https://github.com/${slug}.git/info/lfs`;
  }

  try {
    const url = new URL(originUrl);
    const pathname = url.pathname.replace(/\/$/, "").replace(/\.git$/, "");
    return `${url.protocol}//${url.host}${pathname}.git/info/lfs`;
  } catch {
    return null;
  }
}

function materializeGitLfsObjects() {
  if (!hasArtLibraryPointers()) {
    return;
  }

  console.log("Art Library contains LFS pointers — materializing Git LFS objects...");

  try {
    runQuiet("git lfs version");
  } catch {
    throw new Error(
      "git-lfs is unavailable on the build machine. Enable Git LFS in Vercel project settings.",
    );
  }

  run("git lfs install --local");

  const originUrl = runQuiet("git remote get-url origin");
  const lfsUrl = resolveLfsUrl(originUrl);
  if (lfsUrl) {
    run(`git config lfs.url "${lfsUrl}"`);
  }

  const branch = process.env.VERCEL_GIT_COMMIT_REF ?? "main";
  run(`git lfs pull origin ${branch}`);

  if (hasArtLibraryPointers()) {
    throw new Error(
      "Art Library still contains LFS pointer files after git lfs pull. Enable Git LFS in Vercel: Project Settings → Git → Git Large File Storage.",
    );
  }

  console.log("Git LFS objects materialized for Art Library.");
}

try {
  materializeGitLfsObjects();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
}
