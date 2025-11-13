import { useEffect, useState } from 'react';
import { useMapStore } from '../store/mapStore';
import { ChevronLeft, ChevronRight, X, Eye } from 'lucide-react';

export function ScreenshotViewer() {
  const { selectedPageId, data, selectedJourneyId, setSelectedPage } = useMapStore();
  const [selectedComponentIndex, setSelectedComponentIndex] = useState<number | null>(null);

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedPage(null);
      } else if (e.key === 'ArrowLeft' && canNavigatePrev) {
        navigateToStep('prev');
      } else if (e.key === 'ArrowRight' && canNavigateNext) {
        navigateToStep('next');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  if (!selectedPageId || !data) return null;

  const selectedPage = data.pages.find(p => p.id === selectedPageId);
  if (!selectedPage) return null;

  // Get journey steps if a journey is selected
  const journey = selectedJourneyId ? data.journeys.find(j => j.id === selectedJourneyId) : null;
  const journeySteps = journey?.steps || [];

  // Derive current step index from selectedPageId
  const currentStepIndex = journey
    ? journeySteps.findIndex(s => s.pageId === selectedPageId)
    : -1;

  // Get component actions for current step
  const currentStep = journey && currentStepIndex >= 0 ? journeySteps[currentStepIndex] : null;
  const componentActions = currentStep?.componentActions || [];

  const canNavigatePrev = journey && currentStepIndex > 0;
  const canNavigateNext = journey && currentStepIndex < journeySteps.length - 1;

  const getPrevPage = () => {
    if (!journey || currentStepIndex === 0) return null;
    const prevPageId = journeySteps[currentStepIndex - 1].pageId;
    return data.pages.find(p => p.id === prevPageId);
  };

  const getNextPage = () => {
    if (!journey || currentStepIndex >= journeySteps.length - 1) return null;
    const nextPageId = journeySteps[currentStepIndex + 1].pageId;
    return data.pages.find(p => p.id === nextPageId);
  };

  const prevPage = getPrevPage();
  const nextPage = getNextPage();

  const navigateToStep = (direction: 'prev' | 'next') => {
    if (!journey || currentStepIndex < 0) return;

    const newIndex = direction === 'prev' ? currentStepIndex - 1 : currentStepIndex + 1;
    if (newIndex >= 0 && newIndex < journeySteps.length) {
      const nextPageId = journeySteps[newIndex].pageId;
      setSelectedPage(nextPageId);
      setSelectedComponentIndex(null); // Reset component selection
    }
  };

  const screenshot = selectedPage.screenshots[0];
  const screenshotUrl = screenshot ? `/screenshots/${screenshot.filename}` : null;

  // Group journey into page-level milestones
  const pageMilestones = useMemo(() => {
    if (!journey) return [];

    const milestones: Array<{ page: any; stepIndices: number[] }> = [];
    let currentPageId = '';

    journeySteps.forEach((step, idx) => {
      if (step.pageId !== currentPageId) {
        // New page - create milestone
        const page = data.pages.find(p => p.id === step.pageId);
        milestones.push({ page, stepIndices: [idx] });
        currentPageId = step.pageId;
      } else {
        // Same page - add to current milestone
        milestones[milestones.length - 1].stepIndices.push(idx);
      }
    });

    return milestones;
  }, [journey, journeySteps, data.pages]);

  return (
    <div className="screenshot-viewer-inline">
      {/* CONSOLIDATED NAVIGATION CARD */}
      <div className="viewer-nav-card">
        {/* Breadcrumb */}
        <div className="viewer-breadcrumb">
          <span className="breadcrumb-item">Product Map</span>
          <span className="breadcrumb-sep">›</span>
          <span className="breadcrumb-item">{journey ? journey.name : 'Page View'}</span>
          <span className="breadcrumb-sep">›</span>
          <span className="breadcrumb-item current">{selectedPage.title}</span>
        </div>

        {/* Close Button - Minimal X */}
        <button
          className="viewer-close-minimal"
          onClick={() => setSelectedPage(null)}
          title="Close (Esc)"
        >
          <X size={20} />
        </button>

        {/* Journey Navigation - Dual-Track Subway Map */}
        {journey && (
          <div className="subway-map-container-dual">
            {/* Previous Page Navigation */}
            {canNavigatePrev && prevPage && (
              <button
                className="subway-nav-btn prev"
                onClick={() => navigateToStep('prev')}
                title={`Previous: ${prevPage.title}`}
              >
                <ChevronLeft size={20} />
                <div className="nav-btn-preview">
                  {prevPage.screenshots[0] && (
                    <img src={`/screenshots/${prevPage.screenshots[0].filename}`} alt={prevPage.title} />
                  )}
                </div>
              </button>
            )}

            {/* Git-Style Branch Map */}
            <div className="subway-map-dual">
              {/* Main Page Track */}
              <div className="page-track">
                <div className="page-track-line" />

                {/* Render page stations and their component branches */}
                {pageMilestones.map((milestone, milestoneIdx) => {
                  const isCurrentPage = milestone.page?.id === selectedPageId;
                  const milestonePosition = (milestoneIdx / Math.max(pageMilestones.length - 1, 1)) * 100;
                  const pageStepIndices = milestone.stepIndices;

                  return (
                    <div key={milestoneIdx} style={{ position: 'absolute', left: `${milestonePosition}%`, top: 0 }}>
                      {/* Page Station */}
                      <div
                        className={`page-station ${isCurrentPage ? 'active' : ''}`}
                        style={{ position: 'relative', left: 0, top: 0 }}
                        onClick={() => {
                          const firstStepPageId = journeySteps[pageStepIndices[0]].pageId;
                          setSelectedPage(firstStepPageId);
                          setSelectedComponentIndex(null);
                        }}
                      >
                        <div className="page-station-dot" />
                        <div className="page-station-label">{milestone.page?.title || 'Page'}</div>
                      </div>

                      {/* Component branch below this page (if multiple actions) */}
                      {pageStepIndices.length > 1 && (
                        <div className="component-branch-group">
                          {/* Branch connector line down */}
                          <svg className="branch-connector-down" width="40" height="60" style={{ position: 'absolute', left: '-20px', top: '15px' }}>
                            <path d="M 20 0 Q 20 20, 20 30" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" fill="none" strokeDasharray="3,2" />
                          </svg>

                          {/* Component dots */}
                          {pageStepIndices.map((stepIdx, compIdx) => {
                            const step = journeySteps[stepIdx];
                            const isActive = stepIdx === currentStepIndex;
                            const isCompleted = stepIdx < currentStepIndex;
                            const compOffsetX = (compIdx - (pageStepIndices.length - 1) / 2) * 35;

                            return (
                              <div
                                key={stepIdx}
                                className={`component-station ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                                style={{
                                  position: 'absolute',
                                  left: `${compOffsetX}px`,
                                  top: '60px',
                                }}
                                onClick={() => {
                                  setSelectedPage(step.pageId);
                                  setSelectedComponentIndex(compIdx);
                                }}
                              >
                                <div className="component-station-dot" />
                                <div className="component-station-number">{stepIdx + 1}</div>
                                <div className="component-station-label">
                                  {step.primaryAction || `Action ${stepIdx + 1}`}
                                </div>
                              </div>
                            );
                          })}

                          {/* Branch connector line back up */}
                          <svg className="branch-connector-up" width="40" height="60" style={{ position: 'absolute', right: '-20px', top: '15px' }}>
                            <path d="M 20 30 Q 20 20, 20 0" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" fill="none" strokeDasharray="3,2" />
                          </svg>
                        </div>
                      )}

                      {/* Single action - show small indicator below */}
                      {pageStepIndices.length === 1 && (
                        <div
                          className={`component-station single ${currentStepIndex === pageStepIndices[0] ? 'active' : ''}`}
                          style={{ position: 'absolute', left: '0', top: '45px' }}
                          onClick={() => setSelectedPage(journeySteps[pageStepIndices[0]].pageId)}
                        >
                          <div className="component-station-dot" />
                          <div className="component-station-number">{pageStepIndices[0] + 1}</div>
                          <div className="component-station-label">
                            {journeySteps[pageStepIndices[0]].primaryAction}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Next Page Navigation */}
            {canNavigateNext && nextPage && (
              <button
                className="subway-nav-btn next"
                onClick={() => navigateToStep('next')}
                title={`Next: ${nextPage.title}`}
              >
                <div className="nav-btn-preview">
                  {nextPage.screenshots[0] && (
                    <img src={`/screenshots/${nextPage.screenshots[0].filename}`} alt={nextPage.title} />
                  )}
                </div>
                <ChevronRight size={20} />
              </button>
            )}
          </div>
        )}

        {/* Page Info - Consolidated */}
        <div className="viewer-page-info">
          <div className="page-info-main">
            <div className="page-type-badge">{selectedPage.pageType}</div>
            <div className="page-title-large">{selectedPage.title}</div>
            {currentStep?.primaryAction && (
              <div className="page-action-subtitle">→ {currentStep.primaryAction}</div>
            )}
          </div>
          <div className="page-stats-row">
            <div className="page-stat">
              <span className="stat-value">{selectedPage.sessions.toLocaleString()}</span>
              <span className="stat-label">sessions</span>
            </div>
            <div className="stat-divider" />
            <div className="page-stat">
              <span className="stat-value">{selectedPage.uniqueUsers.toLocaleString()}</span>
              <span className="stat-label">users</span>
            </div>
            {journey && currentStepIndex >= 0 && componentActions.length > 0 && (
              <>
                <div className="stat-divider" />
                <div className="page-stat">
                  <span className="stat-value">{componentActions.length}</span>
                  <span className="stat-label">components</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Screenshot with Component Highlights */}
      <div className="viewer-main-content">
        <div className="viewer-screenshot-inline">
          {screenshotUrl ? (
            <>
              <img src={screenshotUrl} alt={selectedPage.title} />

              {/* Component Sequence Highlights */}
              {componentActions.map((action, idx) => {
                const isPrimary = action.importance === 'primary';
                const isSelected = selectedComponentIndex === idx;

                return (
                  <div
                    key={idx}
                    className={`component-highlight ${action.importance} ${action.actionType} ${isSelected ? 'selected' : ''}`}
                    style={{
                      left: `${action.position.x}%`,
                      top: `${action.position.y}%`,
                      animationDelay: `${idx * 0.4}s`,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedComponentIndex(idx);
                    }}
                  >
                    <div className="component-pulse" />
                    <div className="component-sequence-number">{action.sequenceOrder}</div>
                    <div className="component-label">
                      <div className="component-action-type">{action.actionType}</div>
                      <div className="component-name">{action.label}</div>
                      <div className="component-selector">{action.selector}</div>
                    </div>
                    {idx < componentActions.length - 1 && isPrimary && (
                      <svg className="component-flow-arrow" width="60" height="60" viewBox="0 0 60 60">
                        <defs>
                          <marker id={`arrowhead-${idx}`} markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                            <polygon points="0 0, 10 3, 0 6" fill="var(--color-accent)" />
                          </marker>
                        </defs>
                        <path
                          d={`M 0 30 Q 30 ${componentActions[idx + 1].position.y > action.position.y ? 45 : 15}, 60 30`}
                          stroke="var(--color-accent)"
                          strokeWidth="2"
                          fill="none"
                          strokeDasharray="5,3"
                          markerEnd={`url(#arrowhead-${idx})`}
                          opacity="0.6"
                        />
                      </svg>
                    )}
                  </div>
                );
              })}
            </>
          ) : (
            <div className="viewer-placeholder">
              <Eye size={48} opacity={0.3} />
              <p>No screenshot available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function useMemo<T>(factory: () => T, _deps: any[]): T {
  return factory();
}
