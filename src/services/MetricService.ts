import type { IDataAdapter } from '../adapters/IDataAdapter';
import type { RawMetricData } from '../adapters/types';
import type { Metric } from '../types';

export class MetricService {
  private adapter: IDataAdapter<RawMetricData>;

  constructor(adapter: IDataAdapter<RawMetricData>) {
    this.adapter = adapter;
  }

  async getMetrics(): Promise<Metric[]> {
    const rawData = await this.adapter.fetchAll();
    return rawData.metrics;
  }

  async getMetricsForPage(pageId: string): Promise<Metric[]> {
    const metrics = await this.getMetrics();
    return metrics.filter((m) => m.pageId === pageId);
  }

  async getOffTrackMetrics(): Promise<Metric[]> {
    const metrics = await this.getMetrics();
    return metrics.filter((m) => m.contentMeta.currentValue < m.contentMeta.target);
  }

  async getImprovingMetrics(): Promise<Metric[]> {
    const metrics = await this.getMetrics();
    return metrics.filter((m) => m.contentMeta.trend === 'up');
  }

  async getDecliningMetrics(): Promise<Metric[]> {
    const metrics = await this.getMetrics();
    return metrics.filter((m) => m.contentMeta.trend === 'down');
  }
}
