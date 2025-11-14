import type { IDataAdapter, AdapterConfig } from '../IDataAdapter';
import type { RawPullRequestData } from '../types';

export class LocalPullRequestAdapter implements IDataAdapter<RawPullRequestData> {
  private _config: AdapterConfig;

  constructor(_config: AdapterConfig = {}) {
    this._config = _config;
    void this._config;
  }

  async fetchAll(): Promise<RawPullRequestData> {
    const response = await fetch('/pull_requests.json');
    const data = await response.json();
    return data;
  }

  async fetchById(id: string): Promise<RawPullRequestData | null> {
    const allData = await this.fetchAll();
    const pr = allData.pullRequests.find((p) => p.id === id);
    return pr ? { pullRequests: [pr] } : null;
  }
}
