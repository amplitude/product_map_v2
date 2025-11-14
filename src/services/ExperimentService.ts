import type { IDataAdapter } from '../adapters/IDataAdapter';
import type { RawExperimentData } from '../adapters/types';
import type { Experiment } from '../types';

export class ExperimentService {
  private adapter: IDataAdapter<RawExperimentData>;

  constructor(adapter: IDataAdapter<RawExperimentData>) {
    this.adapter = adapter;
  }

  async getExperiments(): Promise<Experiment[]> {
    const rawData = await this.adapter.fetchAll();
    return rawData.experiments;
  }

  async getExperimentsForPage(pageId: string): Promise<Experiment[]> {
    const experiments = await this.getExperiments();
    return experiments.filter((e) => e.pageId === pageId);
  }

  async getRunningExperiments(): Promise<Experiment[]> {
    const experiments = await this.getExperiments();
    return experiments.filter((e) => e.status === 'RUNNING');
  }

  async getCompletedExperiments(): Promise<Experiment[]> {
    const experiments = await this.getExperiments();
    return experiments.filter((e) => e.status === 'COMPLETED');
  }

  async getExperimentsWithWinner(): Promise<Experiment[]> {
    const experiments = await this.getExperiments();
    return experiments.filter((e) => e.contentMeta.winner !== null);
  }
}
