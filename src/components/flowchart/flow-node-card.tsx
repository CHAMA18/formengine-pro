'use client';

import { NODE_CATALOG, type FlowNode } from '@/lib/flowchart/types';
import { useFlowchartStore } from '@/lib/flowchart/store';

/**
 * FlowNodeCard
 *
 * Renders a single node on the canvas. Each node type has a distinct color
 * and icon. Nodes are draggable (via the header) and have output handles
 * for creating edges.
 *
 * Condition nodes have two output handles: "true" (green) and "false" (red).
 * All other nodes have a single output handle on the right.
 */
const NODE_WIDTH = 200;
const NODE_HEIGHT = 64;

export function FlowNodeCard({
  node,
  selected,
  isPendingTarget,
  onMouseDown,
  onClick,
  onOutputMouseDown,
}: {
  node: FlowNode;
  selected: boolean;
  isPendingTarget: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onClick: (e: React.MouseEvent) => void;
  onOutputMouseDown: (e: React.MouseEvent, branch?: 'true' | 'false') => void;
}) {
  const catalog = NODE_CATALOG[node.type];
  const { deleteNode } = useFlowchartStore();

  const isCondition = node.type === 'condition';
  const isTerminal = node.type === 'start' || node.type === 'end';

  return (
    <div
      className="absolute select-none"
      style={{
        left: node.position.x,
        top: node.position.y,
        width: NODE_WIDTH,
      }}
      onMouseDown={onMouseDown}
      onClick={onClick}
    >
      {/* Selection ring */}
      <div
        className={`relative rounded-xl border bg-fe-surface-container transition-all ${
          selected
            ? 'border-fe-primary shadow-[0_0_0_2px_rgba(0,102,255,0.3),0_8px_24px_rgba(0,0,0,0.4)]'
            : isPendingTarget
            ? 'border-fe-primary/50 hover:border-fe-primary hover:shadow-[0_0_0_2px_rgba(0,102,255,0.2)]'
            : 'border-white/10 hover:border-white/20'
        }`}
        style={{ minHeight: NODE_HEIGHT }}
      >
        {/* Top accent bar */}
        <div
          className="absolute left-0 right-0 top-0 h-1 rounded-t-xl"
          style={{ backgroundColor: catalog.color }}
        />

        {/* Node content */}
        <div className="flex items-center gap-3 px-3 py-3">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
            style={{
              backgroundColor: `${catalog.color}20`,
              color: catalog.color,
            }}
          >
            <span className="material-symbols-outlined text-[20px]">
              {catalog.icon}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[12px] font-semibold text-fe-on-surface">
              {node.data.label}
            </div>
            <div className="truncate font-mono text-[10px] uppercase tracking-wider text-fe-on-surface-variant">
              {node.type === 'field'
                ? node.data.fieldType
                : node.type === 'condition'
                ? 'if / else'
                : node.type}
              {node.type === 'field' && node.data.required ? ' · required' : ''}
            </div>
          </div>

          {/* Delete button */}
          {!isTerminal && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                deleteNode(node.id);
              }}
              className="rounded p-1 text-fe-on-surface-variant opacity-0 transition-all hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
              style={{ opacity: selected ? 1 : undefined }}
              aria-label="Delete node"
            >
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
          )}
        </div>

        {/* Options indicator for dropdown/radio/checkbox */}
        {node.type === 'field' &&
          node.data.options &&
          node.data.options.filter((o) => o.trim()).length > 0 && (
            <div className="border-t border-white/5 px-3 py-1.5">
              <div className="flex flex-wrap gap-1">
                {node.data.options
                  .filter((o) => o.trim())
                  .slice(0, 3)
                  .map((opt, i) => (
                    <span
                      key={i}
                      className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[9px] text-fe-on-surface-variant"
                    >
                      {opt}
                    </span>
                  ))}
                {node.data.options.filter((o) => o.trim()).length > 3 && (
                  <span className="font-mono text-[9px] text-fe-on-surface-variant">
                    +{node.data.options.filter((o) => o.trim()).length - 3}
                  </span>
                )}
              </div>
            </div>
          )}

        {/* Input handle (left side) */}
        {node.type !== 'start' && (
          <div
            className="absolute left-0 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-fe-surface-container bg-fe-on-surface-variant"
            title="Input"
          />
        )}

        {/* Output handles */}
        {node.type !== 'end' && (
          <>
            {isCondition ? (
              <>
                {/* True branch — bottom */}
                <button
                  type="button"
                  onMouseDown={(e) => onOutputMouseDown(e, 'true')}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-0 left-1/3 flex h-4 w-4 -translate-x-1/2 translate-y-1/2 items-center justify-center rounded-full border-2 border-fe-surface-container bg-emerald-500 transition-transform hover:scale-125"
                  title="True branch — drag to connect"
                >
                  <span className="font-mono text-[7px] font-bold text-white">T</span>
                </button>
                {/* False branch — bottom right */}
                <button
                  type="button"
                  onMouseDown={(e) => onOutputMouseDown(e, 'false')}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-0 right-1/3 flex h-4 w-4 translate-x-1/2 translate-y-1/2 items-center justify-center rounded-full border-2 border-fe-surface-container bg-rose-500 transition-transform hover:scale-125"
                  title="False branch — drag to connect"
                >
                  <span className="font-mono text-[7px] font-bold text-white">F</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onMouseDown={(e) => onOutputMouseDown(e)}
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-1/2 h-3.5 w-3.5 translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-fe-surface-container bg-fe-primary transition-transform hover:scale-125"
                title="Output — drag to connect"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
