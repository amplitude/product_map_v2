import { useMapStore } from '../store/mapStore';
import { ChevronDown, TrendingUp, Users, Target } from 'lucide-react';
import { useState } from 'react';

export function JourneySelector() {
  const { data, selectedJourneyId, setSelectedJourney } = useMapStore();
  const [isOpen, setIsOpen] = useState(false);

  if (!data || data.journeys.length === 0) {
    return (
      <div className="journey-selector-placeholder">
        <p>No journeys configured</p>
        <small>Add funnel data to see journey paths</small>
      </div>
    );
  }

  const selectedJourney = data.journeys.find((j) => j.id === selectedJourneyId);

  const getJourneyIcon = (type: string) => {
    switch (type) {
      case 'conversion':
        return Target;
      case 'engagement':
        return TrendingUp;
      case 'retention':
        return Users;
      default:
        return Target;
    }
  };

  return (
    <div className="journey-selector">
      <label className="journey-selector-label">Focus Journey</label>
      <button
        className="journey-selector-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedJourney ? (
          <>
            <span className="journey-selector-icon">
              {(() => {
                const Icon = getJourneyIcon(selectedJourney.type);
                return <Icon size={16} />;
              })()}
            </span>
            <span className="journey-selector-text">{selectedJourney.name}</span>
          </>
        ) : (
          <span className="journey-selector-text">All Paths</span>
        )}
        <ChevronDown size={16} className={`journey-selector-chevron ${isOpen ? 'open' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="journey-selector-overlay" onClick={() => setIsOpen(false)} />
          <div className="journey-selector-dropdown">
            <button
              className={`journey-option ${!selectedJourneyId ? 'active' : ''}`}
              onClick={() => {
                setSelectedJourney(null);
                setIsOpen(false);
              }}
            >
              <span className="journey-option-name">All Paths</span>
              <span className="journey-option-meta">Show all user flows</span>
            </button>
            {data.journeys.map((journey) => {
              const Icon = getJourneyIcon(journey.type);
              return (
                <button
                  key={journey.id}
                  className={`journey-option ${selectedJourneyId === journey.id ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedJourney(journey.id);
                    setIsOpen(false);
                  }}
                >
                  <div className="journey-option-header">
                    <Icon size={16} />
                    <span className="journey-option-name">{journey.name}</span>
                    <span className={`journey-option-badge ${journey.importance}`}>
                      {journey.importance}
                    </span>
                  </div>
                  <span className="journey-option-meta">
                    {journey.steps.length} steps • {journey.conversionRate ? `${Math.round(journey.conversionRate * 100)}% conv.` : `${journey.totalSessions} sessions`}
                  </span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
