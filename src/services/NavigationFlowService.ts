import type { IDataAdapter } from '../adapters/IDataAdapter';
import type { RawNavigationFlowData } from '../adapters/types';
import type { NavigationFlow } from '../types';

export class NavigationFlowService {
  private adapter: IDataAdapter<RawNavigationFlowData>;

  constructor(adapter: IDataAdapter<RawNavigationFlowData>) {
    this.adapter = adapter;
  }

  async getNavigationFlows(): Promise<NavigationFlow[]> {
    const rawData = await this.adapter.fetchAll();
    return rawData.navigationFlows;
  }

  async getFlowsForPage(pageId: string): Promise<NavigationFlow[]> {
    const flows = await this.getNavigationFlows();
    return flows.filter((f) => f.startPageId === pageId || f.endPageId === pageId);
  }

  async getConversionFlows(): Promise<NavigationFlow[]> {
    const flows = await this.getNavigationFlows();
    return flows.filter((f) => f.contentMeta.flowType === 'CONVERSION');
  }

  async getLowCompletionFlows(threshold: number): Promise<NavigationFlow[]> {
    const flows = await this.getNavigationFlows();
    return flows.filter(
      (f) => f.contentMeta.completionRate && f.contentMeta.completionRate < threshold
    );
  }

  async getFlowsByType(flowType: string): Promise<NavigationFlow[]> {
    const flows = await this.getNavigationFlows();
    return flows.filter((f) => f.contentMeta.flowType === flowType);
  }
}
