import type { IDataAdapter, AdapterConfig } from '../IDataAdapter';
import type { RawBehavioralInsightData } from '../types';

export class LocalBehavioralInsightAdapter implements IDataAdapter<RawBehavioralInsightData> {
  private _config: AdapterConfig;

  constructor(_config: AdapterConfig = {}) {
    this._config = _config;
    void this._config;
  }

  async fetchAll(): Promise<RawBehavioralInsightData> {
    const response = await fetch('/behavioral.json');
    const data = await response.json();
    return data;
  }

  async fetchById(id: string): Promise<RawBehavioralInsightData | null> {
    const allData = await this.fetchAll();
    const insight = allData.behavioralInsights.find((b) => b.id === id);
    return insight ? { behavioralInsights: [insight] } : null;
  }
}
