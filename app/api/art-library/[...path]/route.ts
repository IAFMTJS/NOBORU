import { readFile } from "node:fs/promises";
import path from "node:path";

const ART_LIBRARY_ROOT = path.resolve(process.cwd(), "Art Library");
const PUBLIC_ROOT = path.resolve(process.cwd(), "public/art-library");

const MIME: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

/** Dev fallback when public/art-library has not been published yet. */
export async function GET(
  _request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await context.params;
  if (!segments?.length) {
    return new Response("Not found", { status: 404 });
  }

  const publicPath = path.resolve(PUBLIC_ROOT, ...segments);
  if (publicPath.startsWith(PUBLIC_ROOT)) {
    try {
      const data = await readFile(publicPath);
      const ext = path.extname(publicPath).toLowerCase();
      return new Response(data, {
        headers: {
          "Content-Type": MIME[ext] ?? "application/octet-stream",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    } catch {
      // fall through to Art Library source
    }
  }

  const resolved = path.resolve(ART_LIBRARY_ROOT, ...segments);
  if (!resolved.startsWith(ART_LIBRARY_ROOT)) {
    return new Response("Forbidden", { status: 403 });
  }

  try {
    const data = await readFile(resolved);
    const ext = path.extname(resolved).toLowerCase();
    const contentType = MIME[ext] ?? "application/octet-stream";
    return new Response(data, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
