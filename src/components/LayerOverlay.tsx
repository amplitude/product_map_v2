import { useMemo, useState } from 'react';
import { useNodes, useViewport } from '@xyflow/react';
import { useMapStore } from '../store/mapStore';
import { InsightCard } from './InsightCard';
import type {
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
import {
  BarChart3,
  LayoutDashboard,
  Users,
  Activity,
  FlaskConical,
  MessageSquare,
  GitPullRequest,
  AlertTriangle,
  Navigation,
  Gauge,
  Route,
  ListChecks,
} from 'lucide-react';
import '../styles/layerOverlay.css';

interface OverlayMarker {
  id: string;
  type: string;
  pageId: string;
  name: string;
  description: string;
  severity?: 'HIGH' | 'MEDIUM' | 'LOW';
  status?: string;
  impact?: string;
  metric?: any;
  url?: string;
  fullData?: any; // Store full insight object for detailed view
}

export function LayerOverlay() {
  const { data, layers } = useMapStore();
  const nodes = useNodes();
  const viewport = useViewport();
  const [selectedInsight, setSelectedInsight] = useState<FrictionPoint | null>(null);

  const markers = useMemo((): OverlayMarker[] => {
    if (!data || !layers.activeLayer) return [];

    console.log('Active layer:', layers.activeLayer);

    // Map different layer types to their data
    switch (layers.activeLayer) {
      // Analytics
      case 'charts':
        console.log('Charts data:', data.charts?.length || 0, 'items');
        return data.charts?.map((chart: Chart) => ({
          id: chart.id,
          type: 'chart',
          pageId: chart.pageId,
          name: chart.name,
          description: chart.description,
          metric: chart.contentMeta.metric,
          url: chart.url,
        })) || [];

      case 'dashboards':
        return data.dashboards?.map((dashboard: Dashboard) => ({
          id: dashboard.id,
          type: 'dashboard',
          pageId: dashboard.pageId,
          name: dashboard.name,
          description: dashboard.description,
          metric: { viewCount: dashboard.contentMeta.viewCount },
          url: dashboard.url,
        })) || [];

      case 'cohorts':
        return data.cohorts?.map((cohort: Cohort) => ({
          id: cohort.id,
          type: 'cohort',
          pageId: cohort.pageId,
          name: cohort.name,
          description: cohort.description,
          metric: { userCount: cohort.contentMeta.userCount },
          url: cohort.url,
        })) || [];

      case 'metrics':
        return data.metrics?.map((metric: Metric) => ({
          id: metric.id,
          type: 'metric',
          pageId: metric.pageId,
          name: metric.name,
          description: metric.description,
          metric: {
            currentValue: metric.contentMeta.currentValue,
            target: metric.contentMeta.target,
            trend: metric.contentMeta.trend,
          },
        })) || [];

      // Actions
      case 'experiments':
        return data.experiments?.map((experiment: Experiment) => ({
          id: experiment.id,
          type: 'experiment',
          pageId: experiment.pageId,
          name: experiment.name,
          description: experiment.description,
          status: experiment.status,
          url: experiment.url,
        })) || [];

      case 'guides_surveys':
        const guides = data.guides?.map((guide: Guide) => ({
          id: guide.id,
          type: 'guide',
          pageId: guide.pageId,
          name: guide.name,
          description: guide.description,
          status: guide.status,
        })) || [];

        const surveys = data.surveys?.map((survey: Survey) => ({
          id: survey.id,
          type: 'survey',
          pageId: survey.pageId,
          name: survey.name,
          description: survey.description,
          status: survey.status,
        })) || [];

        return [...guides, ...surveys];

      case 'pull_requests':
        return data.pullRequests?.map((pr: PullRequest) => ({
          id: pr.id,
          type: 'pull_request',
          pageId: pr.pageId,
          name: pr.title,
          description: pr.description,
          status: pr.status,
          url: pr.url,
        })) || [];

      // Product Insights
      case 'friction':
        return data.frictionPoints?.map((friction: FrictionPoint) => ({
          id: friction.id,
          type: 'friction',
          pageId: friction.pageId,
          name: friction.title,
          description: friction.description,
          severity: friction.severity,
          impact: friction.impact,
          fullData: friction, // Store full insight for detailed view
        })) || [];

      case 'behavioral':
        return data.behavioralInsights?.map((insight: BehavioralInsight) => ({
          id: insight.id,
          type: 'behavioral',
          pageId: insight.pageId,
          name: insight.title,
          description: insight.description,
          impact: insight.impact,
          url: insight.url,
        })) || [];

      case 'performance':
        return data.performanceMetrics?.map((perf: PerformanceMetric) => ({
          id: perf.id,
          type: 'performance',
          pageId: perf.pageId,
          name: perf.name,
          description: perf.description,
          severity: perf.severity,
        })) || [];

      case 'navigation':
        return data.navigationFlows?.map((flow: NavigationFlow) => ({
          id: flow.id,
          type: 'navigation',
          pageId: flow.startPageId,
          name: flow.name,
          description: flow.description,
        })) || [];

      case 'tasks':
        return data.tasks?.map((task: Task) => ({
          id: task.id,
          type: 'task',
          pageId: task.pageId,
          name: task.name,
          description: task.description,
          status: task.contentMeta.status,
        })) || [];

      default:
        return [];
    }
  }, [data, layers.activeLayer]);

  // Calculate positions for markers based on page nodes
  const markerPositions = useMemo(() => {
    if (markers.length === 0 || nodes.length === 0) return [];

    // Group markers by pageId
    const markersByPage = new Map<string, OverlayMarker[]>();
    markers.forEach(marker => {
      const existing = markersByPage.get(marker.pageId) || [];
      existing.push(marker);
      markersByPage.set(marker.pageId, existing);
    });

    // Calculate positions for each marker
    const positions: Array<OverlayMarker & { x: number; y: number }> = [];

    markersByPage.forEach((pageMarkers, pageId) => {
      // Find the node for this page
      const node = nodes.find(n => n.id === pageId);
      if (!node) return; // Skip markers for pages not currently visible

      // Position markers around the node
      pageMarkers.forEach((marker, index) => {
        // Calculate offset position (spread markers horizontally above the node)
        const offsetX = (index - (pageMarkers.length - 1) / 2) * 40;
        const offsetY = -50; // Position above the node

        // Calculate node-relative position
        const nodeX = node.position.x + 100 + offsetX; // 100 is approximate node center
        const nodeY = node.position.y + offsetY;

        // Transform to screen coordinates using viewport
        const screenX = nodeX * viewport.zoom + viewport.x;
        const screenY = nodeY * viewport.zoom + viewport.y;

        positions.push({
          ...marker,
          x: screenX,
          y: screenY,
        });
      });
    });

    return positions;
  }, [markers, nodes, viewport]);

  console.log('Marker positions calculated:', markerPositions.length, 'markers from', markers.length, 'total');

  if (markerPositions.length === 0) return null;

  const handleMarkerClick = (marker: OverlayMarker) => {
    // For friction insights, show detail card
    if (marker.type === 'friction' && marker.fullData) {
      setSelectedInsight(marker.fullData as FrictionPoint);
    }
    // For other types with URLs, open in new tab
    else if (marker.url) {
      window.open(marker.url, '_blank');
    }
  };

  return (
    <>
      <div className="layer-overlay">
        {markerPositions.map((marker) => (
          <LayerMarker
            key={marker.id}
            marker={marker}
            x={marker.x}
            y={marker.y}
            zoom={viewport.zoom}
            onClick={() => handleMarkerClick(marker)}
          />
        ))}
      </div>
      {selectedInsight && (
        <InsightCard insight={selectedInsight} onClose={() => setSelectedInsight(null)} />
      )}
    </>
  );
}

interface LayerMarkerProps {
  marker: OverlayMarker;
  x: number;
  y: number;
  zoom: number;
  onClick: () => void;
}

function LayerMarker({ marker, x, y, zoom, onClick }: LayerMarkerProps) {
  const getIcon = () => {
    switch (marker.type) {
      case 'chart':
        return <BarChart3 size={16} />;
      case 'dashboard':
        return <LayoutDashboard size={16} />;
      case 'cohort':
        return <Users size={16} />;
      case 'metric':
        return <Activity size={16} />;
      case 'experiment':
        return <FlaskConical size={16} />;
      case 'guide':
      case 'survey':
        return <MessageSquare size={16} />;
      case 'pull_request':
        return <GitPullRequest size={16} />;
      case 'friction':
        return <AlertTriangle size={16} />;
      case 'behavioral':
        return <Users size={16} />;
      case 'performance':
        return <Gauge size={16} />;
      case 'navigation':
        return <Navigation size={16} />;
      case 'task':
        return <ListChecks size={16} />;
      default:
        return <Route size={16} />;
    }
  };

  const getColor = () => {
    if (marker.severity === 'HIGH') return '#ef4444';
    if (marker.severity === 'MEDIUM') return '#f59e0b';
    if (marker.severity === 'LOW') return '#10b981';
    if (marker.impact === 'High') return '#ef4444';
    if (marker.impact === 'Medium') return '#f59e0b';
    return '#3b82f6';
  };

  const isClickable = marker.type === 'friction' || marker.url;

  return (
    <div
      className="layer-marker"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        borderColor: getColor(),
        cursor: isClickable ? 'pointer' : 'default',
        transform: `translate(-50%, -50%) scale(${zoom})`,
        transformOrigin: 'center center',
      }}
      onClick={onClick}
      title={`${marker.name}\n${marker.description.substring(0, 100)}...`}
    >
      <div className="marker-icon" style={{ color: getColor() }}>
        {getIcon()}
      </div>
      {marker.severity && (
        <div className="marker-badge" style={{ backgroundColor: getColor() }}>
          {marker.severity}
        </div>
      )}
      {marker.status && (
        <div className="marker-status">{marker.status}</div>
      )}
    </div>
  );
}
