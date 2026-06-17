import { readFile } from "node:fs/promises";
import path from "node:path";

const PUBLIC_ROOT = path.resolve(process.cwd(), "public/art-library");

const MIME: Record<string, string> = {
  ".webp": "image/webp",
};

/** Legacy redirect target — site assets are static WebP under public/art-library/. */
export async function GET(
  _request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await context.params;
  if (!segments?.length) {
    return new Response("Not found", { status: 404 });
  }

  const publicPath = path.resolve(PUBLIC_ROOT, ...segments);
  if (!publicPath.startsWith(PUBLIC_ROOT)) {
    return new Response("Forbidden", { status: 403 });
  }

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
    return new Response("Not found", { status: 404 });
  }
}
