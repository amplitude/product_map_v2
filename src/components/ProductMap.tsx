import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  ConnectionLineType,
  MarkerType,
} from '@xyflow/react';
import type { Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { PageNode } from './PageNode';
import { useMapStore } from '../store/mapStore';
import type { PageNode as PageNodeType } from '../types';

const nodeTypes = {
  pageNode: PageNode,
};

/**
 * Layout algorithm for horizontal flow
 * Distributes nodes in a grid pattern that flows left-to-right
 */
function calculateHorizontalLayout(pages: PageNodeType[], _edges: any[]): Node[] {
  const nodeSpacingX = 420;
  const nodeSpacingY = 350; // Increased spacing to prevent overlap
  const nodesPerRow = 5; // How many nodes per horizontal row
  const nodes: Node[] = [];

  // Calculate grid positions for horizontal flow
  pages.forEach((page, index) => {
    const col = index % nodesPerRow; // Column position (0-4)
    const row = Math.floor(index / nodesPerRow); // Row position

    nodes.push({
      id: page.id,
      type: 'pageNode',
      position: {
        x: col * nodeSpacingX + 120,
        y: row * nodeSpacingY + 100,
      },
      data: page as unknown as Record<string, unknown>,
    });
  });

  const totalRows = Math.ceil(pages.length / nodesPerRow);
  console.log(`📊 Layout: ${nodesPerRow} columns × ${totalRows} rows = ${nodes.length} nodes`);
  return nodes;
}

export function ProductMap() {
  const { data, selectedJourneyId, pageTypeFilter } = useMapStore();

  const nodes = useMemo(() => {
    if (!data) return [];

    // Filter pages by type if filter is active
    let filteredPages = data.pages;
    if (pageTypeFilter) {
      filteredPages = data.pages.filter(p => p.pageType === pageTypeFilter);
    }

    const baseNodes = calculateHorizontalLayout(filteredPages, data.edges);

    // Highlight nodes in selected journey
    if (selectedJourneyId) {
      const journey = data.journeys.find(j => j.id === selectedJourneyId);
      if (journey) {
        const journeyPageIds = new Set(journey.steps.map(s => s.pageId));
        return baseNodes.map(node => ({
          ...node,
          className: journeyPageIds.has(node.id) ? 'journey-highlighted' : 'journey-dimmed',
        }));
      }
    }

    return baseNodes;
  }, [data, selectedJourneyId, pageTypeFilter]);

  const edges = useMemo<Edge[]>(() => {
    if (!data) return [];

    // Filter edges based on page type filter
    let filteredEdges = data.edges;
    if (pageTypeFilter) {
      const filteredPageIds = new Set(
        data.pages.filter(p => p.pageType === pageTypeFilter).map(p => p.id)
      );
      filteredEdges = data.edges.filter(e =>
        filteredPageIds.has(e.source) && filteredPageIds.has(e.target)
      );
    }

    // Check if we have a selected journey
    const selectedJourney = selectedJourneyId
      ? data.journeys.find(j => j.id === selectedJourneyId)
      : null;

    const journeyEdges = new Set<string>();
    if (selectedJourney) {
      // Build journey edges from consecutive steps
      for (let i = 0; i < selectedJourney.steps.length - 1; i++) {
        const sourceId = selectedJourney.steps[i].pageId;
        const targetId = selectedJourney.steps[i + 1].pageId;
        journeyEdges.add(`${sourceId}→${targetId}`);
      }
    }

    return filteredEdges.map((edge) => {
      // Calculate edge thickness based on session volume
      const maxSessions = Math.max(...filteredEdges.map((e) => e.sessions));
      const thickness = Math.max(1, (edge.sessions / maxSessions) * 8);

      const isJourneyEdge = journeyEdges.has(edge.id);
      const isJourneyActive = selectedJourney !== null;

      return {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: 'smoothstep',
        animated: isJourneyEdge || (!isJourneyActive && edge.sessions > 10),
        style: {
          strokeWidth: isJourneyEdge ? thickness + 2 : thickness,
          stroke: isJourneyEdge ? '#3b82f6' : (isJourneyActive ? '#475569' : '#94a3b8'),
          opacity: isJourneyActive && !isJourneyEdge ? 0.3 : 1,
        },
        label: (isJourneyEdge || edge.sessions > 5) ? `${edge.sessions}` : undefined,
        labelStyle: {
          fill: isJourneyEdge ? '#3b82f6' : '#64748b',
          fontSize: 12,
          fontWeight: 600
        },
        labelBgStyle: { fill: '#f1f5f9' },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isJourneyEdge ? '#3b82f6' : '#94a3b8',
        },
      };
    });
  }, [data, selectedJourneyId, pageTypeFilter]);

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    console.log('Node clicked:', node.data);
  }, []);

  if (!data) {
    return (
      <div className="product-map-loading">
        <div className="spinner" />
        <p>Loading product map data...</p>
      </div>
    );
  }

  return (
    <div className="product-map">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
        fitViewOptions={{
          padding: 0.15,
          minZoom: 0.3,
          maxZoom: 1.2,
        }}
        minZoom={0.1}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 0.6 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#e2e8f0" gap={16} size={1} />
        <Controls
          showZoom={true}
          showFitView={true}
          showInteractive={true}
          position="bottom-left"
        />
        <MiniMap
          nodeColor={(node) => {
            const pageType = (node.data as unknown as PageNodeType).pageType;
            const colorMap: Record<string, string> = {
              Login: '#3b82f6',
              Home: '#10b981',
              Dashboard: '#8b5cf6',
              Analysis: '#f59e0b',
              Settings: '#6b7280',
            };
            return colorMap[pageType] || '#94a3b8';
          }}
          maskColor="rgba(0, 0, 0, 0.4)"
          position="top-right"
          pannable
          zoomable
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            border: '2px solid #334155',
            borderRadius: '8px',
            marginRight: '16px',
            marginTop: '16px',
          }}
        />
      </ReactFlow>
    </div>
  );
}
