import type { IDataAdapter, AdapterConfig } from '../IDataAdapter';
import type { RawTaskData } from '../types';

export class LocalTaskAdapter implements IDataAdapter<RawTaskData> {
  private _config: AdapterConfig;

  constructor(_config: AdapterConfig = {}) {
    this._config = _config;
    void this._config;
  }

  async fetchAll(): Promise<RawTaskData> {
    const response = await fetch('/tasks.json');
    const data = await response.json();
    return data;
  }

  async fetchById(id: string): Promise<RawTaskData | null> {
    const allData = await this.fetchAll();
    const task = allData.tasks.find((t) => t.id === id);
    return task ? { tasks: [task] } : null;
  }
}
