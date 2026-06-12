import { hiraganaProgressService } from "@/features/hiragana/services/hiragana-progress.service";
import { katakanaProgressService } from "@/features/katakana/services/katakana-progress.service";
import { vocabularyProgressService } from "@/features/vocabulary/services/vocabulary-progress.service";
import { intakeRepository } from "@/features/intake/repositories/intake.repository";
import { intakePracticeService } from "@/features/intake/services/intake-practice.service";
import type {
  IntakeChartData,
  IntakePracticeMode,
  IntakePracticeSessionViewModel,
  IntakeResult,
  IntakeSummaryViewModel,
  SaveIntakeInput,
} from "@/features/intake/types/intake.types";

class IntakeService {
  async getChartData(userId: string): Promise<IntakeChartData> {
    const [hiraganaChart, katakanaChart, vocabularyList] = await Promise.all([
      hiraganaProgressService.getChart(userId),
      katakanaProgressService.getChart(userId),
      vocabularyProgressService.getListByJlpt(userId, "n5"),
    ]);

    return {
      hiragana: hiraganaChart.entries,
      katakana: katakanaChart.entries,
      vocabulary: vocabularyList.entries,
    };
  }

  summarizeInput(input: SaveIntakeInput): IntakeSummaryViewModel {
    return {
      hiraganaCount: input.hiraganaIds.length,
      katakanaCount: input.katakanaIds.length,
      vocabularyCount: input.vocabularyIds.length,
      totalKanaCount: input.hiraganaIds.length + input.katakanaIds.length,
    };
  }

  async saveIntake(userId: string, input: SaveIntakeInput): Promise<IntakeResult> {
    try {
      const seededCount = await intakeRepository.saveKnownContent(userId, input);
      return { success: true, seededCount };
    } catch (caught) {
      return {
        success: false,
        error:
          caught instanceof Error
            ? caught.message
            : "Unable to save your knowledge inventory.",
      };
    }
  }

  async getPracticeSession(
    userId: string,
    mode: IntakePracticeMode,
  ): Promise<IntakePracticeSessionViewModel> {
    return intakePracticeService.buildSession(userId, mode);
  }
}

export const intakeService = new IntakeService();
