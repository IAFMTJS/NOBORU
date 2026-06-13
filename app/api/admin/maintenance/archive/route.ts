import { jsonError, jsonOk } from "@/lib/api/responses";
import { requireContentAdminSession } from "@/lib/admin/require-content-admin";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const { error } = await requireContentAdminSession();
  if (error) return error;

  let body: { retentionDays?: number; batchSize?: number } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    // Empty body is valid — defaults apply.
  }

  const retentionDays =
    typeof body.retentionDays === "number" ? body.retentionDays : 365;
  const batchSize = typeof body.batchSize === "number" ? body.batchSize : 5000;

  try {
    const supabase = await createClient();
    const { data, error: rpcError } = await supabase.rpc(
      "archive_stale_learning_events",
      {
        p_retention_days: retentionDays,
        p_batch_size: batchSize,
      },
    );

    if (rpcError) {
      throw new Error(rpcError.message);
    }

    return jsonOk(data);
  } catch (caught) {
    return jsonError(
      caught instanceof Error ? caught.message : "Failed to archive stale events.",
      400,
    );
  }
}
