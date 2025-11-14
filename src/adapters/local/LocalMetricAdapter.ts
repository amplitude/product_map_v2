import type { IDataAdapter, AdapterConfig } from '../IDataAdapter';
import type { RawMetricData } from '../types';

export class LocalMetricAdapter implements IDataAdapter<RawMetricData> {
  private _config: AdapterConfig;

  constructor(_config: AdapterConfig = {}) {
    this._config = _config;
    void this._config;
  }

  async fetchAll(): Promise<RawMetricData> {
    const response = await fetch('/metrics.json');
    const data = await response.json();
    return data;
  }

  async fetchById(id: string): Promise<RawMetricData | null> {
    const allData = await this.fetchAll();
    const metric = allData.metrics.find((m) => m.id === id);
    return metric ? { metrics: [metric] } : null;
  }
}
