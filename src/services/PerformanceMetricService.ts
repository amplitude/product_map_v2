import type { IDataAdapter } from '../adapters/IDataAdapter';
import type { RawPerformanceMetricData } from '../adapters/types';
import type { PerformanceMetric } from '../types';

export class PerformanceMetricService {
  private adapter: IDataAdapter<RawPerformanceMetricData>;

  constructor(adapter: IDataAdapter<RawPerformanceMetricData>) {
    this.adapter = adapter;
  }

  async getPerformanceMetrics(): Promise<PerformanceMetric[]> {
    const rawData = await this.adapter.fetchAll();
    return rawData.performanceMetrics;
  }

  async getMetricsForPage(pageId: string): Promise<PerformanceMetric[]> {
    const metrics = await this.getPerformanceMetrics();
    return metrics.filter((m) => m.pageId === pageId);
  }

  async getHighSeverityMetrics(): Promise<PerformanceMetric[]> {
    const metrics = await this.getPerformanceMetrics();
    return metrics.filter((m) => m.severity === 'HIGH');
  }

  async getWorseningMetrics(): Promise<PerformanceMetric[]> {
    const metrics = await this.getPerformanceMetrics();
    return metrics.filter((m) => m.contentMeta.trend === 'worsening');
  }

  async getMetricsByType(metricType: string): Promise<PerformanceMetric[]> {
    const metrics = await this.getPerformanceMetrics();
    return metrics.filter((m) => m.contentMeta.metric === metricType);
  }
}
