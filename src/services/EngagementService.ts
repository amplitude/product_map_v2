import type { IDataAdapter } from '../adapters/IDataAdapter';
import type { RawEngagementData } from '../adapters/types';
import type { EngagementPattern } from '../types';

/**
 * Service for managing engagement pattern data
 *
 * This service wraps the engagement data adapter and provides
 * business logic for analyzing user engagement metrics.
 */
export class EngagementService {
  private adapter: IDataAdapter<RawEngagementData>;

  constructor(adapter: IDataAdapter<RawEngagementData>) {
    this.adapter = adapter;
  }

  /**
   * Get all engagement patterns
   */
  async getEngagementPatterns(): Promise<EngagementPattern[]> {
    const rawData = await this.adapter.fetchAll();
    return rawData.patterns;
  }

  /**
   * Get engagement patterns for a specific page
   */
  async getEngagementForPage(pageId: string): Promise<EngagementPattern[]> {
    const patterns = await this.getEngagementPatterns();
    return patterns.filter((p) => p.pageId === pageId);
  }

  /**
   * Get engagement patterns by type
   */
  async getEngagementByType(
    type: 'scroll_depth' | 'dwell_time' | 'click_density' | 'attention_map'
  ): Promise<EngagementPattern[]> {
    const patterns = await this.getEngagementPatterns();
    return patterns.filter((p) => p.type === type);
  }

  /**
   * Get low engagement pages (below threshold)
   */
  async getLowEngagementPages(threshold: number): Promise<EngagementPattern[]> {
    const patterns = await this.getEngagementPatterns();
    return patterns.filter((p) => p.avgValue !== undefined && p.avgValue < threshold);
  }

  /**
   * Get high engagement pages (above threshold)
   */
  async getHighEngagementPages(threshold: number): Promise<EngagementPattern[]> {
    const patterns = await this.getEngagementPatterns();
    return patterns.filter((p) => p.avgValue !== undefined && p.avgValue > threshold);
  }
}
