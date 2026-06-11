export type YamaExpression =
  | "main"
  | "happy"
  | "celebrating"
  | "encouraging"
  | "supportive"
  | "thinking"
  | "studying"
  | "loading";

export type YamaSize = "xs" | "sm" | "md" | "lg" | "xl";

export type YamaPresenceViewModel = {
  expression: YamaExpression;
  message: string;
  ariaLabel: string;
};

export type YamaHomeContext = {
  dailyQuestsCompleted: number;
  dailyQuestsTotal: number;
  regionProgressPercent: number;
  hasInProgressTrailNode: boolean;
};

export type YamaCelebrationKind =
  | "lesson_complete"
  | "level_up"
  | "achievement"
  | "quest"
  | "trail_node";
