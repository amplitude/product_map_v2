import type { IDataAdapter } from '../adapters/IDataAdapter';
import type { RawJourneyData } from '../adapters/types';
import type { Journey, PageNode } from '../types';
import { mapFunnelsToJourneys } from '../utils/dataProcessor';

/**
 * Service for managing journey/funnel data
 *
 * This service wraps the journey data adapter and provides
 * business logic for mapping funnel definitions to journey objects.
 */
export class JourneyService {
  private adapter: IDataAdapter<RawJourneyData>;

  constructor(adapter: IDataAdapter<RawJourneyData>) {
    this.adapter = adapter;
  }

  /**
   * Get all journeys mapped to actual pages
   */
  async getJourneys(pages: PageNode[]): Promise<Journey[]> {
    const rawData = await this.adapter.fetchAll();
    return mapFunnelsToJourneys(rawData.funnels, pages);
  }

  /**
   * Get a single journey by ID
   */
  async getJourneyById(journeyId: string, pages: PageNode[]): Promise<Journey | null> {
    const journeys = await this.getJourneys(pages);
    return journeys.find((j) => j.id === journeyId) || null;
  }

  /**
   * Get journeys by type (conversion, engagement, retention)
   */
  async getJourneysByType(
    type: 'conversion' | 'engagement' | 'retention',
    pages: PageNode[]
  ): Promise<Journey[]> {
    const journeys = await this.getJourneys(pages);
    return journeys.filter((j) => j.type === type);
  }

  /**
   * Get journeys by importance level
   */
  async getJourneysByImportance(
    importance: 'critical' | 'high' | 'medium' | 'low',
    pages: PageNode[]
  ): Promise<Journey[]> {
    const journeys = await this.getJourneys(pages);
    return journeys.filter((j) => j.importance === importance);
  }
}
