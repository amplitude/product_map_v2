import type { IDataAdapter } from '../adapters/IDataAdapter';
import type { RawTaxonomyData } from '../adapters/types';
import type { TaxonomyMarker } from '../types';

/**
 * Service for managing taxonomy/event tracking data
 *
 * This service wraps the taxonomy data adapter and provides
 * business logic for filtering and analyzing event instrumentation.
 */
export class TaxonomyService {
  private adapter: IDataAdapter<RawTaxonomyData>;

  constructor(adapter: IDataAdapter<RawTaxonomyData>) {
    this.adapter = adapter;
  }

  /**
   * Get all taxonomy markers
   */
  async getTaxonomyMarkers(): Promise<TaxonomyMarker[]> {
    const rawData = await this.adapter.fetchAll();
    return rawData.markers;
  }

  /**
   * Get taxonomy markers for a specific page
   */
  async getTaxonomyForPage(pageId: string): Promise<TaxonomyMarker[]> {
    const markers = await this.getTaxonomyMarkers();
    return markers.filter((m) => m.pageId === pageId);
  }

  /**
   * Get uninstrumented events (events that should be tracked but aren't)
   */
  async getUninstrumentedEvents(): Promise<TaxonomyMarker[]> {
    const markers = await this.getTaxonomyMarkers();
    return markers.filter((m) => !m.instrumented);
  }

  /**
   * Get high-volume events (above a threshold)
   */
  async getHighVolumeEvents(threshold: number): Promise<TaxonomyMarker[]> {
    const markers = await this.getTaxonomyMarkers();
    return markers.filter((m) => m.volume > threshold);
  }

  /**
   * Get events by name
   */
  async getEventsByName(eventName: string): Promise<TaxonomyMarker[]> {
    const markers = await this.getTaxonomyMarkers();
    return markers.filter((m) => m.eventName === eventName);
  }
}
