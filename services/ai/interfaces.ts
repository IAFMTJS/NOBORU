/**
 * Future local AI abstraction.
 * Application must function without AI — interfaces only per architecture.mdc.
 */
export interface AiService {
  isAvailable(): boolean;
}

export const aiService: AiService = {
  isAvailable() {
    return false;
  },
};
