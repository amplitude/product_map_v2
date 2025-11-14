import type { IDataAdapter, AdapterConfig } from '../IDataAdapter';
import type { RawNavigationFlowData } from '../types';

export class LocalNavigationFlowAdapter implements IDataAdapter<RawNavigationFlowData> {
  private _config: AdapterConfig;

  constructor(_config: AdapterConfig = {}) {
    this._config = _config;
    void this._config;
  }

  async fetchAll(): Promise<RawNavigationFlowData> {
    const response = await fetch('/navigation.json');
    const data = await response.json();
    return data;
  }

  async fetchById(id: string): Promise<RawNavigationFlowData | null> {
    const allData = await this.fetchAll();
    const flow = allData.navigationFlows.find((n) => n.id === id);
    return flow ? { navigationFlows: [flow] } : null;
  }
}
