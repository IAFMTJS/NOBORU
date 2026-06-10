import { jsonError, jsonOk } from "@/lib/api/responses";
import { parsePaginationFromRequest } from "@/lib/api/pagination";
import { requireContentAdminSession } from "@/lib/admin/require-content-admin";
import { revalidatePublishedContent } from "@/lib/cache/revalidate-content";
import { vocabularyAdminService } from "@/features/vocabulary/services/vocabulary-admin.service";
import type { VocabularyInput } from "@/features/vocabulary/types/vocabulary.types";

export async function GET(request: Request) {
  const { error } = await requireContentAdminSession();
  if (error) return error;

  try {
    const pagination = parsePaginationFromRequest(request);
    const data = await vocabularyAdminService.list(pagination);
    return jsonOk(data);
  } catch (caught) {
    return jsonError(
      caught instanceof Error ? caught.message : "Failed to list vocabulary.",
      500,
    );
  }
}

export async function POST(request: Request) {
  const { error } = await requireContentAdminSession();
  if (error) return error;

  try {
    const body = (await request.json()) as VocabularyInput;
    const data = await vocabularyAdminService.create(body);
    revalidatePublishedContent();
    return jsonOk(data, 201);
  } catch (caught) {
    return jsonError(
      caught instanceof Error ? caught.message : "Failed to create vocabulary.",
      400,
    );
  }
}
