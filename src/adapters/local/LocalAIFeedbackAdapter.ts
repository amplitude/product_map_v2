import type { IDataAdapter, AdapterConfig } from '../IDataAdapter';
import type { RawAIFeedbackData } from '../types';
import type { PageNode, AIFeedback } from '../../types';

/**
 * Local adapter for AI feedback data
 *
 * Currently generates mock data. In a real implementation, this would
 * call an AI service or load pre-generated insights.
 */
export class LocalAIFeedbackAdapter implements IDataAdapter<RawAIFeedbackData> {
  private _config: AdapterConfig;
  private pages: PageNode[];

  private readonly feedbackSuggestions = [
    {
      title: 'High bounce rate detected',
      description:
        'Users are leaving this page without further interaction. Consider A/B testing the headline or CTA button.',
    },
    {
      title: 'Engagement opportunity',
      description:
        'This page has significant traffic but low engagement. Add more interactive elements or content.',
    },
    {
      title: 'Navigation friction',
      description: 'Users spend longer navigating to this page. Simplify the navigation path.',
    },
    {
      title: 'Mobile optimization needed',
      description: 'Mobile users are experiencing slower load times. Optimize images and assets.',
    },
    {
      title: 'Conversion opportunity',
      description:
        'This page shows high qualified traffic but low conversions. Test a new CTA placement.',
    },
  ];

  constructor(pages: PageNode[], _config: AdapterConfig = {}) {
    this.pages = pages;
    this._config = _config;
    void this._config;
    void this._config; // Suppress unused warning for stubbed implementation
  }

  /**
   * Fetch all AI feedback
   * Currently generates mock insights for some pages
   */
  async fetchAll(): Promise<RawAIFeedbackData> {
    const feedback: AIFeedback[] = this.pages
      .filter(() => Math.random() > 0.5) // Only some pages get feedback
      .map((page, idx) => {
        const suggestion = this.feedbackSuggestions[idx % this.feedbackSuggestions.length];
        return {
          id: `ai-${page.id}`,
          pageId: page.id,
          type: ['suggestion', 'warning', 'insight', 'optimization'][
            Math.floor(Math.random() * 4)
          ] as 'suggestion' | 'warning' | 'insight' | 'optimization',
          confidence: 0.6 + Math.random() * 0.4,
          title: suggestion.title,
          description: suggestion.description,
          impact: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as
            | 'high'
            | 'medium'
            | 'low',
          actionable: Math.random() > 0.3,
        };
      });

    return { feedback };
  }

  /**
   * Fetch AI feedback for a specific page
   */
  async fetchById(pageId: string): Promise<RawAIFeedbackData | null> {
    const allData = await this.fetchAll();
    const pageFeedback = allData.feedback.filter((f) => f.pageId === pageId);

    return { feedback: pageFeedback };
  }
}
