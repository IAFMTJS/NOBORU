import { notFound } from "next/navigation";

import { StoryPageShell } from "@/features/reading/components/story-page-shell";
import { getStoryDetail } from "@/lib/orchestration/learn.orchestrator";

type StoryPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function StoryPage({ params }: StoryPageProps) {
  const { slug } = await params;
  const story = await getStoryDetail(slug);

  if (!story) {
    notFound();
  }

  return <StoryPageShell story={story} />;
}
