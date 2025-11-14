import { AdapterType } from './IDataAdapter';
import type { AdapterConfig } from './IDataAdapter';

// Local adapters
import {
  LocalScreenshotAdapter,
  LocalJourneyAdapter,
  LocalEdgeAdapter,
  LocalTaxonomyAdapter,
  LocalFrictionAdapter,
  LocalEngagementAdapter,
  LocalActionAdapter,
  LocalAIFeedbackAdapter,
} from './local';

// New local adapters
import { LocalChartAdapter } from './local/LocalChartAdapter';
import { LocalDashboardAdapter } from './local/LocalDashboardAdapter';
import { LocalCohortAdapter } from './local/LocalCohortAdapter';
import { LocalMetricAdapter } from './local/LocalMetricAdapter';
import { LocalExperimentAdapter } from './local/LocalExperimentAdapter';
import { LocalGuidesSurveysAdapter } from './local/LocalGuidesSurveysAdapter';
import { LocalPullRequestAdapter } from './local/LocalPullRequestAdapter';
import { LocalFrictionPointAdapter } from './local/LocalFrictionPointAdapter';
import { LocalBehavioralInsightAdapter } from './local/LocalBehavioralInsightAdapter';
import { LocalPerformanceMetricAdapter } from './local/LocalPerformanceMetricAdapter';
import { LocalNavigationFlowAdapter } from './local/LocalNavigationFlowAdapter';
import { LocalTaskAdapter } from './local/LocalTaskAdapter';

// API adapters
import {
  ApiScreenshotAdapter,
  ApiJourneyAdapter,
  ApiEdgeAdapter,
  ApiTaxonomyAdapter,
  ApiFrictionAdapter,
  ApiEngagementAdapter,
  ApiActionAdapter,
  ApiAIFeedbackAdapter,
} from './api';

// Services
import {
  PageService,
  JourneyService,
  EdgeService,
  TaxonomyService,
  FrictionService,
  EngagementService,
  ActionService,
  AIFeedbackService,
} from '../services';

// New services
import { ChartService } from '../services/ChartService';
import { DashboardService } from '../services/DashboardService';
import { CohortService } from '../services/CohortService';
import { MetricService } from '../services/MetricService';
import { ExperimentService } from '../services/ExperimentService';
import { GuidesSurveysService } from '../services/GuidesSurveysService';
import { PullRequestService } from '../services/PullRequestService';
import { FrictionPointService } from '../services/FrictionPointService';
import { BehavioralInsightService } from '../services/BehavioralInsightService';
import { PerformanceMetricService } from '../services/PerformanceMetricService';
import { NavigationFlowService } from '../services/NavigationFlowService';
import { TaskService } from '../services/TaskService';

/**
 * Adapter Factory
 *
 * Central configuration point for creating data adapters and services.
 * This makes it easy to swap between different data sources (local files, API, etc.)
 *
 * Usage:
 * ```typescript
 * const factory = new AdapterFactory(AdapterType.LOCAL);
 * const services = await factory.createServices();
 * const pages = await services.pageService.getPages();
 * ```
 */
export class AdapterFactory {
  private adapterType: AdapterType;
  private config: AdapterConfig;

  constructor(adapterType: AdapterType = AdapterType.LOCAL, config: AdapterConfig = {}) {
    this.adapterType = adapterType;
    this.config = config;
  }

  /**
   * Create all services with the configured adapter type
   *
   * Note: Some services (taxonomy, friction, engagement, etc.) require
   * page data to be loaded first, so this method loads pages first
   * and then creates all services.
   */
  async createServices() {
    // Create page service first
    const screenshotAdapter =
      this.adapterType === AdapterType.LOCAL
        ? new LocalScreenshotAdapter(this.config)
        : new ApiScreenshotAdapter(this.config);

    const pageService = new PageService(screenshotAdapter);

    // Load initial data needed for other adapters
    const pages = await pageService.getPages();
    const screenshots = await pageService.getScreenshots();

    // Create journey service
    const journeyAdapter =
      this.adapterType === AdapterType.LOCAL
        ? new LocalJourneyAdapter(this.config)
        : new ApiJourneyAdapter(this.config);

    const journeyService = new JourneyService(journeyAdapter);

    // Create edge service
    const edgeAdapter =
      this.adapterType === AdapterType.LOCAL
        ? new LocalEdgeAdapter(screenshots, this.config)
        : new ApiEdgeAdapter(this.config);

    const edgeService = new EdgeService(edgeAdapter);

    // Create overlay services (these need page data)
    const taxonomyAdapter =
      this.adapterType === AdapterType.LOCAL
        ? new LocalTaxonomyAdapter(pages, this.config)
        : new ApiTaxonomyAdapter(this.config);

    const frictionAdapter =
      this.adapterType === AdapterType.LOCAL
        ? new LocalFrictionAdapter(pages, this.config)
        : new ApiFrictionAdapter(this.config);

    const engagementAdapter =
      this.adapterType === AdapterType.LOCAL
        ? new LocalEngagementAdapter(pages, this.config)
        : new ApiEngagementAdapter(this.config);

    const actionAdapter =
      this.adapterType === AdapterType.LOCAL
        ? new LocalActionAdapter(pages, this.config)
        : new ApiActionAdapter(this.config);

    const aiFeedbackAdapter =
      this.adapterType === AdapterType.LOCAL
        ? new LocalAIFeedbackAdapter(pages, this.config)
        : new ApiAIFeedbackAdapter(this.config);

    // Create new layer adapters (Analytics)
    const chartAdapter = new LocalChartAdapter(this.config);
    const dashboardAdapter = new LocalDashboardAdapter(this.config);
    const cohortAdapter = new LocalCohortAdapter(this.config);
    const metricAdapter = new LocalMetricAdapter(this.config);

    // Create new layer adapters (Actions)
    const experimentAdapter = new LocalExperimentAdapter(this.config);
    const guidesSurveysAdapter = new LocalGuidesSurveysAdapter(this.config);
    const pullRequestAdapter = new LocalPullRequestAdapter(this.config);

    // Create new layer adapters (Product Insights)
    const frictionPointAdapter = new LocalFrictionPointAdapter(this.config);
    const behavioralInsightAdapter = new LocalBehavioralInsightAdapter(this.config);
    const performanceMetricAdapter = new LocalPerformanceMetricAdapter(this.config);
    const navigationFlowAdapter = new LocalNavigationFlowAdapter(this.config);
    const taskAdapter = new LocalTaskAdapter(this.config);

    return {
      // Core services
      pageService,
      journeyService,
      edgeService,
      taxonomyService: new TaxonomyService(taxonomyAdapter),
      frictionService: new FrictionService(frictionAdapter),
      engagementService: new EngagementService(engagementAdapter),
      actionService: new ActionService(actionAdapter),
      aiFeedbackService: new AIFeedbackService(aiFeedbackAdapter),
      // Analytics services
      chartService: new ChartService(chartAdapter),
      dashboardService: new DashboardService(dashboardAdapter),
      cohortService: new CohortService(cohortAdapter),
      metricService: new MetricService(metricAdapter),
      // Actions services
      experimentService: new ExperimentService(experimentAdapter),
      guidesSurveysService: new GuidesSurveysService(guidesSurveysAdapter),
      pullRequestService: new PullRequestService(pullRequestAdapter),
      // Product Insights services
      frictionPointService: new FrictionPointService(frictionPointAdapter),
      behavioralInsightService: new BehavioralInsightService(behavioralInsightAdapter),
      performanceMetricService: new PerformanceMetricService(performanceMetricAdapter),
      navigationFlowService: new NavigationFlowService(navigationFlowAdapter),
      taskService: new TaskService(taskAdapter),
    };
  }

  /**
   * Get the current adapter type
   */
  getAdapterType(): AdapterType {
    return this.adapterType;
  }

  /**
   * Switch to a different adapter type
   */
  setAdapterType(type: AdapterType): void {
    this.adapterType = type;
  }
}

/**
 * Default factory instance using local adapters
 *
 * To use API adapters instead, create a new instance:
 * ```typescript
 * const factory = new AdapterFactory(AdapterType.API, {
 *   baseUrl: 'https://api.example.com',
 *   authToken: 'your-token'
 * });
 * ```
 */
export const defaultFactory = new AdapterFactory(AdapterType.LOCAL);
