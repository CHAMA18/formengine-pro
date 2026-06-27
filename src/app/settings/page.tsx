import type { Metadata } from 'next';
import { AppShell, Icon } from '@/components/app-shell';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'System Configuration | FormEngine Pro',
  description:
    'Manage workspace configuration, integrations, security, and compliance for FormEngine Pro.',
};

function SettingsCard({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description: string;
  icon: string;
  children: ReactNode;
}) {
  return (
    <div className="glass-panel rounded-[20px] p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h4 className="text-[18px] font-semibold tracking-[-0.02em] text-fe-on-surface">
            {title}
          </h4>
          <p className="mt-1 text-[13px] leading-[21px] text-fe-on-surface-variant">
            {description}
          </p>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-fe-border-white-faint bg-fe-input-hollow-bg text-fe-on-surface-variant">
          <Icon name={icon} className="text-[20px]" />
        </div>
      </div>
      {children}
    </div>
  );
}

function ToggleRow({
  title,
  description,
  checked = false,
  id,
}: {
  title: string;
  description: string;
  checked?: boolean;
  id: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div>
        <p className="text-[14px] font-medium text-fe-on-surface">{title}</p>
        <p className="text-[12px] leading-[20px] text-fe-on-surface-variant">{description}</p>
      </div>
      <div className="relative inline-block h-5 w-10 shrink-0">
        <input
          defaultChecked={checked}
          className="peer hidden"
          id={id}
          type="checkbox"
        />
        <label
          className="absolute inset-0 cursor-pointer rounded-full bg-fe-surface-container-highest transition-all duration-300 peer-checked:bg-fe-primary peer-focus-visible:ring-2 peer-focus-visible:ring-fe-primary/40 after:absolute after:bottom-0.5 after:left-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:duration-300 peer-checked:after:translate-x-5"
          htmlFor={id}
        />
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <AppShell activePath="/settings" brandSubtitle="Operational dashboard">
      <div className="relative z-10 mx-auto w-full max-w-[1200px] space-y-8 px-4 pb-12 pt-20 min-[480px]:pt-8 sm:px-6">
        <header data-tour="settings-header" className="glass-panel sticky top-0 z-30 flex h-16 items-center justify-between border border-fe-border-white-faint bg-fe-glass-bg px-4 backdrop-blur-xl md:px-6">
          <div>
            <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-fe-on-surface">
              System Configuration
            </h2>
            <p className="mt-0.5 text-[12px] text-fe-on-surface-variant">
              Manage global infrastructure and security protocols.
            </p>
          </div>
          <button className="glow-button-primary flex items-center gap-2 rounded-lg px-4 py-2 text-[14px] font-semibold text-fe-on-primary transition-transform hover:-translate-y-[1px]">
            <Icon name="save" className="text-[20px]" />
            <span>Deploy Changes</span>
          </button>
        </header>

        <section className="space-y-6">
          <div className="flex items-center gap-2 text-fe-primary">
            <Icon name="account_tree" className="text-[18px]" />
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.24em]">
              Workspace Configuration
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <SettingsCard
              title="General Profile"
              description="Update project identity and metadata."
              icon="info"
            >
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-fe-on-surface-variant">
                    Project Identifier
                  </label>
                  <input
                    className="input-glow w-full rounded-lg border border-fe-border-white-faint bg-fe-input-hollow-bg px-3 py-2 font-mono text-[12px] text-fe-on-surface transition-all placeholder:text-fe-on-surface-variant/50"
                    defaultValue="formengine-pro-main"
                    type="text"
                  />
                </div>

                <ToggleRow
                  id="toggle-autoscale"
                  title="Auto-Scale Engine"
                  description="Automatically increase compute during spikes."
                  checked
                />
              </div>
            </SettingsCard>

            <SettingsCard
              title="Team Access"
              description="Review who can manage the workspace and billing context."
              icon="groups"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="rounded bg-fe-secondary-container/30 px-2 py-1 text-[11px] font-bold text-fe-primary">
                    8 Members
                  </span>
                  <button className="text-[11px] font-semibold uppercase tracking-[0.18em] text-fe-primary transition-colors hover:underline">
                    Invite Member
                  </button>
                </div>

                <div className="flex -space-x-2">
                  <div className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-fe-surface-base bg-fe-surface-container-high text-[10px] font-semibold">
                    AC
                  </div>
                  <div className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-fe-surface-base bg-fe-surface-container-high text-[10px] font-semibold">
                    CH
                  </div>
                  <div className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-fe-surface-base bg-fe-surface-container-high text-[10px] font-semibold">
                    JP
                  </div>
                  <div className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-fe-surface-base bg-fe-surface-container-high text-[10px] font-semibold">
                    +5
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[14px] font-medium text-fe-on-surface">Billing Period</p>
                      <p className="text-[12px] text-fe-on-surface-variant">
                        Enterprise Tier - Monthly Renewal
                      </p>
                    </div>
                    <button className="text-[11px] font-semibold uppercase tracking-[0.18em] text-fe-primary transition-colors hover:underline">
                      Manage Plan
                    </button>
                  </div>
                </div>
              </div>
            </SettingsCard>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-2 text-fe-primary">
            <Icon name="dns" className="text-[18px]" />
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.24em]">
              System Integration
            </h3>
          </div>

          <SettingsCard
            title="Integration Layer"
            description="Webhook destinations, environment variables, and live runtime status."
            icon="api"
          >
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-fe-on-surface-variant">
                    Global Webhook Endpoint
                  </label>
                  <div className="flex gap-2">
                    <input
                      className="input-glow flex-1 rounded-lg border border-fe-border-white-faint bg-fe-input-hollow-bg px-3 py-2 font-mono text-[12px] text-fe-on-surface-variant/80"
                      readOnly
                      value="https://api.formengine.pro/v1/hooks/prod-01"
                      type="text"
                    />
                    <button className="rounded-lg border border-fe-border-white-faint bg-fe-input-hollow-bg p-2 transition-colors hover:bg-fe-surface-container-highest">
                      <Icon name="content_copy" className="text-[18px]" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-fe-on-surface-variant">
                    Environment Variables
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 rounded-lg border border-fe-border-white-faint bg-fe-surface-container-low px-3 py-2">
                      <span className="font-mono text-[12px] text-fe-primary">DB_CLUSTER_KEY</span>
                      <span className="text-[12px] text-fe-on-surface-variant">••••••••••••••••</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border border-fe-border-white-faint bg-fe-surface-container-low px-3 py-2">
                      <span className="font-mono text-[12px] text-fe-primary">STRIPE_SECRET</span>
                      <span className="text-[12px] text-fe-on-surface-variant">••••••••••••••••</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-fe-border-white-faint bg-fe-surface-container-lowest/50 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-fe-on-surface">
                    Real-time Node Status
                  </span>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="mb-1 flex justify-between text-[12px]">
                      <span className="text-fe-on-surface-variant">Compute Load</span>
                      <span className="text-fe-primary">12.4%</span>
                    </div>
                    <div className="h-1 w-full overflow-hidden rounded-full bg-fe-surface-container-highest">
                      <div className="h-full w-[12.4%] bg-fe-primary shadow-[0_0_8px_#b3c5ff]" />
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 flex justify-between text-[12px]">
                      <span className="text-fe-on-surface-variant">Network Latency</span>
                      <span className="text-fe-primary">14ms</span>
                    </div>
                    <div className="h-1 w-full overflow-hidden rounded-full bg-fe-surface-container-highest">
                      <div className="h-full w-[4%] bg-fe-primary shadow-[0_0_8px_#b3c5ff]" />
                    </div>
                  </div>
                </div>
                <button className="mt-4 w-full rounded border border-fe-border-white-faint py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-fe-on-surface-variant transition-colors hover:text-fe-on-surface">
                  View System Logs
                </button>
              </div>
            </div>
          </SettingsCard>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-2 text-fe-primary">
            <Icon name="security" className="text-[18px]" />
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.24em]">
              Security & Compliance
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              {
                icon: 'fingerprint',
                title: 'SSO Providers',
                description:
                  'Enforce SAML 2.0 or OAuth login flows for team members.',
                action: 'Configure SSO',
              },
              {
                icon: 'history',
                title: 'Audit Logs',
                description:
                  'Track every configuration change with deep system forensics.',
                action: 'Export Logs',
              },
              {
                icon: 'verified_user',
                title: 'Data Residency',
                description:
                  'Pin your form data to specific geographic regions (GDPR/CCPA).',
                action: 'Region Lock',
              },
            ].map((item) => (
              <div key={item.title} className="glass-panel space-y-3 rounded-[20px] p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-fe-secondary-container/40 text-fe-primary">
                  <Icon name={item.icon} className="text-[20px]" />
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-fe-on-surface">{item.title}</h4>
                  <p className="mt-1 text-[12px] leading-[20px] text-fe-on-surface-variant">
                    {item.description}
                  </p>
                </div>
                <button className="w-full rounded bg-fe-surface-container-highest py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-fe-on-surface transition-colors hover:bg-fe-secondary-container">
                  {item.action}
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="pb-4">
          <div className="flex items-center gap-2 text-fe-error">
            <Icon name="warning" className="text-[18px]" />
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.24em]">
              Danger Zone
            </h3>
          </div>
          <div className="mt-4 flex flex-col items-center justify-between gap-4 rounded-[20px] border border-fe-error-red/20 bg-fe-error-red/5 p-6 md:flex-row">
            <div>
              <h4 className="text-[18px] font-semibold text-fe-error-red">Terminate Project</h4>
              <p className="mt-2 max-w-2xl text-[14px] leading-[24px] text-fe-on-surface-variant">
                Permanently delete this project and all associated form data. This action cannot
                be reversed and will immediately invalidate all active API keys.
              </p>
            </div>
            <button className="rounded-lg border-2 border-fe-error-red px-6 py-2 font-semibold text-fe-error-red transition-all hover:bg-fe-error-red hover:text-white">
              Delete Project
            </button>
          </div>
        </section>

        {/* Walkthrough / Tour section */}
        <WalkthroughSection />
      </div>
    </AppShell>
  );
}

/**
 * WalkthroughSection
 *
 * Lets the user start, restart, or reset the guided tour. Shows whether
 * the tour has been completed and how many steps it covers.
 */
function WalkthroughSection() {
  return (
    <section data-tour="settings-walkthrough" className="glass-panel rounded-[20px] p-6">
      <div className="flex items-center gap-2 text-fe-primary">
        <Icon name="tour" className="text-[18px]" />
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.24em]">
          Guided Walkthrough
        </h3>
      </div>

      <div className="mt-4 flex flex-col items-start justify-between gap-4 rounded-[20px] border border-fe-primary/20 bg-fe-primary/5 p-6 md:flex-row md:items-center">
        <div>
          <h4 className="text-[18px] font-semibold text-fe-on-surface">
            Interactive Application Tour
          </h4>
          <p className="mt-2 max-w-2xl text-[14px] leading-[24px] text-fe-on-surface-variant">
            New to FormEngine Pro? Take the guided tour to explore every section
            of the application — the dashboard, template library, flowchart
            builder, submissions, API keys, and settings. The tour walks you
            through each feature with highlights and explanations.
          </p>
          <div className="mt-3 flex flex-wrap gap-3 text-[12px] text-fe-on-surface-variant">
            <span className="flex items-center gap-1">
              <Icon name="steps" className="text-[14px] text-fe-primary" />
              20 steps
            </span>
            <span className="flex items-center gap-1">
              <Icon name="timer" className="text-[14px] text-fe-primary" />
              ~5 minutes
            </span>
            <span className="flex items-center gap-1">
              <Icon name="visibility" className="text-[14px] text-fe-primary" />
              Covers all 6 sections
            </span>
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-2">
          <StartTourButton />
        </div>
      </div>

      {/* Tour topics */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { icon: 'dashboard', title: 'Dashboard', desc: 'Overview, stats, and form library' },
          { icon: 'auto_awesome', title: 'Templates', desc: 'Pre-built forms and your published forms' },
          { icon: 'schema', title: 'Flowchart Builder', desc: 'Visual node editor for designing forms' },
          { icon: 'inbox', title: 'Submissions', desc: 'Real-time response tracking and search' },
          { icon: 'api', title: 'API Keys', desc: 'Create, rotate, and revoke programmatic access' },
          { icon: 'menu_book', title: 'API Docs', desc: 'Interactive REST API documentation' },
        ].map((topic) => (
          <div
            key={topic.title}
            className="flex items-start gap-3 rounded-xl border border-white/10 bg-fe-surface/50 p-3"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-fe-primary/10 text-fe-primary">
              <Icon name={topic.icon} className="text-[18px]" />
            </div>
            <div>
              <div className="text-[13px] font-semibold text-fe-on-surface">
                {topic.title}
              </div>
              <div className="text-[11px] text-fe-on-surface-variant">
                {topic.desc}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * StartTourButton — client component that triggers the walkthrough.
 */
function StartTourButton() {
  return <StartTourButtonClient />;
}

/**
 * We need a client component for the onClick handler, but the settings page
 * is a server component. Import the client wrapper.
 */
import { StartTourButtonClient } from '@/components/start-tour-button';
