import { useState } from 'react';
import { useMapStore } from '../store/mapStore';
import type { LayerType } from '../types';
import { Layers, Tag, AlertTriangle, Activity, Zap, Flame, Brain, Database, Microscope, Sparkles } from 'lucide-react';

interface NavCategory {
  id: string;
  label: string;
  icon: any;
  color: string;
  items: NavItem[];
}

interface NavItem {
  id: LayerType;
  label: string;
  icon: any;
  stats: { value: string | number; label: string };
}

const NAV_STRUCTURE: NavCategory[] = [
  {
    id: 'data-sources',
    label: 'Data Sources',
    icon: Database,
    color: '#3b82f6',
    items: [
      {
        id: 'taxonomy',
        label: 'Taxonomy',
        icon: Tag,
        stats: { value: '2.8K', label: 'Events' },
      },
      {
        id: 'heatmap',
        label: 'Heatmap',
        icon: Flame,
        stats: { value: '12.4K', label: 'Clicks' },
      },
    ],
  },
  {
    id: 'analysis',
    label: 'Analysis Tools',
    icon: Microscope,
    color: '#8b5cf6',
    items: [
      {
        id: 'friction',
        label: 'Friction',
        icon: AlertTriangle,
        stats: { value: 23, label: 'Issues' },
      },
      {
        id: 'engagement',
        label: 'Engagement',
        icon: Activity,
        stats: { value: '64%', label: 'Avg' },
      },
      {
        id: 'actions',
        label: 'Actions',
        icon: Zap,
        stats: { value: 5, label: 'Active' },
      },
    ],
  },
  {
    id: 'ai-insights',
    label: 'AI Insights',
    icon: Sparkles,
    color: '#f59e0b',
    items: [
      {
        id: 'ai_feedback',
        label: 'Feedback',
        icon: Brain,
        stats: { value: 14, label: 'Suggestions' },
      },
    ],
  },
];

export function FuturisticNav() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>('data-sources');
  const { layers, setActiveLayer } = useMapStore();

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const selectLayer = (layerId: LayerType) => {
    const currentActive = layers.activeLayer;
    setActiveLayer(currentActive === layerId ? null : layerId);
  };

  return (
    <div className="futuristic-nav">
      <div className="nav-header">
        <Layers size={16} />
        <span>Neural Interface</span>
      </div>

      <div className="nav-categories">
        {NAV_STRUCTURE.map((category) => {
          const isExpanded = expandedCategory === category.id;
          const CategoryIcon = category.icon;

          return (
            <div
              key={category.id}
              className={`nav-category ${isExpanded ? 'expanded' : 'collapsed'}`}
            >
              {/* Category Header - Hexagonal Button */}
              <button
                className="category-button"
                onClick={() => toggleCategory(category.id)}
                style={{ '--category-color': category.color } as React.CSSProperties}
              >
                <div className="category-hex">
                  <svg viewBox="0 0 100 100" className="hex-bg">
                    <polygon
                      points="50 1 95 25 95 75 50 99 5 75 5 25"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                  <div className="category-icon">
                    <CategoryIcon size={20} />
                  </div>
                </div>
                <div className="category-content">
                  <div className="category-label">{category.label}</div>
                  <div className="category-count">{category.items.length} layers</div>
                </div>
                <div className={`category-indicator ${isExpanded ? 'active' : ''}`}>
                  <div className="indicator-line" />
                  <div className="indicator-dot" />
                </div>
              </button>

              {/* Expanded Items - Arc Layout */}
              {isExpanded && (
                <div className="category-items">
                  {category.items.map((item, index) => {
                    const ItemIcon = item.icon;
                    const isActive = layers.activeLayer === item.id;

                    return (
                      <button
                        key={item.id}
                        className={`nav-item ${isActive ? 'active' : ''}`}
                        onClick={() => selectLayer(item.id)}
                        style={{
                          '--item-index': index,
                          '--item-delay': `${index * 0.05}s`,
                        } as React.CSSProperties}
                      >
                        <div className="item-connector">
                          <svg width="40" height="40" viewBox="0 0 40 40">
                            <path
                              d="M 0 20 Q 20 20, 40 20"
                              stroke="currentColor"
                              strokeWidth="2"
                              fill="none"
                              className="connector-path"
                            />
                          </svg>
                        </div>
                        <div className="item-content">
                          <div className="item-icon">
                            <ItemIcon size={16} />
                          </div>
                          <div className="item-info">
                            <div className="item-label">{item.label}</div>
                            <div className="item-stats">
                              <span className="stat-value">{item.stats.value}</span>
                              <span className="stat-label">{item.stats.label}</span>
                            </div>
                          </div>
                          {isActive && (
                            <div className="item-pulse">
                              <div className="pulse-ring" />
                              <div className="pulse-ring" />
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Base Layer - Always Visible at Bottom */}
      <div className="nav-base-layer">
        <button
          className={`base-layer-button ${layers.activeLayer === null ? 'active' : ''}`}
          onClick={() => setActiveLayer(null)}
        >
          <div className="base-layer-glow" />
          <Layers size={20} />
          <span>Base Flow</span>
          <div className="base-layer-badge">Core</div>
        </button>
      </div>
    </div>
  );
}
