import { jsonError, jsonOk } from "@/lib/api/responses";
import { parsePaginationFromRequest } from "@/lib/api/pagination";
import { requireContentAdminSession } from "@/lib/admin/require-content-admin";
import { revalidatePublishedContent } from "@/lib/cache/revalidate-content";
import { curriculumAdminService } from "@/features/learning/services/curriculum-admin.service";
import type { LessonInput } from "@/features/learning/types/curriculum.types";

export async function GET(request: Request) {
  const { error } = await requireContentAdminSession();
  if (error) return error;
  try {
    const pagination = parsePaginationFromRequest(request);
    return jsonOk(await curriculumAdminService.listLessons(pagination));
  } catch (caught) {
    return jsonError(caught instanceof Error ? caught.message : "Failed.", 500);
  }
}

export async function POST(request: Request) {
  const { error } = await requireContentAdminSession();
  if (error) return error;
  try {
    const body = (await request.json()) as LessonInput;
    const data = await curriculumAdminService.createLesson(body);
    revalidatePublishedContent();
    return jsonOk(data, 201);
  } catch (caught) {
    return jsonError(caught instanceof Error ? caught.message : "Failed.", 400);
  }
}
