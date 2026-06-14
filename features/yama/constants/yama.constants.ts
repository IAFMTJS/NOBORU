import type {
  YamaDialoguePool,
  YamaDialoguePoolId,
  YamaExpression,
} from "@/features/yama/types/yama.types";

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

export const YAMA_LESSON_INTRO_MESSAGES = [
  "Ready for this stretch of the trail? Let's climb together.",
  "New lesson ahead. Take it one foothold at a time.",
  "I'll walk you through this step. Steady pace wins summits.",
] as const;

export const YAMA_TEACHING_MESSAGES = [
  "Here's what to focus on for this step.",
  "Let me explain this before we practice.",
  "Study this carefully — it becomes your next foothold.",
] as const;

export const YAMA_CHECKPOINT_MESSAGES = {
  prepare: [
    "Checkpoint ahead. Review what you've learned, then show your mastery.",
    "This exam tests your trail knowledge. You've got this.",
    "Time to prove what you've climbed so far. Steady and focused.",
  ],
  passed: [
    "Checkpoint cleared! The path opens ahead.",
    "You passed the exam. Another milestone on your climb.",
  ],
} as const;

export const YAMA_TRAINING_GROUNDS_MESSAGES = {
  kana_dojo: [
    "Welcome to the Kana Dojo. Train every character until it feels natural.",
    "Let's sharpen your kana. Repetition builds reliable footholds.",
  ],
  vocabulary_hall: [
    "The Vocabulary Hall is open. Drill words until recall feels effortless.",
    "Train your word memory here. Each review strengthens the trail.",
  ],
  grammar_shrine: [
    "The Grammar Shrine awaits. Patterns become clear with practice.",
    "Study sentence structure here. Understanding opens higher paths.",
  ],
  listening_pavilion: [
    "The Listening Pavilion is ready. Train your ear for real Japanese.",
    "Listen carefully and often. Comprehension grows with each session.",
  ],
} as const;

export const YAMA_ERROR_MESSAGES = {
  recoverable: [
    "Something blocked the path. Let's try again — no rush.",
    "That didn't load cleanly. Take a breath and retry when ready.",
    "A small detour on the trail. We can recover from here.",
  ],
  blocking: [
    "This path isn't available right now. Check your connection or try later.",
    "We couldn't reach the trail from here. Come back when you're reconnected.",
  ],
} as const;

export const YAMA_EMPTY_MESSAGES = {
  review: [
    "No reviews due right now. Explore a lesson or rest up.",
    "The review queue is clear. Time to push forward on the trail.",
  ],
  search: [
    "Nothing matched that search. Try different characters or a broader term.",
    "No results on this path. Adjust your search and look again.",
  ],
  achievements: [
    "No achievements unlocked yet. Keep climbing — milestones will appear.",
    "Your badge case is empty for now. Every lesson builds toward one.",
  ],
  notifications: [
    "No notifications right now. I'll let you know when something matters.",
    "All quiet on the trail. Check back after your next climb.",
  ],
  trail: [
    "No trail nodes here yet. Content is still being mapped.",
    "This region's path isn't ready. Explore another area for now.",
  ],
  generic: [
    "Nothing here yet. Your next step will fill this space.",
    "This area is empty for now. Keep climbing and check back soon.",
  ],
} as const;

export const YAMA_NOTIFICATION_MESSAGES = {
  reminder: [
    "A gentle reminder — your daily climb is waiting when you're ready.",
    "Ready to train? Even a short session keeps the trail warm.",
  ],
  milestone: [
    "You reached a milestone on the trail. Well climbed.",
    "A new milestone unlocked. The mountain remembers your progress.",
  ],
  social: [
    "A fellow climber shared something on the trail.",
    "Activity from your climbing circle — encouragement, not pressure.",
  ],
} as const;

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

export const YAMA_DIALOGUE_POOLS: Record<YamaDialoguePoolId, YamaDialoguePool> = {
  lesson_intro: {
    id: "lesson_intro",
    defaultExpression: "teaching",
    messages: [
      "Ready for the next stretch of the trail?",
      "Let's take this lesson one foothold at a time.",
      "I'll walk through each step with you.",
      "New ground ahead — we'll climb it together.",
    ],
  },
  teaching: {
    id: "teaching",
    defaultExpression: "teaching",
    messages: [
      "Watch this pattern — it shows up often on the trail.",
      "Here's the idea in plain steps.",
      "Take your time with this part. Understanding beats speed.",
      "I'll point out what matters most here.",
    ],
  },
  checkpoint: {
    id: "checkpoint",
    defaultExpression: "determined",
    messages: [
      "Checkpoint ahead. Show what you've learned so far.",
      "This exam marks a milestone on your climb.",
      "Ready for the next checkpoint?",
      "Prove your footing — then the trail opens wider.",
    ],
  },
  training_kana_dojo: {
    id: "training_kana_dojo",
    defaultExpression: "training",
    messages: [
      "Let's train those kana until they feel natural.",
      "Steady strokes build strong recall.",
      "The dojo is quiet — perfect for focused practice.",
      "Each character is another foothold on the trail.",
    ],
  },
  training_vocabulary_hall: {
    id: "training_vocabulary_hall",
    defaultExpression: "training",
    messages: [
      "Words stick when you revisit them on purpose.",
      "Pick a deck and sharpen your recall.",
      "The hall is open — train the words that need you most.",
      "Recognition today makes production easier tomorrow.",
    ],
  },
  training_grammar_shrine: {
    id: "training_grammar_shrine",
    defaultExpression: "training",
    messages: [
      "Patterns repeat across Japanese — notice the structure.",
      "Grammar is the map that keeps sentences readable.",
      "Read the scroll slowly. Structure reveals meaning.",
      "Practice the pattern until it feels familiar.",
    ],
  },
  training_listening_pavilion: {
    id: "training_listening_pavilion",
    defaultExpression: "training",
    messages: [
      "Listen for rhythm first, detail second.",
      "Your ears need reps just like your eyes.",
      "Replay calmly — comprehension grows with exposure.",
      "Hearing the language in context builds real fluency.",
    ],
  },
  concerned_inactivity: {
    id: "concerned_inactivity",
    defaultExpression: "concerned",
    messages: [
      "The trail is still here whenever you're ready.",
      "No rush — pick up where it feels right.",
      "Rest is part of climbing. Come back when you can.",
      "Your progress is saved. We'll continue together.",
    ],
  },
  determined_exam: {
    id: "determined_exam",
    defaultExpression: "determined",
    messages: [
      "Focus up — this challenge tests real footing.",
      "You've trained for this. Trust your steps.",
      "Stay calm and work one question at a time.",
      "Trials are steep, but you've climbed harder stretches.",
    ],
  },
  sleeping_offline: {
    id: "sleeping_offline",
    defaultExpression: "sleeping",
    messages: [
      "I'm resting while you're offline. Your trail is saved.",
      "Catch your breath — I'll be here when you return.",
      "Even climbers pause at camp. Sync when you're back.",
      "Offline mode keeps your lessons ready for the next climb.",
    ],
  },
  sad_streak_lost: {
    id: "sad_streak_lost",
    defaultExpression: "sad",
    messages: [
      "That streak ended, but your learning didn't.",
      "Consistency helps — yet every day can be a fresh start.",
      "The mountain doesn't judge rest days. Climb again when ready.",
      "What you learned still counts. Let's keep building.",
    ],
  },
  surprised: {
    id: "surprised",
    defaultExpression: "surprised",
    messages: [
      "Whoa — I did not expect that!",
      "Now that's a rare find on the trail.",
      "Surprises like this make the climb memorable.",
      "Look at that — something special just appeared.",
    ],
  },
  reward: {
    id: "reward",
    defaultExpression: "reward",
    messages: [
      "You've earned this — well climbed.",
      "A reward worth pausing for.",
      "Open it up. Your effort built this.",
      "Treasure found on the trail — enjoy the moment.",
    ],
  },
  error: {
    id: "error",
    defaultExpression: "confused",
    messages: [
      "Something blocked the path. Let's try again.",
      "That didn't load — your progress is safe.",
      "A rough foothold. Retry when you're ready.",
      "Temporary snag on the trail. We'll recover.",
    ],
  },
  empty: {
    id: "empty",
    defaultExpression: "encouraging",
    messages: [
      "Nothing here yet — that's room to grow.",
      "This space fills as you climb further.",
      "Start a lesson or review to see activity here.",
      "Empty now, but the trail ahead is full of steps.",
    ],
  },
  notification: {
    id: "notification",
    defaultExpression: "encouraging",
    messages: [
      "A quick note from the trail when you're ready.",
      "Something worth checking when you have a moment.",
      "Your climb has an update — no rush.",
      "Friendly reminder: the mountain waits patiently.",
    ],
  },
  daily_challenge: {
    id: "daily_challenge",
    defaultExpression: "happy",
    messages: [
      "Today's challenge is live — optional, but fun.",
      "A short daily climb keeps skills sharp.",
      "Try today's challenge if you want an extra foothold.",
      "Daily training, your pace. Join in when it fits.",
    ],
  },
};

export const YAMA_EXPRESSION_STYLES: Record<
  YamaExpression,
  { imageClass: string; containerClass?: string }
> = {
  main: { imageClass: "" },
  happy: { imageClass: "" },
  celebrating: {
    imageClass: "animate-[yama-celebrate_600ms_ease-out]",
    containerClass: "motion-reduce:animate-none",
  },
  encouraging: { imageClass: "" },
  supportive: { imageClass: "" },
  thinking: { imageClass: "" },
  studying: { imageClass: "" },
  teaching: { imageClass: "" },
  surprised: { imageClass: "" },
  concerned: { imageClass: "" },
  determined: { imageClass: "" },
  sleeping: { imageClass: "", containerClass: "motion-reduce:animate-none" },
  confused: { imageClass: "" },
  sad: { imageClass: "" },
  adventure: { imageClass: "" },
  training: { imageClass: "" },
  seasonal: { imageClass: "" },
  reward: {
    imageClass: "animate-[yama-celebrate_600ms_ease-out]",
    containerClass: "motion-reduce:animate-none",
  },
  loading: {
    imageClass: "animate-[yama-float_2s_ease-in-out_infinite]",
    containerClass: "motion-reduce:animate-none",
  },
  victorious: {
    imageClass: "animate-[yama-celebrate_600ms_ease-out]",
    containerClass: "motion-reduce:animate-none",
  },
};
