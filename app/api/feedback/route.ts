import { NextResponse } from "next/server";

import { validateSubmitFeedbackInput } from "@/features/feedback/services/feedback-validation";
import { feedbackService } from "@/features/feedback/services/feedback.service";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const validation = validateSubmitFeedbackInput(body);
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const feedback = await feedbackService.submit(user.id, validation.value);
  return NextResponse.json({ feedback }, { status: 201 });
}
