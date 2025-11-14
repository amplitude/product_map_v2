import type { IDataAdapter } from '../adapters/IDataAdapter';
import type { RawCohortData } from '../adapters/types';
import type { Cohort } from '../types';

export class CohortService {
  private adapter: IDataAdapter<RawCohortData>;

  constructor(adapter: IDataAdapter<RawCohortData>) {
    this.adapter = adapter;
  }

  async getCohorts(): Promise<Cohort[]> {
    const rawData = await this.adapter.fetchAll();
    return rawData.cohorts;
  }

  async getCohortsForPage(pageId: string): Promise<Cohort[]> {
    const cohorts = await this.getCohorts();
    return cohorts.filter((c) => c.pageId === pageId);
  }

  async getCohortsByType(cohortType: string): Promise<Cohort[]> {
    const cohorts = await this.getCohorts();
    return cohorts.filter((c) => c.contentMeta.cohortType === cohortType);
  }

  async getGrowingCohorts(): Promise<Cohort[]> {
    const cohorts = await this.getCohorts();
    return cohorts.filter((c) => c.contentMeta.growthRate > 0);
  }

  async getDecliningCohorts(): Promise<Cohort[]> {
    const cohorts = await this.getCohorts();
    return cohorts.filter((c) => c.contentMeta.growthRate < 0);
  }
}
