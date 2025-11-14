import type { IDataAdapter, AdapterConfig } from '../IDataAdapter';
import type { RawEdgeData } from '../types';
import type { Screenshot } from '../../types';

/**
 * Local adapter for edge/navigation data
 *
 * Edges represent navigation flows between pages. This adapter returns
 * the raw screenshot data needed to compute edges. The actual edge
 * computation is done in the EdgeService.
 */
export class LocalEdgeAdapter implements IDataAdapter<RawEdgeData> {
  private _config: AdapterConfig;
  private screenshots: Screenshot[];

  constructor(screenshots: Screenshot[], _config: AdapterConfig = {}) {
    this.screenshots = screenshots;
    this._config = _config;
    void this._config;
    void this._config; // Suppress unused warning for stubbed implementation
  }

  /**
   * Fetch all screenshot data needed for edge computation
   */
  async fetchAll(): Promise<RawEdgeData> {
    return { screenshots: this.screenshots };
  }

  /**
   * Fetch screenshots for a specific session (used to compute edges for that session)
   */
  async fetchById(sessionId: string): Promise<RawEdgeData | null> {
    const sessionScreenshots = this.screenshots.filter((s) => s.sessionId === sessionId);

    return { screenshots: sessionScreenshots };
  }
}
