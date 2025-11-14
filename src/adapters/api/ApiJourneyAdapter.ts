import type { IDataAdapter, AdapterConfig } from '../IDataAdapter';
import type { RawJourneyData } from '../types';

/**
 * API adapter for journey/funnel data
 *
 * This adapter will fetch journey definitions from a backend API.
 * Currently stubbed for future implementation.
 *
 * @example
 * // Future usage:
 * const adapter = new ApiJourneyAdapter({
 *   baseUrl: 'https://api.example.com',
 *   authToken: 'your-token'
 * });
 * const data = await adapter.fetchAll();
 */
export class ApiJourneyAdapter implements IDataAdapter<RawJourneyData> {
  constructor(_config?: AdapterConfig) {
    // Config will be used when API is implemented
    void _config;
  }

  /**
   * Fetch all journey/funnel definitions from API
   *
   * TODO: Implement API call to backend
   * Expected endpoint: GET /api/journeys or /api/funnels
   * Expected response: { funnels: Array<FunnelDefinition> }
   */
  async fetchAll(): Promise<RawJourneyData> {
    // TODO: Implement API call
    // Example implementation:
    // const response = await fetch(`${this._config.baseUrl}/api/journeys`, {
    //   headers: {
    //     'Authorization': `Bearer ${this.config.authToken}`,
    //     'Content-Type': 'application/json',
    //   },
    //   signal: AbortSignal.timeout(this.config.timeout!),
    // });
    //
    // if (!response.ok) {
    //   throw new Error(`API error: ${response.statusText}`);
    // }
    //
    // return await response.json();

    console.warn('ApiJourneyAdapter: Not yet implemented, returning empty data');
    return { funnels: [] };
  }

  /**
   * Fetch a single journey by name from API
   *
   * TODO: Implement API call to backend
   * Expected endpoint: GET /api/journeys/:name
   */
  async fetchById(name: string): Promise<RawJourneyData | null> {
    // TODO: Implement API call
    console.warn(`ApiJourneyAdapter.fetchById(${name}): Not yet implemented, returning null`);
    return null;
  }
}
