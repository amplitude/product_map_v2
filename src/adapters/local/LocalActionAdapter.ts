import type { IDataAdapter, AdapterConfig } from '../IDataAdapter';
import type { RawActionData } from '../types';
import type { PageNode, ActionItem } from '../../types';

/**
 * Local adapter for action item data
 *
 * Currently generates mock data. In a real implementation, this would
 * integrate with project management tools (Jira, Linear, etc.)
 */
export class LocalActionAdapter implements IDataAdapter<RawActionData> {
  private _config: AdapterConfig;
  private pages: PageNode[];

  constructor(pages: PageNode[], _config: AdapterConfig = {}) {
    this.pages = pages;
    this._config = _config;
    void this._config;
    void this._config; // Suppress unused warning for stubbed implementation
  }

  /**
   * Fetch all action items
   * Currently generates mock experiments/PRs for some pages
   */
  async fetchAll(): Promise<RawActionData> {
    const items: ActionItem[] = this.pages
      .filter(() => Math.random() > 0.7) // Only some pages have action items
      .flatMap((page) => [
        {
          id: `action-${page.id}-1`,
          pageId: page.id,
          type: 'experiment' as const,
          status: 'active' as const,
          title: 'A/B Test: New CTA Design',
          description: 'Testing button color variants',
          priority: 'p1' as const,
        },
      ]);

    return { items };
  }

  /**
   * Fetch action items for a specific page
   */
  async fetchById(pageId: string): Promise<RawActionData | null> {
    const allData = await this.fetchAll();
    const pageItems = allData.items.filter((i) => i.pageId === pageId);

    return { items: pageItems };
  }
}
