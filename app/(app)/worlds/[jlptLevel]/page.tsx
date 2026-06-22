import { redirect } from "next/navigation";

type WorldPageProps = {
  params: Promise<{ jlptLevel: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
};

/** Legacy per-world routes — redirect to the tree tab placeholder. */
export default async function WorldPage({ searchParams }: WorldPageProps) {
  const params = await searchParams;
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value) query.set(key, value);
  }

  const suffix = query.toString();
  redirect(suffix ? `/tree?${suffix}` : "/tree");
}
