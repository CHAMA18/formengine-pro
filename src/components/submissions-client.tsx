'use client';

import { useState, useMemo } from 'react';
import { Icon } from '@/components/app-shell';

interface Submission {
  id: string;
  formId: string;
  formName: string;
  data: Record<string, unknown>;
  source: string | null;
  status: string;
  timestamp: string;
}

/**
 * SubmissionsClient
 *
 * Client component that renders the submissions table with search/filter
 * and an expandable detail row showing the full response payload.
 */
export function SubmissionsClient({
  initialSubmissions,
}: {
  initialSubmissions: Submission[];
}) {
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return initialSubmissions;
    const q = search.toLowerCase();
    return initialSubmissions.filter(
      (s) =>
        s.formName.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.source?.toLowerCase().includes(q) ||
        Object.values(s.data).some((v) => String(v).toLowerCase().includes(q))
    );
  }, [initialSubmissions, search]);

  if (initialSubmissions.length === 0) {
    return (
      <section className="glass-panel rounded-[28px] border border-white/10 bg-fe-glass-bg p-8 backdrop-blur-xl sm:p-12">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-fe-primary/10 text-fe-primary">
            <Icon name="inbox" className="text-[32px]" />
          </div>
          <h3 className="mt-4 text-[18px] font-bold text-fe-on-surface">
            No submissions yet
          </h3>
          <p className="mt-2 max-w-md text-[13px] leading-relaxed text-fe-on-surface-variant">
            Publish a form from the Schema Architect and share the link. Once
            people start responding, their submissions will appear here in
            real time.
          </p>
          <a
            href="/forms/new"
            className="btn-primary mt-6 flex items-center gap-2 rounded-lg px-5 py-2.5 text-[13px] font-bold"
          >
            <Icon name="add" className="text-[16px]" />
            Create a Form
          </a>
        </div>
      </section>
    );
  }

  return (
    <section data-tour="submissions-table" className="glass-panel rounded-[28px] border border-white/10 bg-fe-glass-bg p-4 backdrop-blur-xl sm:p-5 md:p-6">
      <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          <h3 className="text-[18px] font-semibold tracking-[-0.02em] text-fe-on-surface">
            Submission Index
          </h3>
          <p className="mt-1 text-[13px] leading-[22px] text-fe-on-surface-variant">
            {filtered.length} of {initialSubmissions.length} entries · click a row to inspect
          </p>
        </div>

        <div className="relative lg:w-80">
          <Icon
            name="search"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[18px] text-fe-on-surface-variant"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by form, ID, or content…"
            className="input-glow w-full rounded-full border border-white/10 bg-fe-input-hollow-bg py-3 pl-11 pr-4 text-sm text-fe-on-surface placeholder:text-fe-on-surface-variant/50"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-[24px] border border-white/10">
        <div className="overflow-x-auto">
          <table className="min-w-[760px] w-full border-collapse">
            <thead className="bg-fe-surface-container-highest/60">
              <tr className="text-left text-[10px] font-semibold uppercase tracking-[0.24em] text-fe-on-surface-variant">
                <th className="px-5 py-4">Form</th>
                <th className="px-5 py-4">Preview</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Timestamp</th>
                <th className="px-5 py-4">Source</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, index) => {
                const isExpanded = expandedId === row.id;
                const previewValues = Object.entries(row.data).slice(0, 2);
                const date = new Date(row.timestamp);
                const timeLabel = date.toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                });

                return (
                  <>
                    <tr
                      key={row.id}
                      className={`border-t border-white/10 text-[14px] text-fe-on-surface transition-colors hover:bg-white/[0.02] ${
                        index % 2 === 0 ? 'bg-fe-surface/25' : 'bg-transparent'
                      } ${isExpanded ? 'bg-fe-primary/5' : ''}`}
                    >
                      <td className="px-5 py-4">
                        <div className="font-medium">{row.formName}</div>
                        <div className="font-mono text-[11px] text-fe-on-surface-variant">
                          #{row.id.slice(0, 12)}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="max-w-[280px] space-y-0.5">
                          {previewValues.map(([key, val]) => (
                            <div
                              key={key}
                              className="truncate font-mono text-[11px] text-fe-on-surface-variant"
                            >
                              <span className="text-fe-on-surface-variant/60">
                                {key}:
                              </span>{' '}
                              {String(val).slice(0, 40)}
                            </div>
                          ))}
                          {Object.keys(row.data).length > 2 && (
                            <div className="font-mono text-[10px] text-fe-on-surface-variant/50">
                              +{Object.keys(row.data).length - 2} more
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${
                            row.status === 'Live'
                              ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300'
                              : row.status === 'Pending'
                              ? 'border-amber-400/20 bg-amber-400/10 text-amber-300'
                              : 'border-rose-400/20 bg-rose-400/10 text-rose-300'
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-fe-on-surface-variant">
                        {timeLabel}
                      </td>
                      <td className="px-5 py-4 font-mono text-[12px] text-fe-on-surface-variant">
                        {row.source ?? '—'}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedId(isExpanded ? null : row.id)
                            }
                            className="flex items-center gap-1 rounded-full border border-white/10 bg-fe-input-hollow-bg px-3 py-1.5 text-[12px] font-medium text-fe-on-surface-variant transition-colors hover:text-fe-on-surface"
                          >
                            <Icon
                              name={isExpanded ? 'expand_less' : 'expand_more'}
                              className="text-[14px]"
                            />
                            {isExpanded ? 'Hide' : 'View'}
                          </button>
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${row.id}-detail`} className="border-t border-white/5">
                        <td colSpan={6} className="bg-fe-surface-container-lowest px-5 py-5">
                          <div className="rounded-xl border border-white/10 bg-fe-surface/30 p-4">
                            <div className="mb-3 flex items-center gap-2">
                              <Icon
                                name="data_object"
                                className="text-[16px] text-fe-primary"
                              />
                              <span className="text-[11px] font-semibold uppercase tracking-wider text-fe-on-surface-variant">
                                Full Response Payload
                              </span>
                            </div>
                            <pre className="overflow-x-auto rounded-lg bg-fe-surface-base p-3 font-mono text-[12px] leading-relaxed text-fe-on-surface">
                              <code>{JSON.stringify(row.data, null, 2)}</code>
                            </pre>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
