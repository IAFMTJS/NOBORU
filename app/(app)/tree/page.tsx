import { redirect } from "next/navigation";

import { worldService } from "@/features/worlds/services/world.service";
import { requireAuthenticatedUserId } from "@/lib/orchestration/require-authenticated-user";

type TreePageProps = {
  searchParams: Promise<{
    region?: string;
    node?: string;
    zone?: string;
    jlpt?: string;
  }>;
};

/** Tree tab — redirects to the current JLPT world in overview mode. */
export default async function TreePage({ searchParams }: TreePageProps) {
  const userId = await requireAuthenticatedUserId();
  const params = await searchParams;
  const worldId = await worldService.resolveCurrentWorldId(userId);

  const targetWorld =
    params.jlpt && worldService.isValidWorldId(params.jlpt) ? params.jlpt : worldId;

  const query = new URLSearchParams({ mode: "overview" });
  if (params.region) query.set("region", params.region);
  if (params.node) query.set("node", params.node);

  redirect(`/worlds/${targetWorld}?${query}`);
}
