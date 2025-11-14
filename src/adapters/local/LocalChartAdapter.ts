import type { IDataAdapter, AdapterConfig } from '../IDataAdapter';
import type { RawChartData } from '../types';

/**
 * Local adapter for chart data
 * Loads chart definitions from local JSON file
 */
export class LocalChartAdapter implements IDataAdapter<RawChartData> {
  private _config: AdapterConfig;

  constructor(_config: AdapterConfig = {}) {
    this._config = _config;
    void this._config;
  }

  async fetchAll(): Promise<RawChartData> {
    const response = await fetch('/charts.json');
    const data = await response.json();
    return data;
  }

  async fetchById(id: string): Promise<RawChartData | null> {
    const allData = await this.fetchAll();
    const chart = allData.charts.find((c) => c.id === id);
    return chart ? { charts: [chart] } : null;
  }
}
