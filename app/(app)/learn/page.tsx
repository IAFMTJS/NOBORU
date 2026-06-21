import { redirect } from "next/navigation";

type LearnPageProps = {
  searchParams: Promise<{
    region?: string;
    node?: string;
  }>;
};

/** Legacy Journey tab URL — forwards to the Tree tab. */
export default async function LearnPage({ searchParams }: LearnPageProps) {
  const params = await searchParams;
  const query = new URLSearchParams();

  if (params.region) query.set("region", params.region);
  if (params.node) query.set("node", params.node);

  const suffix = query.toString();
  redirect(suffix ? `/tree?${suffix}` : "/tree");
}
