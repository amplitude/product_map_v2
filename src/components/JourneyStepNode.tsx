import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import type { JourneyStep, PageNode } from '../types';
import { Users, Eye, ArrowRight, MousePointer, Keyboard, ScanEye, Hand } from 'lucide-react';
import { useMapStore } from '../store/mapStore';

interface StepNodeData {
  step: JourneyStep;
  page: PageNode;
  journeyId: string;
}

export const JourneyStepNode = memo((props: NodeProps) => {
  const nodeData = props.data as unknown as StepNodeData;
  const { step, page } = nodeData;
  const { selectedPageId, setSelectedPage } = useMapStore();
  const isSelected = selectedPageId === page.id;

  // Get screenshot
  const screenshot = page.screenshots[0];
  const screenshotUrl = screenshot ? `/screenshots/${screenshot.filename}` : null;

  // Count components in this step
  const componentCount = step.componentActions?.length || 0;
  const primaryAction = step.primaryAction || 'View Page';

  // Get action type icon
  const getActionIcon = () => {
    if (!step.componentActions || step.componentActions.length === 0) return Eye;
    const primaryActionType = step.componentActions.find(a => a.importance === 'primary')?.actionType;

    switch (primaryActionType) {
      case 'click': return MousePointer;
      case 'input': return Keyboard;
      case 'scroll': return ScanEye;
      case 'hover': return Hand;
      default: return ArrowRight;
    }
  };

  const ActionIcon = getActionIcon();

  // Format drop-off rate
  const dropOffRate = step.dropOffRate ? `${Math.round(step.dropOffRate * 100)}%` : null;

  return (
    <div
      className={`journey-step-node ${isSelected ? 'selected' : ''}`}
      onClick={() => setSelectedPage(page.id)}
    >
      <Handle type="target" position={Position.Left} className="node-handle" />

      {/* Step Number Badge */}
      <div className="step-number-badge">{step.stepNumber}</div>

      {/* Screenshot thumbnail */}
      <div className="step-node-thumbnail">
        {screenshotUrl ? (
          <img src={screenshotUrl} alt={primaryAction} loading="lazy" />
        ) : (
          <div className="step-node-placeholder">
            <Eye size={24} opacity={0.3} />
          </div>
        )}

        {/* Component count overlay */}
        {componentCount > 0 && (
          <div className="component-count-badge">
            {componentCount} components
          </div>
        )}
      </div>

      {/* Step info */}
      <div className="step-node-content">
        {/* Action Icon + Type */}
        <div className="step-action-header">
          <div className="step-action-icon">
            <ActionIcon size={14} />
          </div>
          <div className="step-action-label">{primaryAction}</div>
        </div>

        {/* Page context */}
        <div className="step-page-context">on {page.title}</div>

        {/* Metrics */}
        <div className="step-node-metrics">
          <div className="metric" title="Sessions through this step">
            <Users size={12} />
            <span>{page.sessions.toLocaleString()}</span>
          </div>
          {dropOffRate && (
            <div className="metric drop-off" title="Drop-off rate">
              <span className="drop-off-rate">-{dropOffRate}</span>
            </div>
          )}
        </div>
      </div>

      <Handle type="source" position={Position.Right} className="node-handle" />
    </div>
  );
});

JourneyStepNode.displayName = 'JourneyStepNode';
