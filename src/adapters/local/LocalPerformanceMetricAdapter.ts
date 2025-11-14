import type { IDataAdapter, AdapterConfig } from '../IDataAdapter';
import type { RawPerformanceMetricData } from '../types';

export class LocalPerformanceMetricAdapter implements IDataAdapter<RawPerformanceMetricData> {
  private _config: AdapterConfig;

  constructor(_config: AdapterConfig = {}) {
    this._config = _config;
    void this._config;
  }

  async fetchAll(): Promise<RawPerformanceMetricData> {
    const response = await fetch('/performance.json');
    const data = await response.json();
    return data;
  }

  async fetchById(id: string): Promise<RawPerformanceMetricData | null> {
    const allData = await this.fetchAll();
    const metric = allData.performanceMetrics.find((p) => p.id === id);
    return metric ? { performanceMetrics: [metric] } : null;
  }
}
