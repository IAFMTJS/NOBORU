import { jsonError, jsonOk } from "@/lib/api/responses";
import { parsePaginationFromRequest } from "@/lib/api/pagination";
import { requireContentAdminSession } from "@/lib/admin/require-content-admin";
import { revalidatePublishedContent } from "@/lib/cache/revalidate-content";
import { grammarAdminService } from "@/features/grammar/services/grammar-admin.service";
import type { GrammarInput } from "@/features/grammar/types/grammar.types";

export async function GET(request: Request) {
  const { error } = await requireContentAdminSession();
  if (error) return error;
  try {
    const pagination = parsePaginationFromRequest(request);
    return jsonOk(await grammarAdminService.list(pagination));
  } catch (caught) {
    return jsonError(caught instanceof Error ? caught.message : "Failed.", 500);
  }
}

export async function POST(request: Request) {
  const { error } = await requireContentAdminSession();
  if (error) return error;
  try {
    const body = (await request.json()) as GrammarInput;
    const data = await grammarAdminService.create(body);
    revalidatePublishedContent();
    return jsonOk(data, 201);
  } catch (caught) {
    return jsonError(caught instanceof Error ? caught.message : "Failed.", 400);
  }
}
