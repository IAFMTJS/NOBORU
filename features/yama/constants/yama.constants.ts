import type { YamaExpression } from "@/features/yama/types/yama.types";

export const YAMA_LOADING_MESSAGES = [
  "Preparing your trail…",
  "Checking the path ahead…",
  "Gathering your climbing gear…",
  "Mapping the next steps…",
] as const;

export const YAMA_HOME_MESSAGES = {
  allQuestsComplete: [
    "Every quest cleared today. Rest up, or keep climbing.",
    "Today's objectives are done. Nice steady climb.",
  ],
  questsInProgress: [
    "A few quests left on today's trail. One step at a time.",
    "Your daily objectives are waiting on the path ahead.",
  ],
  trailInProgress: [
    "You're mid-climb. Pick up where you left off.",
    "The trail remembers your last step. Ready to continue?",
  ],
  default: [
    "One step at a time. The summit is built from small climbs.",
    "Every lesson is another foothold on the mountain.",
    "Steady progress beats rushed steps. Keep climbing.",
  ],
} as const;

export const YAMA_DRILL_MESSAGES = {
  correct: [
    "Correct! Keep that rhythm.",
    "Nice recall. The trail is opening up.",
    "That's it. Steady and sure.",
  ],
  incorrect: [
    "Not quite — review the step and try again.",
    "Close. Take another look before the next foothold.",
    "Every miss is part of the climb. Try once more.",
  ],
} as const;

export const YAMA_REVIEW_MESSAGES = {
  again: [
    "That's okay. We'll revisit this on the trail.",
    "No rush — mastery takes repeated steps.",
  ],
  good: [
    "Good recall. That foothold is holding.",
    "Solid step. Keep the pace steady.",
  ],
  strong: [
    "Strong memory. That path is well worn now.",
    "Excellent. You're climbing with confidence.",
  ],
  queueEmpty: [
    "No reviews due right now. Explore a lesson or rest up.",
    "The review queue is clear. Time to push forward on the trail.",
  ],
} as const;

export const YAMA_EXPLORE_MESSAGES = [
  "Side trails keep your recall sharp. Pick a challenge!",
  "Games and trials reinforce what you've learned on the path.",
  "Every mini-game is another foothold on the mountain.",
  "Ready for a sprint? Try a rush drill or enter the trials.",
] as const;

export const YAMA_PROFILE_MESSAGES = [
  "This is your climber's log. Every stat tells part of your story.",
  "Your achievements mark the milestones you've earned so far.",
  "Steady progress adds up — keep building your trail record.",
] as const;

export const YAMA_CELEBRATION_MESSAGES = {
  lesson_complete: [
    "Lesson complete. Another foothold secured.",
    "You finished this stretch of the trail. Well climbed.",
  ],
  level_up: [
    "Level up! You're climbing higher.",
    "New elevation reached. The view keeps improving.",
  ],
  achievement: [
    "Achievement unlocked. A milestone on your climb.",
    "You earned a badge worth remembering.",
  ],
  quest: [
    "Quest complete. Today's trail goal reached.",
    "Objective cleared. Steady progress adds up.",
  ],
  trail_node: [
    "Trail node cleared. The path opens ahead.",
    "Another step on the mountain, complete.",
  ],
  trial_boss: [
    "Boss defeated! The region gate opens before you.",
    "Trial conquered. Yama leaps with pride.",
  ],
  streak_milestone: [
    "Streak milestone reached. Consistency builds summits.",
    "Days of steady climbing. The mountain remembers.",
  ],
} as const;

export const YAMA_EXPRESSION_STYLES: Record<
  YamaExpression,
  { imageClass: string; containerClass?: string }
> = {
  main: { imageClass: "" },
  happy: { imageClass: "scale-[1.28]" },
  celebrating: {
    imageClass: "animate-[yama-celebrate_600ms_ease-out]",
    containerClass: "motion-reduce:animate-none",
  },
  encouraging: { imageClass: "" },
  supportive: { imageClass: "opacity-95" },
  thinking: { imageClass: "-rotate-3" },
  studying: { imageClass: "" },
  loading: {
    imageClass: "animate-[yama-float_2s_ease-in-out_infinite]",
    containerClass: "motion-reduce:animate-none",
  },
  victorious: {
    imageClass: "animate-[yama-celebrate_600ms_ease-out] scale-[1.15]",
    containerClass: "motion-reduce:animate-none",
  },
  confused: { imageClass: "-rotate-6 scale-[0.98]" },
};
