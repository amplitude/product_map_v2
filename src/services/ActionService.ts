import type { IDataAdapter } from '../adapters/IDataAdapter';
import type { RawActionData } from '../adapters/types';
import type { ActionItem } from '../types';

/**
 * Service for managing action item data
 *
 * This service wraps the action data adapter and provides
 * business logic for filtering and organizing experiments, PRs, and tasks.
 */
export class ActionService {
  private adapter: IDataAdapter<RawActionData>;

  constructor(adapter: IDataAdapter<RawActionData>) {
    this.adapter = adapter;
  }

  /**
   * Get all action items
   */
  async getActionItems(): Promise<ActionItem[]> {
    const rawData = await this.adapter.fetchAll();
    return rawData.items;
  }

  /**
   * Get action items for a specific page
   */
  async getActionsForPage(pageId: string): Promise<ActionItem[]> {
    const items = await this.getActionItems();
    return items.filter((i) => i.pageId === pageId);
  }

  /**
   * Get action items by type
   */
  async getActionsByType(
    type: 'experiment' | 'pr' | 'candidate' | 'completed'
  ): Promise<ActionItem[]> {
    const items = await this.getActionItems();
    return items.filter((i) => i.type === type);
  }

  /**
   * Get action items by status
   */
  async getActionsByStatus(
    status: 'active' | 'in_dev' | 'proposed' | 'shipped'
  ): Promise<ActionItem[]> {
    const items = await this.getActionItems();
    return items.filter((i) => i.status === status);
  }

  /**
   * Get high-priority action items
   */
  async getHighPriorityActions(): Promise<ActionItem[]> {
    const items = await this.getActionItems();
    return items.filter((i) => i.priority === 'p0' || i.priority === 'p1');
  }

  /**
   * Get active experiments
   */
  async getActiveExperiments(): Promise<ActionItem[]> {
    const items = await this.getActionItems();
    return items.filter((i) => i.type === 'experiment' && i.status === 'active');
  }
}
