import type { IDataAdapter, AdapterConfig } from '../IDataAdapter';
import type { RawActionData } from '../types';

/**
 * API adapter for action item data
 *
 * This adapter will fetch action items from project management APIs
 * (Jira, Linear, GitHub, etc.) or a custom backend.
 * Currently stubbed for future implementation.
 */
export class ApiActionAdapter implements IDataAdapter<RawActionData> {
  constructor(_config?: AdapterConfig) {
    // Config will be used when API is implemented
    void _config;
  }

  /**
   * Fetch all action items from API
   *
   * TODO: Implement API call to backend or project management tool
   * Expected endpoint: GET /api/actions or integration with Jira/Linear API
   */
  async fetchAll(): Promise<RawActionData> {
    console.warn('ApiActionAdapter: Not yet implemented, returning empty data');
    return { items: [] };
  }

  async fetchById(pageId: string): Promise<RawActionData | null> {
    console.warn(`ApiActionAdapter.fetchById(${pageId}): Not yet implemented, returning null`);
    return null;
  }
}
