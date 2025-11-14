import type { IDataAdapter, AdapterConfig } from '../IDataAdapter';
import type { RawGuidesSurveysData } from '../types';

export class LocalGuidesSurveysAdapter implements IDataAdapter<RawGuidesSurveysData> {
  private _config: AdapterConfig;

  constructor(_config: AdapterConfig = {}) {
    this._config = _config;
    void this._config;
  }

  async fetchAll(): Promise<RawGuidesSurveysData> {
    const response = await fetch('/guides_surveys.json');
    const data = await response.json();
    return data;
  }

  async fetchById(id: string): Promise<RawGuidesSurveysData | null> {
    const allData = await this.fetchAll();
    const guide = allData.guides.find((g) => g.id === id);
    const survey = allData.surveys.find((s) => s.id === id);

    if (guide || survey) {
      return {
        guides: guide ? [guide] : [],
        surveys: survey ? [survey] : [],
      };
    }
    return null;
  }
}
