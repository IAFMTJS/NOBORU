import type { UpdateProfileInput } from "@/features/profile/types/profile.types";

class ProfileService {
  async updateProfile(
    input: UpdateProfileInput,
  ): Promise<{ displayName: string }> {
    const trimmedName = input.displayName.trim();
    if (!trimmedName) {
      throw new Error("Display name is required.");
    }

    const response = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ displayName: trimmedName }),
    });

    const result = (await response.json()) as {
      success: boolean;
      data?: { displayName: string };
      error?: string;
    };

    if (!result.success || !result.data) {
      throw new Error(result.error ?? "Unable to update profile.");
    }

    return { displayName: result.data.displayName };
  }
}

export const profileService = new ProfileService();
