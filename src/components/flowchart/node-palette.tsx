'use client';

import { NODE_CATALOG, type NodeType } from '@/lib/flowchart/types';
import { useFlowchartStore } from '@/lib/flowchart/store';

/**
 * NodePalette
 *
 * The left sidebar of the builder. Shows draggable node types that can be
 * dragged onto the canvas, or clicked to add at the canvas center.
 */
const PALETTE_ITEMS: NodeType[] = ['start', 'field', 'condition', 'submit', 'end'];

export function NodePalette() {
  const addNode = useFlowchartStore((s) => s.addNode);

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-white/10 bg-fe-surface-container/60 backdrop-blur-xl">
      <div className="border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2 text-fe-primary">
          <span className="material-symbols-outlined text-[16px]">add_circle</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
            Node Palette
          </span>
        </div>
        <p className="mt-1 text-[10px] text-fe-on-surface-variant">
          Drag onto canvas or click to add
        </p>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        {PALETTE_ITEMS.map((type) => {
          const catalog = NODE_CATALOG[type];
          return (
            <button
              key={type}
              type="button"
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('application/node-type', type);
                e.dataTransfer.effectAllowed = 'copy';
              }}
              onClick={() => addNode(type)}
              className="group flex w-full items-start gap-3 rounded-xl border border-white/10 bg-fe-surface/50 p-3 text-left transition-all hover:border-white/20 hover:bg-fe-surface"
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-transform group-hover:scale-110"
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
                <div className="text-[13px] font-semibold text-fe-on-surface">
                  {catalog.label}
                </div>
                <div className="mt-0.5 text-[10px] leading-tight text-fe-on-surface-variant">
                  {catalog.description}
                </div>
              </div>
              <span className="material-symbols-outlined text-[14px] text-fe-on-surface-variant opacity-0 transition-opacity group-hover:opacity-100">
                drag_indicator
              </span>
            </button>
          );
        })}
      </div>

      <div className="border-t border-white/10 p-3">
        <div className="rounded-lg border border-white/5 bg-fe-surface/30 p-3">
          <div className="flex items-center gap-1.5 text-fe-on-surface-variant">
            <span className="material-symbols-outlined text-[14px]">tips_and_updates</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider">
              Tips
            </span>
          </div>
          <ul className="mt-2 space-y-1 text-[10px] leading-relaxed text-fe-on-surface-variant/80">
            <li>· Drag from a node&apos;s right edge to connect</li>
            <li>· Conditions branch into true / false</li>
            <li>· Click an edge to delete it</li>
            <li>· Scroll to zoom, drag bg to pan</li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
