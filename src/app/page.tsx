'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ParticleBackground from '@/components/ParticleBackground';
import { SafeClientBoundary } from '@/components/safe-client-boundary';
import Reveal from '@/components/Reveal';
import { ThemeToggleButton } from '@/components/theme-toggle-button';

/* ----------------------------- Small UI primitives ----------------------------- */

interface MaterialIconProps {
  name: string;
  className?: string;
  style?: React.CSSProperties;
}

function MaterialIcon({ name, className = '', style }: MaterialIconProps) {
  return (
    <span
      className={`material-symbols-outlined ${className}`.trim()}
      style={style}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}

interface SolutionCardProps {
  icon: string;
  title: string;
  description: string;
}

function SolutionCard({ icon, title, description }: SolutionCardProps) {
  return (
    <div className="glass-panel p-8 rounded-xl glow-hover transition-all group">
      <div className="w-12 h-12 rounded-lg bg-fe-primary-container/10 border border-fe-primary-container/20 flex items-center justify-center mb-4 group-hover:bg-fe-primary-container/20 transition-colors">
        <MaterialIcon name={icon} className="text-fe-primary-container" />
      </div>
      <h3 className="text-[18px] leading-[28px] font-medium mb-2">{title}</h3>
      <p className="text-[14px] leading-[24px] text-fe-on-surface-variant opacity-80">
        {description}
      </p>
    </div>
  );
}

interface PricingCardProps {
  tier: string;
  price: string;
  priceUnit?: string;
  features: string[];
  cta: string;
  accent?: 'none' | 'popular';
  badge?: string;
}

function PricingCard({
  tier,
  price,
  priceUnit,
  features,
  cta,
  accent = 'none',
  badge,
}: PricingCardProps) {
  const isPopular = accent === 'popular';
  return (
    <div
      className={`glass-panel p-8 rounded-xl flex flex-col relative ${
        isPopular ? 'hyper-blue-glow scale-105 z-20' : ''
      }`}
    >
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-fe-primary-container text-fe-on-primary-container px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-[0_0_15px_#0066ff]">
          {badge}
        </div>
      )}
      <div className="mb-8">
        <span
          className={`text-[11px] leading-[16px] tracking-[0.05em] font-semibold ${
            isPopular ? 'text-fe-primary' : 'text-fe-on-surface-variant'
          }`}
        >
          {tier}
        </span>
        <div className="text-4xl font-bold mt-2">
          {price}
          {priceUnit && (
            <span className="text-[14px] font-normal text-fe-on-surface-variant">
              {priceUnit}
            </span>
          )}
        </div>
      </div>
      <ul className="space-y-4 flex-grow text-[14px] leading-[24px]">
        {features.map((feature) => (
          <li key={feature} className="flex items-center space-x-2">
            <MaterialIcon
              name="check"
              className="text-fe-primary text-sm"
            />
            <span className={isPopular ? '' : 'text-fe-on-surface-variant'}>
              {feature}
            </span>
          </li>
        ))}
      </ul>
      {isPopular ? (
        <button className="mt-8 w-full py-2 bg-fe-primary-container text-fe-on-primary-container rounded-lg font-bold shadow-[0_4px_12px_rgba(0,102,255,0.4)] hover:opacity-90 transition-all">
          {cta}
        </button>
      ) : (
        <button className="mt-8 w-full py-2 border border-fe-border-white-faint rounded-lg hover:bg-white/5 transition-all">
          {cta}
        </button>
      )}
    </div>
  );
}

/* ----------------------------- Page ----------------------------- */

export default function Home() {
  const router = useRouter();

  // Navigate to /signin with a hard-fallback safety net. Client-side routing
  // via router.push() is fast, but inside the Z.ai preview iframe the RSC
  // fetch can be blocked by sandbox restrictions - if that happens we fall
  // back to a hard window.location assignment after 800ms so the user is
  // never stuck.
  const goToSignin = () => {
    router.push('/signin');
    const fallback = window.setTimeout(() => {
      if (window.location.pathname !== '/signin') {
        window.location.assign('/signin');
      }
    }, 800);
    window.addEventListener(
      'beforeunload',
      () => window.clearTimeout(fallback),
      { once: true }
    );
  };

  // Smooth scroll for anchor links
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const el = document.querySelector(href);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth' });
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Three.js Particle Background — wrapped in SafeClientBoundary so a
          WebGL failure (common in sandboxed preview iframes) never blanks
          the page. The CSS decorative layers inside ParticleBackground
          still render even if Three.js bails out. */}
      <SafeClientBoundary>
        <ParticleBackground />
      </SafeClientBoundary>

      {/* Navigation Header */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-[40px] bg-fe-glass-bg border-b border-fe-border-white-faint shadow-sm">
        <div className="flex justify-between items-center px-6 py-4 mx-auto">
          <div className="text-[24px] leading-[32px] font-bold text-fe-on-surface tracking-tight">
            FormEngine <span className="text-fe-primary-container">Pro</span>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <a
              className="text-[14px] text-fe-on-surface-variant font-medium hover:text-fe-primary transition-colors duration-300"
              href="#solutions"
            >
              Solutions
            </a>
            <a
              className="text-[14px] text-fe-on-surface-variant font-medium hover:text-fe-primary transition-colors duration-300"
              href="#developers"
            >
              Developers
            </a>
            <a
              className="text-[14px] text-fe-on-surface-variant font-medium hover:text-fe-primary transition-colors duration-300"
              href="#pricing"
            >
              Pricing
            </a>
            <ThemeToggleButton variant="nav" />
          </div>
          <div className="flex items-center gap-3">
            <div className="md:hidden">
              <ThemeToggleButton variant="nav" />
            </div>
            <button
              type="button"
              onClick={goToSignin}
              className="bg-fe-primary-container text-fe-on-primary-container px-8 py-2 rounded-lg font-bold hover:opacity-90 transition-all duration-300"
            >
              Login
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-32 space-y-32 pb-32 flex-grow">
        {/* Hero Context */}
        <section className="w-full mx-auto px-6 text-center">
          <Reveal>
            <h1 className="text-[48px] leading-[56px] font-bold mb-4 tracking-[-0.02em]">
              Next-Gen Schema Engineering
            </h1>
            <p className="text-[18px] leading-[28px] font-medium text-fe-on-surface-variant max-w-2xl mx-auto">
              Build, validate, and deploy complex logical workflows with the
              precision of a high-performance terminal.
            </p>
          </Reveal>
        </section>

        {/* Solutions Section */}
        <section
          className="w-full mx-auto px-6 space-y-8"
          id="solutions"
        >
          <Reveal className="text-center mb-8 block">
            <span className="text-[11px] leading-[16px] tracking-[0.2em] font-semibold text-fe-primary uppercase block">
              Industry Verticals
            </span>
            <h2 className="text-[32px] leading-[40px] font-semibold mt-2 tracking-[-0.01em]">
              Engineered for Complexity
            </h2>
          </Reveal>
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SolutionCard
                icon="account_balance"
                title="Fintech Compliance"
                description="Streamline KYC and complex risk assessment flows with atomic validation and immutable audit logs."
              />
              <SolutionCard
                icon="clinical_notes"
                title="Healthcare Logistics"
                description="HIPAA-ready infrastructure for dynamic patient intake and diagnostic branching logic at scale."
              />
              <SolutionCard
                icon="account_balance_wallet"
                title="Gov Infrastructure"
                description="Public-sector resilient systems supporting massive concurrent users and airtight security protocols."
              />
            </div>
          </Reveal>
        </section>

        {/* Developers Section: Code Preview */}
        <section className="w-full mx-auto px-6" id="developers">
          <Reveal>
            <div className="mb-8">
              <span className="text-[11px] leading-[16px] tracking-[0.2em] font-semibold text-fe-primary uppercase">
                Engine Performance
              </span>
              <h2 className="text-[32px] leading-[40px] font-semibold mt-2 tracking-[-0.01em]">
                Developer-First Schema Engine
              </h2>
            </div>
            <div className="glass-panel rounded-xl overflow-hidden flex flex-col md:flex-row border-fe-border-white-faint">
              {/* Code Side */}
              <div className="w-full md:w-1/2 p-8 bg-fe-surface-container-lowest font-mono text-[12px] leading-[20px] border-b md:border-b-0 md:border-r border-fe-border-white-faint">
                <div className="flex items-center justify-between mb-4 opacity-50">
                  <span>engine-schema.json</span>
                  <MaterialIcon
                    name="content_copy"
                    className="text-sm cursor-pointer"
                  />
                </div>
                <pre className="space-y-1 whitespace-pre-wrap break-words font-mono">
                  <span className="code-syntax-key">"id"</span>: <span className="code-syntax-string">"kyc_v4"</span>,{'\n'}
                  <span className="code-syntax-key">"type"</span>: <span className="code-syntax-string">"logical_flow"</span>,{'\n'}
                  <span className="code-syntax-key">"steps"</span>: [{'\n'}
                  {'  {\n'}
                  {'    '}<span className="code-syntax-key">"component"</span>: <span className="code-syntax-string">"identity_v3"</span>,{'\n'}
                  {'    '}<span className="code-syntax-key">"require_bio"</span>: <span className="code-syntax-bool">true</span>,{'\n'}
                  {'    '}<span className="code-syntax-key">"async_verify"</span>: <span className="code-syntax-bool">true</span>{'\n'}
                  {'  }\n'}
                  ],{'\n'}
                  <span className="code-syntax-key">"hooks"</span>: [{'\n'}
                  {'  '}<span className="code-syntax-string">"pre_auth_check"</span>,{'\n'}
                  {'  '}<span className="code-syntax-string">"log_audit_trail"</span>{'\n'}
                  ]
                </pre>
              </div>
              {/* Rendered Side */}
              <div className="w-full md:w-1/2 p-8 flex flex-col justify-center bg-fe-input-hollow-bg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none">
                  <MaterialIcon name="terminal" style={{ fontSize: '4rem' }} />
                </div>
                <div className="space-y-4 z-10 max-w-md mx-auto w-full">
                  <div className="p-4 border border-fe-primary/20 rounded-lg bg-fe-surface-container/50">
                    <label className="text-[11px] leading-[16px] tracking-[0.05em] font-semibold mb-2 block opacity-60">
                      Identity Verification
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="w-full h-2 bg-fe-primary/10 rounded-full overflow-hidden">
                        <div className="w-2/3 h-full bg-fe-primary-container shadow-[0_0_8px_#0066ff]"></div>
                      </div>
                      <span className="font-mono text-[12px] text-fe-primary">
                        68%
                      </span>
                    </div>
                  </div>
                  <button className="w-full py-4 border border-fe-border-white-faint rounded-lg font-bold flex items-center justify-center space-x-2 bg-white/5 hover:bg-white/10 transition-all">
                    <span>Initialize Secure Bridge</span>
                    <MaterialIcon name="arrow_forward" className="text-sm" />
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <a
                className="text-[11px] leading-[16px] tracking-[0.05em] font-semibold text-fe-primary hover:underline flex items-center space-x-2 group"
                href="#"
              >
                <span>Explore Documentation</span>
                <MaterialIcon
                  name="arrow_forward"
                  className="text-sm group-hover:translate-x-1 transition-transform"
                />
              </a>
            </div>
          </Reveal>
        </section>

        {/* Pricing Section */}
        <section className="w-full mx-auto px-6" id="pricing">
          <Reveal>
            <div className="text-center mb-8">
              <span className="text-[11px] leading-[16px] tracking-[0.2em] font-semibold text-fe-primary uppercase">
                Scale your Infrastructure
              </span>
              <h2 className="text-[32px] leading-[40px] font-semibold mt-2 tracking-[-0.01em]">
                Precision-Engineered Pricing
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
              <PricingCard
                tier="Starter"
                price="$49"
                priceUnit="/mo"
                features={[
                  '5 Active Engines',
                  'Standard Validation',
                  'Email Support',
                ]}
                cta="Get Started"
              />
              <PricingCard
                tier="Engine"
                price="$299"
                priceUnit="/mo"
                features={[
                  'Unlimited Engines',
                  'Custom Logics & Hooks',
                  'Advanced Observability',
                  'Priority Response',
                ]}
                cta="Select Engine"
                accent="popular"
                badge="Most Popular"
              />
              <PricingCard
                tier="Enterprise"
                price="Custom"
                features={[
                  'Air-gapped Deploy',
                  'Custom SLA & Security',
                  'Dedicated Architect',
                ]}
                cta="Talk to Sales"
              />
            </div>
          </Reveal>
        </section>

        {/* Final CTA Area */}
        <section className="w-full mx-auto px-6">
          <Reveal>
            <div className="glass-panel p-12 rounded-xl text-center border-fe-primary/20 relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-[32px] leading-[40px] font-semibold mb-4 tracking-[-0.01em]">
                  Ready to re-engineer your forms?
                </h2>
                <p className="text-fe-on-surface-variant mb-8">
                  Join 1,000+ technical teams building faster, safer
                  infrastructure.
                </p>
                <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <button className="bg-fe-primary-container text-fe-on-primary-container px-10 py-4 rounded-lg font-bold text-lg shadow-[0_0_20px_rgba(0,102,255,0.3)]">
                    Get Started Now
                  </button>
                  <button className="border border-fe-border-white-faint px-10 py-4 rounded-lg font-bold text-lg hover:bg-white/5">
                    Request Demo
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 bg-fe-surface-container-lowest border-t border-fe-border-white-faint relative z-10 mt-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6 mx-auto">
          <div className="col-span-2 md:col-span-1">
            <div className="text-[11px] leading-[16px] tracking-[0.05em] font-semibold text-fe-on-surface-variant mb-4">
              FormEngine Pro
            </div>
            <p className="font-mono text-[12px] text-fe-on-surface-variant opacity-60 max-w-[200px]">
              Precision-engineered for technical infrastructure.
            </p>
          </div>
          <div>
            <div className="text-[11px] leading-[16px] tracking-[0.05em] font-semibold text-fe-on-surface-variant mb-4">
              Resources
            </div>
            <ul className="space-y-2">
              <li>
                <a
                  className="font-mono text-[12px] text-fe-on-surface-variant hover:text-fe-primary-fixed-dim underline transition-all"
                  href="#"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  className="font-mono text-[12px] text-fe-on-surface-variant hover:text-fe-primary-fixed-dim underline transition-all"
                  href="#"
                >
                  API Reference
                </a>
              </li>
              <li>
                <a
                  className="font-mono text-[12px] text-fe-on-surface-variant hover:text-fe-primary-fixed-dim underline transition-all"
                  href="#"
                >
                  Changelog
                </a>
              </li>
            </ul>
          </div>
          <div>
            <div className="text-[11px] leading-[16px] tracking-[0.05em] font-semibold text-fe-on-surface-variant mb-4">
              Compliance
            </div>
            <ul className="space-y-2">
              <li>
                <a
                  className="font-mono text-[12px] text-fe-on-surface-variant hover:text-fe-primary-fixed-dim underline transition-all"
                  href="#"
                >
                  Security
                </a>
              </li>
              <li>
                <a
                  className="font-mono text-[12px] text-fe-on-surface-variant hover:text-fe-primary-fixed-dim underline transition-all"
                  href="#"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  className="font-mono text-[12px] text-fe-on-surface-variant hover:text-fe-primary-fixed-dim underline transition-all"
                  href="#"
                >
                  Status
                </a>
              </li>
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1 flex flex-col justify-end">
            <p className="font-mono text-[12px] text-fe-on-surface-variant opacity-40">
              © 2024 FormEngine Pro.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
