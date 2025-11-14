import type { IDataAdapter } from '../adapters/IDataAdapter';
import type { RawEdgeData } from '../adapters/types';
import type { Edge, PageNode } from '../types';
import { buildEdges } from '../utils/dataProcessor';

/**
 * Service for managing edge/navigation flow data
 *
 * This service wraps the edge data adapter and provides
 * business logic for computing navigation edges between pages.
 */
export class EdgeService {
  private adapter: IDataAdapter<RawEdgeData>;

  constructor(adapter: IDataAdapter<RawEdgeData>) {
    this.adapter = adapter;
  }

  /**
   * Get all edges (navigation flows between pages)
   */
  async getEdges(pages: PageNode[]): Promise<Edge[]> {
    const rawData = await this.adapter.fetchAll();
    return buildEdges(rawData.screenshots, pages);
  }

  /**
   * Get edges filtered by minimum session count
   */
  async getEdgesByMinSessions(minSessions: number, pages: PageNode[]): Promise<Edge[]> {
    const edges = await this.getEdges(pages);
    return edges.filter((e) => e.sessions >= minSessions);
  }

  /**
   * Get edges for a specific page (incoming and outgoing)
   */
  async getEdgesForPage(pageId: string, pages: PageNode[]): Promise<Edge[]> {
    const edges = await this.getEdges(pages);
    return edges.filter((e) => e.source === pageId || e.target === pageId);
  }

  /**
   * Get incoming edges for a page
   */
  async getIncomingEdges(pageId: string, pages: PageNode[]): Promise<Edge[]> {
    const edges = await this.getEdges(pages);
    return edges.filter((e) => e.target === pageId);
  }

  /**
   * Get outgoing edges for a page
   */
  async getOutgoingEdges(pageId: string, pages: PageNode[]): Promise<Edge[]> {
    const edges = await this.getEdges(pages);
    return edges.filter((e) => e.source === pageId);
  }
}
