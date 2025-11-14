/**
 * Domain-specific adapter type definitions
 *
 * These types define what each domain adapter should return
 */

import type {
  Screenshot,
  TaxonomyMarker,
  FrictionSignal,
  EngagementPattern,
  ActionItem,
  AIFeedback,
  Chart,
  Dashboard,
  Cohort,
  Metric,
  Experiment,
  Guide,
  Survey,
  PullRequest,
  FrictionPoint,
  BehavioralInsight,
  PerformanceMetric,
  NavigationFlow,
  Task,
} from '../types';

/**
 * Raw metadata from screenshots
 */
export interface RawScreenshotData {
  screenshots: Screenshot[];
}

/**
 * Raw journey/funnel data (as stored in JSON files)
 */
export interface RawJourneyData {
  funnels: Array<{
    funnel_name: string;
    funnel_type: 'conversion' | 'engagement' | 'retention';
    description: string;
    steps: string[];
    estimated_importance: 'critical' | 'high' | 'medium' | 'low';
    drop_off_risks?: string[];
  }>;
}

/**
 * Data returned by Edge adapter
 * Edges are computed, so adapter returns raw navigation data
 */
export interface RawEdgeData {
  screenshots: Screenshot[];
}

/**
 * Data returned by Taxonomy adapter
 */
export interface RawTaxonomyData {
  markers: TaxonomyMarker[];
}

/**
 * Data returned by Friction adapter
 */
export interface RawFrictionData {
  signals: FrictionSignal[];
}

/**
 * Data returned by Engagement adapter
 */
export interface RawEngagementData {
  patterns: EngagementPattern[];
}

/**
 * Data returned by Action adapter
 */
export interface RawActionData {
  items: ActionItem[];
}

/**
 * Data returned by AI Feedback adapter
 */
export interface RawAIFeedbackData {
  feedback: AIFeedback[];
}

/**
 * Analytics layer raw data types
 */
export interface RawChartData {
  charts: Chart[];
}

export interface RawDashboardData {
  dashboards: Dashboard[];
}

export interface RawCohortData {
  cohorts: Cohort[];
}

export interface RawMetricData {
  metrics: Metric[];
}

/**
 * Actions layer raw data types
 */
export interface RawExperimentData {
  experiments: Experiment[];
}

export interface RawGuidesSurveysData {
  guides: Guide[];
  surveys: Survey[];
}

export interface RawPullRequestData {
  pullRequests: PullRequest[];
}

/**
 * Product Insights layer raw data types
 */
export interface RawFrictionPointData {
  frictionPoints: FrictionPoint[];
}

export interface RawBehavioralInsightData {
  behavioralInsights: BehavioralInsight[];
}

export interface RawPerformanceMetricData {
  performanceMetrics: PerformanceMetric[];
}

export interface RawNavigationFlowData {
  navigationFlows: NavigationFlow[];
}

export interface RawTaskData {
  tasks: Task[];
}
