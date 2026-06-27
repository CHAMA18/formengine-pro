'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SafeClientBoundary } from '@/components/safe-client-boundary';
import { ThemeToggleButton } from '@/components/theme-toggle-button';
import { useTheme } from 'next-themes';

function MaterialIcon({ name, className = '', style }: { name: string; className?: string; style?: React.CSSProperties }) {
  return (
    <span className={`material-symbols-outlined ${className}`.trim()} style={style} aria-hidden="true">{name}</span>
  );
}

function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  return (
    <div
      className={`transition-all duration-700 ease-out ${className} ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted ? resolvedTheme === 'dark' : true;

  const goToSignin = () => {
    router.push('/signin');
    setTimeout(() => {
      if (window.location.pathname !== '/signin') window.location.assign('/signin');
    }, 500);
  };

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
    <div className="relative min-h-screen overflow-x-hidden bg-fe-surface-base text-fe-on-surface">
      {/* === Animated Background === */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Aurora blobs */}
        <div className="absolute top-[-10%] left-[-5%] h-[500px] w-[500px] rounded-full opacity-30 blur-[120px] animate-pulse"
          style={{ background: isDark ? '#0066ff' : '#0066ff', animationDuration: '8s' }} />
        <div className="absolute top-[20%] right-[-10%] h-[400px] w-[400px] rounded-full opacity-20 blur-[100px] animate-pulse"
          style={{ background: isDark ? '#8b5cf6' : '#7c3aed', animationDuration: '10s', animationDelay: '1s' }} />
        <div className="absolute bottom-[10%] left-[30%] h-[450px] w-[450px] rounded-full opacity-15 blur-[110px] animate-pulse"
          style={{ background: isDark ? '#06b6d4' : '#0891b2', animationDuration: '12s', animationDelay: '2s' }} />
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(${isDark ? '#fff' : '#000'} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? '#fff' : '#000'} 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
          }} />
        {/* Radial gradient vignette */}
        <div className="absolute inset-0"
          style={{
            background: isDark
              ? 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0,102,255,0.12), transparent 70%)'
              : 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0,102,255,0.08), transparent 70%)',
          }} />
      </div>

      {/* === Navigation === */}
      <nav className="fixed top-0 z-50 w-full backdrop-blur-2xl border-b"
        style={{
          background: isDark ? 'rgba(5,7,10,0.7)' : 'rgba(255,255,255,0.8)',
          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
        }}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 text-[24px] font-bold tracking-tight">
            FormEngine <span className="text-fe-primary-container">Pro</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-[14px] font-medium text-fe-on-surface-variant hover:text-fe-primary transition-colors">Features</a>
            <a href="#how" className="text-[14px] font-medium text-fe-on-surface-variant hover:text-fe-primary transition-colors">How It Works</a>
            <a href="#pricing" className="text-[14px] font-medium text-fe-on-surface-variant hover:text-fe-primary transition-colors">Pricing</a>
            <a href="#api" className="text-[14px] font-medium text-fe-on-surface-variant hover:text-fe-primary transition-colors">API</a>
            <Link href="/docs/api" className="text-[14px] font-medium text-fe-on-surface-variant hover:text-fe-primary transition-colors">Docs</Link>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggleButton variant="nav" />
            <button onClick={goToSignin} className="hidden sm:block text-[14px] font-medium text-fe-on-surface-variant hover:text-fe-on-surface transition-colors">
              Sign In
            </button>
            <button onClick={() => router.push('/signup')}
              className="rounded-lg px-5 py-2 text-[14px] font-bold transition-all hover:scale-105 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #0066ff, #0044cc)',
                color: '#fff',
                boxShadow: '0 4px 20px rgba(0,102,255,0.4)',
              }}>
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* === Hero === */}
      <section className="relative z-10 flex min-h-screen items-center justify-center px-6 pt-32 pb-20">
        <div className="mx-auto max-w-5xl text-center">
          <Reveal>
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[12px] font-medium"
              style={{
                borderColor: isDark ? 'rgba(0,102,255,0.3)' : 'rgba(0,102,255,0.2)',
                background: isDark ? 'rgba(0,102,255,0.1)' : 'rgba(0,102,255,0.05)',
                color: '#0066ff',
              }}>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              The world&apos;s most advanced form builder engine
            </div>
          </Reveal>

          <Reveal delay={100}>
            <h1 className="text-[44px] font-bold leading-tight tracking-tight sm:text-[64px] md:text-[80px] md:leading-[1.05]">
              Build forms that
              <br />
              <span className="bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(135deg, #0066ff, #8b5cf6, #06b6d4)' }}>
                think dynamically
              </span>
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-relaxed text-fe-on-surface-variant sm:text-[20px]">
              Design forms with a visual flowchart editor. Validate responses with
              dynamic rules driven by config — not code. Deploy with a shareable link.
              Integrate via REST API. All in one platform.
            </p>
          </Reveal>

          <Reveal delay={300}>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button onClick={() => router.push('/signup')}
                className="flex items-center gap-2 rounded-xl px-8 py-4 text-[16px] font-bold transition-all hover:scale-105 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #0066ff, #0044cc)',
                  color: '#fff',
                  boxShadow: '0 8px 30px rgba(0,102,255,0.4)',
                }}>
                Start Building Free
                <MaterialIcon name="arrow_forward" className="text-[20px]" />
              </button>
              <button onClick={() => router.push('/templates')}
                className="flex items-center gap-2 rounded-xl border px-8 py-4 text-[16px] font-bold transition-all hover:scale-105 active:scale-95"
                style={{
                  borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
                  background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.6)',
                }}>
                <MaterialIcon name="auto_awesome" className="text-[20px] text-fe-primary-container" />
                Browse Templates
              </button>
            </div>
          </Reveal>

          <Reveal delay={400}>
            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-[13px] text-fe-on-surface-variant">
              <div className="flex items-center gap-2">
                <MaterialIcon name="check_circle" className="text-[18px] text-emerald-400" />
                No code required
              </div>
              <div className="flex items-center gap-2">
                <MaterialIcon name="check_circle" className="text-[18px] text-emerald-400" />
                13 field types
              </div>
              <div className="flex items-center gap-2">
                <MaterialIcon name="check_circle" className="text-[18px] text-emerald-400" />
                Dynamic validation
              </div>
              <div className="flex items-center gap-2">
                <MaterialIcon name="check_circle" className="text-[18px] text-emerald-400" />
                REST API included
              </div>
              <div className="flex items-center gap-2">
                <MaterialIcon name="check_circle" className="text-[18px] text-emerald-400" />
                PostgreSQL backed
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* === Stats Bar === */}
      <section className="relative z-10 border-y backdrop-blur-xl"
        style={{
          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
          background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.5)',
        }}>
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-6 py-10 md:grid-cols-4">
          {[
            { value: '13', label: 'Field Types', icon: 'input' },
            { value: '22', label: 'Tour Steps', icon: 'tour' },
            { value: '6', label: 'Starter Templates', icon: 'auto_awesome' },
            { value: '100%', label: 'Dynamic Validation', icon: 'verified' },
          ].map((stat, i) => (
            <Reveal key={stat.label} delay={i * 80}>
              <div className="flex flex-col items-center text-center">
                <MaterialIcon name={stat.icon} className="mb-2 text-[28px] text-fe-primary-container" />
                <div className="text-[36px] font-bold tracking-tight text-fe-on-surface">{stat.value}</div>
                <div className="text-[12px] uppercase tracking-wider text-fe-on-surface-variant">{stat.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* === Features === */}
      <section id="features" className="relative z-10 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="mb-16 text-center">
              <div className="mb-3 text-[12px] font-bold uppercase tracking-[0.2em] text-fe-primary-container">Capabilities</div>
              <h2 className="text-[36px] font-bold tracking-tight sm:text-[48px]">Everything you need to build</h2>
              <p className="mx-auto mt-4 max-w-2xl text-[16px] text-fe-on-surface-variant">
                From visual form design to API integration, FormEngine Pro covers the entire lifecycle.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: 'schema', title: 'Visual Flowchart Builder', desc: 'Design forms with a drag-and-drop node editor. Connect fields, add conditions, and define validation rules visually — no code needed.', gradient: 'from-blue-500 to-cyan-500' },
              { icon: 'verified', title: 'Dynamic Validation Engine', desc: 'Validation rules are stored in the form config and evaluated at runtime using Zod. Change rules without redeploying. Client + server validation in one engine.', gradient: 'from-violet-500 to-purple-500' },
              { icon: 'alt_route', title: 'Conditional Logic', desc: 'Branch your form flow based on field values. Show or hide fields dynamically. True/false condition paths with green and red handles.', gradient: 'from-amber-500 to-orange-500' },
              { icon: 'api', title: 'REST API v1', desc: 'Full programmatic access with API key authentication. Create forms, submit responses, and retrieve submissions via clean REST endpoints.', gradient: 'from-emerald-500 to-teal-500' },
              { icon: 'vpn_key', title: 'Rotatable API Keys', desc: 'SHA-256 hashed at rest. Scoped permissions (forms:read, forms:write, submissions:read, submissions:write). Rotate or revoke instantly.', gradient: 'from-rose-500 to-pink-500' },
              { icon: 'share', title: 'Shareable Links', desc: 'Publish a form and get a shareable URL instantly. Send it to anyone. Responses appear in your submissions dashboard in real time.', gradient: 'from-indigo-500 to-blue-500' },
              { icon: 'auto_awesome', title: '6 Starter Templates', desc: 'KYC verification, customer feedback, event registration, support tickets, job applications, and contact forms. All fully customizable.', gradient: 'from-cyan-500 to-sky-500' },
              { icon: 'dashboard', title: 'Real-time Dashboard', desc: 'Live form counts, submission stats, and form library. Every metric is pulled from the database in real time — no mock data.', gradient: 'from-purple-500 to-violet-500' },
              { icon: 'tour', title: 'Guided Walkthrough', desc: '22-step interactive tour spanning all 6 app sections. Spotlight highlights, progress tracking, and auto-navigation between pages.', gradient: 'from-teal-500 to-emerald-500' },
            ].map((feature, i) => (
              <Reveal key={feature.title} delay={i * 60}>
                <div className="group relative h-full overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
                    background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.6)',
                  }}>
                  <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient}`}
                    style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
                    <MaterialIcon name={feature.icon} className="text-[28px] text-white" />
                  </div>
                  <h3 className="mb-2 text-[20px] font-bold tracking-tight">{feature.title}</h3>
                  <p className="text-[14px] leading-relaxed text-fe-on-surface-variant">{feature.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* === How It Works === */}
      <section id="how" className="relative z-10 px-6 py-24"
        style={{ background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="mb-16 text-center">
              <div className="mb-3 text-[12px] font-bold uppercase tracking-[0.2em] text-fe-primary-container">Workflow</div>
              <h2 className="text-[36px] font-bold tracking-tight sm:text-[48px]">From idea to deployment in 4 steps</h2>
            </div>
          </Reveal>

          <div className="grid gap-8 md:grid-cols-4">
            {[
              { step: '01', icon: 'add_circle', title: 'Design', desc: 'Open the visual builder and drag nodes onto the canvas. Add fields, connect them, and set conditions.' },
              { step: '02', icon: 'rule', title: 'Validate', desc: 'Configure validation rules per field — required, min/max length, regex patterns, date ranges, enum values.' },
              { step: '03', icon: 'rocket_launch', title: 'Publish', desc: 'Click Deploy Schema. Get a shareable link instantly. The JSON schema is generated and stored automatically.' },
              { step: '04', icon: 'analytics', title: 'Collect', desc: 'Share the link. Watch submissions arrive in real time on your dashboard. Export or query via the REST API.' },
            ].map((item, i) => (
              <Reveal key={item.step} delay={i * 100}>
                <div className="relative">
                  {i < 3 && (
                    <div className="absolute top-12 left-[60%] hidden h-px w-full md:block"
                      style={{ background: `linear-gradient(90deg, ${isDark ? 'rgba(0,102,255,0.4)' : 'rgba(0,102,255,0.2)'}, transparent)` }} />
                  )}
                  <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-xl text-[18px] font-bold text-white mb-5"
                    style={{ background: 'linear-gradient(135deg, #0066ff, #0044cc)', boxShadow: '0 4px 20px rgba(0,102,255,0.3)' }}>
                    {item.step}
                  </div>
                  <MaterialIcon name={item.icon} className="mb-3 text-[28px] text-fe-primary-container" />
                  <h3 className="mb-2 text-[20px] font-bold">{item.title}</h3>
                  <p className="text-[14px] leading-relaxed text-fe-on-surface-variant">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* === Code Preview === */}
      <section id="api" className="relative z-10 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <Reveal>
              <div>
                <div className="mb-3 text-[12px] font-bold uppercase tracking-[0.2em] text-fe-primary-container">Developer API</div>
                <h2 className="text-[36px] font-bold tracking-tight sm:text-[44px]">Integrate with anything</h2>
                <p className="mt-4 text-[16px] leading-relaxed text-fe-on-surface-variant">
                  Every feature is accessible via a clean REST API. Create forms
                  programmatically, submit responses from your backend, and retrieve
                  submissions with pagination. API keys are scoped and rotatable.
                </p>
                <div className="mt-6 space-y-3">
                  {[
                    'Scoped permissions: forms:read, forms:write, submissions:read, submissions:write',
                    'SHA-256 hashed keys — full key shown once at creation',
                    'Rotate keys instantly without downtime',
                    'Full interactive docs at /docs/api',
                  ].map((point) => (
                    <div key={point} className="flex items-start gap-3">
                      <MaterialIcon name="check_circle" className="mt-0.5 text-[18px] text-emerald-400" />
                      <span className="text-[14px] text-fe-on-surface-variant">{point}</span>
                    </div>
                  ))}
                </div>
                <Link href="/docs/api" className="mt-8 inline-flex items-center gap-2 rounded-lg border px-6 py-3 text-[14px] font-bold transition-all hover:scale-105"
                  style={{ borderColor: isDark ? 'rgba(0,102,255,0.3)' : 'rgba(0,102,255,0.2)', background: 'rgba(0,102,255,0.05)', color: '#0066ff' }}>
                  <MaterialIcon name="code" className="text-[18px]" />
                  View API Documentation
                </Link>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="overflow-hidden rounded-2xl border"
                style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
                <div className="flex items-center gap-2 border-b px-4 py-3"
                  style={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                  <span className="h-3 w-3 rounded-full bg-red-400/60" />
                  <span className="h-3 w-3 rounded-full bg-amber-300/60" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400/70" />
                  <span className="ml-3 text-[12px] font-mono text-fe-on-surface-variant">terminal</span>
                </div>
                <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-relaxed"
                  style={{ background: isDark ? '#0a0d14' : '#f8f9fa' }}>
                  <code><span className="text-emerald-400">curl</span> <span className="text-amber-300">-X POST</span> \
{'  '}https://your-app.com/api/v1/forms \
{'  '}<span className="text-amber-300">-H</span> <span className="text-rose-300">&quot;Authorization: Bearer fep_live_...&quot;</span> \
{'  '}<span className="text-amber-300">-H</span> <span className="text-rose-300">&quot;Content-Type: application/json&quot;</span> \
{'  '}<span className="text-amber-300">-d</span> <span className="text-rose-300">&apos;{`{&quot;name&quot;:&quot;Survey&quot;,&quot;flowchart&quot;:{...}}`}&apos;</span>

<span className="text-fe-on-surface-variant"># Response (201 Created)</span>
{`{`}
{'  '}<span className="text-cyan-400">&quot;id&quot;</span>: <span className="text-rose-300">&quot;clk...&quot;</span>,
{'  '}<span className="text-cyan-400">&quot;shareId&quot;</span>: <span className="text-rose-300">&quot;cmqv...&quot;</span>,
{'  '}<span className="text-cyan-400">&quot;name&quot;</span>: <span className="text-rose-300">&quot;Survey&quot;</span>,
{'  '}<span className="text-cyan-400">&quot;status&quot;</span>: <span className="text-rose-300">&quot;published&quot;</span>
{`}`}</code>
                </pre>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* === Pricing === */}
      <section id="pricing" className="relative z-10 px-6 py-24"
        style={{ background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="mb-16 text-center">
              <div className="mb-3 text-[12px] font-bold uppercase tracking-[0.2em] text-fe-primary-container">Pricing</div>
              <h2 className="text-[36px] font-bold tracking-tight sm:text-[48px]">Simple, transparent pricing</h2>
              <p className="mx-auto mt-4 max-w-2xl text-[16px] text-fe-on-surface-variant">
                Start free. Upgrade when you need more. No hidden fees.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              { name: 'Starter', price: '$0', period: '/mo', desc: 'For getting started', features: ['Unlimited forms', 'Unlimited submissions', 'Visual builder', 'REST API access', '1 API key', 'Community support'], cta: 'Start Free', highlight: false },
              { name: 'Engine', price: '$29', period: '/mo', desc: 'For growing teams', features: ['Everything in Starter', 'Unlimited API keys', 'Key rotation', 'Priority support', 'Custom domains', 'Webhook integrations'], cta: 'Get Started', highlight: true },
              { name: 'Enterprise', price: 'Custom', period: '', desc: 'For large organizations', features: ['Everything in Engine', 'SSO / SAML', 'Dedicated infrastructure', 'Custom SLAs', 'Audit logs', 'Dedicated architect'], cta: 'Talk to Sales', highlight: false },
            ].map((plan, i) => (
              <Reveal key={plan.name} delay={i * 80}>
                <div className="relative h-full overflow-hidden rounded-2xl border p-8 transition-all hover:scale-[1.02]"
                  style={{
                    borderColor: plan.highlight ? 'rgba(0,102,255,0.4)' : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'),
                    background: plan.highlight ? (isDark ? 'rgba(0,102,255,0.08)' : 'rgba(0,102,255,0.03)') : (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.6)'),
                  }}>
                  {plan.highlight && (
                    <div className="absolute top-0 right-0 rounded-bl-xl px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white"
                      style={{ background: 'linear-gradient(135deg, #0066ff, #0044cc)' }}>
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-[22px] font-bold">{plan.name}</h3>
                  <p className="mt-1 text-[13px] text-fe-on-surface-variant">{plan.desc}</p>
                  <div className="mt-6 flex items-end gap-1">
                    <span className="text-[44px] font-bold tracking-tight">{plan.price}</span>
                    <span className="mb-2 text-[14px] text-fe-on-surface-variant">{plan.period}</span>
                  </div>
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-[14px]">
                        <MaterialIcon name="check_circle" className="mt-0.5 text-[16px] text-emerald-400" />
                        <span className="text-fe-on-surface-variant">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => router.push('/signup')}
                    className="mt-8 w-full rounded-lg py-3 text-[14px] font-bold transition-all hover:scale-[1.02]"
                    style={plan.highlight
                      ? { background: 'linear-gradient(135deg, #0066ff, #0044cc)', color: '#fff', boxShadow: '0 4px 20px rgba(0,102,255,0.3)' }
                      : { border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'}` }}>
                    {plan.cta}
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* === Final CTA === */}
      <section className="relative z-10 px-6 py-24">
        <Reveal>
          <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl p-12 text-center relative"
            style={{
              background: isDark
                ? 'linear-gradient(135deg, rgba(0,102,255,0.15), rgba(139,92,246,0.1), rgba(6,182,212,0.08))'
                : 'linear-gradient(135deg, rgba(0,102,255,0.08), rgba(139,92,246,0.05), rgba(6,182,212,0.04))',
              border: `1px solid ${isDark ? 'rgba(0,102,255,0.2)' : 'rgba(0,102,255,0.12)'}`,
            }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[200px] w-[600px] rounded-full opacity-20 blur-[80px]"
              style={{ background: '#0066ff' }} />
            <h2 className="relative text-[36px] font-bold tracking-tight sm:text-[48px]">
              Ready to build something amazing?
            </h2>
            <p className="relative mx-auto mt-4 max-w-2xl text-[16px] text-fe-on-surface-variant">
              Join the next generation of form builders. Design dynamic forms with a
              visual editor, validate with config-driven rules, and deploy in seconds.
            </p>
            <div className="relative mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button onClick={() => router.push('/signup')}
                className="flex items-center gap-2 rounded-xl px-8 py-4 text-[16px] font-bold transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #0066ff, #0044cc)', color: '#fff', boxShadow: '0 8px 30px rgba(0,102,255,0.4)' }}>
                Create Your Account
                <MaterialIcon name="arrow_forward" className="text-[20px]" />
              </button>
              <button onClick={() => router.push('/signin')}
                className="rounded-xl border px-8 py-4 text-[16px] font-bold transition-all hover:scale-105"
                style={{ borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)' }}>
                Sign In
              </button>
            </div>
          </div>
        </Reveal>
      </section>

      {/* === Footer === */}
      <footer className="relative z-10 border-t px-6 py-12"
        style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="text-[20px] font-bold tracking-tight">
                FormEngine <span className="text-fe-primary-container">Pro</span>
              </div>
              <p className="mt-2 text-[12px] text-fe-on-surface-variant">
                The world&apos;s most advanced dynamic form builder engine.
              </p>
            </div>
            <div>
              <h4 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-fe-on-surface-variant">Product</h4>
              <ul className="space-y-2 text-[13px]">
                <li><a href="#features" className="text-fe-on-surface-variant hover:text-fe-primary transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-fe-on-surface-variant hover:text-fe-primary transition-colors">Pricing</a></li>
                <li><Link href="/templates" className="text-fe-on-surface-variant hover:text-fe-primary transition-colors">Templates</Link></li>
                <li><Link href="/docs/api" className="text-fe-on-surface-variant hover:text-fe-primary transition-colors">API Docs</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-fe-on-surface-variant">Company</h4>
              <ul className="space-y-2 text-[13px]">
                <li><a href="#" className="text-fe-on-surface-variant hover:text-fe-primary transition-colors">About</a></li>
                <li><a href="#" className="text-fe-on-surface-variant hover:text-fe-primary transition-colors">Blog</a></li>
                <li><a href="#" className="text-fe-on-surface-variant hover:text-fe-primary transition-colors">Careers</a></li>
                <li><a href="#" className="text-fe-on-surface-variant hover:text-fe-primary transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-fe-on-surface-variant">Legal</h4>
              <ul className="space-y-2 text-[13px]">
                <li><a href="#" className="text-fe-on-surface-variant hover:text-fe-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-fe-on-surface-variant hover:text-fe-primary transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-fe-on-surface-variant hover:text-fe-primary transition-colors">Security</a></li>
                <li><a href="#" className="text-fe-on-surface-variant hover:text-fe-primary transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row"
            style={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
            <p className="text-[12px] text-fe-on-surface-variant">© 2026 FormEngine Pro. Built with precision.</p>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              <span className="text-[12px] font-medium text-fe-on-surface-variant">All systems operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
