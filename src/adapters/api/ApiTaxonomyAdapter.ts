import type { IDataAdapter, AdapterConfig } from '../IDataAdapter';
import type { RawTaxonomyData } from '../types';

/**
 * API adapter for taxonomy/event tracking data
 *
 * This adapter will fetch event tracking metadata from a backend API.
 * Currently stubbed for future implementation.
 */
export class ApiTaxonomyAdapter implements IDataAdapter<RawTaxonomyData> {
  constructor(_config?: AdapterConfig) {
    // Config will be used when API is implemented
    void _config;
  }

  /**
   * Fetch all taxonomy markers from API
   *
   * TODO: Implement API call to backend
   * Expected endpoint: GET /api/taxonomy or /api/events
   */
  async fetchAll(): Promise<RawTaxonomyData> {
    console.warn('ApiTaxonomyAdapter: Not yet implemented, returning empty data');
    return { markers: [] };
  }

  async fetchById(pageId: string): Promise<RawTaxonomyData | null> {
    console.warn(`ApiTaxonomyAdapter.fetchById(${pageId}): Not yet implemented, returning null`);
    return null;
  }
}
