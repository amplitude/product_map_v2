import type { IDataAdapter, AdapterConfig } from '../IDataAdapter';
import type { RawCohortData } from '../types';

export class LocalCohortAdapter implements IDataAdapter<RawCohortData> {
  private _config: AdapterConfig;

  constructor(_config: AdapterConfig = {}) {
    this._config = _config;
    void this._config;
  }

  async fetchAll(): Promise<RawCohortData> {
    const response = await fetch('/cohorts.json');
    const data = await response.json();
    return data;
  }

  async fetchById(id: string): Promise<RawCohortData | null> {
    const allData = await this.fetchAll();
    const cohort = allData.cohorts.find((c) => c.id === id);
    return cohort ? { cohorts: [cohort] } : null;
  }
}
