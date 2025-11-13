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
export type LayerType = 'base' | 'taxonomy' | 'friction' | 'engagement' | 'actions' | 'heatmap' | 'ai_feedback';

export interface LayerState {
  activeLayer: LayerType | null; // Only one layer active at a time (null = base only)
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
}
