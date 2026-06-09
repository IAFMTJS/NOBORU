import { jsonError, jsonOk } from "@/lib/api/responses";
import { requireContentAdminSession } from "@/lib/admin/require-content-admin";
import { achievementAdminService } from "@/features/achievements/services/achievement-admin.service";
import type { AchievementInput } from "@/features/achievements/types/achievement.types";

export async function GET() {
  const { error } = await requireContentAdminSession();
  if (error) return error;
  try {
    return jsonOk(await achievementAdminService.list());
  } catch (caught) {
    return jsonError(caught instanceof Error ? caught.message : "Failed.", 500);
  }
}

export async function POST(request: Request) {
  const { error } = await requireContentAdminSession();
  if (error) return error;
  try {
    const body = (await request.json()) as AchievementInput;
    return jsonOk(await achievementAdminService.create(body), 201);
  } catch (caught) {
    return jsonError(caught instanceof Error ? caught.message : "Failed.", 400);
  }
}
