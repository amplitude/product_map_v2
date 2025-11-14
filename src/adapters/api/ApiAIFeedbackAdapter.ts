import type { IDataAdapter, AdapterConfig } from '../IDataAdapter';
import type { RawAIFeedbackData } from '../types';

/**
 * API adapter for AI feedback data
 *
 * This adapter will fetch AI-generated insights from a backend ML service.
 * Currently stubbed for future implementation.
 */
export class ApiAIFeedbackAdapter implements IDataAdapter<RawAIFeedbackData> {
  constructor(_config?: AdapterConfig) {
    // Config will be used when API is implemented
    void _config;
  }

  /**
   * Fetch all AI feedback from API
   *
   * TODO: Implement API call to AI/ML backend
   * Expected endpoint: GET /api/ai-insights or /api/feedback
   */
  async fetchAll(): Promise<RawAIFeedbackData> {
    console.warn('ApiAIFeedbackAdapter: Not yet implemented, returning empty data');
    return { feedback: [] };
  }

  async fetchById(pageId: string): Promise<RawAIFeedbackData | null> {
    console.warn(`ApiAIFeedbackAdapter.fetchById(${pageId}): Not yet implemented, returning null`);
    return null;
  }
}
