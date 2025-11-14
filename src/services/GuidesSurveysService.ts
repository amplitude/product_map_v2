import type { IDataAdapter } from '../adapters/IDataAdapter';
import type { RawGuidesSurveysData } from '../adapters/types';
import type { Guide, Survey } from '../types';

export class GuidesSurveysService {
  private adapter: IDataAdapter<RawGuidesSurveysData>;

  constructor(adapter: IDataAdapter<RawGuidesSurveysData>) {
    this.adapter = adapter;
  }

  async getGuides(): Promise<Guide[]> {
    const rawData = await this.adapter.fetchAll();
    return rawData.guides;
  }

  async getSurveys(): Promise<Survey[]> {
    const rawData = await this.adapter.fetchAll();
    return rawData.surveys;
  }

  async getGuidesForPage(pageId: string): Promise<Guide[]> {
    const guides = await this.getGuides();
    return guides.filter((g) => g.pageId === pageId);
  }

  async getSurveysForPage(pageId: string): Promise<Survey[]> {
    const surveys = await this.getSurveys();
    return surveys.filter((s) => s.pageId === pageId);
  }

  async getActiveGuides(): Promise<Guide[]> {
    const guides = await this.getGuides();
    return guides.filter((g) => g.status === 'ACTIVE');
  }

  async getActiveSurveys(): Promise<Survey[]> {
    const surveys = await this.getSurveys();
    return surveys.filter((s) => s.status === 'ACTIVE');
  }

  async getHighPerformingGuides(minCompletionRate: number): Promise<Guide[]> {
    const guides = await this.getGuides();
    return guides.filter((g) => g.contentMeta.completionRate >= minCompletionRate);
  }
}
