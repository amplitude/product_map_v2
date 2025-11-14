import type { IDataAdapter, AdapterConfig } from '../IDataAdapter';
import type { RawEdgeData } from '../types';

/**
 * API adapter for edge/navigation data
 *
 * This adapter will fetch navigation flow data from a backend API.
 * Currently stubbed for future implementation.
 */
export class ApiEdgeAdapter implements IDataAdapter<RawEdgeData> {
  constructor(_config?: AdapterConfig) {
    // Config will be used when API is implemented
    void _config;
  }

  /**
   * Fetch all screenshot data for edge computation from API
   *
   * TODO: Implement API call to backend
   * Expected endpoint: GET /api/screenshots or /api/navigation
   */
  async fetchAll(): Promise<RawEdgeData> {
    console.warn('ApiEdgeAdapter: Not yet implemented, returning empty data');
    return { screenshots: [] };
  }

  async fetchById(sessionId: string): Promise<RawEdgeData | null> {
    console.warn(`ApiEdgeAdapter.fetchById(${sessionId}): Not yet implemented, returning null`);
    return null;
  }
}
