import type { IDataAdapter } from '../adapters/IDataAdapter';
import type { RawPullRequestData } from '../adapters/types';
import type { PullRequest } from '../types';

export class PullRequestService {
  private adapter: IDataAdapter<RawPullRequestData>;

  constructor(adapter: IDataAdapter<RawPullRequestData>) {
    this.adapter = adapter;
  }

  async getPullRequests(): Promise<PullRequest[]> {
    const rawData = await this.adapter.fetchAll();
    return rawData.pullRequests;
  }

  async getPullRequestsForPage(pageId: string): Promise<PullRequest[]> {
    const prs = await this.getPullRequests();
    return prs.filter((pr) => pr.pageId === pageId);
  }

  async getOpenPullRequests(): Promise<PullRequest[]> {
    const prs = await this.getPullRequests();
    return prs.filter((pr) => pr.status === 'OPEN' || pr.status === 'REVIEW');
  }

  async getMergedPullRequests(): Promise<PullRequest[]> {
    const prs = await this.getPullRequests();
    return prs.filter((pr) => pr.status === 'MERGED');
  }

  async getHighImpactPRs(): Promise<PullRequest[]> {
    const prs = await this.getPullRequests();
    return prs.filter((pr) => pr.contentMeta.impact.affectedUsers > 10000);
  }

  async getPRsLinkedToInsights(): Promise<PullRequest[]> {
    const prs = await this.getPullRequests();
    return prs.filter((pr) => pr.contentMeta.linkedInsights.length > 0);
  }
}
