import type { IDataAdapter, AdapterConfig } from '../IDataAdapter';
import type { RawScreenshotData } from '../types';
import { parseMetadata } from '../../utils/dataProcessor';

/**
 * Local file adapter for screenshot/page data
 *
 * Loads screenshot metadata from the local /public/metadata.txt file
 * and parses it into structured Screenshot objects.
 */
export class LocalScreenshotAdapter implements IDataAdapter<RawScreenshotData> {
  private _config: AdapterConfig;

  constructor(_config: AdapterConfig = {}) {
    this._config = {
      basePath: '/metadata.txt',
      ..._config,
    };
  }

  /**
   * Fetch all screenshot data from local metadata.txt file
   */
  async fetchAll(): Promise<RawScreenshotData> {
    try {
      const response = await fetch(this._config.basePath!);

      if (!response.ok) {
        throw new Error(`Failed to fetch metadata: ${response.statusText}`);
      }

      const metadataText = await response.text();
      const screenshots = parseMetadata(metadataText);

      return { screenshots };
    } catch (error) {
      console.error('LocalScreenshotAdapter: Failed to load screenshot data', error);
      throw error;
    }
  }

  /**
   * Fetch a single screenshot by filename
   */
  async fetchById(filename: string): Promise<RawScreenshotData | null> {
    const allData = await this.fetchAll();
    const screenshot = allData.screenshots.find((s) => s.filename === filename);

    if (!screenshot) {
      return null;
    }

    return { screenshots: [screenshot] };
  }
}
