/**
 * Future local AI abstraction.
 * Application must function without AI — interfaces only per architecture.mdc.
 *
 * When AI is enabled, generators must obey docs/NOBORU LEARNING ARCHITECTURE BIBLE.md
 * using PlayerKnowledgeContext from lib/learning.
 */
import type { PlayerKnowledgeContext } from "@/lib/learning/learning-architecture.types";

export type AiContentGenerationRequest = {
  context: PlayerKnowledgeContext;
  prompt: string;
  contentType: "story" | "quest_dialogue" | "companion" | "daily_challenge";
};

export interface AiService {
  isAvailable(): boolean;
  /**
   * Future: generate content constrained to the player's known vocabulary and grammar.
   * Must not be called until golden-content validation is wired at the boundary.
   */
  generateContent?(
    request: AiContentGenerationRequest,
  ): Promise<{ content: string }>;
}

export const aiService: AiService = {
  isAvailable() {
    return false;
  },
};
