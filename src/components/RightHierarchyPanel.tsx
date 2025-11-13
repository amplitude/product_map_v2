import { useState, useEffect } from 'react';
import { useMapStore } from '../store/mapStore';
import { ChevronRight, ChevronDown, Eye, AlertTriangle, Tag, Activity, Zap, Brain } from 'lucide-react';

export function RightHierarchyPanel() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [panelWidth, setPanelWidth] = useState(320);
  const [isResizing, setIsResizing] = useState(false);
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set());

  const { data, layers, selectedJourneyId, setSelectedPage } = useMapStore();

  // Resize functionality
  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = window.innerWidth - e.clientX;
      setPanelWidth(Math.max(250, Math.min(600, newWidth)));
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
        return []; // Heatmap doesn't have specific objects
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

  return (
    <div
      className={`right-hierarchy-panel ${isExpanded ? 'expanded' : 'collapsed'}`}
      style={{ width: isExpanded ? `${panelWidth}px` : '48px' }}
    >
      {/* Resize Handle */}
      {isExpanded && (
        <div
          className={`resize-handle resize-handle-vertical ${isResizing ? 'resizing' : ''}`}
          style={{ left: 0 }}
          onMouseDown={() => setIsResizing(true)}
        />
      )}

      <div className="hierarchy-header">
        {isExpanded && (
          <>
            <LayerIcon size={16} />
            <h3>{layerLabel}</h3>
          </>
        )}
        <button
          className="hierarchy-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <ChevronRight size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {isExpanded && (
        <div className="hierarchy-content">
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
                    className="hierarchy-page-row"
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
    </div>
  );
}
