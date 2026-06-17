#!/usr/bin/env node
/**
 * Materialize Git LFS objects when checkout contains pointer files (Vercel default).
 * Uses GitHub LFS batch API on Vercel; falls back to git lfs pull locally.
 */
import { execSync } from "node:child_process";
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");
const ART_LIBRARY = join(ROOT, "Art Library");
const LFS_POINTER_PREFIX = "version https://git-lfs.github.com/spec/v1";
const BATCH_SIZE = 50;

function run(command) {
  execSync(command, { cwd: ROOT, stdio: "inherit", env: process.env });
}

function runQuiet(command) {
  return execSync(command, { cwd: ROOT, encoding: "utf8", env: process.env }).trim();
}

function tryQuiet(command) {
  try {
    return runQuiet(command);
  } catch {
    return null;
  }
}

function parsePointer(content) {
  const oid = content.match(/^oid (sha256:[a-f0-9]+)$/m)?.[1];
  const size = Number.parseInt(content.match(/^size (\d+)$/m)?.[1] ?? "0", 10);
  if (!oid || !size) return null;
  return { oid, size };
}

function isPointerContent(content) {
  return content.startsWith(LFS_POINTER_PREFIX);
}

function walkPointerFiles(dir, results = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === "_rejected") continue;
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      walkPointerFiles(fullPath, results);
      continue;
    }
    if (!/\.(png|jpg|jpeg|webp)$/i.test(entry)) continue;
    const content = readFileSync(fullPath, { encoding: "utf8" });
    if (isPointerContent(content)) {
      const pointer = parsePointer(content);
      if (pointer) {
        results.push({ ...pointer, path: fullPath });
      }
    }
  }
  return results;
}

function resolveGitHubRepository() {
  const owner = process.env.VERCEL_GIT_REPO_OWNER;
  const slug = process.env.VERCEL_GIT_REPO_SLUG;
  if (owner && slug) {
    return { owner, repo: slug };
  }

  const origin = tryQuiet("git remote get-url origin");
  if (origin) {
    const sshMatch = origin.match(/^git@github\.com:([^/]+)\/(.+?)(?:\.git)?$/);
    if (sshMatch) {
      return { owner: sshMatch[1], repo: sshMatch[2].replace(/\.git$/, "") };
    }
    try {
      const url = new URL(origin);
      const parts = url.pathname.replace(/^\//, "").replace(/\.git$/, "").split("/");
      if (parts.length >= 2) {
        return { owner: parts[0], repo: parts[1] };
      }
    } catch {
      // ignore
    }
  }

  return { owner: "IAFMTJS", repo: "NOBORU" };
}

function githubAuthHeaders() {
  const token =
    process.env.GITHUB_TOKEN ??
    process.env.GH_TOKEN ??
    process.env.VERCEL_GIT_ACCESS_TOKEN;
  return token
    ? {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.git-lfs+json",
        "Content-Type": "application/vnd.git-lfs+json",
      }
    : {
        Accept: "application/vnd.git-lfs+json",
        "Content-Type": "application/vnd.git-lfs+json",
      };
}

async function downloadBatch(owner, repo, batch) {
  const endpoint = `https://github.com/${owner}/${repo}.git/info/lfs/objects/batch`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: githubAuthHeaders(),
    body: JSON.stringify({
      operation: "download",
      transfers: ["basic"],
      objects: batch.map(({ oid, size }) => ({ oid, size })),
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `GitHub LFS batch request failed (${response.status}): ${body.slice(0, 300)}`,
    );
  }

  const payload = await response.json();
  const actionsByOid = new Map(
    (payload.objects ?? []).map((object) => [object.oid, object.actions?.download]),
  );

  for (const item of batch) {
    const action = actionsByOid.get(item.oid);
    if (!action?.href) {
      throw new Error(`Missing LFS download action for ${relative(ROOT, item.path)} (${item.oid})`);
    }

    const fileResponse = await fetch(action.href, {
      headers: action.header ?? {},
    });
    if (!fileResponse.ok) {
      throw new Error(
        `Failed to download ${relative(ROOT, item.path)} (${fileResponse.status})`,
      );
    }

    const bytes = Buffer.from(await fileResponse.arrayBuffer());
    if (bytes.length !== item.size) {
      throw new Error(
        `Size mismatch for ${relative(ROOT, item.path)}: expected ${item.size}, got ${bytes.length}`,
      );
    }
    writeFileSync(item.path, bytes);
  }
}

async function materializeViaGitHubApi(pointers) {
  const { owner, repo } = resolveGitHubRepository();
  console.log(`Materializing ${pointers.length} LFS files via GitHub API (${owner}/${repo})...`);

  for (let index = 0; index < pointers.length; index += BATCH_SIZE) {
    const batch = pointers.slice(index, index + BATCH_SIZE);
    await downloadBatch(owner, repo, batch);
    console.log(
      `Downloaded ${Math.min(index + BATCH_SIZE, pointers.length)}/${pointers.length} LFS files`,
    );
  }
}

function materializeViaGitLfsPull() {
  console.log("Materializing Git LFS objects via git lfs pull...");

  try {
    runQuiet("git lfs version");
  } catch {
    throw new Error("git-lfs is unavailable on the build machine.");
  }

  run("git lfs install --local");

  let originUrl = tryQuiet("git remote get-url origin");
  if (!originUrl) {
    const { owner, repo } = resolveGitHubRepository();
    originUrl = `https://github.com/${owner}/${repo}.git`;
    run(`git remote add origin "${originUrl}"`);
  }

  const lfsUrl = originUrl.startsWith("git@github.com:")
    ? `https://github.com/${originUrl.slice("git@github.com:".length).replace(/\.git$/, "")}.git/info/lfs`
    : `${originUrl.replace(/\.git$/, "")}.git/info/lfs`;

  run(`git config lfs.url "${lfsUrl}"`);

  const branch = process.env.VERCEL_GIT_COMMIT_REF ?? "main";
  run(`git lfs pull origin ${branch}`);
}

async function materializeGitLfsObjects() {
  const pointers = walkPointerFiles(ART_LIBRARY);
  if (pointers.length === 0) {
    return;
  }

  console.log(`Art Library contains ${pointers.length} LFS pointer files.`);

  if (process.env.VERCEL === "1" || !tryQuiet("git remote get-url origin")) {
    await materializeViaGitHubApi(pointers);
  } else {
    materializeViaGitLfsPull();
  }

  const remaining = walkPointerFiles(ART_LIBRARY);
  if (remaining.length > 0) {
    throw new Error(
      `${remaining.length} Art Library files are still LFS pointers. Enable Git LFS in Vercel project settings or add GITHUB_TOKEN for private repos.`,
    );
  }

  console.log("Git LFS objects materialized for Art Library.");
}

materializeGitLfsObjects().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
});
