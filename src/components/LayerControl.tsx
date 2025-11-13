import { useMapStore } from '../store/mapStore';
import { Layers, Tag, AlertTriangle, Activity, Zap, Flame, Brain, TrendingUp } from 'lucide-react';
import type { LayerType } from '../types';
import { useMemo } from 'react';

type LayerTypeKey = Exclude<LayerType, 'base'>;

const LAYER_CONFIG: Record<LayerTypeKey, {
  label: string;
  icon: any;
  color: string;
  description: string;
  stats: { label: string; value: string | number };
}> = {
  taxonomy: {
    label: 'Taxonomy',
    icon: Tag,
    color: '#34d399',
    description: 'Event instrumentation and properties',
    stats: { label: 'Events Tracked', value: '2,847' },
  },
  friction: {
    label: 'Friction Signals',
    icon: AlertTriangle,
    color: '#f87171',
    description: 'Drop-offs, errors, and user struggles',
    stats: { label: 'Issues Detected', value: 23 },
  },
  engagement: {
    label: 'Engagement',
    icon: Activity,
    color: '#a78bfa',
    description: 'Scroll depth, dwell time, attention',
    stats: { label: 'Avg Engagement', value: '64%' },
  },
  actions: {
    label: 'Actions',
    icon: Zap,
    color: '#fbbf24',
    description: 'Experiments, PRs, and feature candidates',
    stats: { label: 'Active Tests', value: 5 },
  },
  heatmap: {
    label: 'Heatmap',
    icon: Flame,
    color: '#fb923c',
    description: 'Click density and interaction patterns',
    stats: { label: 'Click Events', value: '12.4K' },
  },
  ai_feedback: {
    label: 'AI Feedback',
    icon: Brain,
    color: '#8b5cf6',
    description: 'ML-powered insights and recommendations',
    stats: { label: 'Suggestions', value: 14 },
  },
};

interface LayerStats {
  activeCount: number;
  impactScore: number;
}

export function LayerControl() {
  const { layers, data, setActiveLayer } = useMapStore();
  const activeLayer = layers.activeLayer;

  const layerStats = useMemo((): Record<LayerTypeKey, LayerStats> => {
    if (!data) {
      return {
        taxonomy: { activeCount: 0, impactScore: 0 },
        friction: { activeCount: 0, impactScore: 0 },
        engagement: { activeCount: 0, impactScore: 0 },
        actions: { activeCount: 0, impactScore: 0 },
        heatmap: { activeCount: 0, impactScore: 0 },
        ai_feedback: { activeCount: 0, impactScore: 0 },
      };
    }

    return {
      taxonomy: {
        activeCount: data.taxonomyMarkers.length,
        impactScore: data.taxonomyMarkers.filter(m => !m.instrumented).length,
      },
      friction: {
        activeCount: data.frictionSignals.filter(s => s.severity === 'critical' || s.severity === 'high').length,
        impactScore: data.frictionSignals.reduce((sum, s) => sum + (s.affectedSessions || 0), 0),
      },
      engagement: {
        activeCount: data.engagementPatterns.length,
        impactScore: Math.round((data.engagementPatterns.reduce((sum, p) => sum + (p.avgValue || 0), 0) / data.engagementPatterns.length) * 100),
      },
      actions: {
        activeCount: data.actionItems.filter(a => a.status === 'active').length,
        impactScore: data.actionItems.length,
      },
      heatmap: {
        activeCount: data.pages.length,
        impactScore: data.pages.reduce((sum, p) => sum + p.sessions, 0),
      },
      ai_feedback: {
        activeCount: data.aiFeedback.length,
        impactScore: data.aiFeedback.filter(a => a.actionable).length,
      },
    };
  }, [data]);

  return (
    <div className="layer-control">
      <div className="layer-control-header">
        <Layers size={16} />
        <span>Data Layers</span>
      </div>

      {/* Base layer - always visible */}
      <div className="layer-control-base">
        <button
          className={`layer-card-base ${activeLayer === null ? 'active' : ''}`}
          onClick={() => setActiveLayer(null)}
        >
          <div className="layer-card-icon" style={{ background: '#60a5fa' }}>
            <Layers size={20} color="white" />
          </div>
          <div className="layer-card-content">
            <div className="layer-card-title">Base Flow</div>
            <div className="layer-card-desc">Journey paths and page nodes</div>
          </div>
          <div className="layer-card-badge">Always On</div>
        </button>
      </div>

      {/* Layer cards */}
      <div className="layer-cards-container">
        {(Object.keys(LAYER_CONFIG) as LayerTypeKey[]).map((layerKey) => {
          const config = LAYER_CONFIG[layerKey];
          const Icon = config.icon;
          const isActive = activeLayer === layerKey;
          const stats = layerStats[layerKey];

          return (
            <button
              key={layerKey}
              className={`layer-card ${isActive ? 'active' : ''}`}
              onClick={() => setActiveLayer(isActive ? null : layerKey)}
            >
              <div className="layer-card-header">
                <div className="layer-card-icon" style={{ background: config.color }}>
                  <Icon size={20} color="white" />
                </div>
                {isActive && <div className="layer-card-active-indicator" style={{ background: config.color }} />}
              </div>

              <div className="layer-card-content">
                <div className="layer-card-title">{config.label}</div>
                <div className="layer-card-desc">{config.description}</div>
              </div>

              <div className="layer-card-analytics">
                <div className="analytics-row">
                  <span className="analytics-label">{config.stats.label}</span>
                  <span className="analytics-value">{config.stats.value}</span>
                </div>
                <div className="analytics-row">
                  <span className="analytics-label">Active Items</span>
                  <span className="analytics-value">{stats.activeCount}</span>
                </div>
                {stats.impactScore > 0 && (
                  <div className="analytics-row impact">
                    <TrendingUp size={14} />
                    <span className="analytics-value">{stats.impactScore} impact</span>
                  </div>
                )}
              </div>

              <div className="layer-card-radio">
                <div className={`radio-button ${isActive ? 'checked' : ''}`} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
