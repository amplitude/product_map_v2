import type { IDataAdapter, AdapterConfig } from '../IDataAdapter';
import type { RawDashboardData } from '../types';

export class LocalDashboardAdapter implements IDataAdapter<RawDashboardData> {
  private _config: AdapterConfig;

  constructor(_config: AdapterConfig = {}) {
    this._config = _config;
    void this._config;
  }

  async fetchAll(): Promise<RawDashboardData> {
    const response = await fetch('/dashboards.json');
    const data = await response.json();
    return data;
  }

  async fetchById(id: string): Promise<RawDashboardData | null> {
    const allData = await this.fetchAll();
    const dashboard = allData.dashboards.find((d) => d.id === id);
    return dashboard ? { dashboards: [dashboard] } : null;
  }
}
