import { jsonError, jsonOk, notFound } from "@/lib/api/responses";
import { requireContentAdminSession } from "@/lib/admin/require-content-admin";
import { revalidatePublishedContent } from "@/lib/cache/revalidate-content";
import { kanjiAdminService } from "@/features/kanji/services/kanji-admin.service";
import type { KanjiInput } from "@/features/kanji/types/kanji.types";

type RouteParams = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: RouteParams) {
  const { error } = await requireContentAdminSession();
  if (error) return error;
  const { id } = await params;
  try {
    const body = (await request.json()) as KanjiInput;
    const data = await kanjiAdminService.update(id, body);
    revalidatePublishedContent();
    return jsonOk(data);
  } catch (caught) {
    return jsonError(caught instanceof Error ? caught.message : "Failed.", 400);
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { error } = await requireContentAdminSession();
  if (error) return error;
  const { id } = await params;
  try {
    await kanjiAdminService.remove(id);
    revalidatePublishedContent();
    return jsonOk({ id });
  } catch (caught) {
    return jsonError(caught instanceof Error ? caught.message : "Failed.", 400);
  }
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { error } = await requireContentAdminSession();
  if (error) return error;
  const { id } = await params;
  try {
    const data = await kanjiAdminService.getById(id);
    if (!data) return notFound();
    return jsonOk(data);
  } catch (caught) {
    return jsonError(caught instanceof Error ? caught.message : "Failed.", 500);
  }
}
