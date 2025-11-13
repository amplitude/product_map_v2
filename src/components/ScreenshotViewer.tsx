import { useState, useEffect } from 'react';
import { useMapStore } from '../store/mapStore';
import { ChevronLeft, ChevronRight, X, Eye } from 'lucide-react';

export function ScreenshotViewer() {
  const { selectedPageId, data, selectedJourneyId, setSelectedPage } = useMapStore();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [highlightPositions] = useState([
    { x: 30, y: 20, label: 'CTA Button' },
    { x: 50, y: 60, label: 'Main Content' },
    { x: 70, y: 40, label: 'Navigation' },
  ]);

  if (!selectedPageId || !data) return null;

  const selectedPage = data.pages.find(p => p.id === selectedPageId);
  if (!selectedPage) return null;

  // Get journey steps if a journey is selected
  const journey = selectedJourneyId ? data.journeys.find(j => j.id === selectedJourneyId) : null;
  const journeySteps = journey?.steps || [];

  // Find current step in journey
  useEffect(() => {
    if (journey) {
      const stepIdx = journeySteps.findIndex(s => s.pageId === selectedPageId);
      if (stepIdx >= 0) {
        setCurrentStepIndex(stepIdx);
      }
    }
  }, [selectedPageId, journey, journeySteps]);

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
    if (!journey) return;

    const newIndex = direction === 'prev' ? currentStepIndex - 1 : currentStepIndex + 1;
    if (newIndex >= 0 && newIndex < journeySteps.length) {
      const nextPageId = journeySteps[newIndex].pageId;
      setSelectedPage(nextPageId);
      setCurrentStepIndex(newIndex);
    }
  };

  const screenshot = selectedPage.screenshots[0];
  const screenshotUrl = screenshot ? `/screenshots/${screenshot.filename}` : null;

  return (
    <div className="screenshot-viewer-inline">
      {/* Close Button - Top Right Corner */}
      <div className="viewer-header-bar">
        <div className="viewer-breadcrumb">
          <span>Product Map</span>
          <span className="breadcrumb-sep">›</span>
          <span>{journey ? journey.name : 'Page View'}</span>
        </div>
        <button
          className="viewer-close-inline"
          onClick={() => setSelectedPage(null)}
        >
          <X size={18} />
          <span>Close</span>
        </button>
      </div>

      {/* Journey Navigation with Page Previews */}
      {journey && (
        <div className="journey-progress-inline">
          <div className="journey-header">
            <div className="journey-name">{journey.name}</div>
            <div className="journey-step-label">
              Step {currentStepIndex + 1} of {journeySteps.length}
            </div>
          </div>

          <div className="journey-navigation">
            {/* Previous Page Preview */}
            {canNavigatePrev && prevPage && (
              <button
                className="nav-preview nav-preview-prev"
                onClick={() => navigateToStep('prev')}
              >
                <div className="nav-preview-arrow">
                  <ChevronLeft size={24} />
                </div>
                <div className="nav-preview-content">
                  <div className="nav-preview-label">Previous</div>
                  <div className="nav-preview-title">{prevPage.title}</div>
                  <div className="nav-preview-thumb">
                    {prevPage.screenshots[0] && (
                      <img src={`/screenshots/${prevPage.screenshots[0].filename}`} alt={prevPage.title} />
                    )}
                  </div>
                </div>
              </button>
            )}

            {/* Step Progress Bar */}
            <div className="journey-steps-bar-inline">
              {journeySteps.map((step, idx) => (
                <div
                  key={idx}
                  className={`step-dot-inline ${idx === currentStepIndex ? 'active' : ''} ${idx < currentStepIndex ? 'completed' : ''}`}
                  onClick={() => {
                    setSelectedPage(step.pageId);
                    setCurrentStepIndex(idx);
                  }}
                  title={`Step ${idx + 1}`}
                />
              ))}
            </div>

            {/* Next Page Preview */}
            {canNavigateNext && nextPage && (
              <button
                className="nav-preview nav-preview-next"
                onClick={() => navigateToStep('next')}
              >
                <div className="nav-preview-content">
                  <div className="nav-preview-label">Next</div>
                  <div className="nav-preview-title">{nextPage.title}</div>
                  <div className="nav-preview-thumb">
                    {nextPage.screenshots[0] && (
                      <img src={`/screenshots/${nextPage.screenshots[0].filename}`} alt={nextPage.title} />
                    )}
                  </div>
                </div>
                <div className="nav-preview-arrow">
                  <ChevronRight size={24} />
                </div>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Screenshot with Highlights */}
      <div className="viewer-main-content">
        <div className="viewer-screenshot-inline">
          {screenshotUrl ? (
            <>
              <img src={screenshotUrl} alt={selectedPage.title} />

              {/* Animated Highlights */}
              {highlightPositions.map((highlight, idx) => (
                <div
                  key={idx}
                  className="screenshot-highlight"
                  style={{
                    left: `${highlight.x}%`,
                    top: `${highlight.y}%`,
                    animationDelay: `${idx * 0.3}s`,
                  }}
                >
                  <div className="highlight-pulse" />
                  <div className="highlight-label">{highlight.label}</div>
                </div>
              ))}
            </>
          ) : (
            <div className="viewer-placeholder">
              <Eye size={48} opacity={0.3} />
              <p>No screenshot available</p>
            </div>
          )}
        </div>

        {/* Page Info Bar */}
        <div className="viewer-info-inline">
          <div className="viewer-title-inline">{selectedPage.title}</div>
          <div className="viewer-meta-inline">
            <span className="viewer-type-inline">{selectedPage.pageType}</span>
            <div className="viewer-divider" />
            <span className="viewer-sessions-inline">{selectedPage.sessions.toLocaleString()} sessions</span>
            <div className="viewer-divider" />
            <span className="viewer-users-inline">{selectedPage.uniqueUsers.toLocaleString()} users</span>
          </div>
        </div>
      </div>
    </div>
  );
}
