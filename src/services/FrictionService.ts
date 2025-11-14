import type { IDataAdapter } from '../adapters/IDataAdapter';
import type { RawFrictionData } from '../adapters/types';
import type { FrictionSignal } from '../types';

/**
 * Service for managing friction signal data
 *
 * This service wraps the friction data adapter and provides
 * business logic for filtering and analyzing user experience issues.
 */
export class FrictionService {
  private adapter: IDataAdapter<RawFrictionData>;

  constructor(adapter: IDataAdapter<RawFrictionData>) {
    this.adapter = adapter;
  }

  /**
   * Get all friction signals
   */
  async getFrictionSignals(): Promise<FrictionSignal[]> {
    const rawData = await this.adapter.fetchAll();
    return rawData.signals;
  }

  /**
   * Get friction signals for a specific page
   */
  async getFrictionForPage(pageId: string): Promise<FrictionSignal[]> {
    const signals = await this.getFrictionSignals();
    return signals.filter((s) => s.pageId === pageId);
  }

  /**
   * Get friction signals by severity level
   */
  async getFrictionBySeverity(
    severity: 'critical' | 'high' | 'medium' | 'low'
  ): Promise<FrictionSignal[]> {
    const signals = await this.getFrictionSignals();
    return signals.filter((s) => s.severity === severity);
  }

  /**
   * Get friction signals by type
   */
  async getFrictionByType(
    type: 'drop_off' | 'error' | 'rage_click' | 'dead_click' | 'slow_load'
  ): Promise<FrictionSignal[]> {
    const signals = await this.getFrictionSignals();
    return signals.filter((s) => s.type === type);
  }

  /**
   * Get critical friction signals (critical or high severity)
   */
  async getCriticalFriction(): Promise<FrictionSignal[]> {
    const signals = await this.getFrictionSignals();
    return signals.filter((s) => s.severity === 'critical' || s.severity === 'high');
  }
}
