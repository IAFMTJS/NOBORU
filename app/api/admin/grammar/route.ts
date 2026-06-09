import { jsonError, jsonOk } from "@/lib/api/responses";
import { requireContentAdminSession } from "@/lib/admin/require-content-admin";
import { grammarAdminService } from "@/features/grammar/services/grammar-admin.service";
import type { GrammarInput } from "@/features/grammar/types/grammar.types";

export async function GET() {
  const { error } = await requireContentAdminSession();
  if (error) return error;
  try {
    return jsonOk(await grammarAdminService.list());
  } catch (caught) {
    return jsonError(caught instanceof Error ? caught.message : "Failed.", 500);
  }
}

export async function POST(request: Request) {
  const { error } = await requireContentAdminSession();
  if (error) return error;
  try {
    const body = (await request.json()) as GrammarInput;
    return jsonOk(await grammarAdminService.create(body), 201);
  } catch (caught) {
    return jsonError(caught instanceof Error ? caught.message : "Failed.", 400);
  }
}
