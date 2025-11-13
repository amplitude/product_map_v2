import { useMemo } from 'react';
import { useMapStore } from '../../store/mapStore';
import type { AIFeedback } from '../../types';
import { Brain, Lightbulb, AlertCircle, Zap, CheckCircle } from 'lucide-react';

export function AIFeedbackOverlay() {
  const { data, layers } = useMapStore();

  const visibleFeedback = useMemo(() => {
    if (!data || layers.activeLayer !== 'ai_feedback') return [];
    return data.aiFeedback;
  }, [data, layers.activeLayer]);

  if (layers.activeLayer !== 'ai_feedback' || visibleFeedback.length === 0) return null;

  return (
    <div className="ai-feedback-overlay">
      {visibleFeedback.map((feedback) => (
        <AIFeedbackComponent key={feedback.id} feedback={feedback} />
      ))}
    </div>
  );
}

function AIFeedbackComponent({ feedback }: { feedback: AIFeedback }) {
  const getIcon = () => {
    switch (feedback.type) {
      case 'suggestion': return Lightbulb;
      case 'warning': return AlertCircle;
      case 'insight': return Brain;
      case 'optimization': return Zap;
      default: return Brain;
    }
  };

  const getColor = () => {
    switch (feedback.type) {
      case 'suggestion': return '#fbbf24'; // Orange-yellow
      case 'warning': return '#f87171'; // Red
      case 'insight': return '#8b5cf6'; // Purple
      case 'optimization': return '#34d399'; // Green
      default: return '#8b5cf6';
    }
  };

  const Icon = getIcon();

  return (
    <div className="ai-feedback-item">
      <div className="ai-feedback-icon" style={{ background: getColor() }}>
        <Icon size={16} color="white" />
      </div>
      <div className="ai-feedback-content">
        <div className="ai-feedback-type" style={{ color: getColor() }}>
          {feedback.type.replace('_', ' ').toUpperCase()}
        </div>
        <div className="ai-feedback-title">{feedback.title}</div>
        <div className="ai-feedback-description">{feedback.description}</div>
        <div className="ai-feedback-meta">
          <span className="ai-feedback-confidence">
            Confidence: {Math.round(feedback.confidence * 100)}%
          </span>
          {feedback.actionable && (
            <span className="ai-feedback-actionable">
              <CheckCircle size={12} /> Actionable
            </span>
          )}
        </div>
      </div>
      <div className={`ai-feedback-impact ${feedback.impact}`}>
        {feedback.impact}
      </div>
    </div>
  );
}
