import type { IDataAdapter } from '../adapters/IDataAdapter';
import type { RawScreenshotData } from '../adapters/types';
import type { PageNode, Screenshot } from '../types';
import { aggregatePages } from '../utils/dataProcessor';

/**
 * Service for managing page/screenshot data
 *
 * This service wraps the screenshot data adapter and provides
 * business logic for aggregating screenshots into page nodes.
 */
export class PageService {
  private adapter: IDataAdapter<RawScreenshotData>;

  constructor(adapter: IDataAdapter<RawScreenshotData>) {
    this.adapter = adapter;
  }

  /**
   * Get all pages with their aggregated screenshot data
   */
  async getPages(): Promise<PageNode[]> {
    const rawData = await this.adapter.fetchAll();
    return aggregatePages(rawData.screenshots);
  }

  /**
   * Get all raw screenshots
   */
  async getScreenshots(): Promise<Screenshot[]> {
    const rawData = await this.adapter.fetchAll();
    return rawData.screenshots;
  }

  /**
   * Get a single page by ID
   */
  async getPageById(pageId: string): Promise<PageNode | null> {
    const pages = await this.getPages();
    return pages.find((p) => p.id === pageId) || null;
  }

  /**
   * Get pages filtered by type
   */
  async getPagesByType(pageType: string): Promise<PageNode[]> {
    const pages = await this.getPages();
    return pages.filter((p) => p.pageType === pageType);
  }

  /**
   * Get top N pages by session count
   */
  async getTopPages(limit: number): Promise<PageNode[]> {
    const pages = await this.getPages();
    return pages.slice(0, limit);
  }
}
