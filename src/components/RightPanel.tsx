import { useState, useEffect } from 'react';
import { useMapStore } from '../store/mapStore';
import {
  ChevronRight, ChevronDown, Eye, AlertTriangle, Tag, Activity, Zap, Brain,
  FolderTree, MessageSquare, Lightbulb, TrendingUp, Send, Sparkles
} from 'lucide-react';

type TabType = 'hierarchy' | 'chat' | 'insights';

const TABS = [
  { id: 'chat', label: 'AI Chat', icon: MessageSquare },
  { id: 'hierarchy', label: 'Pages & Components', icon: FolderTree },
  { id: 'insights', label: 'Top Insights', icon: Lightbulb },
] as const;

export function RightPanel() {
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const [isExpanded, setIsExpanded] = useState(true);
  const [panelWidth, setPanelWidth] = useState(320);
  const [isResizing, setIsResizing] = useState(false);
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set());
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    { role: 'assistant', text: 'Hi! I can help analyze your product map data. Try asking: "What are the biggest friction points?" or "Which pages have the highest drop-off?"' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const { data, layers, selectedJourneyId, selectedPageId, setSelectedPage } = useMapStore();

  // Resize functionality
  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = window.innerWidth - e.clientX;
      setPanelWidth(Math.max(280, Math.min(600, newWidth)));
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

  if (!data) return null;

  const activeLayer = layers.activeLayer;

  // Filter pages by selected journey
  let filteredPages = data.pages;
  if (selectedJourneyId) {
    const journey = data.journeys.find(j => j.id === selectedJourneyId);
    if (journey) {
      const journeyPageIds = new Set(journey.steps.map(s => s.pageId));
      filteredPages = data.pages.filter(p => journeyPageIds.has(p.id));
    }
  }

  // Get layer-specific objects
  const getObjectsForPage = (pageId: string) => {
    if (!activeLayer) return [];

    switch (activeLayer) {
      case 'taxonomy':
        return data.taxonomyMarkers.filter(m => m.pageId === pageId);
      case 'friction':
        return data.frictionSignals.filter(s => s.pageId === pageId);
      case 'engagement':
        return data.engagementPatterns.filter(p => p.pageId === pageId);
      case 'actions':
        return data.actionItems.filter(a => a.pageId === pageId);
      case 'ai_feedback':
        return data.aiFeedback.filter(a => a.pageId === pageId);
      case 'heatmap':
        return [];
      default:
        return [];
    }
  };

  const togglePage = (pageId: string) => {
    const newExpanded = new Set(expandedPages);
    if (newExpanded.has(pageId)) {
      newExpanded.delete(pageId);
    } else {
      newExpanded.add(pageId);
    }
    setExpandedPages(newExpanded);
  };

  const getLayerIcon = () => {
    switch (activeLayer) {
      case 'taxonomy': return Tag;
      case 'friction': return AlertTriangle;
      case 'engagement': return Activity;
      case 'actions': return Zap;
      case 'ai_feedback': return Brain;
      default: return Eye;
    }
  };

  const LayerIcon = getLayerIcon();
  const layerLabel = activeLayer
    ? activeLayer.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
    : 'Base Flow';

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    setChatMessages([...chatMessages,
      { role: 'user', text: chatInput },
      { role: 'assistant', text: 'I\'m analyzing your request... (This is a demo - full AI integration coming soon!)' }
    ]);
    setChatInput('');
  };

  // Calculate top insights
  const topInsights = [
    {
      type: 'critical',
      icon: AlertTriangle,
      title: 'High Drop-off on Dashboard',
      description: `${data.frictionSignals.filter(s => s.severity === 'critical').length} critical friction points detected`,
      metric: '45% exit rate',
    },
    {
      type: 'success',
      icon: TrendingUp,
      title: 'Strong Feature Adoption',
      description: 'Chart Builder shows exceptional engagement',
      metric: '82% adoption',
    },
    {
      type: 'warning',
      icon: Sparkles,
      title: 'AI Recommendations',
      description: `${data.aiFeedback.filter(a => a.actionable).length} actionable insights available`,
      metric: `${Math.round(data.aiFeedback.reduce((sum, a) => sum + a.confidence, 0) / data.aiFeedback.length * 100)}% avg confidence`,
    },
    {
      type: 'info',
      icon: Tag,
      title: 'Instrumentation Health',
      description: `${data.taxonomyMarkers.filter(m => m.instrumented).length}/${data.taxonomyMarkers.length} events tracked`,
      metric: `${Math.round(data.taxonomyMarkers.filter(m => m.instrumented).length / data.taxonomyMarkers.length * 100)}% coverage`,
    },
  ];

  return (
    <div
      className={`right-panel ${isExpanded ? 'expanded' : 'collapsed'}`}
      style={{ width: isExpanded ? `${panelWidth}px` : '56px' }}
    >
      {/* Resize Handle */}
      {isExpanded && (
        <div
          className={`resize-handle resize-handle-vertical ${isResizing ? 'resizing' : ''}`}
          style={{ left: 0 }}
          onMouseDown={() => setIsResizing(true)}
        />
      )}

      {/* Icon Tabs - Lightroom Style (Horizontal) */}
      <div className="right-panel-tabs-horizontal">
        <div className="tabs-group">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                className={`right-panel-tab-icon ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(tab.id as TabType);
                  if (!isExpanded) setIsExpanded(true);
                }}
                title={tab.label}
              >
                <Icon size={20} />
                {isActive && <div className="tab-bottom-indicator" />}
              </button>
            );
          })}
        </div>

        {/* Collapse/Expand Toggle */}
        <button
          className="panel-collapse-toggle-horizontal"
          onClick={() => setIsExpanded(!isExpanded)}
          title={isExpanded ? 'Collapse panel' : 'Expand panel'}
        >
          {isExpanded ? <ChevronRight size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {/* Tab Content */}
      {isExpanded && (
        <div className="right-panel-content">
          {/* HIERARCHY TAB */}
          {activeTab === 'hierarchy' && (
            <div className="tab-panel">
              <div className="panel-header">
                <LayerIcon size={16} />
                <h3>{layerLabel}</h3>
              </div>

              <div className="hierarchy-stats">
                <div className="stat-item">
                  <span className="stat-label">Pages</span>
                  <span className="stat-value">{filteredPages.length}</span>
                </div>
                {activeLayer && (
                  <div className="stat-item">
                    <span className="stat-label">Objects</span>
                    <span className="stat-value">
                      {filteredPages.reduce((sum, p) => sum + getObjectsForPage(p.id).length, 0)}
                    </span>
                  </div>
                )}
              </div>

              <div className="hierarchy-tree">
                {filteredPages.map((page) => {
                  const objects = getObjectsForPage(page.id);
                  const isExpanded = expandedPages.has(page.id);
                  const hasObjects = objects.length > 0;

                  return (
                    <div key={page.id} className="hierarchy-page">
                      <div
                        className={`hierarchy-page-row ${selectedPageId === page.id ? 'selected' : ''}`}
                        onClick={() => setSelectedPage(page.id)}
                      >
                        {hasObjects && (
                          <button
                            className="page-expand-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePage(page.id);
                            }}
                          >
                            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                          </button>
                        )}
                        {!hasObjects && <div className="page-spacer" />}

                        <div className="page-info">
                          <div className="page-title">{page.title}</div>
                          <div className="page-meta">
                            <span>{page.pageType}</span>
                            {hasObjects && (
                              <span className="object-count">{objects.length} items</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {hasObjects && isExpanded && (
                        <div className="hierarchy-objects">
                          {objects.map((obj: any, idx) => (
                            <div
                              key={obj.id || idx}
                              className="hierarchy-object"
                              onClick={() => setSelectedPage(page.id)}
                            >
                              <div className="object-indicator" />
                              <div className="object-content">
                                <div className="object-label">
                                  {obj.eventName || obj.title || obj.type || `Item ${idx + 1}`}
                                </div>
                                {obj.severity && (
                                  <div className={`object-badge ${obj.severity}`}>
                                    {obj.severity}
                                  </div>
                                )}
                                {obj.volume !== undefined && (
                                  <div className="object-stat">{obj.volume.toLocaleString()}</div>
                                )}
                                {obj.confidence !== undefined && (
                                  <div className="object-stat">{Math.round(obj.confidence * 100)}%</div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* AI CHAT TAB */}
          {activeTab === 'chat' && (
            <div className="tab-panel chat-panel">
              <div className="panel-header">
                <Brain size={16} />
                <h3>AI Assistant</h3>
              </div>

              <div className="chat-messages">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`chat-message ${msg.role}`}>
                    <div className="message-avatar">
                      {msg.role === 'user' ? '👤' : '🤖'}
                    </div>
                    <div className="message-content">
                      <div className="message-text">{msg.text}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="chat-input-container">
                <input
                  type="text"
                  className="chat-input"
                  placeholder="Ask about your data..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button className="chat-send-btn" onClick={handleSendMessage}>
                  <Send size={16} />
                </button>
              </div>

              <div className="chat-suggestions">
                <div className="suggestions-label">Quick questions:</div>
                {[
                  'What are the biggest friction points?',
                  'Which pages need instrumentation?',
                  'Show conversion bottlenecks',
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    className="suggestion-chip"
                    onClick={() => {
                      setChatInput(suggestion);
                      handleSendMessage();
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TOP INSIGHTS TAB */}
          {activeTab === 'insights' && (
            <div className="tab-panel insights-panel">
              <div className="panel-header">
                <Sparkles size={16} />
                <h3>Top Insights</h3>
              </div>

              <div className="insights-cards">
                {topInsights.map((insight, idx) => {
                  const Icon = insight.icon;
                  return (
                    <div key={idx} className={`insight-card insight-${insight.type}`}>
                      <div className="insight-card-header">
                        <div className="insight-icon">
                          <Icon size={18} />
                        </div>
                        <div className="insight-metric">
                          {insight.metric}
                        </div>
                      </div>
                      <div className="insight-card-content">
                        <div className="insight-title">{insight.title}</div>
                        <div className="insight-description">{insight.description}</div>
                      </div>
                      <button className="insight-action-btn">
                        Investigate →
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="insights-summary">
                <div className="summary-header">
                  <TrendingUp size={16} />
                  <span>Quick Stats</span>
                </div>
                <div className="summary-stats">
                  <div className="summary-stat">
                    <span className="summary-label">Total Pages</span>
                    <span className="summary-value">{data.pages.length}</span>
                  </div>
                  <div className="summary-stat">
                    <span className="summary-label">Critical Issues</span>
                    <span className="summary-value">{data.frictionSignals.filter(s => s.severity === 'critical').length}</span>
                  </div>
                  <div className="summary-stat">
                    <span className="summary-label">AI Suggestions</span>
                    <span className="summary-value">{data.aiFeedback.length}</span>
                  </div>
                  <div className="summary-stat">
                    <span className="summary-label">Active Tests</span>
                    <span className="summary-value">{data.actionItems.filter(a => a.status === 'active').length}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
