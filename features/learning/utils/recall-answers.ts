export function normalizeRecallAnswer(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function isRecallAnswerCorrect(
  input: string,
  acceptedAnswers: string[],
): boolean {
  const normalized = normalizeRecallAnswer(input);
  if (!normalized) return false;

  return acceptedAnswers.some(
    (answer) => normalizeRecallAnswer(answer) === normalized,
  );
}

export function buildAcceptedAnswers(primary: string, extras: string[] = []): string[] {
  return Array.from(
    new Set([primary, ...extras].map((value) => value.trim()).filter(Boolean)),
  );
}
