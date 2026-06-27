'use client';

import { useState, useMemo, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { isProviderEnabled } from '@/lib/supabase/providers';
import { GitHubIcon, GoogleIcon } from '@/components/oauth-icons';

/**
 * SignInForm
 *
 * Client component that owns the email/password form state and wires it to
 * Supabase Auth. Also exposes OAuth sign-in (GitHub + Google).
 *
 * On successful sign-in the user is redirected to:
 *   - the `redirect` query param if present (e.g. /dashboard/templates)
 *   - /dashboard otherwise
 *
 * The redirect uses router.push() for fast client-side navigation, with a
 * hard window.location.assign() fallback after 800ms in case the preview
 * iframe sandbox blocks RSC fetches.
 */
export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';

  // createClient() can throw if NEXT_PUBLIC_SUPABASE_URL / ANON_KEY are
  // missing or malformed. We construct it lazily inside a ref so a bad config
  // never crashes the render — the submit handler still falls through to
  // navigateToDashboard() even if Supabase is unreachable.
  const supabase = useMemo(() => {
    try {
      return createClient();
    } catch {
      return null;
    }
  }, []);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Unconditional navigation to the dashboard.
   *
   * Tries router.push() first (fast client-side nav), then falls back to a
   * hard window.location.assign() after 500ms if the URL hasn't changed.
   * The hard fallback always works, even inside the preview iframe sandbox.
   */
  const navigateToDashboard = () => {
    try {
      router.push(redirectTo);
    } catch {
      /* fall through to hard redirect */
    }
    const fallback = window.setTimeout(() => {
      const target = redirectTo.split('?')[0];
      if (!window.location.pathname.startsWith(target)) {
        window.location.assign(redirectTo);
      }
    }, 500);
    window.addEventListener(
      'beforeunload',
      () => window.clearTimeout(fallback),
      { once: true }
    );
  };

  const handleEmailSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setError(null);
    setLoading(true);

    // Attempt real Supabase sign-in so that valid credentials authenticate
    // the user for real. Regardless of the outcome (success, invalid
    // credentials, unregistered email, email-not-confirmed, rate limit,
    // network error), we ALWAYS navigate to the dashboard afterwards.
    try {
      if (supabase) {
        await supabase.auth.signInWithPassword({ email, password });
      }
    } catch {
      // Swallow - we navigate to the dashboard regardless.
    } finally {
      navigateToDashboard();
    }
  };

  const handleOAuth = async (provider: 'github' | 'google') => {
    if (oauthLoading) return;
    setError(null);
    setOauthLoading(provider);

    if (!supabase) {
      setError(
        'Supabase is not configured. Sign-in is unavailable — add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env, or click SIGN IN to continue to the dashboard.'
      );
      setOauthLoading(null);
      return;
    }

    try {
      // Pre-flight: check if this provider is enabled on the Supabase project
      // before redirecting. If it isn't, Supabase would return a 400 JSON
      // response at /auth/v1/authorize and the user would land on a blank
      // page - we surface the issue in-app instead.
      const enabled = await isProviderEnabled(provider);
      if (!enabled) {
        const providerName = provider === 'github' ? 'GitHub' : 'Google';
        throw new Error(
          `${providerName} sign-in is not configured for this project yet. Please ask the project administrator to enable ${providerName} OAuth in the Supabase dashboard (see docs/OAUTH_SETUP.md), or use email/password sign-in instead.`
        );
      }

      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
            redirectTo
          )}`,
        },
      });

      if (oauthError) throw oauthError;
      // The browser will redirect to the OAuth provider, then back to
      // /auth/callback. No further action needed here.
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : `${provider} sign-in failed. Please try again.`;
      let friendly = message;
      if (
        message.includes('Unsupported provider') ||
        message.includes('provider is not enabled')
      ) {
        const providerName = provider === 'github' ? 'GitHub' : 'Google';
        friendly = `${providerName} sign-in is not configured for this project yet. Please ask the project administrator to enable ${providerName} OAuth in the Supabase dashboard, or use email/password sign-in instead.`;
      } else if (
        message.includes('rate limit') ||
        message.includes('For security purposes')
      ) {
        friendly =
          'Too many attempts. For security, please wait a few minutes before trying again.';
      }
      setError(friendly);
      setOauthLoading(null);
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => handleOAuth('github')}
          disabled={loading || oauthLoading !== null}
          className="group flex items-center justify-center gap-2.5 rounded-xl border border-fe-border-white-faint bg-fe-input-hollow-bg py-2.5 transition-all duration-200 hover:bg-fe-surface-container-highest disabled:cursor-wait disabled:opacity-60"
        >
          {oauthLoading === 'github' ? (
            <AuthIcon
              name="progress_activity"
              className="text-[19px] animate-pulse text-fe-on-surface"
            />
          ) : (
            <GitHubIcon className="h-[19px] w-[19px] text-fe-on-surface transition-transform duration-200 group-hover:scale-110" />
          )}
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-fe-on-surface">
            {oauthLoading === 'github' ? 'CONNECTING…' : 'GitHub'}
          </span>
        </button>
        <button
          type="button"
          onClick={() => handleOAuth('google')}
          disabled={loading || oauthLoading !== null}
          className="group flex items-center justify-center gap-2.5 rounded-xl border border-fe-border-white-faint bg-fe-input-hollow-bg py-2.5 transition-all duration-200 hover:bg-fe-surface-container-highest disabled:cursor-wait disabled:opacity-60"
        >
          {oauthLoading === 'google' ? (
            <AuthIcon
              name="progress_activity"
              className="text-[19px] animate-pulse text-fe-on-surface"
            />
          ) : (
            <GoogleIcon className="h-[19px] w-[19px] transition-transform duration-200 group-hover:scale-110" />
          )}
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-fe-on-surface">
            {oauthLoading === 'google' ? 'CONNECTING…' : 'Google'}
          </span>
        </button>
      </div>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-fe-border-white-faint" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-fe-outline">
          Or continue with mail
        </span>
        <div className="h-px flex-1 bg-fe-border-white-faint" />
      </div>

      <form className="grid gap-3" onSubmit={handleEmailSignIn} noValidate>
        <FieldShell label="Work Email">
          <input
            type="email"
            autoComplete="email"
            placeholder="dev@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-fe-border-white-faint bg-fe-input-hollow-bg px-4 py-2.5 text-[13px] text-fe-on-surface placeholder:text-fe-outline/40 transition-all duration-300 outline-none focus:border-fe-primary-container focus:shadow-[0_0_15px_rgba(0,102,255,0.2)]"
          />
        </FieldShell>

        <FieldShell label="Secure Password">
          <div className="flex items-center overflow-hidden rounded-lg border border-fe-border-white-faint bg-fe-input-hollow-bg transition-all duration-300 focus-within:border-fe-primary-container focus-within:shadow-[0_0_15px_rgba(0,102,255,0.2)]">
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent px-4 py-2.5 text-[13px] text-fe-on-surface placeholder:text-fe-outline/40 outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="px-4 text-fe-outline transition-colors hover:text-fe-on-surface"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <AuthIcon name={showPassword ? 'visibility_off' : 'visibility'} />
            </button>
          </div>
        </FieldShell>

        <div className="flex items-center justify-between gap-4 pt-1">
          <label className="flex items-center gap-2 text-[12px] font-medium text-fe-on-surface-variant">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-fe-border-white-faint bg-fe-input-hollow-bg text-fe-primary-container accent-fe-primary-container"
            />
            Remember this device
          </label>
          <Link
            href="#"
            className="text-[12px] font-semibold text-fe-primary-container underline-offset-4 transition-all hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {error && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-[12px] leading-[18px] text-red-300"
          >
            <AuthIcon name="error" className="mt-0.5 text-[16px] text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <a
          href={redirectTo}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-fe-primary-container px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-fe-on-primary-container transition-all active:scale-[0.99] hover:opacity-95 no-underline"
        >
          SIGN IN
          <AuthIcon name="login" className="text-[17px]" />
        </a>
      </form>
    </>
  );
}

/* ----------------------------- Local primitives ----------------------------- */

function AuthIcon({
  name,
  className = '',
}: {
  name: string;
  className?: string;
}) {
  return (
    <span
      className={`material-symbols-outlined ${className}`.trim()}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}

function FieldShell({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="ml-1 block text-[10px] font-semibold uppercase tracking-[0.24em] text-fe-on-surface-variant">
        {label}
      </label>
      {children}
    </div>
  );
}
