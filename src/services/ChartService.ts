import type { IDataAdapter } from '../adapters/IDataAdapter';
import type { RawChartData } from '../adapters/types';
import type { Chart } from '../types';

export class ChartService {
  private adapter: IDataAdapter<RawChartData>;

  constructor(adapter: IDataAdapter<RawChartData>) {
    this.adapter = adapter;
  }

  async getCharts(): Promise<Chart[]> {
    const rawData = await this.adapter.fetchAll();
    return rawData.charts;
  }

  async getChartsForPage(pageId: string): Promise<Chart[]> {
    const charts = await this.getCharts();
    return charts.filter((c) => c.pageId === pageId);
  }

  async getChartsByType(chartType: string): Promise<Chart[]> {
    const charts = await this.getCharts();
    return charts.filter((c) => c.contentMeta.chartType === chartType);
  }

  async getOfficialCharts(): Promise<Chart[]> {
    const charts = await this.getCharts();
    return charts.filter((c) => c.contentMeta.isOfficial);
  }
}
