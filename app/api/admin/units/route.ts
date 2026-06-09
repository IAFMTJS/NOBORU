import { jsonError, jsonOk } from "@/lib/api/responses";
import { requireContentAdminSession } from "@/lib/admin/require-content-admin";
import { curriculumAdminService } from "@/features/learning/services/curriculum-admin.service";

export async function GET() {
  const { error } = await requireContentAdminSession();
  if (error) return error;
  try {
    return jsonOk(await curriculumAdminService.listUnits());
  } catch (caught) {
    return jsonError(caught instanceof Error ? caught.message : "Failed.", 500);
  }
}
