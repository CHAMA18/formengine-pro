import type { Metadata } from 'next';
import { AppShell, Icon } from '@/components/app-shell';
import { ApiKeysManager } from '@/components/api-keys-manager';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'API Management | FormEngine Pro',
  description:
    'Create, rotate, and revoke API keys for programmatic access to FormEngine Pro.',
};

export default function ApiKeysPage() {
  return (
    <AppShell activePath="/api-keys" brandSubtitle="Secrets & access">
      <div className="mx-auto w-full max-w-[1200px] space-y-6 px-4 pb-10 pt-20 min-[480px]:pt-8 sm:px-6">
        {/* Header */}
        <header data-tour="apikeys-header" className="glass-panel rounded-[24px] border border-white/10 bg-fe-glass-bg p-5 backdrop-blur-xl sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-fe-primary-container">
                <Icon name="api" className="text-[15px]" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.24em]">
                  Developer API
                </span>
              </div>
              <h1 className="mt-1 text-[28px] font-bold tracking-tight text-fe-on-surface sm:text-[36px]">
                API Keys
              </h1>
              <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-fe-on-surface-variant sm:text-[14px]">
                Create API keys to integrate FormEngine Pro with your applications,
                webhooks, and automation. Keys are SHA-256 hashed at rest and
                rotatable on demand.
              </p>
            </div>
            <Link
              href="/docs/api"
              data-tour="apikeys-docs"
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-fe-input-hollow-bg px-4 py-2.5 text-[13px] font-semibold text-fe-on-surface-variant transition-colors hover:text-fe-on-surface"
            >
              <Icon name="menu_book" className="text-[16px]" />
              API Docs
            </Link>
          </div>
        </header>

        {/* Manager */}
        <ApiKeysManager />

        {/* Security info */}
        <section className="glass-panel flex items-start gap-4 rounded-2xl border border-white/10 p-5 sm:p-6">
          <div className="rounded-xl bg-fe-primary/10 p-2.5 text-fe-primary">
            <Icon name="shield" className="text-[20px]" />
          </div>
          <div className="flex-1">
            <h4 className="text-[14px] font-bold text-fe-on-surface">
              Security Best Practices
            </h4>
            <p className="mt-1 max-w-3xl text-[12px] leading-relaxed text-fe-on-surface-variant">
              Rotate your keys every 90 days. Never commit keys to source control
              or expose them in client-side code. Use the minimal permission scope
              needed — for read-only integrations, create a key with only{' '}
              <code className="rounded bg-fe-input-hollow-bg px-1 py-0.5 font-mono text-[11px] text-fe-primary">
                forms:read
              </code>{' '}
              and{' '}
              <code className="rounded bg-fe-input-hollow-bg px-1 py-0.5 font-mono text-[11px] text-fe-primary">
                submissions:read
              </code>
              .
            </p>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
