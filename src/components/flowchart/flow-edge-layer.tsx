'use client';

import { useMemo } from 'react';
import type { FlowNode, FlowEdge } from '@/lib/flowchart/types';

const NODE_WIDTH = 200;
const NODE_HEIGHT = 64;

/**
 * FlowEdgeLayer
 *
 * Renders all edges as SVG bezier curves with arrowheads. Condition branch
 * edges are colored green (true) or red (false).
 *
 * If pendingEdgeSource is set, a dashed preview line follows from the
 * source node to... well, it's a static preview showing the source. The
 * actual mouse-following line would require tracking mouse position which
 * adds complexity; the pending hint bar tells the user to click a target.
 */
export function FlowEdgeLayer({
  nodes,
  edges,
  pendingEdgeSource,
  pendingEdgeBranch,
}: {
  nodes: FlowNode[];
  edges: FlowEdge[];
  pendingEdgeSource: FlowNode | null;
  pendingEdgeBranch?: 'true' | 'false';
}) {
  // Build a map for quick node lookup
  const nodeMap = useMemo(() => {
    const map = new Map<string, FlowNode>();
    for (const node of nodes) map.set(node.id, node);
    return map;
  }, [nodes]);

  const paths = useMemo(() => {
    return edges
      .map((edge) => {
        const source = nodeMap.get(edge.source);
        const target = nodeMap.get(edge.target);
        if (!source || !target) return null;

        // Calculate anchor points
        const isCondition = source.type === 'condition';
        let sx: number, sy: number;
        if (isCondition && edge.branch === 'true') {
          sx = source.position.x + NODE_WIDTH / 3;
          sy = source.position.y + NODE_HEIGHT;
        } else if (isCondition && edge.branch === 'false') {
          sx = source.position.x + (NODE_WIDTH * 2) / 3;
          sy = source.position.y + NODE_HEIGHT;
        } else {
          sx = source.position.x + NODE_WIDTH;
          sy = source.position.y + NODE_HEIGHT / 2;
        }

        const tx = target.position.x;
        const ty = target.position.y + NODE_HEIGHT / 2;

        // Bezier control points — horizontal-ish curve
        const dx = Math.abs(tx - sx);
        const offset = Math.max(40, dx * 0.5);
        const cp1x = sx + offset;
        const cp1y = sy;
        const cp2x = tx - offset;
        const cp2y = ty;

        const path = `M ${sx} ${sy} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${tx} ${ty}`;

        const color =
          edge.branch === 'true'
            ? '#10b981'
            : edge.branch === 'false'
            ? '#f43f5e'
            : '#3b82f6';

        // Label position at midpoint of curve
        const midX = (sx + tx) / 2;
        const midY = (sy + ty) / 2;

        return { id: edge.id, path, color, label: edge.label, midX, midY };
      })
      .filter(Boolean) as Array<{
      id: string;
      path: string;
      color: string;
      label?: string;
      midX: number;
      midY: number;
    }>;
  }, [edges, nodeMap]);

  // Pending edge preview
  const pendingPath = useMemo(() => {
    if (!pendingEdgeSource) return null;
    const source = pendingEdgeSource;
    const isCondition = source.type === 'condition';
    let sx: number, sy: number;
    if (isCondition && pendingEdgeBranch === 'true') {
      sx = source.position.x + NODE_WIDTH / 3;
      sy = source.position.y + NODE_HEIGHT;
    } else if (isCondition && pendingEdgeBranch === 'false') {
      sx = source.position.x + (NODE_WIDTH * 2) / 3;
      sy = source.position.y + NODE_HEIGHT;
    } else {
      sx = source.position.x + NODE_WIDTH;
      sy = source.position.y + NODE_HEIGHT / 2;
    }
    // Show a short stub indicating where the edge will start
    const stubLength = 60;
    return {
      path: `M ${sx} ${sy} L ${sx + stubLength} ${sy}`,
      color: pendingEdgeBranch === 'true' ? '#10b981' : pendingEdgeBranch === 'false' ? '#f43f5e' : '#3b82f6',
    };
  }, [pendingEdgeSource, pendingEdgeBranch]);

  return (
    <svg
      className="pointer-events-none absolute left-0 top-0"
      style={{
        width: '100%',
        height: '100%',
        overflow: 'visible',
      }}
    >
      <defs>
        {/* Arrowhead markers — one per color */}
        {[
          { id: 'arrow-blue', color: '#3b82f6' },
          { id: 'arrow-green', color: '#10b981' },
          { id: 'arrow-red', color: '#f43f5e' },
        ].map((marker) => (
          <marker
            key={marker.id}
            id={marker.id}
            markerWidth="10"
            markerHeight="10"
            refX="8"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,6 L8,3 z" fill={marker.color} />
          </marker>
        ))}
      </defs>

      {paths.map((p) => {
        const markerId =
          p.color === '#10b981'
            ? 'arrow-green'
            : p.color === '#f43f5e'
            ? 'arrow-red'
            : 'arrow-blue';
        return (
          <g key={p.id} className="pointer-events-auto">
            {/* Invisible thick path for easier click-to-delete */}
            <path
              d={p.path}
              fill="none"
              stroke="transparent"
              strokeWidth={16}
              className="cursor-pointer"
              onClick={() => {
                // Delegate to the store via a custom event
                const event = new CustomEvent('flowedge-delete', { detail: p.id });
                window.dispatchEvent(event);
              }}
            />
            <path
              d={p.path}
              fill="none"
              stroke={p.color}
              strokeWidth={2}
              strokeOpacity={0.7}
              markerEnd={`url(#${markerId})`}
            />
            {p.label && (
              <g>
                <rect
                  x={p.midX - 20}
                  y={p.midY - 9}
                  width={40}
                  height={18}
                  rx={9}
                  fill="#0a0d14"
                  stroke={p.color}
                  strokeWidth={1}
                  strokeOpacity={0.5}
                />
                <text
                  x={p.midX}
                  y={p.midY + 3}
                  textAnchor="middle"
                  fontSize={9}
                  fontFamily="ui-monospace, monospace"
                  fontWeight={700}
                  fill={p.color}
                >
                  {p.label}
                </text>
              </g>
            )}
          </g>
        );
      })}

      {pendingPath && (
        <path
          d={pendingPath.path}
          fill="none"
          stroke={pendingPath.color}
          strokeWidth={2}
          strokeDasharray="6 4"
          strokeOpacity={0.6}
        />
      )}
    </svg>
  );
}
