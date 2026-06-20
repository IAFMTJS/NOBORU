import { redirectToCurrentWorld } from "@/lib/orchestration/world.orchestrator";
import { requireAuthenticatedUserId } from "@/lib/orchestration/require-authenticated-user";

type LearnPageProps = {
  searchParams: Promise<{
    region?: string;
    node?: string;
  }>;
};

/** Journey tab — redirects to the user's current JLPT world. */
export default async function LearnPage({ searchParams }: LearnPageProps) {
  await requireAuthenticatedUserId();
  const params = await searchParams;

  return redirectToCurrentWorld({
    region: params.region,
    node: params.node,
  });
}
