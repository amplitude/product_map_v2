import { useState, useEffect } from 'react';
import { useMapStore } from '../store/mapStore';
import { ChevronUp, ChevronDown, BarChart3, TrendingDown, AlertTriangle, Activity, Users, Sparkles, Eye, TrendingUp } from 'lucide-react';

type CategoryType = 'overview' | 'conversion' | 'retention' | 'friction' | 'behaviors' | 'sessions';

const CATEGORIES = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'conversion', label: 'Conversion', icon: TrendingDown },
  { id: 'retention', label: 'Retention', icon: Users },
  { id: 'friction', label: 'Friction', icon: AlertTriangle },
  { id: 'behaviors', label: 'Behaviors', icon: Activity },
  { id: 'sessions', label: 'Interesting Sessions', icon: Sparkles },
] as const;

export function BottomInsightsPanel() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CategoryType>('overview');
  const [panelHeight, setPanelHeight] = useState(450);
  const [isResizing, setIsResizing] = useState(false);

  const { data } = useMapStore();

  // Resize functionality
  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newHeight = window.innerHeight - e.clientY;
      setPanelHeight(Math.max(250, Math.min(700, newHeight)));
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // Don't auto-expand - let user control panel state
  // User can manually expand to view analytics when needed

  if (!data) return null;

  // Calculate metrics
  const totalSessions = data.pages.reduce((sum, p) => sum + p.sessions, 0);
  const criticalIssues = data.frictionSignals.filter(s => s.severity === 'critical').length;
  const avgEngagement = Math.round(
    (data.engagementPatterns.reduce((sum, p) => sum + (p.avgValue || 0), 0) / data.engagementPatterns.length) || 0
  );

  return (
    <>
      <div
        className={`bottom-insights-panel ${isExpanded ? 'expanded' : 'collapsed'}`}
        style={{
          height: isExpanded ? `${panelHeight}px` : '48px',
          '--panel-height': isExpanded ? `${panelHeight}px` : '48px',
        } as React.CSSProperties}
      >
        {/* Resize Handle */}
        {isExpanded && (
          <div
            className={`resize-handle resize-handle-horizontal ${isResizing ? 'resizing' : ''}`}
            style={{ top: 0 }}
            onMouseDown={() => setIsResizing(true)}
          />
        )}

        {/* Header with toggle */}
        <div className="insights-header">
          <button
            className="insights-toggle"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
            <span>Journey Health & Analytics</span>
          </button>
        </div>

        {/* Content with vertical tabs */}
        {isExpanded && (
          <div className="insights-body">
            {/* Vertical Category Tabs */}
            <div className="category-tabs">
              {CATEGORIES.map((category) => {
                const Icon = category.icon;
                const isActive = activeCategory === category.id;

                return (
                  <button
                    key={category.id}
                    className={`category-tab ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveCategory(category.id as CategoryType)}
                  >
                    <Icon size={18} />
                    <span>{category.label}</span>
                    {isActive && <div className="tab-active-bar" />}
                  </button>
                );
              })}
            </div>

            {/* Category Content */}
            <div className="category-content">
              {activeCategory === 'overview' && (
                <div className="category-panel">
                  <h2>Top Takeaways</h2>
                  <div className="takeaways-grid">
                    <div className="takeaway-card critical">
                      <div className="takeaway-icon">🚨</div>
                      <div className="takeaway-content">
                        <div className="takeaway-title">Critical Drop-off Alert</div>
                        <div className="takeaway-desc">Dashboard has 45% exit rate - highest in funnel</div>
                        <div className="takeaway-action">Review session replays →</div>
                      </div>
                    </div>
                    <div className="takeaway-card success">
                      <div className="takeaway-icon">✨</div>
                      <div className="takeaway-content">
                        <div className="takeaway-title">Strong Activation</div>
                        <div className="takeaway-desc">Chart Builder sees 82% feature adoption</div>
                        <div className="takeaway-action">Optimize further →</div>
                      </div>
                    </div>
                    <div className="takeaway-card warning">
                      <div className="takeaway-icon">💡</div>
                      <div className="takeaway-content">
                        <div className="takeaway-title">Instrumentation Gap</div>
                        <div className="takeaway-desc">23 events missing key properties</div>
                        <div className="takeaway-action">Fix taxonomy →</div>
                      </div>
                    </div>
                  </div>

                  <div className="overview-stats">
                    <div className="overview-stat-card">
                      <div className="stat-icon"><TrendingUp size={24} /></div>
                      <div className="stat-content">
                        <div className="stat-value">42.3%</div>
                        <div className="stat-label">Overall Conversion</div>
                        <div className="stat-change positive">+5.2% vs last week</div>
                      </div>
                    </div>
                    <div className="overview-stat-card">
                      <div className="stat-icon"><Users size={24} /></div>
                      <div className="stat-content">
                        <div className="stat-value">{totalSessions.toLocaleString()}</div>
                        <div className="stat-label">Total Sessions</div>
                        <div className="stat-change positive">+12% vs last week</div>
                      </div>
                    </div>
                    <div className="overview-stat-card">
                      <div className="stat-icon"><AlertTriangle size={24} /></div>
                      <div className="stat-content">
                        <div className="stat-value">{criticalIssues}</div>
                        <div className="stat-label">Critical Issues</div>
                        <div className="stat-change negative">-2 vs last week</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeCategory === 'conversion' && (
                <div className="category-panel">
                  <h2>Funnel Conversion Analysis</h2>
                  <div className="funnel-plot">
                    <svg width="100%" height="300" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid meet">
                      {/* Funnel stages */}
                      <rect x="50" y="40" width="150" height="60" fill="#3b82f6" opacity="0.8" rx="4" />
                      <text x="125" y="75" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="600">Login</text>
                      <text x="125" y="95" textAnchor="middle" fill="#fff" fontSize="12">100%</text>

                      <polygon points="200,70 230,50 230,90" fill="#64748b" opacity="0.5" />

                      <rect x="230" y="50" width="140" height="50" fill="#3b82f6" opacity="0.7" rx="4" />
                      <text x="300" y="80" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="600">Dashboard</text>
                      <text x="300" y="95" textAnchor="middle" fill="#fff" fontSize="12">78%</text>

                      <polygon points="370,75 400,60 400,90" fill="#64748b" opacity="0.5" />

                      <rect x="400" y="60" width="130" height="40" fill="#3b82f6" opacity="0.6" rx="4" />
                      <text x="465" y="85" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="600">Analysis</text>
                      <text x="465" y="100" textAnchor="middle" fill="#fff" fontSize="12">61%</text>

                      <polygon points="530,80 560,70 560,90" fill="#64748b" opacity="0.5" />

                      <rect x="560" y="70" width="120" height="30" fill="#10b981" opacity="0.8" rx="4" />
                      <text x="620" y="90" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="600">Convert</text>
                      <text x="620" y="105" textAnchor="middle" fill="#fff" fontSize="12">42%</text>

                      {/* Drop-off annotations */}
                      <text x="300" y="130" textAnchor="middle" fill="#f87171" fontSize="11">-22% drop</text>
                      <text x="465" y="140" textAnchor="middle" fill="#fbbf24" fontSize="11">-17% drop</text>
                      <text x="620" y="150" textAnchor="middle" fill="#f87171" fontSize="11">-19% drop</text>
                    </svg>
                  </div>

                  <div className="conversion-metrics">
                    <div className="conversion-stat">
                      <span className="label">Overall Conversion</span>
                      <span className="value">42.3%</span>
                    </div>
                    <div className="conversion-stat">
                      <span className="label">Avg Time to Convert</span>
                      <span className="value">4m 32s</span>
                    </div>
                    <div className="conversion-stat">
                      <span className="label">Largest Drop-off</span>
                      <span className="value danger">Dashboard (-22%)</span>
                    </div>
                  </div>
                </div>
              )}

              {activeCategory === 'retention' && (
                <div className="category-panel">
                  <h2>Retention by Cohort</h2>
                  <div className="cohort-selector">
                    <button className="cohort-btn active">New Users</button>
                    <button className="cohort-btn">Power Users</button>
                    <button className="cohort-btn">At-Risk</button>
                  </div>

                  <div className="retention-graph">
                    <svg width="100%" height="280" viewBox="0 0 800 280">
                      {/* Grid lines */}
                      {[0, 20, 40, 60, 80, 100].map((y) => (
                        <g key={y}>
                          <line x1="60" y1={240 - y * 2} x2="760" y2={240 - y * 2} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                          <text x="40" y={245 - y * 2} fill="#94a3b8" fontSize="11" textAnchor="end">{y}%</text>
                        </g>
                      ))}

                      {/* Retention curves */}
                      <path d="M 60 40 L 160 60 L 260 85 L 360 110 L 460 130 L 560 145 L 660 155 L 760 165"
                        stroke="#10b981" strokeWidth="3" fill="none" strokeLinecap="round" />
                      <path d="M 60 40 L 160 70 L 260 105 L 360 140 L 460 165 L 560 180 L 660 190 L 760 195"
                        stroke="#f59e0b" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="5,5" />
                      <path d="M 60 40 L 160 50 L 260 65 L 360 82 L 460 95 L 560 105 L 660 112 L 760 118"
                        stroke="#8b5cf6" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="8,4" />

                      {/* Legend */}
                      <g transform="translate(60, 260)">
                        <circle cx="0" cy="0" r="4" fill="#10b981" />
                        <text x="10" y="4" fill="#10b981" fontSize="12">New Users (D1: 88%)</text>

                        <circle cx="150" cy="0" r="4" fill="#f59e0b" />
                        <text x="160" y="4" fill="#f59e0b" fontSize="12">Power Users (D1: 76%)</text>

                        <circle cx="320" cy="0" r="4" fill="#8b5cf6" />
                        <text x="330" y="4" fill="#8b5cf6" fontSize="12">At-Risk (D1: 94%)</text>
                      </g>

                      {/* Time labels */}
                      {['D1', 'D3', 'D7', 'D14', 'D30', 'D60', 'D90'].map((label, idx) => (
                        <text key={label} x={60 + idx * 100} y="255" fill="#94a3b8" fontSize="11" textAnchor="middle">{label}</text>
                      ))}
                    </svg>
                  </div>

                  <div className="cohort-stats">
                    <div className="cohort-metric">
                      <span className="metric-label">Day 1 Retention</span>
                      <span className="metric-value">86%</span>
                    </div>
                    <div className="cohort-metric">
                      <span className="metric-label">Day 30 Retention</span>
                      <span className="metric-value">34%</span>
                    </div>
                    <div className="cohort-metric">
                      <span className="metric-label">Avg Session Length</span>
                      <span className="metric-value">8m 42s</span>
                    </div>
                  </div>
                </div>
              )}

              {activeCategory === 'friction' && (
                <div className="category-panel">
                  <h2>Friction Analysis</h2>
                  <div className="friction-summary">
                    <div className="friction-stat-large critical">
                      <div className="stat-number">{criticalIssues}</div>
                      <div className="stat-label">Critical Issues</div>
                    </div>
                    <div className="friction-stat-large high">
                      <div className="stat-number">{data.frictionSignals.filter(s => s.severity === 'high').length}</div>
                      <div className="stat-label">High Priority</div>
                    </div>
                    <div className="friction-stat-large medium">
                      <div className="stat-number">{data.frictionSignals.filter(s => s.severity === 'medium').length}</div>
                      <div className="stat-label">Medium Priority</div>
                    </div>
                  </div>

                  <div className="friction-breakdown">
                    <h3>By Type</h3>
                    <div className="friction-types">
                      {['drop_off', 'error', 'rage_click', 'slow_load'].map((type) => {
                        const count = data.frictionSignals.filter(s => s.type === type).length;
                        return (
                          <div key={type} className="friction-type-card">
                            <AlertTriangle size={16} />
                            <span className="type-label">{type.replace('_', ' ')}</span>
                            <span className="type-count">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="friction-components">
                    <h3>Top Problem Areas</h3>
                    <div className="problem-list">
                      <div className="problem-item">
                        <div className="problem-page">Dashboard → Analysis</div>
                        <div className="problem-metric">128 rage clicks</div>
                      </div>
                      <div className="problem-item">
                        <div className="problem-page">Chart Builder</div>
                        <div className="problem-metric">4.2s load time</div>
                      </div>
                      <div className="problem-item">
                        <div className="problem-page">Login → Home</div>
                        <div className="problem-metric">18% error rate</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeCategory === 'behaviors' && (
                <div className="category-panel">
                  <h2>Browsing Analytics</h2>
                  <div className="behavior-grid">
                    <div className="behavior-chart">
                      <h3>Scroll Depth Distribution</h3>
                      <div className="scroll-bars">
                        {[
                          { range: '0-25%', percent: 12 },
                          { range: '25-50%', percent: 23 },
                          { range: '50-75%', percent: 35 },
                          { range: '75-100%', percent: 30 },
                        ].map((bar) => (
                          <div key={bar.range} className="scroll-bar-row">
                            <span className="scroll-label">{bar.range}</span>
                            <div className="scroll-bar-bg">
                              <div className="scroll-bar-fill" style={{ width: `${bar.percent * 2}%` }} />
                            </div>
                            <span className="scroll-percent">{bar.percent}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="behavior-stats">
                      <h3>Engagement Metrics</h3>
                      <div className="engagement-metrics">
                        <div className="engagement-metric">
                          <Activity size={20} />
                          <div>
                            <div className="metric-value">{avgEngagement}%</div>
                            <div className="metric-label">Avg Engagement</div>
                          </div>
                        </div>
                        <div className="engagement-metric">
                          <Eye size={20} />
                          <div>
                            <div className="metric-value">3m 24s</div>
                            <div className="metric-label">Avg Dwell Time</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeCategory === 'sessions' && (
                <div className="category-panel">
                  <h2>Interesting Sessions</h2>
                  <div className="sessions-list">
                    {[
                      { id: 'abc123', type: 'Power User', events: 142, duration: '18m 34s', badge: 'High Value' },
                      { id: 'def456', type: 'Rage Quit', events: 38, duration: '2m 12s', badge: 'Friction' },
                      { id: 'ghi789', type: 'Feature Discovery', events: 87, duration: '12m 08s', badge: 'Success' },
                      { id: 'jkl012', type: 'Error Loop', events: 24, duration: '4m 45s', badge: 'Error' },
                      { id: 'mno345', type: 'Perfect Flow', events: 76, duration: '8m 22s', badge: 'Ideal' },
                    ].map((session) => (
                      <div key={session.id} className="session-card">
                        <div className="session-header">
                          <span className="session-id">{session.id}</span>
                          <span className={`session-badge ${session.badge.toLowerCase().replace(' ', '-')}`}>
                            {session.badge}
                          </span>
                        </div>
                        <div className="session-type">{session.type}</div>
                        <div className="session-stats">
                          <span>{session.events} events</span>
                          <span>{session.duration}</span>
                        </div>
                        <button className="session-replay-btn">Watch Replay →</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* No backdrop - let content resize naturally */}
    </>
  );
}
