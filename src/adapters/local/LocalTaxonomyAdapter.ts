import type { IDataAdapter, AdapterConfig } from '../IDataAdapter';
import type { RawTaxonomyData } from '../types';
import type { PageNode, TaxonomyMarker } from '../../types';

/**
 * Local adapter for taxonomy/event tracking data
 *
 * Currently generates mock data. In a real implementation, this would
 * load from a local file or generate based on actual instrumentation.
 */
export class LocalTaxonomyAdapter implements IDataAdapter<RawTaxonomyData> {
  private _config: AdapterConfig;
  private pages: PageNode[];

  constructor(pages: PageNode[], _config: AdapterConfig = {}) {
    this.pages = pages;
    this._config = _config;
    void this._config;
    void this._config; // Suppress unused warning for stubbed implementation
  }

  /**
   * Fetch all taxonomy markers
   * Currently generates mock data for each page
   */
  async fetchAll(): Promise<RawTaxonomyData> {
    const markers: TaxonomyMarker[] = this.pages.flatMap((page) => [
      {
        id: `tax-${page.id}-1`,
        pageId: page.id,
        eventName: 'Page Viewed',
        properties: ['page_name', 'user_id', 'timestamp'],
        volume: Math.floor(Math.random() * 10000),
        instrumented: true,
      },
      {
        id: `tax-${page.id}-2`,
        pageId: page.id,
        eventName: 'Button Clicked',
        selector: '.cta-button',
        properties: ['button_name', 'location'],
        volume: Math.floor(Math.random() * 5000),
        instrumented: Math.random() > 0.3,
      },
    ]);

    return { markers };
  }

  /**
   * Fetch taxonomy markers for a specific page
   */
  async fetchById(pageId: string): Promise<RawTaxonomyData | null> {
    const allData = await this.fetchAll();
    const pageMarkers = allData.markers.filter((m) => m.pageId === pageId);

    return { markers: pageMarkers };
  }
}
