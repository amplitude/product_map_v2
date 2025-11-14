import type { IDataAdapter, AdapterConfig } from '../IDataAdapter';
import type { RawEngagementData } from '../types';
import type { PageNode, EngagementPattern } from '../../types';

/**
 * Local adapter for engagement pattern data
 *
 * Currently generates mock data. In a real implementation, this would
 * analyze user behavior data like scroll depth, dwell time, etc.
 */
export class LocalEngagementAdapter implements IDataAdapter<RawEngagementData> {
  private _config: AdapterConfig;
  private pages: PageNode[];

  constructor(pages: PageNode[], _config: AdapterConfig = {}) {
    this.pages = pages;
    this._config = _config;
    void this._config;
    void this._config; // Suppress unused warning for stubbed implementation
  }

  /**
   * Fetch all engagement patterns
   * Currently generates mock scroll depth data for each page
   */
  async fetchAll(): Promise<RawEngagementData> {
    const patterns: EngagementPattern[] = this.pages.map((page) => ({
      id: `engage-${page.id}`,
      pageId: page.id,
      type: 'scroll_depth',
      data: { avgScrollDepth: Math.random() * 100 },
      avgValue: Math.random() * 100,
    }));

    return { patterns };
  }

  /**
   * Fetch engagement patterns for a specific page
   */
  async fetchById(pageId: string): Promise<RawEngagementData | null> {
    const allData = await this.fetchAll();
    const pagePatterns = allData.patterns.filter((p) => p.pageId === pageId);

    return { patterns: pagePatterns };
  }
}
