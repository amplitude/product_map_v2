import { memo, useMemo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import type { PageNode as PageNodeType, TaxonomyMarker, FrictionSignal, EngagementPattern, ActionItem, AIFeedback } from '../types';
import { Users, Eye, AlertCircle, CheckCircle2, Zap, Hammer, Lightbulb, MousePointerClick, Loader, AlertTriangle, Brain } from 'lucide-react';
import { useMapStore } from '../store/mapStore';

export const PageNode = memo((props: NodeProps) => {
  const data = props.data as unknown as PageNodeType;
  const { layers, selectedPageId, setSelectedPage, data: mapData } = useMapStore();
  const isSelected = selectedPageId === data.id;

  // Get a representative screenshot
  const screenshot = data.screenshots[0];
  const screenshotUrl = screenshot ? `/screenshots/${screenshot.filename}` : null;

  // Get overlays for this page
  const pageOverlays = useMemo(() => {
    if (!mapData) return { taxonomy: [], friction: [], engagement: [], actions: [], aiFeedback: [] };

    return {
      taxonomy: mapData.taxonomyMarkers.filter(m => m.pageId === data.id),
      friction: mapData.frictionSignals.filter(s => s.pageId === data.id),
      engagement: mapData.engagementPatterns.filter(p => p.pageId === data.id),
      actions: mapData.actionItems.filter(a => a.pageId === data.id),
      aiFeedback: mapData.aiFeedback.filter(a => a.pageId === data.id),
    };
  }, [mapData, data.id]);

  // Collect overlay indicators for badge display
  const hasFriction = layers.activeLayer === 'friction' && pageOverlays.friction.length > 0;
  const hasActions = layers.activeLayer === 'actions' && pageOverlays.actions.length > 0;
  const hasTaxonomyIssues = layers.activeLayer === 'taxonomy' && pageOverlays.taxonomy.some(t => !t.instrumented);

  return (
    <div
      className={`page-node ${isSelected ? 'selected' : ''}`}
      onClick={() => setSelectedPage(data.id)}
    >
      <Handle type="target" position={Position.Left} className="node-handle" />

      {/* Screenshot thumbnail */}
      <div className="page-node-thumbnail">
        {screenshotUrl ? (
          <img src={screenshotUrl} alt={data.title} loading="lazy" />
        ) : (
          <div className="page-node-placeholder">
            <Eye size={24} opacity={0.3} />
          </div>
        )}

        {/* Overlay indicators */}
        <div className="page-node-indicators">
          {hasFriction && (
            <div className="indicator friction" title="Friction detected">
              <AlertCircle size={16} />
            </div>
          )}
          {hasActions && (
            <div className="indicator action" title="Active experiments">
              <CheckCircle2 size={16} />
            </div>
          )}
        </div>
      </div>

      {/* Page info */}
      <div className="page-node-content">
        <div className="page-node-type">{data.pageType}</div>
        <div className="page-node-title">{data.title}</div>

        {/* Metrics */}
        <div className="page-node-metrics">
          <div className="metric" title="Unique sessions">
            <Users size={14} />
            <span>{data.sessions.toLocaleString()}</span>
          </div>
          <div className="metric" title="Unique users">
            <Eye size={14} />
            <span>{data.uniqueUsers.toLocaleString()}</span>
          </div>
        </div>

        {/* Taxonomy status */}
        {layers.activeLayer === 'taxonomy' && (
          <div className="page-node-taxonomy">
            <div className={`taxonomy-badge ${hasTaxonomyIssues ? 'incomplete' : 'complete'}`}>
              {hasTaxonomyIssues ? 'Instrumentation Gaps' : 'Fully Instrumented'}
            </div>
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Right} className="node-handle" />

      {/* Overlay Components - Show based on active layer */}
      {layers.activeLayer === 'taxonomy' && pageOverlays.taxonomy.length > 0 && (
        <div style={{ position: 'absolute', top: 10, left: 10 }}>
          {pageOverlays.taxonomy.slice(0, 1).map((marker) => (
            <TaxonomyMarkerView key={marker.id} marker={marker} />
          ))}
        </div>
      )}

      {layers.activeLayer === 'friction' && pageOverlays.friction.length > 0 && (
        <div style={{ position: 'absolute', top: 10, right: 10 }}>
          {pageOverlays.friction.slice(0, 1).map((signal) => (
            <FrictionSignalView key={signal.id} signal={signal} />
          ))}
        </div>
      )}

      {layers.activeLayer === 'engagement' && pageOverlays.engagement.length > 0 && (
        <div style={{ position: 'absolute', bottom: 10, left: 10 }}>
          {pageOverlays.engagement.slice(0, 1).map((pattern) => (
            <EngagementPatternView key={pattern.id} pattern={pattern} />
          ))}
        </div>
      )}

      {layers.activeLayer === 'actions' && pageOverlays.actions.length > 0 && (
        <div style={{ position: 'absolute', bottom: 10, right: 10 }}>
          {pageOverlays.actions.slice(0, 1).map((action) => (
            <ActionItemView key={action.id} action={action} />
          ))}
        </div>
      )}

      {layers.activeLayer === 'ai_feedback' && pageOverlays.aiFeedback.length > 0 && (
        <AIFeedbackView feedback={pageOverlays.aiFeedback[0]} />
      )}
    </div>
  );
});

PageNode.displayName = 'PageNode';

// Overlay view components
function TaxonomyMarkerView({ marker }: { marker: TaxonomyMarker }) {
  const getStatusColor = () => {
    if (!marker.instrumented) return '#ef4444';
    if (marker.properties.length < 3) return '#f59e0b';
    return '#10b981';
  };

  const getStatusLabel = () => {
    if (!marker.instrumented) return 'Not Instrumented';
    if (marker.properties.length < 3) return 'Incomplete Properties';
    return 'Fully Instrumented';
  };

  return (
    <div className="taxonomy-marker">
      <div className="taxonomy-marker-icon" style={{ background: getStatusColor() }}>
        <svg width="12" height="12" viewBox="0 0 12 12">
          <circle cx="6" cy="6" r="5" fill="white" opacity="0.9" />
        </svg>
      </div>
      <div className="taxonomy-marker-tooltip">
        <div className="taxonomy-marker-header">
          <span className="taxonomy-marker-event">{marker.eventName}</span>
          <span className="taxonomy-marker-volume">{marker.volume.toLocaleString()}</span>
        </div>
        <div className="taxonomy-marker-status" style={{ color: getStatusColor() }}>
          {getStatusLabel()}
        </div>
        {marker.properties.length > 0 && (
          <div className="taxonomy-marker-properties">
            <strong>Properties:</strong>
            <ul>
              {marker.properties.map((prop) => (
                <li key={prop}>{prop}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function FrictionSignalView({ signal }: { signal: FrictionSignal }) {
  const getIcon = () => {
    switch (signal.type) {
      case 'drop_off': return AlertTriangle;
      case 'error': return Zap;
      case 'rage_click': return MousePointerClick;
      case 'slow_load': return Loader;
      default: return AlertTriangle;
    }
  };

  const getColor = () => {
    switch (signal.severity) {
      case 'critical': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#f59e0b';
      case 'low': return '#fbbf24';
      default: return '#f59e0b';
    }
  };

  const Icon = getIcon();

  return (
    <div className={`friction-signal severity-${signal.severity}`}>
      <div className="friction-signal-icon" style={{ background: getColor() }}>
        <Icon size={16} color="white" />
      </div>
      <div className="friction-signal-pulse" style={{ background: getColor() }} />
      <div className="friction-signal-tooltip">
        <div className="friction-signal-header">
          <span className="friction-signal-type">{signal.type.replace('_', ' ').toUpperCase()}</span>
          <span className="friction-signal-severity" style={{ background: getColor() }}>{signal.severity}</span>
        </div>
        <div className="friction-signal-description">{signal.description}</div>
        <div className="friction-signal-impact">
          <strong>Affected Sessions:</strong> {signal.affectedSessions.toLocaleString()}
        </div>
      </div>
    </div>
  );
}

function EngagementPatternView({ pattern }: { pattern: EngagementPattern }) {
  const scrollDepth = pattern.type === 'scroll_depth' ? (pattern.data?.avgScrollDepth || pattern.avgValue || 0) : 0;

  return (
    <div className="engagement-pattern">
      <div className="engagement-scroll-depth">
        <div className="scroll-depth-bar">
          <div
            className="scroll-depth-fill"
            style={{
              height: `${scrollDepth}%`,
              background: `rgba(167, 139, 250, ${0.3 + (scrollDepth / 100) * 0.7})`,
            }}
          />
        </div>
        <div className="scroll-depth-label">{Math.round(scrollDepth)}%</div>
      </div>
      <div className="engagement-pattern-tooltip">
        <div className="engagement-pattern-header">
          <span className="engagement-pattern-type">SCROLL DEPTH</span>
        </div>
        <div className="engagement-pattern-value">Average: {Math.round(scrollDepth)}%</div>
      </div>
    </div>
  );
}

function ActionItemView({ action }: { action: ActionItem }) {
  const getIcon = () => {
    switch (action.type) {
      case 'experiment': return Zap;
      case 'pr': return Hammer;
      case 'candidate': return Lightbulb;
      case 'completed': return CheckCircle2;
      default: return Zap;
    }
  };

  const getColor = () => {
    switch (action.status) {
      case 'active': return '#10b981';
      case 'in_dev': return '#f59e0b';
      case 'proposed': return '#3b82f6';
      case 'shipped': return '#6b7280';
      default: return '#3b82f6';
    }
  };

  const Icon = getIcon();

  return (
    <div className="action-item">
      <div className="action-item-icon" style={{ background: getColor() }}>
        <Icon size={14} color="white" />
      </div>
      {action.status === 'active' && (
        <div className="action-item-pulse" style={{ background: getColor() }} />
      )}
      <div className="action-item-tooltip">
        <div className="action-item-header">
          <span className="action-item-type">{action.type.toUpperCase()}</span>
          <span className="action-item-status" style={{ background: getColor() }}>
            {action.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
        <div className="action-item-title">{action.title}</div>
        <div className="action-item-description">{action.description}</div>
      </div>
    </div>
  );
}

function AIFeedbackView({ feedback }: { feedback: AIFeedback }) {
  const getIcon = () => {
    switch (feedback.type) {
      case 'suggestion': return Lightbulb;
      case 'warning': return AlertCircle;
      case 'insight': return Brain;
      case 'optimization': return Zap;
      default: return Brain;
    }
  };

  const getColor = () => {
    switch (feedback.type) {
      case 'suggestion': return '#fbbf24';
      case 'warning': return '#f87171';
      case 'insight': return '#8b5cf6';
      case 'optimization': return '#34d399';
      default: return '#8b5cf6';
    }
  };

  const Icon = getIcon();

  return (
    <div className="ai-feedback-item">
      <div className="ai-feedback-icon" style={{ background: getColor() }}>
        <Icon size={16} color="white" />
      </div>
      <div className="ai-feedback-content">
        <div className="ai-feedback-type" style={{ color: getColor() }}>
          {feedback.type.toUpperCase()}
        </div>
        <div className="ai-feedback-title">{feedback.title}</div>
        <div className="ai-feedback-description">{feedback.description}</div>
        <div className="ai-feedback-meta">
          <span className="ai-feedback-confidence">
            {Math.round(feedback.confidence * 100)}% confidence
          </span>
          {feedback.actionable && (
            <span className="ai-feedback-actionable">
              <CheckCircle2 size={12} /> Actionable
            </span>
          )}
        </div>
      </div>
      <div className={`ai-feedback-impact ${feedback.impact}`}>
        {feedback.impact}
      </div>
    </div>
  );
}
