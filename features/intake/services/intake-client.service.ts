import type {
  IntakePracticeMode,
  IntakePracticeSessionViewModel,
  IntakeResult,
  SaveIntakeInput,
} from "@/features/intake/types/intake.types";

type ApiPayload<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

class IntakeClientService {
  async saveIntake(input: SaveIntakeInput): Promise<IntakeResult> {
    const response = await fetch("/api/intake/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const payload = (await response.json()) as ApiPayload<{ seededCount: number }>;

    if (!response.ok || !payload.success || !payload.data) {
      return {
        success: false,
        error: payload.error ?? "Unable to save your knowledge inventory.",
      };
    }

    return { success: true, seededCount: payload.data.seededCount };
  }

  async getPracticeSession(
    mode: IntakePracticeMode,
  ): Promise<IntakePracticeSessionViewModel> {
    const response = await fetch(`/api/intake/practice?mode=${mode}`);
    const payload = (await response.json()) as ApiPayload<IntakePracticeSessionViewModel>;

    if (!response.ok || !payload.success || !payload.data) {
      throw new Error(payload.error ?? "Unable to load practice session.");
    }

    return payload.data;
  }
}

export const intakeClientService = new IntakeClientService();
