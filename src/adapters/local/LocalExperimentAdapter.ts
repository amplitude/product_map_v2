import type { IDataAdapter, AdapterConfig } from '../IDataAdapter';
import type { RawExperimentData } from '../types';

export class LocalExperimentAdapter implements IDataAdapter<RawExperimentData> {
  private _config: AdapterConfig;

  constructor(_config: AdapterConfig = {}) {
    this._config = _config;
    void this._config;
  }

  async fetchAll(): Promise<RawExperimentData> {
    const response = await fetch('/experiments.json');
    const data = await response.json();
    return data;
  }

  async fetchById(id: string): Promise<RawExperimentData | null> {
    const allData = await this.fetchAll();
    const experiment = allData.experiments.find((e) => e.id === id);
    return experiment ? { experiments: [experiment] } : null;
  }
}
