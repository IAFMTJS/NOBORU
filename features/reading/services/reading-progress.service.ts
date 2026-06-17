import { assembleStoryForPlayer } from "@/lib/learning/story-assembly.service";
import { playerKnowledgeService } from "@/features/learning/services/player-knowledge.service";
import { vocabularyRepository } from "@/features/vocabulary/repositories/vocabulary.repository";
import { elevationService } from "@/features/elevation/services/elevation.service";
import type { ElevationAwardViewModel } from "@/features/elevation/types/elevation.types";
import { achievementService } from "@/features/achievements/services/achievement.service";
import type { AchievementUnlockViewModel } from "@/features/achievements/types/achievement.types";
import { questService } from "@/features/quests/services/quest.service";
import { readingRepository } from "@/features/reading/repositories/reading.repository";
import type {
  DialogueDetailViewModel,
  DialogueListEntryViewModel,
  DialogueNodeViewModel,
  ReadingHubViewModel,
  ReadingQuestionViewModel,
  StoryDetailViewModel,
  StoryListEntryViewModel,
  StorySectionViewModel,
} from "@/features/reading/types/reading.types";

function mapSections(
  rows: Awaited<ReturnType<typeof readingRepository.listPublishedSectionsByStoryId>>,
): StorySectionViewModel[] {
  return rows.map((row) => ({
    id: row.id,
    japaneseText: row.japanese_text,
    romaji: row.romaji,
    english: row.english,
  }));
}

function mapQuestions(
  rows: Awaited<ReturnType<typeof readingRepository.listPublishedQuestionsByStoryId>>,
): ReadingQuestionViewModel[] {
  return rows.map((row) => ({
    id: row.id,
    question: row.question,
    options: row.options,
    correctOptionIndex: row.correct_option_index,
  }));
}

function buildDialogueNodes(
  nodes: Awaited<ReturnType<typeof readingRepository.listNodesByScenarioId>>,
  choices: Awaited<ReturnType<typeof readingRepository.listChoicesByNodeIds>>,
): DialogueNodeViewModel[] {
  const choicesByNode = new Map<string, DialogueNodeViewModel["choices"]>();

  for (const choice of choices) {
    const existing = choicesByNode.get(choice.node_id) ?? [];
    existing.push({
      id: choice.id,
      choiceText: choice.choice_text,
      nextNodeId: choice.next_node_id,
      isCorrect: choice.is_correct,
    });
    choicesByNode.set(choice.node_id, existing);
  }

  return nodes.map((node) => ({
    id: node.id,
    speaker: node.speaker,
    japaneseText: node.japanese_text,
    romaji: node.romaji,
    english: node.english,
    nodeType: node.node_type,
    isEntry: node.is_entry,
    orderIndex: node.order_index,
    choices: choicesByNode.get(node.id) ?? [],
  }));
}

class ReadingProgressService {
  async getHubByJlpt(
    userId: string,
    jlptLevel: "n5" | "n4",
  ): Promise<ReadingHubViewModel> {
    const [stories, dialogues, progressRows] = await Promise.all([
      readingRepository.listPublishedStoriesByJlpt(jlptLevel),
      readingRepository.listPublishedDialoguesByJlpt(jlptLevel),
      readingRepository.listProgressByUserId(userId),
    ]);

    const progressByKey = new Map(
      progressRows.map((row) => [`${row.content_type}:${row.content_id}`, row]),
    );

    const storyEntries: StoryListEntryViewModel[] = stories.map((story) => {
      const progress = progressByKey.get(`story:${story.id}`);
      return {
        id: story.id,
        title: story.title,
        slug: story.slug,
        summary: story.summary,
        estimatedReadTime: story.estimated_read_time,
        completed: progress?.status === "completed",
        score: progress?.score ?? 0,
      };
    });

    const dialogueEntries: DialogueListEntryViewModel[] = dialogues.map(
      (dialogue) => {
        const progress = progressByKey.get(`dialogue:${dialogue.id}`);
        return {
          id: dialogue.id,
          title: dialogue.title,
          slug: dialogue.slug,
          description: dialogue.description,
          completed: progress?.status === "completed",
          score: progress?.score ?? 0,
        };
      },
    );

    const totalCount = storyEntries.length + dialogueEntries.length;
    const completedCount =
      storyEntries.filter((entry) => entry.completed).length +
      dialogueEntries.filter((entry) => entry.completed).length;

    return {
      stories: storyEntries,
      dialogues: dialogueEntries,
      completedCount,
      totalCount,
      progressPercent:
        totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100),
    };
  }

  async getHub(userId: string): Promise<ReadingHubViewModel> {
    return this.getHubByJlpt(userId, "n5");
  }

  async getStoryDetail(
    userId: string,
    slug: string,
  ): Promise<StoryDetailViewModel | null> {
    const story = await readingRepository.findStoryBySlug(slug);
    if (!story) return null;

    const [sections, questions, progress, playerContext] = await Promise.all([
      readingRepository.listPublishedSectionsByStoryId(story.id),
      readingRepository.listPublishedQuestionsByStoryId(story.id),
      readingRepository.findProgress(userId, "story", story.id),
      playerKnowledgeService.getGlobalContext(userId),
    ]);

    const baseSections = mapSections(sections);
    let enrichedSections = baseSections;
    let highlightedVocabularyIds: string[] | undefined;

    if (playerContext) {
      const vocabularyRows = await vocabularyRepository.findByIds(
        playerContext.knownVocabularyIds,
      );
      const vocabularyLookup = new Map(
        vocabularyRows.map((row) => [
          row.id,
          {
            id: row.id,
            surfaceForms: [row.kana, row.kanji].filter(
              (value): value is string => Boolean(value),
            ),
          },
        ]),
      );

      const assembly = assembleStoryForPlayer(
        baseSections.map((section) => ({
          id: section.id,
          japaneseText: section.japaneseText,
        })),
        playerContext,
        vocabularyLookup,
      );

      highlightedVocabularyIds = assembly.highlightedVocabularyIds;
      enrichedSections = baseSections.map((section) => {
        const assembled = assembly.sections.find((entry) => entry.id === section.id);
        return {
          ...section,
          tokenAnnotations: assembled?.annotations,
        };
      });
    }

    return {
      id: story.id,
      title: story.title,
      slug: story.slug,
      summary: story.summary,
      jlptLevel: story.jlpt_level,
      estimatedReadTime: story.estimated_read_time,
      sections: enrichedSections,
      questions: mapQuestions(questions),
      highlightedVocabularyIds,
      completed: progress?.status === "completed",
      score: progress?.score ?? 0,
    };
  }

  async getDialogueDetail(
    userId: string,
    slug: string,
  ): Promise<DialogueDetailViewModel | null> {
    const dialogue = await readingRepository.findDialogueBySlug(slug);
    if (!dialogue) return null;

    const nodes = await readingRepository.listNodesByScenarioId(dialogue.id);
    const choices = await readingRepository.listChoicesByNodeIds(
      nodes.map((node) => node.id),
    );
    const progress = await readingRepository.findProgress(
      userId,
      "dialogue",
      dialogue.id,
    );

    return {
      id: dialogue.id,
      title: dialogue.title,
      slug: dialogue.slug,
      description: dialogue.description,
      jlptLevel: dialogue.jlpt_level,
      nodes: buildDialogueNodes(nodes, choices),
      completed: progress?.status === "completed",
      score: progress?.score ?? 0,
    };
  }

  async saveStoryProgress(
    userId: string,
    storyId: string,
    score: number,
  ): Promise<{
    elevation: ElevationAwardViewModel | null;
    achievements: AchievementUnlockViewModel[];
  }> {
    const existing = await readingRepository.findProgress(userId, "story", storyId);
    const isFirstCompletion = existing?.status !== "completed";
    const story = await readingRepository.findStoryById(storyId);

    const normalizedScore = Math.max(0, Math.min(100, Math.round(score)));
    await readingRepository.upsertProgress({
      userId,
      contentType: "story",
      contentId: storyId,
      status: "completed",
      score: normalizedScore,
    });

    if (!isFirstCompletion || !story) {
      return {
        elevation: null,
        achievements: await achievementService.afterStudyActivity(userId),
      };
    }

    const [elevation, achievements] = await Promise.all([
      elevationService.awardComprehensionComplete(
        userId,
        "reading_complete",
        storyId,
        story.title,
        true,
      ),
      achievementService.afterStudyActivity(userId),
    ]);

    if (elevation) {
      await questService.recordActivities(userId, [
        { type: "ep_earned", amount: elevation.epAwarded },
      ]);
    }

    return { elevation, achievements };
  }

  async saveDialogueProgress(
    userId: string,
    dialogueId: string,
    score: number,
  ): Promise<{
    elevation: ElevationAwardViewModel | null;
    achievements: AchievementUnlockViewModel[];
  }> {
    const existing = await readingRepository.findProgress(
      userId,
      "dialogue",
      dialogueId,
    );
    const isFirstCompletion = existing?.status !== "completed";
    const dialogue = await readingRepository.findDialogueById(dialogueId);

    const normalizedScore = Math.max(0, Math.min(100, Math.round(score)));
    await readingRepository.upsertProgress({
      userId,
      contentType: "dialogue",
      contentId: dialogueId,
      status: "completed",
      score: normalizedScore,
    });

    if (!isFirstCompletion || !dialogue) {
      return {
        elevation: null,
        achievements: await achievementService.afterStudyActivity(userId),
      };
    }

    const [elevation, achievements] = await Promise.all([
      elevationService.awardComprehensionComplete(
        userId,
        "reading_complete",
        dialogueId,
        dialogue.title,
        true,
      ),
      achievementService.afterStudyActivity(userId),
    ]);

    if (elevation) {
      await questService.recordActivities(userId, [
        { type: "ep_earned", amount: elevation.epAwarded },
      ]);
    }

    return { elevation, achievements };
  }

  async markInProgress(
    userId: string,
    contentType: "story" | "dialogue",
    contentId: string,
  ): Promise<void> {
    const existing = await readingRepository.findProgress(
      userId,
      contentType,
      contentId,
    );

    if (existing?.status === "completed") {
      return;
    }

    await readingRepository.upsertProgress({
      userId,
      contentType,
      contentId,
      status: "in_progress",
      score: existing?.score ?? 0,
    });
  }

  async loadStoryLessonContent(storyId: string) {
    const story = await readingRepository.findStoryById(storyId);
    if (!story || story.status !== "published") return null;

    const [sections, questions] = await Promise.all([
      readingRepository.listPublishedSectionsByStoryId(story.id),
      readingRepository.listPublishedQuestionsByStoryId(story.id),
    ]);

    return {
      type: "story" as const,
      id: story.id,
      title: story.title,
      slug: story.slug,
      summary: story.summary,
      sections: mapSections(sections),
      questions: mapQuestions(questions),
    };
  }

  async loadDialogueLessonContent(dialogueId: string) {
    const dialogue = await readingRepository.findDialogueById(dialogueId);
    if (!dialogue || dialogue.status !== "published") return null;

    const nodes = await readingRepository.listNodesByScenarioId(dialogue.id);
    const choices = await readingRepository.listChoicesByNodeIds(
      nodes.map((node) => node.id),
    );

    return {
      type: "dialogue" as const,
      id: dialogue.id,
      title: dialogue.title,
      slug: dialogue.slug,
      description: dialogue.description,
      nodes: buildDialogueNodes(nodes, choices),
    };
  }
}

export const readingProgressService = new ReadingProgressService();
