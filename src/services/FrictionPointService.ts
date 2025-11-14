import type { IDataAdapter } from '../adapters/IDataAdapter';
import type { RawFrictionPointData } from '../adapters/types';
import type { FrictionPoint } from '../types';

export class FrictionPointService {
  private adapter: IDataAdapter<RawFrictionPointData>;

  constructor(adapter: IDataAdapter<RawFrictionPointData>) {
    this.adapter = adapter;
  }

  async getFrictionPoints(): Promise<FrictionPoint[]> {
    const rawData = await this.adapter.fetchAll();
    return rawData.frictionPoints;
  }

  async getFrictionForPage(pageId: string): Promise<FrictionPoint[]> {
    const friction = await this.getFrictionPoints();
    return friction.filter((f) => f.pageId === pageId);
  }

  async getHighSeverityFriction(): Promise<FrictionPoint[]> {
    const friction = await this.getFrictionPoints();
    return friction.filter((f) => f.severity === 'HIGH');
  }

  async getFrictionByCategory(category: string): Promise<FrictionPoint[]> {
    const friction = await this.getFrictionPoints();
    return friction.filter((f) => f.category === category);
  }

  async getCriticalFriction(): Promise<FrictionPoint[]> {
    const friction = await this.getFrictionPoints();
    return friction.filter(
      (f) => f.severity === 'HIGH' && f.contentMeta.affectedUsers > 5000
    );
  }
}
