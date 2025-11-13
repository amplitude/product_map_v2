import { useMemo } from 'react';
import { useMapStore } from '../../store/mapStore';
import type { FrictionSignal } from '../../types';
import { AlertTriangle, Zap, MousePointerClick, Loader } from 'lucide-react';

export function FrictionOverlay() {
  const { data, layers } = useMapStore();

  const visibleSignals = useMemo(() => {
    if (!data || layers.activeLayer !== 'friction') return [];
    return data.frictionSignals;
  }, [data, layers.activeLayer]);

  if (layers.activeLayer !== 'friction' || visibleSignals.length === 0) return null;

  return (
    <div className="friction-overlay">
      {visibleSignals.map((signal) => (
        <FrictionSignalComponent key={signal.id} signal={signal} />
      ))}
    </div>
  );
}

function FrictionSignalComponent({ signal }: { signal: FrictionSignal }) {
  const getIcon = () => {
    switch (signal.type) {
      case 'drop_off':
        return AlertTriangle;
      case 'error':
        return Zap;
      case 'rage_click':
        return MousePointerClick;
      case 'slow_load':
        return Loader;
      default:
        return AlertTriangle;
    }
  };

  const getColor = () => {
    switch (signal.severity) {
      case 'critical':
        return '#ef4444';
      case 'high':
        return '#f97316';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#fbbf24';
      default:
        return '#f59e0b';
    }
  };

  const Icon = getIcon();

  return (
    <div
      className={`friction-signal severity-${signal.severity}`}
      style={{ borderColor: getColor() }}
    >
      <div className="friction-signal-icon" style={{ background: getColor() }}>
        <Icon size={16} color="white" />
      </div>
      <div className="friction-signal-pulse" style={{ background: getColor() }} />
      <div className="friction-signal-tooltip">
        <div className="friction-signal-header">
          <span className="friction-signal-type">
            {signal.type.replace('_', ' ').toUpperCase()}
          </span>
          <span
            className="friction-signal-severity"
            style={{ background: getColor() }}
          >
            {signal.severity}
          </span>
        </div>
        <div className="friction-signal-description">{signal.description}</div>
        <div className="friction-signal-impact">
          <strong>Affected Sessions:</strong> {signal.affectedSessions.toLocaleString()}
        </div>
        <button className="friction-signal-action">View Session Replays →</button>
      </div>
    </div>
  );
}
