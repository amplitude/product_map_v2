import type { IDataAdapter } from '../adapters/IDataAdapter';
import type { RawBehavioralInsightData } from '../adapters/types';
import type { BehavioralInsight } from '../types';

export class BehavioralInsightService {
  private adapter: IDataAdapter<RawBehavioralInsightData>;

  constructor(adapter: IDataAdapter<RawBehavioralInsightData>) {
    this.adapter = adapter;
  }

  async getBehavioralInsights(): Promise<BehavioralInsight[]> {
    const rawData = await this.adapter.fetchAll();
    return rawData.behavioralInsights;
  }

  async getInsightsForPage(pageId: string): Promise<BehavioralInsight[]> {
    const insights = await this.getBehavioralInsights();
    return insights.filter((i) => i.pageId === pageId);
  }

  async getHighImpactInsights(): Promise<BehavioralInsight[]> {
    const insights = await this.getBehavioralInsights();
    return insights.filter((i) => i.impact === 'HIGH');
  }

  async getInsightsByCategory(category: string): Promise<BehavioralInsight[]> {
    const insights = await this.getBehavioralInsights();
    return insights.filter((i) => i.contentMeta.category === category);
  }

  async getInsightsWithActions(): Promise<BehavioralInsight[]> {
    const insights = await this.getBehavioralInsights();
    return insights.filter((i) => i.recommendedActions.length > 0);
  }
}
