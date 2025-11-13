import { useMemo } from 'react';
import { useMapStore } from '../../store/mapStore';
import type { TaxonomyMarker } from '../../types';

export function TaxonomyOverlay() {
  const { data, layers } = useMapStore();

  const visibleMarkers = useMemo(() => {
    if (!data || layers.activeLayer !== 'taxonomy') return [];
    return data.taxonomyMarkers;
  }, [data, layers.activeLayer]);

  if (layers.activeLayer !== 'taxonomy' || visibleMarkers.length === 0) return null;

  return (
    <div className="taxonomy-overlay">
      {visibleMarkers.map((marker) => (
        <TaxonomyMarkerComponent key={marker.id} marker={marker} />
      ))}
    </div>
  );
}

function TaxonomyMarkerComponent({ marker }: { marker: TaxonomyMarker }) {
  const getStatusColor = () => {
    if (!marker.instrumented) return '#ef4444'; // Red - not instrumented
    if (marker.properties.length < 3) return '#f59e0b'; // Orange - incomplete
    return '#10b981'; // Green - complete
  };

  const getStatusLabel = () => {
    if (!marker.instrumented) return 'Not Instrumented';
    if (marker.properties.length < 3) return 'Incomplete Properties';
    return 'Fully Instrumented';
  };

  return (
    <div className="taxonomy-marker" style={{ borderColor: getStatusColor() }}>
      <div className="taxonomy-marker-icon" style={{ background: getStatusColor() }}>
        <svg width="12" height="12" viewBox="0 0 12 12">
          <circle cx="6" cy="6" r="5" fill="white" opacity="0.9" />
        </svg>
      </div>
      <div className="taxonomy-marker-tooltip">
        <div className="taxonomy-marker-header">
          <span className="taxonomy-marker-event">{marker.eventName}</span>
          <span className="taxonomy-marker-volume">
            {marker.volume.toLocaleString()} events
          </span>
        </div>
        <div className="taxonomy-marker-status" style={{ color: getStatusColor() }}>
          {getStatusLabel()}
        </div>
        {marker.properties.length > 0 && (
          <div className="taxonomy-marker-properties">
            <strong>Properties:</strong>
            <ul>
              {marker.properties.map((prop) => (
                <li key={prop}>{prop}</li>
              ))}
            </ul>
          </div>
        )}
        {marker.selector && (
          <div className="taxonomy-marker-selector">
            <strong>Selector:</strong> <code>{marker.selector}</code>
          </div>
        )}
      </div>
    </div>
  );
}
