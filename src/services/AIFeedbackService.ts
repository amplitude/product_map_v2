import type { IDataAdapter } from '../adapters/IDataAdapter';
import type { RawAIFeedbackData } from '../adapters/types';
import type { AIFeedback } from '../types';

/**
 * Service for managing AI feedback/insights data
 *
 * This service wraps the AI feedback data adapter and provides
 * business logic for filtering and prioritizing AI-generated insights.
 */
export class AIFeedbackService {
  private adapter: IDataAdapter<RawAIFeedbackData>;

  constructor(adapter: IDataAdapter<RawAIFeedbackData>) {
    this.adapter = adapter;
  }

  /**
   * Get all AI feedback
   */
  async getAIFeedback(): Promise<AIFeedback[]> {
    const rawData = await this.adapter.fetchAll();
    return rawData.feedback;
  }

  /**
   * Get AI feedback for a specific page
   */
  async getFeedbackForPage(pageId: string): Promise<AIFeedback[]> {
    const feedback = await this.getAIFeedback();
    return feedback.filter((f) => f.pageId === pageId);
  }

  /**
   * Get AI feedback by type
   */
  async getFeedbackByType(
    type: 'suggestion' | 'warning' | 'insight' | 'optimization'
  ): Promise<AIFeedback[]> {
    const feedback = await this.getAIFeedback();
    return feedback.filter((f) => f.type === type);
  }

  /**
   * Get high-confidence feedback (above threshold)
   */
  async getHighConfidenceFeedback(threshold: number = 0.7): Promise<AIFeedback[]> {
    const feedback = await this.getAIFeedback();
    return feedback.filter((f) => f.confidence >= threshold);
  }

  /**
   * Get actionable feedback
   */
  async getActionableFeedback(): Promise<AIFeedback[]> {
    const feedback = await this.getAIFeedback();
    return feedback.filter((f) => f.actionable);
  }

  /**
   * Get high-impact feedback
   */
  async getHighImpactFeedback(): Promise<AIFeedback[]> {
    const feedback = await this.getAIFeedback();
    return feedback.filter((f) => f.impact === 'high');
  }

  /**
   * Get prioritized feedback (high confidence + high impact + actionable)
   */
  async getPrioritizedFeedback(): Promise<AIFeedback[]> {
    const feedback = await this.getAIFeedback();
    return feedback
      .filter((f) => f.confidence >= 0.7 && f.impact === 'high' && f.actionable)
      .sort((a, b) => b.confidence - a.confidence);
  }
}
