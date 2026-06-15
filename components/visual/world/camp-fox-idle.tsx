"use client";

import { useEffect, useState } from "react";

import { CAMP_WORLD_ASSETS } from "@/lib/assets/art-mappings";
import { cn } from "@/lib/utils";

import { WorldArtImage } from "./world-art-image";

type CampFoxIdleProps = {
  className?: string;
};

const IDLE_POSES = [
  CAMP_WORLD_ASSETS.campfire_fox,
  CAMP_WORLD_ASSETS.campfire_fox_peek,
  CAMP_WORLD_ASSETS.campfire_fox,
] as const;

const REACTION_POSES = [
  CAMP_WORLD_ASSETS.campfire_fox_happy,
  CAMP_WORLD_ASSETS.campfire_fox_encouraging,
  CAMP_WORLD_ASSETS.campfire_fox_proud,
] as const;

const IDLE_CYCLE_MS = 12_000;
const REACTION_CYCLE_MS = 28_000;
const REACTION_DURATION_MS = 3_500;

/** Doc 11 Component 004 — campfire fox with idle pose rotation and timed reactions. */
export function CampFoxIdle({ className }: CampFoxIdleProps) {
  const [poseIndex, setPoseIndex] = useState(0);
  const [reactionPose, setReactionPose] = useState<
    (typeof REACTION_POSES)[number] | null
  >(null);

  useEffect(() => {
    const idleTimer = window.setInterval(() => {
      setPoseIndex((current) => (current + 1) % IDLE_POSES.length);
    }, IDLE_CYCLE_MS);

    return () => window.clearInterval(idleTimer);
  }, []);

  useEffect(() => {
    let reactionTimeout: number | undefined;

    const reactionTimer = window.setInterval(() => {
      const nextReaction =
        REACTION_POSES[Math.floor(Math.random() * REACTION_POSES.length)];
      setReactionPose(nextReaction);
      reactionTimeout = window.setTimeout(() => {
        setReactionPose(null);
      }, REACTION_DURATION_MS);
    }, REACTION_CYCLE_MS);

    return () => {
      window.clearInterval(reactionTimer);
      if (reactionTimeout !== undefined) {
        window.clearTimeout(reactionTimeout);
      }
    };
  }, []);

  const activePose = reactionPose ?? IDLE_POSES[poseIndex];

  return (
    <WorldArtImage
      asset={activePose}
      alt="Yama resting by the campfire"
      width={112}
      height={112}
      className={cn(
        "h-28 w-28 object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.55)] motion-standard motion-reduce:transition-none",
        reactionPose && "motion-reward scale-[1.03]",
        className,
      )}
    />
  );
}
