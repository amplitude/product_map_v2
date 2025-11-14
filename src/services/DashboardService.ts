import type { IDataAdapter } from '../adapters/IDataAdapter';
import type { RawDashboardData } from '../adapters/types';
import type { Dashboard } from '../types';

export class DashboardService {
  private adapter: IDataAdapter<RawDashboardData>;

  constructor(adapter: IDataAdapter<RawDashboardData>) {
    this.adapter = adapter;
  }

  async getDashboards(): Promise<Dashboard[]> {
    const rawData = await this.adapter.fetchAll();
    return rawData.dashboards;
  }

  async getDashboardsForPage(pageId: string): Promise<Dashboard[]> {
    const dashboards = await this.getDashboards();
    return dashboards.filter((d) => d.pageId === pageId);
  }

  async getPopularDashboards(minViews: number): Promise<Dashboard[]> {
    const dashboards = await this.getDashboards();
    return dashboards.filter((d) => d.contentMeta.viewCount >= minViews);
  }

  async getOfficialDashboards(): Promise<Dashboard[]> {
    const dashboards = await this.getDashboards();
    return dashboards.filter((d) => d.contentMeta.isOfficial);
  }
}
