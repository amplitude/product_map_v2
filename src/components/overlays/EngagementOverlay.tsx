import { useMemo } from 'react';
import { useMapStore } from '../../store/mapStore';
import type { EngagementPattern } from '../../types';

export function EngagementOverlay() {
  const { data, layers } = useMapStore();

  const visiblePatterns = useMemo(() => {
    if (!data || layers.activeLayer !== 'engagement') return [];
    return data.engagementPatterns;
  }, [data, layers.activeLayer]);

  if (layers.activeLayer !== 'engagement' || visiblePatterns.length === 0) return null;

  return (
    <div className="engagement-overlay">
      {visiblePatterns.map((pattern) => (
        <EngagementPatternComponent key={pattern.id} pattern={pattern} />
      ))}
    </div>
  );
}

function EngagementPatternComponent({ pattern }: { pattern: EngagementPattern }) {
  const getColorIntensity = (value: number) => {
    // Higher engagement = more intense purple
    const intensity = Math.min(value / 100, 1);
    return `rgba(167, 139, 250, ${0.3 + intensity * 0.7})`;
  };

  const renderVisualization = () => {
    switch (pattern.type) {
      case 'scroll_depth':
        const scrollDepth = pattern.data.avgScrollDepth || pattern.avgValue || 0;
        return (
          <div className="engagement-scroll-depth">
            <div className="scroll-depth-bar">
              <div
                className="scroll-depth-fill"
                style={{
                  height: `${scrollDepth}%`,
                  background: getColorIntensity(scrollDepth),
                }}
              />
            </div>
            <div className="scroll-depth-label">{Math.round(scrollDepth)}%</div>
          </div>
        );

      case 'dwell_time':
        const dwellTime = pattern.avgValue || 0;
        const minutes = Math.floor(dwellTime / 60);
        const seconds = Math.floor(dwellTime % 60);
        return (
          <div className="engagement-dwell-time">
            <div className="dwell-time-circle">
              <svg width="40" height="40" viewBox="0 0 40 40">
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  fill="none"
                  stroke="rgba(167, 139, 250, 0.2)"
                  strokeWidth="3"
                />
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  fill="none"
                  stroke="rgba(167, 139, 250, 0.9)"
                  strokeWidth="3"
                  strokeDasharray={`${(dwellTime / 300) * 100} 100`}
                  transform="rotate(-90 20 20)"
                />
              </svg>
            </div>
            <div className="dwell-time-label">
              {minutes}:{seconds.toString().padStart(2, '0')}
            </div>
          </div>
        );

      case 'click_density':
        const density = pattern.avgValue || 0;
        return (
          <div className="engagement-click-density">
            <div className="click-density-heat" style={{ opacity: density / 100 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="click-dot"
                  style={{
                    left: `${Math.random() * 80 + 10}%`,
                    top: `${Math.random() * 80 + 10}%`,
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              ))}
            </div>
            <div className="click-density-label">{Math.round(density)} clicks</div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="engagement-pattern">
      {renderVisualization()}
      <div className="engagement-pattern-tooltip">
        <div className="engagement-pattern-header">
          <span className="engagement-pattern-type">
            {pattern.type.replace('_', ' ').toUpperCase()}
          </span>
        </div>
        <div className="engagement-pattern-value">
          Average: {Math.round(pattern.avgValue || 0)}
          {pattern.type === 'scroll_depth' && '%'}
          {pattern.type === 'dwell_time' && 's'}
        </div>
      </div>
    </div>
  );
}
