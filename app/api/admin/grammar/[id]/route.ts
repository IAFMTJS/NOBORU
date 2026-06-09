import { jsonError, jsonOk, notFound } from "@/lib/api/responses";
import { requireContentAdminSession } from "@/lib/admin/require-content-admin";
import { grammarAdminService } from "@/features/grammar/services/grammar-admin.service";
import type { GrammarInput } from "@/features/grammar/types/grammar.types";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  const { error } = await requireContentAdminSession();
  if (error) return error;
  const { id } = await params;
  try {
    const data = await grammarAdminService.getById(id);
    if (!data) return notFound();
    return jsonOk(data);
  } catch (caught) {
    return jsonError(caught instanceof Error ? caught.message : "Failed.", 500);
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { error } = await requireContentAdminSession();
  if (error) return error;
  const { id } = await params;
  try {
    const body = (await request.json()) as GrammarInput;
    return jsonOk(await grammarAdminService.update(id, body));
  } catch (caught) {
    return jsonError(caught instanceof Error ? caught.message : "Failed.", 400);
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { error } = await requireContentAdminSession();
  if (error) return error;
  const { id } = await params;
  try {
    await grammarAdminService.remove(id);
    return jsonOk({ id });
  } catch (caught) {
    return jsonError(caught instanceof Error ? caught.message : "Failed.", 400);
  }
}
