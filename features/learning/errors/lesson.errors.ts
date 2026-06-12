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
