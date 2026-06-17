/**
 * Queue a Noboru SD 1.5 generation via ComfyUI API (bypasses UI workflow load issues).
 *
 * Usage:
 *   node scripts/art-direction/comfyui-generate.mjs
 *   node scripts/art-direction/comfyui-generate.mjs "your positive prompt here"
 *
 * Requires ComfyUI running at http://127.0.0.1:8188
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
const API_WORKFLOW = join(ROOT, "scripts/art-direction/comfyui-sd15-noboru.api.json");
const SERVER = "http://127.0.0.1:8188";

const promptText = process.argv.slice(2).join(" ").trim();

const workflow = JSON.parse(readFileSync(API_WORKFLOW, "utf8"));

if (promptText) {
  workflow["4"].inputs.text = promptText;
}

const body = JSON.stringify({ prompt: workflow });

const res = await fetch(`${SERVER}/prompt`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body,
});

if (!res.ok) {
  const text = await res.text();
  throw new Error(`ComfyUI error ${res.status}: ${text}`);
}

const data = await res.json();
console.log("Queued prompt:", data.prompt_id);
console.log("Output folder: D:\\ComfyUI_windows_portable\\ComfyUI\\output\\");
console.log("Prefix: noboru_*.png");
