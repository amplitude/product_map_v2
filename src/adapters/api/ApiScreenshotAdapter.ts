import type { IDataAdapter, AdapterConfig } from '../IDataAdapter';
import type { RawScreenshotData } from '../types';

/**
 * API adapter for screenshot/page data
 *
 * This adapter will fetch screenshot data from a backend API.
 * Currently stubbed for future implementation.
 *
 * @example
 * // Future usage:
 * const adapter = new ApiScreenshotAdapter({
 *   baseUrl: 'https://api.example.com',
 *   authToken: 'your-token'
 * });
 * const data = await adapter.fetchAll();
 */
export class ApiScreenshotAdapter implements IDataAdapter<RawScreenshotData> {
  constructor(_config?: AdapterConfig) {
    // Config will be used when API is implemented
    void _config;
  }

  /**
   * Fetch all screenshot data from API
   *
   * TODO: Implement API call to backend
   * Expected endpoint: GET /api/screenshots
   * Expected response: { screenshots: Screenshot[] }
   */
  async fetchAll(): Promise<RawScreenshotData> {
    // TODO: Implement API call
    // Example implementation:
    // const response = await fetch(`${this._config.baseUrl}/api/screenshots`, {
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

    console.warn('ApiScreenshotAdapter: Not yet implemented, returning empty data');
    return { screenshots: [] };
  }

  /**
   * Fetch a single screenshot by filename from API
   *
   * TODO: Implement API call to backend
   * Expected endpoint: GET /api/screenshots/:filename
   */
  async fetchById(filename: string): Promise<RawScreenshotData | null> {
    // TODO: Implement API call
    console.warn(
      `ApiScreenshotAdapter.fetchById(${filename}): Not yet implemented, returning null`
    );
    return null;
  }
}
