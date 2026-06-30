"use client";

import dynamic from "next/dynamic";

import { NoboruWordmark } from "@/components/brand/noboru-wordmark";
import { StoryTitle } from "@/components/visual/primitives/story-title";

const YamaAvatar = dynamic(
  () =>
    import("@/features/yama/components/yama-avatar").then((module) => ({
      default: module.YamaAvatar,
    })),
  {
    loading: () => <div className="mx-auto mb-3 h-24 w-24 rounded-full bg-muted/40" aria-hidden />,
  },
);

type AuthBrandHeaderProps = {
  title: string;
  description: string;
};

export function AuthBrandHeader({ title, description }: AuthBrandHeaderProps) {
  return (
    <div className="text-center">
      <NoboruWordmark className="mx-auto mb-4" priority />
      <div className="mx-auto mb-3 flex justify-center">
        <YamaAvatar expression="main" size="lg" alt="Yama" />
      </div>
      <p className="font-japanese text-body-sm tracking-widest text-muted-foreground">
        登る
      </p>
      <StoryTitle as="h1" className="mt-2 text-xl tracking-wide">
        {title}
      </StoryTitle>
      <p className="mt-1 text-body-sm text-muted-foreground">{description}</p>
    </div>
  );
}
