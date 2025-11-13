import { useMemo } from 'react';
import { useMapStore } from '../../store/mapStore';
import type { ActionItem } from '../../types';
import { Zap, Hammer, Lightbulb, CheckCircle2, ExternalLink } from 'lucide-react';

export function ActionOverlay() {
  const { data, layers } = useMapStore();

  const visibleActions = useMemo(() => {
    if (!data || layers.activeLayer !== 'actions') return [];
    return data.actionItems;
  }, [data, layers.activeLayer]);

  if (layers.activeLayer !== 'actions' || visibleActions.length === 0) return null;

  return (
    <div className="action-overlay">
      {visibleActions.map((action) => (
        <ActionItemComponent key={action.id} action={action} />
      ))}
    </div>
  );
}

function ActionItemComponent({ action }: { action: ActionItem }) {
  const getIcon = () => {
    switch (action.type) {
      case 'experiment':
        return Zap;
      case 'pr':
        return Hammer;
      case 'candidate':
        return Lightbulb;
      case 'completed':
        return CheckCircle2;
      default:
        return Zap;
    }
  };

  const getColor = () => {
    switch (action.status) {
      case 'active':
        return '#10b981'; // Green
      case 'in_dev':
        return '#f59e0b'; // Orange
      case 'proposed':
        return '#3b82f6'; // Blue
      case 'shipped':
        return '#6b7280'; // Gray
      default:
        return '#3b82f6';
    }
  };

  const getStatusLabel = () => {
    switch (action.status) {
      case 'active':
        return 'Active';
      case 'in_dev':
        return 'In Development';
      case 'proposed':
        return 'Proposed';
      case 'shipped':
        return 'Shipped';
      default:
        return action.status;
    }
  };

  const Icon = getIcon();

  return (
    <div className="action-item" style={{ borderColor: getColor() }}>
      <div className="action-item-icon" style={{ background: getColor() }}>
        <Icon size={14} color="white" />
      </div>
      {action.status === 'active' && (
        <div className="action-item-pulse" style={{ background: getColor() }} />
      )}
      <div className="action-item-tooltip">
        <div className="action-item-header">
          <span className="action-item-type">
            {action.type.replace('_', ' ').toUpperCase()}
          </span>
          <span className="action-item-status" style={{ background: getColor() }}>
            {getStatusLabel()}
          </span>
        </div>
        {action.priority && (
          <div className="action-item-priority" style={{ color: getColor() }}>
            Priority: {action.priority.toUpperCase()}
          </div>
        )}
        <div className="action-item-title">{action.title}</div>
        <div className="action-item-description">{action.description}</div>
        {action.link && (
          <a
            href={action.link}
            target="_blank"
            rel="noopener noreferrer"
            className="action-item-link"
          >
            View Details <ExternalLink size={12} />
          </a>
        )}
      </div>
    </div>
  );
}
