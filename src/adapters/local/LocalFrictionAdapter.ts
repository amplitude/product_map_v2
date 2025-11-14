import type { IDataAdapter, AdapterConfig } from '../IDataAdapter';
import type { RawFrictionData } from '../types';
import type { PageNode, FrictionSignal } from '../../types';

/**
 * Local adapter for friction signal data
 *
 * Currently generates mock data. In a real implementation, this would
 * analyze session replay data or load from analytics.
 */
export class LocalFrictionAdapter implements IDataAdapter<RawFrictionData> {
  private _config: AdapterConfig;
  private pages: PageNode[];

  constructor(pages: PageNode[], _config: AdapterConfig = {}) {
    this.pages = pages;
    this._config = _config;
    void this._config;
    void this._config; // Suppress unused warning for stubbed implementation
  }

  /**
   * Fetch all friction signals
   * Currently generates mock data for pages with issues
   */
  async fetchAll(): Promise<RawFrictionData> {
    const signals: FrictionSignal[] = this.pages
      .filter(() => Math.random() > 0.6) // Only some pages have friction
      .map((page) => ({
        id: `friction-${page.id}`,
        pageId: page.id,
        type: ['drop_off', 'error', 'rage_click'][Math.floor(Math.random() * 3)] as
          | 'drop_off'
          | 'error'
          | 'rage_click'
          | 'dead_click'
          | 'slow_load',
        severity: ['critical', 'high', 'medium'][Math.floor(Math.random() * 3)] as
          | 'critical'
          | 'high'
          | 'medium'
          | 'low',
        description: 'High drop-off rate detected',
        affectedSessions: Math.floor(Math.random() * 500),
      }));

    return { signals };
  }

  /**
   * Fetch friction signals for a specific page
   */
  async fetchById(pageId: string): Promise<RawFrictionData | null> {
    const allData = await this.fetchAll();
    const pageSignals = allData.signals.filter((s) => s.pageId === pageId);

    return { signals: pageSignals };
  }
}
