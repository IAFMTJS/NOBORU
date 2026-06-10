import { jsonError, jsonOk, notFound } from "@/lib/api/responses";
import { requireAuthSession } from "@/lib/auth/require-session";
import { trialService } from "@/features/trials/services/trial.service";

type RouteParams = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  const { session, error } = await requireAuthSession();
  if (error || !session) return error ?? jsonError("Unauthorized.", 401);

  const { slug } = await params;

  try {
    const data = await trialService.getTrialSession(session.userId, slug);
    if (!data) return notFound("Trial not found.");
    return jsonOk(data);
  } catch (caught) {
    return jsonError(
      caught instanceof Error ? caught.message : "Failed to load trial.",
      400,
    );
  }
}
