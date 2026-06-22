export class LessonPassThresholdError extends Error {
  readonly score: number;
  readonly passScore: number;

  constructor(score: number, passScore: number) {
    super(`Score ${score}% is below the ${passScore}% pass threshold.`);
    this.name = "LessonPassThresholdError";
    this.score = score;
    this.passScore = passScore;
  }
}

export class LessonAccessDeniedError extends Error {
  constructor() {
    super("Complete earlier lessons on the trail before opening this one.");
    this.name = "LessonAccessDeniedError";
  }
}

export class LessonNotFoundError extends Error {
  constructor(
    message = "This lesson could not be found. Return to the trail and try the next available step.",
  ) {
    super(message);
    this.name = "LessonNotFoundError";
  }
}
