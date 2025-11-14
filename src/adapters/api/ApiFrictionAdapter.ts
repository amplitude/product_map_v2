import type { IDataAdapter, AdapterConfig } from '../IDataAdapter';
import type { RawFrictionData } from '../types';

/**
 * API adapter for friction signal data
 *
 * This adapter will fetch friction signals from a backend analytics API.
 * Currently stubbed for future implementation.
 */
export class ApiFrictionAdapter implements IDataAdapter<RawFrictionData> {
  constructor(_config?: AdapterConfig) {
    // Config will be used when API is implemented
    void _config;
  }

  /**
   * Fetch all friction signals from API
   *
   * TODO: Implement API call to backend
   * Expected endpoint: GET /api/friction or /api/signals
   */
  async fetchAll(): Promise<RawFrictionData> {
    console.warn('ApiFrictionAdapter: Not yet implemented, returning empty data');
    return { signals: [] };
  }

  async fetchById(pageId: string): Promise<RawFrictionData | null> {
    console.warn(`ApiFrictionAdapter.fetchById(${pageId}): Not yet implemented, returning null`);
    return null;
  }
}
