// Core data types for Product Map

export interface PageNode {
  id: string;
  url: string;
  urlPattern: string; // Globbed pattern like "/analytics/*/home"
  pageType: string; // Login, Dashboard, Analysis, etc.
  title: string;
  screenshots: Screenshot[];
  sessions: number;
  uniqueUsers: number;
  avgTimeOnPage?: number;
  position?: { x: number; y: number }; // For layout
}

export interface Screenshot {
  filename: string;
  url: string;
  sessionId: string;
  deviceId: string;
  deviceType: string | null;
  timestamp: number;
  textContent?: string;
  htmlFile?: string;
}

export interface Journey {
  id: string;
  name: string;
  type: 'conversion' | 'engagement' | 'retention';
  description: string;
  steps: JourneyStep[];
  totalSessions: number;
  conversionRate?: number;
  importance: 'critical' | 'high' | 'medium' | 'low';
}

export interface ComponentAction {
  selector: string;
  label: string;
  actionType: 'click' | 'input' | 'scroll' | 'hover';
  position: { x: number; y: number }; // Percentage position on screenshot
  sequenceOrder: number; // Order within the step
  importance: 'primary' | 'secondary' | 'tertiary';
}

export interface JourneyStep {
  pageId: string;
  stepNumber: number;
  dropOffRate?: number;
  avgTimeToNext?: number;
  componentActions?: ComponentAction[]; // Sequence of components interacted with
  primaryAction?: string; // Main action description (e.g., "Click Submit Button")
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  sessions: number;
  journeyIds: string[];
  avgDuration?: number;
}

// Overlay data types
export interface TaxonomyMarker {
  id: string;
  pageId: string;
  eventName: string;
  selector?: string;
  properties: string[];
  volume: number;
  instrumented: boolean;
}

export interface FrictionSignal {
  id: string;
  pageId: string;
  type: 'drop_off' | 'error' | 'rage_click' | 'dead_click' | 'slow_load';
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  affectedSessions: number;
  position?: { x: number; y: number }; // Relative to page
}

export interface EngagementPattern {
  id: string;
  pageId: string;
  type: 'scroll_depth' | 'dwell_time' | 'click_density' | 'attention_map';
  data: any; // Flexible for different pattern types
  avgValue?: number;
}

export interface ActionItem {
  id: string;
  pageId: string;
  type: 'experiment' | 'pr' | 'candidate' | 'completed';
  status: 'active' | 'in_dev' | 'proposed' | 'shipped';
  title: string;
  description: string;
  link?: string;
  priority?: 'p0' | 'p1' | 'p2';
}

export interface AIFeedback {
  id: string;
  pageId: string;
  type: 'suggestion' | 'warning' | 'insight' | 'optimization';
  confidence: number; // 0-1
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
}

// Layer visibility state (now supports single active layer)
export type LayerType =
  | 'base'
  // Data Management
  | 'taxonomy'
  | 'heatmap'
  // Analytics
  | 'metrics'
  | 'charts'
  | 'dashboards'
  | 'cohorts'
  // Product Insights
  | 'friction'
  | 'behavioral'
  | 'performance'
  | 'navigation'
  | 'tasks'
  // Actions
  | 'pull_requests'
  | 'experiments'
  | 'guides_surveys'
  // Legacy (keeping for compatibility)
  | 'session_replays'
  | 'ai_feedback'
  | 'agents'
  | 'engagement'
  | 'actions';

export interface LayerState {
  activeLayer: LayerType | null; // Only one layer active at a time (null = base only)
}

// Analytics layer types
export interface Chart {
  id: string;
  name: string;
  type: 'CHART';
  description: string;
  pageId: string;
  position: { x: number; y: number };
  contentMeta: {
    chartType: string;
    isOfficial: boolean;
    owner: string;
    lastModified: string;
    viewCount: number;
    metric?: {
      current?: number;
      conversionRate?: number;
      adoptionRate?: number;
      dropOffRate?: number;
      change: number;
      trend: 'up' | 'down' | 'stable';
    };
  };
  projectId: string;
  url: string;
}

export interface Dashboard {
  id: string;
  name: string;
  type: 'DASHBOARD';
  description: string;
  pageId: string;
  position: { x: number; y: number };
  contentMeta: {
    isOfficial: boolean;
    owner: string;
    lastModified: string;
    viewCount: number;
    chartCount: number;
    subscribers: number;
  };
  projectId: string;
  url: string;
}

export interface Cohort {
  id: string;
  name: string;
  type: 'COHORT';
  description: string;
  pageId: string;
  position: { x: number; y: number };
  contentMeta: {
    isOfficial: boolean;
    owner: string;
    lastModified: string;
    userCount: number;
    cohortType: string;
    growthRate: number;
  };
  projectId: string;
  url: string;
}

export interface Metric {
  id: string;
  name: string;
  type: 'METRIC';
  description: string;
  pageId: string;
  position: { x: number; y: number };
  contentMeta: {
    isOfficial: boolean;
    owner: string;
    lastModified: string;
    currentValue: number;
    target: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
    unit: string;
  };
  projectId: string;
}

// Actions layer types
export interface Experiment {
  id: string;
  name: string;
  type: 'EXPERIMENT';
  description: string;
  pageId: string;
  position: { x: number; y: number };
  status: 'RUNNING' | 'COMPLETED' | 'PAUSED';
  contentMeta: {
    isOfficial: boolean;
    owner: string;
    lastModified: string;
    variantCount: number;
    exposureCount: number;
    winner: string | null;
    confidence: number;
    variants: Array<{
      id: string;
      name: string;
      metrics: {
        signupRate?: number;
        conversionRate?: number;
        completionRate?: number;
        engagementRate?: number;
        lift: number;
        isWinner: boolean;
      };
    }>;
  };
  projectId: string;
  url: string;
}

export interface Guide {
  id: string;
  name: string;
  type: 'GUIDE';
  description: string;
  pageId: string;
  position: { x: number; y: number };
  status: 'ACTIVE' | 'PAUSED' | 'DRAFT';
  contentMeta: {
    guideType: string;
    steps: number;
    completionRate: number;
    dismissRate: number;
    viewCount: number;
    lastModified: string;
  };
  projectId: string;
}

export interface Survey {
  id: string;
  name: string;
  type: 'SURVEY';
  description: string;
  pageId: string;
  position: { x: number; y: number };
  status: 'ACTIVE' | 'PAUSED' | 'CLOSED';
  contentMeta: {
    surveyType: string;
    responseRate: number;
    averageScore: number;
    responseCount: number;
    lastModified: string;
    sentiment?: any;
    topReasons?: Array<{ reason: string; count: number }>;
  };
  projectId: string;
}

export interface PullRequest {
  id: string;
  number: number;
  title: string;
  type: 'PULL_REQUEST';
  description: string;
  pageId: string;
  position: { x: number; y: number };
  status: 'OPEN' | 'MERGED' | 'CLOSED' | 'REVIEW';
  contentMeta: {
    author: string;
    createdAt: string;
    updatedAt: string;
    mergedAt?: string;
    reviewers: string[];
    approvals: number;
    changesRequested: number;
    comments: number;
    additions: number;
    deletions: number;
    linkedInsights: string[];
    impact: {
      estimatedConversionLift?: number;
      estimatedActivationLift?: number;
      loadTimeReduction?: number;
      affectedUsers: number;
    };
  };
  projectId: string;
  url: string;
}

// Product Insights layer types
export interface FrictionPoint {
  id: string;
  name: string;
  type: 'FRICTION';
  description: string;
  pageId: string;
  position: { x: number; y: number };
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  contentMeta: {
    category: string;
    affectedUsers: number;
    dropOffRate?: number;
    errorRate?: number;
    abandonRate?: number;
    completionRate?: number;
    avgLoadTime?: number;
    targetLoadTime?: number;
    avgRetries?: number;
    avgTimeToComplete?: number;
    targetTime?: number;
    usageRate?: number;
    expectedUsageRate?: number;
    detectedAt: string;
    linkedEvents: string[];
    linkedMetrics?: string[];
    relatedFeedback?: string[];
    dropOffSteps?: number[];
  };
  projectId: string;
}

export interface BehavioralInsight {
  id: string;
  sessionId: string;
  type: 'BEHAVIORAL';
  title: string;
  description: string;
  pageId: string;
  position: { x: number; y: number };
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  contentMeta: {
    category: string;
    segment: string;
    affectedUsers: number;
    dropOffRate?: number;
    engagementRate?: number;
    expectedEngagementRate?: number;
    avgRefocusEvents?: number;
    avgTabSwitches?: number;
    timeBeforeAction?: number;
    abandonRate?: number;
    avgTimeAtStep?: number;
    detectedAt: string;
    sessionReplayCount: number;
    linkedEvents: string[];
    linkedMetrics: string[];
    heatmapData?: any;
    supporting_evidence: string;
  };
  recommendedActions: Array<{
    title: string;
    actionType: string;
    description: string;
  }>;
  projectId: string;
  url: string;
}

export interface PerformanceMetric {
  id: string;
  name: string;
  type: 'PERFORMANCE';
  description: string;
  pageId: string;
  position: { x: number; y: number };
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  contentMeta: {
    metric: string;
    currentValue: number;
    targetValue: number;
    p50: number;
    p75: number;
    p95: number;
    affectedUsers: number;
    impactOnConversion?: number;
    impactOnEngagement?: number;
    impactOnUsage?: number;
    impactOnExperience?: number;
    detectedAt: string;
    trend: 'worsening' | 'stable' | 'improving';
    linkedMetrics: string[];
    bottlenecks?: Array<{ resource: string; loadTime: number; size: string }>;
    slowEndpoints?: Array<{ endpoint: string; avgTime: number; calls: number }>;
    causes?: string[];
    issues?: string[];
    deviceTypes?: string[];
  };
  recommendations: string[];
  projectId: string;
}

export interface NavigationFlow {
  id: string;
  name: string;
  type: 'NAVIGATION';
  description: string;
  startPageId: string;
  endPageId: string | null;
  position: { x: number; y: number };
  contentMeta: {
    flowType: string;
    completionRate?: number;
    avgSteps?: number;
    avgPagesPerSession?: number;
    avgDuration: number;
    totalSessions: number;
    dropOffPoints?: Array<{ page: string; rate: number; reason: string }>;
    alternativePaths?: Array<{ path: string[]; usage: number }>;
    popularPaths?: Array<{ path: string[]; usage: number; successRate: number }>;
    unusedFeatures?: Array<{ feature: string; awareness: number; usage: number }>;
    fastTrackUsers?: any;
    mobilePatterns?: any;
    desktopPatterns?: any;
    keyDifferences?: string[];
    detectedAt: string;
  };
  insights: string[];
  recommendations: string[];
  projectId: string;
}

export interface Task {
  id: string;
  name: string;
  type: 'TASK';
  description: string;
  pageId: string;
  position: { x: number; y: number };
  contentMeta: {
    taskType: string;
    status: 'ACTIVE' | 'PAUSED' | 'COMPLETED';
    completionRate: number;
    avgTimeToComplete: number;
    totalAttempts: number;
    abandonmentRate: number;
    steps: Array<{ step: number; name: string; completionRate: number }>;
    blockers: Array<{ issue: string; frequency: number }>;
    detectedAt: string;
  };
  insights: string[];
  recommendations: string[];
  projectId: string;
}

// Aggregated product map data
export interface ProductMapData {
  pages: PageNode[];
  journeys: Journey[];
  edges: Edge[];
  taxonomyMarkers: TaxonomyMarker[];
  frictionSignals: FrictionSignal[];
  engagementPatterns: EngagementPattern[];
  actionItems: ActionItem[];
  aiFeedback: AIFeedback[];
  // Analytics layers
  charts: Chart[];
  dashboards: Dashboard[];
  cohorts: Cohort[];
  metrics: Metric[];
  // Actions layers
  experiments: Experiment[];
  guides: Guide[];
  surveys: Survey[];
  pullRequests: PullRequest[];
  // Product Insights layers
  frictionPoints: FrictionPoint[];
  behavioralInsights: BehavioralInsight[];
  performanceMetrics: PerformanceMetric[];
  navigationFlows: NavigationFlow[];
  tasks: Task[];
}
