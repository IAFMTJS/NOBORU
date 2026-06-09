import { jsonError, jsonOk } from "@/lib/api/responses";
import { requireContentAdminSession } from "@/lib/admin/require-content-admin";
import { curriculumAdminService } from "@/features/learning/services/curriculum-admin.service";
import type { RegionInput } from "@/features/learning/types/curriculum.types";

export async function GET() {
  const { error } = await requireContentAdminSession();
  if (error) return error;
  try {
    return jsonOk(await curriculumAdminService.listRegions());
  } catch (caught) {
    return jsonError(caught instanceof Error ? caught.message : "Failed.", 500);
  }
}

export async function POST(request: Request) {
  const { error } = await requireContentAdminSession();
  if (error) return error;
  try {
    const body = (await request.json()) as RegionInput;
    return jsonOk(await curriculumAdminService.createRegion(body), 201);
  } catch (caught) {
    return jsonError(caught instanceof Error ? caught.message : "Failed.", 400);
  }
}
