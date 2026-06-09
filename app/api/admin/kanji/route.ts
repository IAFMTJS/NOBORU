import { jsonError, jsonOk } from "@/lib/api/responses";
import { requireContentAdminSession } from "@/lib/admin/require-content-admin";
import { kanjiAdminService } from "@/features/kanji/services/kanji-admin.service";
import type { KanjiInput } from "@/features/kanji/types/kanji.types";

export async function GET() {
  const { error } = await requireContentAdminSession();
  if (error) return error;
  try {
    return jsonOk(await kanjiAdminService.list());
  } catch (caught) {
    return jsonError(caught instanceof Error ? caught.message : "Failed.", 500);
  }
}

export async function POST(request: Request) {
  const { error } = await requireContentAdminSession();
  if (error) return error;
  try {
    const body = (await request.json()) as KanjiInput;
    return jsonOk(await kanjiAdminService.create(body), 201);
  } catch (caught) {
    return jsonError(caught instanceof Error ? caught.message : "Failed.", 400);
  }
}
