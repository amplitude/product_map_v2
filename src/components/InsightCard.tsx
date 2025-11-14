import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  X,
  AlertTriangle,
  Users,
  ExternalLink,
  PlayCircle,
  TrendingUp,
  GitPullRequest,
  FlaskConical,
  MessageSquare,
} from 'lucide-react';
import type { FrictionPoint } from '../types';
import '../styles/insightCard.css';

interface InsightCardProps {
  insight: FrictionPoint;
  onClose: () => void;
}

export function InsightCard({ insight, onClose }: InsightCardProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('description');

  const getImpactColor = () => {
    if (insight.impact === 'High') return '#ef4444';
    if (insight.impact === 'Medium') return '#f59e0b';
    return '#10b981';
  };

  const getSeverityBadge = () => {
    const colors = {
      HIGH: '#ef4444',
      MEDIUM: '#f59e0b',
      LOW: '#10b981',
    };
    return (
      <span className="severity-badge" style={{ backgroundColor: colors[insight.severity] }}>
        {insight.severity}
      </span>
    );
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'web_experiment':
        return <FlaskConical size={16} />;
      case 'guide':
        return <MessageSquare size={16} />;
      default:
        return <TrendingUp size={16} />;
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="insight-card-overlay" onClick={onClose}>
      <div className="insight-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="insight-card-header" style={{ borderLeftColor: getImpactColor() }}>
          <div className="header-content">
            <div className="header-top">
              <div className="header-title-row">
                <AlertTriangle size={20} color={getImpactColor()} />
                <h3>{insight.title}</h3>
              </div>
              <button className="close-button" onClick={onClose}>
                <X size={20} />
              </button>
            </div>
            <div className="header-meta">
              {getSeverityBadge()}
              <span className="meta-item">
                <Users size={14} />
                {insight.contentMeta.affectedUsers.toLocaleString()} users
              </span>
              <span className="meta-category">{insight.category}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="insight-card-body">
          {/* Segment & Location */}
          <div className="insight-section">
            <div className="section-label">Segment & Location</div>
            <div className="segment-info">
              <div><strong>Segment:</strong> {insight.segment}</div>
              <div><strong>Location:</strong> {insight.location}</div>
            </div>
          </div>

          {/* Description */}
          <div className="insight-section">
            <button
              className="section-header"
              onClick={() => toggleSection('description')}
            >
              <span className="section-title">Analysis</span>
              <span className="section-toggle">
                {expandedSection === 'description' ? '−' : '+'}
              </span>
            </button>
            {expandedSection === 'description' && (
              <div className="section-content markdown-content">
                <ReactMarkdown>{insight.description}</ReactMarkdown>
              </div>
            )}
          </div>

          {/* Session Replays */}
          {insight.sessionReplays && insight.sessionReplays.length > 0 && (
            <div className="insight-section">
              <button
                className="section-header"
                onClick={() => toggleSection('replays')}
              >
                <span className="section-title">
                  <PlayCircle size={16} />
                  Session Replays ({insight.sessionReplays.length})
                </span>
                <span className="section-toggle">
                  {expandedSection === 'replays' ? '−' : '+'}
                </span>
              </button>
              {expandedSection === 'replays' && (
                <div className="section-content">
                  <div className="session-replays">
                    {insight.sessionReplays.map((replay) => (
                      <a
                        key={replay.sessionId}
                        href={replay.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="replay-item"
                      >
                        <div className="replay-header">
                          <span className="replay-title">{replay.highlightTitle}</span>
                          <ExternalLink size={14} />
                        </div>
                        <div className="replay-meta">
                          <span>{replay.deviceType}</span>
                          <span>•</span>
                          <span>{Math.floor(replay.duration / 60)}m {replay.duration % 60}s</span>
                        </div>
                        <div className="replay-description">{replay.highlightDescription}</div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Recommended Actions */}
          {insight.recommendedActions && insight.recommendedActions.length > 0 && (
            <div className="insight-section">
              <button
                className="section-header"
                onClick={() => toggleSection('actions')}
              >
                <span className="section-title">
                  <TrendingUp size={16} />
                  Recommended Actions ({insight.recommendedActions.length})
                </span>
                <span className="section-toggle">
                  {expandedSection === 'actions' ? '−' : '+'}
                </span>
              </button>
              {expandedSection === 'actions' && (
                <div className="section-content">
                  <div className="recommended-actions">
                    {insight.recommendedActions.map((action) => (
                      <div key={action.id} className="action-item">
                        <div className="action-header">
                          {getActionIcon(action.actionType)}
                          <span className="action-title">{action.title}</span>
                        </div>
                        <div className="action-description">{action.description}</div>
                        <div className="action-footer">
                          <span className="action-impact">{action.estimatedImpact}</span>
                          {(action.linkedPR || action.linkedExperiment || action.linkedGuide) && (
                            <div className="action-links">
                              {action.linkedPR && (
                                <span className="action-link">
                                  <GitPullRequest size={12} />
                                  PR #{action.linkedPR.replace('pr_', '')}
                                </span>
                              )}
                              {action.linkedExperiment && (
                                <span className="action-link">
                                  <FlaskConical size={12} />
                                  Exp #{action.linkedExperiment.replace('exp_', '')}
                                </span>
                              )}
                              {action.linkedGuide && (
                                <span className="action-link">
                                  <MessageSquare size={12} />
                                  Guide #{action.linkedGuide.replace('guide_', '')}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Supporting Evidence */}
          <div className="insight-section">
            <button
              className="section-header"
              onClick={() => toggleSection('evidence')}
            >
              <span className="section-title">Supporting Evidence</span>
              <span className="section-toggle">
                {expandedSection === 'evidence' ? '−' : '+'}
              </span>
            </button>
            {expandedSection === 'evidence' && (
              <div className="section-content markdown-content">
                <ReactMarkdown>{insight.supportingEvidence}</ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
