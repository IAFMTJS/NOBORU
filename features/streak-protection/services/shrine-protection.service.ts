import { shrineProtectionRepository } from "@/features/streak-protection/repositories/shrine-protection.repository";
import type { ShrineProtectionViewModel } from "@/features/streak-protection/types/shrine-protection.types";

class ShrineProtectionService {
  async getSummary(userId: string): Promise<ShrineProtectionViewModel> {
    const row = await shrineProtectionRepository.ensure(userId);
    return {
      tokensAvailable: row.tokens_available,
      tokensUsed: row.tokens_used,
    };
  }

  async grantTokens(userId: string, count: number): Promise<ShrineProtectionViewModel> {
    const row = await shrineProtectionRepository.ensure(userId);
    const newAvailable = row.tokens_available + count;
    await shrineProtectionRepository.updateTokens(
      userId,
      newAvailable,
      row.tokens_used,
    );
    return { tokensAvailable: newAvailable, tokensUsed: row.tokens_used };
  }

  async useToken(userId: string): Promise<boolean> {
    const row = await shrineProtectionRepository.ensure(userId);
    if (row.tokens_available <= 0) return false;

    await shrineProtectionRepository.updateTokens(
      userId,
      row.tokens_available - 1,
      row.tokens_used + 1,
    );
    return true;
  }
}

export const shrineProtectionService = new ShrineProtectionService();
