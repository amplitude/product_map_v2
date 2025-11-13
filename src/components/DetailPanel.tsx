import { useMapStore } from '../store/mapStore';
import { X, ChevronLeft, ChevronRight, Users, Eye, Clock, TrendingUp, ExternalLink } from 'lucide-react';
import { useState, useMemo } from 'react';

export function DetailPanel() {
  const { data, selectedPageId, setSelectedPage } = useMapStore();
  const [currentScreenshotIndex, setCurrentScreenshotIndex] = useState(0);

  const selectedPage = useMemo(() => {
    if (!data || !selectedPageId) return null;
    return data.pages.find((p) => p.id === selectedPageId);
  }, [data, selectedPageId]);

  if (!selectedPage) return null;

  const screenshots = selectedPage.screenshots;
  const currentScreenshot = screenshots[currentScreenshotIndex];

  const handlePrevious = () => {
    setCurrentScreenshotIndex((prev) => (prev > 0 ? prev - 1 : screenshots.length - 1));
  };

  const handleNext = () => {
    setCurrentScreenshotIndex((prev) => (prev < screenshots.length - 1 ? prev + 1 : 0));
  };

  // Get related data
  const relatedOverlays = useMemo(() => {
    if (!data) return { taxonomy: [], friction: [], engagement: [], actions: [] };
    return {
      taxonomy: data.taxonomyMarkers.filter((m) => m.pageId === selectedPage.id),
      friction: data.frictionSignals.filter((s) => s.pageId === selectedPage.id),
      engagement: data.engagementPatterns.filter((p) => p.pageId === selectedPage.id),
      actions: data.actionItems.filter((a) => a.pageId === selectedPage.id),
    };
  }, [data, selectedPage.id]);

  // Get inbound/outbound edges
  const edges = useMemo(() => {
    if (!data) return { inbound: [], outbound: [] };
    return {
      inbound: data.edges.filter((e) => e.target === selectedPage.id),
      outbound: data.edges.filter((e) => e.source === selectedPage.id),
    };
  }, [data, selectedPage.id]);

  return (
    <>
      <div className="detail-panel-overlay" onClick={() => setSelectedPage(null)} />
      <div className="detail-panel">
        {/* Header */}
        <div className="detail-panel-header">
          <div>
            <div className="detail-panel-type">{selectedPage.pageType}</div>
            <h2 className="detail-panel-title">{selectedPage.title}</h2>
            <p className="detail-panel-url">{selectedPage.url}</p>
          </div>
          <button className="detail-panel-close" onClick={() => setSelectedPage(null)}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="detail-panel-content">
          {/* Screenshot Carousel */}
          <div className="detail-panel-section">
            <h3>Screenshots ({screenshots.length})</h3>
            <div className="screenshot-carousel">
              <div className="screenshot-main">
                <img
                  src={`/screenshots/${currentScreenshot.filename}`}
                  alt="Page screenshot"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%231e293b" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%23cbd5e1"%3EScreenshot not available%3C/text%3E%3C/svg%3E';
                  }}
                />
                {screenshots.length > 1 && (
                  <>
                    <button className="screenshot-nav screenshot-nav-prev" onClick={handlePrevious}>
                      <ChevronLeft size={24} />
                    </button>
                    <button className="screenshot-nav screenshot-nav-next" onClick={handleNext}>
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}
              </div>
              {screenshots.length > 1 && (
                <div className="screenshot-thumbnails">
                  {screenshots.map((s, idx) => (
                    <button
                      key={s.filename}
                      className={`screenshot-thumbnail ${idx === currentScreenshotIndex ? 'active' : ''}`}
                      onClick={() => setCurrentScreenshotIndex(idx)}
                    >
                      <img src={`/screenshots/${s.filename}`} alt="" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="detail-panel-section">
            <h3>Key Metrics</h3>
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-icon" style={{ background: 'rgba(59, 130, 246, 0.2)' }}>
                  <Users size={18} color="#60a5fa" />
                </div>
                <div className="metric-info">
                  <div className="metric-value">{selectedPage.sessions.toLocaleString()}</div>
                  <div className="metric-label">Sessions</div>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon" style={{ background: 'rgba(16, 185, 129, 0.2)' }}>
                  <Eye size={18} color="#34d399" />
                </div>
                <div className="metric-info">
                  <div className="metric-value">{selectedPage.uniqueUsers.toLocaleString()}</div>
                  <div className="metric-label">Unique Users</div>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon" style={{ background: 'rgba(167, 139, 250, 0.2)' }}>
                  <Clock size={18} color="#a78bfa" />
                </div>
                <div className="metric-info">
                  <div className="metric-value">{selectedPage.avgTimeOnPage || '--'}</div>
                  <div className="metric-label">Avg Time on Page</div>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon" style={{ background: 'rgba(245, 158, 11, 0.2)' }}>
                  <TrendingUp size={18} color="#fbbf24" />
                </div>
                <div className="metric-info">
                  <div className="metric-value">
                    {edges.outbound.length > 0 ? `${Math.round((edges.outbound.reduce((sum, e) => sum + e.sessions, 0) / selectedPage.sessions) * 100)}%` : '--'}
                  </div>
                  <div className="metric-label">Exit Rate</div>
                </div>
              </div>
            </div>
          </div>

          {/* User Flows */}
          <div className="detail-panel-section">
            <h3>User Flows</h3>
            <div className="flows-container">
              {edges.inbound.length > 0 && (
                <div className="flow-section">
                  <h4>Inbound ({edges.inbound.length})</h4>
                  <div className="flow-list">
                    {edges.inbound.slice(0, 5).map((edge) => {
                      const sourcePage = data?.pages.find((p) => p.id === edge.source);
                      return (
                        <div key={edge.id} className="flow-item">
                          <div className="flow-page">{sourcePage?.title || 'Unknown'}</div>
                          <div className="flow-sessions">{edge.sessions} sessions</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {edges.outbound.length > 0 && (
                <div className="flow-section">
                  <h4>Outbound ({edges.outbound.length})</h4>
                  <div className="flow-list">
                    {edges.outbound.slice(0, 5).map((edge) => {
                      const targetPage = data?.pages.find((p) => p.id === edge.target);
                      return (
                        <div key={edge.id} className="flow-item">
                          <div className="flow-page">{targetPage?.title || 'Unknown'}</div>
                          <div className="flow-sessions">{edge.sessions} sessions</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Insights */}
          {(relatedOverlays.friction.length > 0 || relatedOverlays.actions.length > 0) && (
            <div className="detail-panel-section">
              <h3>Insights & Actions</h3>
              <div className="insights-list">
                {relatedOverlays.friction.map((signal) => (
                  <div key={signal.id} className="insight-item friction">
                    <div className="insight-badge" style={{ background: '#ef4444' }}>Friction</div>
                    <div className="insight-content">
                      <div className="insight-title">{signal.type.replace('_', ' ').toUpperCase()}</div>
                      <div className="insight-description">{signal.description}</div>
                      <div className="insight-meta">{signal.affectedSessions} sessions affected</div>
                    </div>
                  </div>
                ))}
                {relatedOverlays.actions.map((action) => (
                  <div key={action.id} className="insight-item action">
                    <div className="insight-badge" style={{ background: '#10b981' }}>
                      {action.type.toUpperCase()}
                    </div>
                    <div className="insight-content">
                      <div className="insight-title">{action.title}</div>
                      <div className="insight-description">{action.description}</div>
                      {action.link && (
                        <a href={action.link} className="insight-link" target="_blank" rel="noopener noreferrer">
                          View Details <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Session Replays Placeholder */}
          <div className="detail-panel-section">
            <h3>Session Replays</h3>
            <div className="session-replays-placeholder">
              <p>Session replays will appear here</p>
              <button className="session-replays-cta">View in Amplitude →</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
