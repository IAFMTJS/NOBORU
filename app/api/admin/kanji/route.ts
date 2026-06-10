import { jsonError, jsonOk } from "@/lib/api/responses";
import { parsePaginationFromRequest } from "@/lib/api/pagination";
import { requireContentAdminSession } from "@/lib/admin/require-content-admin";
import { revalidatePublishedContent } from "@/lib/cache/revalidate-content";
import { kanjiAdminService } from "@/features/kanji/services/kanji-admin.service";
import type { KanjiInput } from "@/features/kanji/types/kanji.types";

export async function GET(request: Request) {
  const { error } = await requireContentAdminSession();
  if (error) return error;
  try {
    const pagination = parsePaginationFromRequest(request);
    return jsonOk(await kanjiAdminService.list(pagination));
  } catch (caught) {
    return jsonError(caught instanceof Error ? caught.message : "Failed.", 500);
  }
}

export async function POST(request: Request) {
  const { error } = await requireContentAdminSession();
  if (error) return error;
  try {
    const body = (await request.json()) as KanjiInput;
    const data = await kanjiAdminService.create(body);
    revalidatePublishedContent();
    return jsonOk(data, 201);
  } catch (caught) {
    return jsonError(caught instanceof Error ? caught.message : "Failed.", 400);
  }
}
