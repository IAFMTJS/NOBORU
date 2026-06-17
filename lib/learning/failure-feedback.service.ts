export type FailureFeedbackInput = {
  userAnswer: string;
  correctAnswer: string;
  explanation?: string;
  contentLabel?: string;
};

export type FailureFeedbackViewModel = {
  correction: string;
  explanation: string;
  encouragement: string;
  shouldRetry: boolean;
  reinforcementHint: string;
};

const ENCOURAGEMENT_MESSAGES = [
  "Every mistake is a step on the trail — let's try again.",
  "Good effort. The correct form is right here with you.",
  "Learning happens in the retry. You've got this.",
  "That was close — let's reinforce this one together.",
] as const;

export function buildFailureFeedback(
  input: FailureFeedbackInput,
  seed = 0,
): FailureFeedbackViewModel {
  const label = input.contentLabel ? ` for ${input.contentLabel}` : "";
  const explanation =
    input.explanation ??
    `The answer${label} is "${input.correctAnswer}". Your attempt was "${input.userAnswer}".`;

  return {
    correction: input.correctAnswer,
    explanation,
    encouragement:
      ENCOURAGEMENT_MESSAGES[Math.abs(seed) % ENCOURAGEMENT_MESSAGES.length] ??
      ENCOURAGEMENT_MESSAGES[0],
    shouldRetry: true,
    reinforcementHint: "Review the meaning once, then try again without penalty.",
  };
}
