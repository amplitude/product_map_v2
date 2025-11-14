import type { IDataAdapter, AdapterConfig } from '../IDataAdapter';
import type { RawEngagementData } from '../types';

/**
 * API adapter for engagement pattern data
 *
 * This adapter will fetch engagement analytics from a backend API.
 * Currently stubbed for future implementation.
 */
export class ApiEngagementAdapter implements IDataAdapter<RawEngagementData> {
  constructor(_config?: AdapterConfig) {
    // Config will be used when API is implemented
    void _config;
  }

  /**
   * Fetch all engagement patterns from API
   *
   * TODO: Implement API call to backend
   * Expected endpoint: GET /api/engagement
   */
  async fetchAll(): Promise<RawEngagementData> {
    console.warn('ApiEngagementAdapter: Not yet implemented, returning empty data');
    return { patterns: [] };
  }

  async fetchById(pageId: string): Promise<RawEngagementData | null> {
    console.warn(`ApiEngagementAdapter.fetchById(${pageId}): Not yet implemented, returning null`);
    return null;
  }
}
