import type { IDataAdapter, AdapterConfig } from '../IDataAdapter';
import type { RawFrictionPointData } from '../types';

export class LocalFrictionPointAdapter implements IDataAdapter<RawFrictionPointData> {
  private _config: AdapterConfig;

  constructor(_config: AdapterConfig = {}) {
    this._config = _config;
    void this._config;
  }

  async fetchAll(): Promise<RawFrictionPointData> {
    const response = await fetch('/friction.json');
    const data = await response.json();
    return data;
  }

  async fetchById(id: string): Promise<RawFrictionPointData | null> {
    const allData = await this.fetchAll();
    const frictionPoint = allData.frictionPoints.find((f) => f.id === id);
    return frictionPoint ? { frictionPoints: [frictionPoint] } : null;
  }
}
