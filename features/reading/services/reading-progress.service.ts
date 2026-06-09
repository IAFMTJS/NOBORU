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
  async getHub(userId: string): Promise<ReadingHubViewModel> {
    const [stories, dialogues, progressRows] = await Promise.all([
      readingRepository.listPublishedStories(),
      readingRepository.listPublishedDialogues(),
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

  async getStoryDetail(
    userId: string,
    slug: string,
  ): Promise<StoryDetailViewModel | null> {
    const story = await readingRepository.findStoryBySlug(slug);
    if (!story) return null;

    const [sections, questions, progress] = await Promise.all([
      readingRepository.listPublishedSectionsByStoryId(story.id),
      readingRepository.listPublishedQuestionsByStoryId(story.id),
      readingRepository.findProgress(userId, "story", story.id),
    ]);

    return {
      id: story.id,
      title: story.title,
      slug: story.slug,
      summary: story.summary,
      jlptLevel: story.jlpt_level,
      estimatedReadTime: story.estimated_read_time,
      sections: mapSections(sections),
      questions: mapQuestions(questions),
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
  ): Promise<void> {
    const normalizedScore = Math.max(0, Math.min(100, Math.round(score)));
    await readingRepository.upsertProgress({
      userId,
      contentType: "story",
      contentId: storyId,
      status: "completed",
      score: normalizedScore,
    });
  }

  async saveDialogueProgress(
    userId: string,
    dialogueId: string,
    score: number,
  ): Promise<void> {
    const normalizedScore = Math.max(0, Math.min(100, Math.round(score)));
    await readingRepository.upsertProgress({
      userId,
      contentType: "dialogue",
      contentId: dialogueId,
      status: "completed",
      score: normalizedScore,
    });
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
