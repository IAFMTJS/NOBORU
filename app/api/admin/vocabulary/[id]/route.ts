import { jsonError, jsonOk, notFound } from "@/lib/api/responses";
import { requireContentAdminSession } from "@/lib/admin/require-content-admin";
import { vocabularyAdminService } from "@/features/vocabulary/services/vocabulary-admin.service";
import type { VocabularyInput } from "@/features/vocabulary/types/vocabulary.types";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  const { error } = await requireContentAdminSession();
  if (error) return error;

  const { id } = await params;

  try {
    const data = await vocabularyAdminService.getById(id);
    if (!data) return notFound();
    return jsonOk(data);
  } catch (caught) {
    return jsonError(
      caught instanceof Error ? caught.message : "Failed to load vocabulary.",
      500,
    );
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { error } = await requireContentAdminSession();
  if (error) return error;

  const { id } = await params;

  try {
    const body = (await request.json()) as VocabularyInput;
    const data = await vocabularyAdminService.update(id, body);
    return jsonOk(data);
  } catch (caught) {
    return jsonError(
      caught instanceof Error ? caught.message : "Failed to update vocabulary.",
      400,
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { error } = await requireContentAdminSession();
  if (error) return error;

  const { id } = await params;

  try {
    await vocabularyAdminService.remove(id);
    return jsonOk({ id });
  } catch (caught) {
    return jsonError(
      caught instanceof Error ? caught.message : "Failed to delete vocabulary.",
      400,
    );
  }
}
