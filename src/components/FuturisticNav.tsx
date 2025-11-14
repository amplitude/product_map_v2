import { useState } from 'react';
import { useMapStore } from '../store/mapStore';
import type { LayerType } from '../types';
import {
  Layers,
  Tag,
  Database,
  BarChart3,
  LayoutDashboard,
  Users,
  GitPullRequest,
  FlaskConical,
  Target,
  Lightbulb,
  Activity,
  AlertTriangle,
  Gauge,
  Navigation,
  ListChecks,
  Brain,
} from 'lucide-react';

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
    id: 'data-management',
    label: 'Data Management',
    icon: Database,
    color: '#3b82f6',
    items: [
      {
        id: 'taxonomy',
        label: 'Taxonomy',
        icon: Tag,
        stats: { value: '2.8K', label: 'Events' },
      },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    color: '#8b5cf6',
    items: [
      {
        id: 'metrics',
        label: 'Metrics',
        icon: Activity,
        stats: { value: 156, label: 'Tracked' },
      },
      {
        id: 'charts',
        label: 'Charts',
        icon: BarChart3,
        stats: { value: 8, label: 'Active' },
      },
      {
        id: 'dashboards',
        label: 'Dashboards',
        icon: LayoutDashboard,
        stats: { value: 12, label: 'Views' },
      },
      {
        id: 'cohorts',
        label: 'Cohorts',
        icon: Users,
        stats: { value: '24', label: 'Groups' },
      },
    ],
  },
  {
    id: 'product-insights',
    label: 'Product Insights',
    icon: Lightbulb,
    color: '#f59e0b',
    items: [
      {
        id: 'friction',
        label: 'Friction',
        icon: AlertTriangle,
        stats: { value: 23, label: 'Issues' },
      },
      {
        id: 'behavioral',
        label: 'Behavioral',
        icon: Users,
        stats: { value: '89%', label: 'Engaged' },
      },
      {
        id: 'performance',
        label: 'Performance',
        icon: Gauge,
        stats: { value: '2.4s', label: 'Avg Load' },
      },
      {
        id: 'navigation',
        label: 'Navigation',
        icon: Navigation,
        stats: { value: '156', label: 'Paths' },
      },
      {
        id: 'tasks',
        label: 'Tasks',
        icon: ListChecks,
        stats: { value: '72%', label: 'Complete' },
      },
      {
        id: 'ai_feedback',
        label: 'AI Feedback',
        icon: Brain,
        stats: { value: 14, label: 'Insights' },
      },
    ],
  },
  {
    id: 'actions',
    label: 'Actions',
    icon: Target,
    color: '#10b981',
    items: [
      {
        id: 'pull_requests',
        label: 'Pull Requests',
        icon: GitPullRequest,
        stats: { value: 7, label: 'Open' },
      },
      {
        id: 'experiments',
        label: 'Experiments',
        icon: FlaskConical,
        stats: { value: 4, label: 'Running' },
      },
      {
        id: 'guides_surveys',
        label: 'Guides & Surveys',
        icon: Target,
        stats: { value: 12, label: 'Active' },
      },
    ],
  },
];

export function FuturisticNav() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>('data-management');
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
