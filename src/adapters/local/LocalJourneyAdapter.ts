import type { IDataAdapter, AdapterConfig } from '../IDataAdapter';
import type { RawJourneyData } from '../types';

/**
 * Local file adapter for journey/funnel data
 *
 * Loads journey definitions from the local /public/funnels.json file
 */
export class LocalJourneyAdapter implements IDataAdapter<RawJourneyData> {
  private _config: AdapterConfig;

  constructor(_config: AdapterConfig = {}) {
    this._config = {
      basePath: '/funnels.json',
      ..._config,
    };
  }

  /**
   * Fetch all journey/funnel data from local JSON file
   */
  async fetchAll(): Promise<RawJourneyData> {
    try {
      const response = await fetch(this._config.basePath!);

      if (!response.ok) {
        throw new Error(`Failed to fetch journey data: ${response.statusText}`);
      }

      const data = await response.json();
      return data as RawJourneyData;
    } catch (error) {
      console.error('LocalJourneyAdapter: Failed to load journey data', error);
      // Return empty data instead of throwing to allow app to function
      return { funnels: [] };
    }
  }

  /**
   * Fetch a single journey by name
   */
  async fetchById(name: string): Promise<RawJourneyData | null> {
    const allData = await this.fetchAll();
    const funnel = allData.funnels.find((f) => f.funnel_name === name);

    if (!funnel) {
      return null;
    }

    return { funnels: [funnel] };
  }
}
