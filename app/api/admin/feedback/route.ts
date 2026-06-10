import { NextResponse } from "next/server";

import { feedbackRepository } from "@/features/feedback/repositories/feedback.repository";
import { feedbackService } from "@/features/feedback/services/feedback.service";
import { FEEDBACK_STATUSES } from "@/features/feedback/types/feedback.types";
import { requireContentAdminSession } from "@/lib/admin/require-content-admin";

export async function GET() {
  const { error } = await requireContentAdminSession();
  if (error) return error;

  const feedback = await feedbackService.listRecentForAdmin();
  return NextResponse.json({ feedback });
}

export async function PATCH(request: Request) {
  const { error } = await requireContentAdminSession();
  if (error) return error;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const candidate = body as { id?: string; status?: string };
  if (!candidate.id || typeof candidate.id !== "string") {
    return NextResponse.json({ error: "Feedback id is required." }, { status: 400 });
  }

  if (
    !candidate.status ||
    !FEEDBACK_STATUSES.includes(candidate.status as (typeof FEEDBACK_STATUSES)[number])
  ) {
    return NextResponse.json({ error: "Invalid feedback status." }, { status: 400 });
  }

  const feedback = await feedbackRepository.updateStatus(
    candidate.id,
    candidate.status as (typeof FEEDBACK_STATUSES)[number],
  );

  return NextResponse.json({ feedback });
}
