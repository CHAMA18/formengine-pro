'use client';

import { useState, useMemo, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { isProviderEnabled } from '@/lib/supabase/providers';
import { GitHubIcon, GoogleIcon } from '@/components/oauth-icons';

/**
 * SignUpForm
 *
 * Client component that owns the signup form state and wires it to
 * Supabase Auth via supabase.auth.signUp(). Also exposes OAuth sign-up
 * (GitHub + Google) which is the same call as sign-in.
 *
 * Behavior:
 *   - If email confirmation is enabled on the Supabase project (default),
 *     signUp() returns a user without a session. We show a "check your email"
 *     success state and tell them to click the verification link.
 *   - If email confirmation is disabled, signUp() returns a session and we
 *     redirect to /dashboard immediately.
 *   - If the email is already registered, Supabase returns a 422 - we show
 *     a friendly "already exists" message with a link to /signin.
 */
export function SignUpForm() {
  const router = useRouter();
  // createClient() can throw if env vars are missing/malformed. Construct
  // lazily so a bad config never crashes the render.
  const supabase = useMemo(() => {
    try {
      return createClient();
    } catch {
      return null;
    }
  }, []);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [orgName, setOrgName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [needsEmailConfirm, setNeedsEmailConfirm] = useState(false);

  const navigateToDashboard = () => {
    router.push('/dashboard');
    const fallback = window.setTimeout(() => {
      if (window.location.pathname !== '/dashboard') {
        window.location.assign('/dashboard');
      }
    }, 800);
    window.addEventListener(
      'beforeunload',
      () => window.clearTimeout(fallback),
      { once: true }
    );
  };

  const handleOAuth = async (provider: 'github' | 'google') => {
    if (oauthLoading) return;
    setError(null);
    setOauthLoading(provider);

    if (!supabase) {
      setError(
        'Supabase is not configured. Sign-up is unavailable — add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.'
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
          `${providerName} sign-up is not configured for this project yet. Please ask the project administrator to enable ${providerName} OAuth in the Supabase dashboard (see docs/OAUTH_SETUP.md), or use email/password sign-up instead.`
        );
      }

      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
            '/dashboard'
          )}`,
        },
      });

      if (oauthError) throw oauthError;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : `${provider} sign-up failed. Please try again.`;
      let friendly = message;
      if (
        message.includes('Unsupported provider') ||
        message.includes('provider is not enabled')
      ) {
        const providerName = provider === 'github' ? 'GitHub' : 'Google';
        friendly = `${providerName} sign-up is not configured for this project yet. Please ask the project administrator to enable ${providerName} OAuth in the Supabase dashboard, or use email/password sign-up instead.`;
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

  const handleEmailSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setError(null);
    setNeedsEmailConfirm(false);
    setLoading(true);

    try {
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters.');
      }

      if (!supabase) {
        throw new Error(
          'Supabase is not configured. Sign-up is unavailable — add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.'
        );
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            organization_name: orgName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
            '/dashboard'
          )}`,
        },
      });

      if (signUpError) throw signUpError;

      // If a session is returned, email confirmation is disabled - log them
      // in immediately and redirect to the dashboard.
      if (data.session) {
        navigateToDashboard();
        return;
      }

      // No session but no error - email confirmation is required.
      setNeedsEmailConfirm(true);
      setLoading(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Sign-up failed. Please try again.';
      // Supabase returns distinct messages for the most common failures.
      // Translate them into friendly, actionable copy.
      let friendly = message;
      if (message.includes('already been registered')) {
        friendly =
          'An account with this email already exists. Try signing in instead.';
      } else if (
        message.includes('rate limit') ||
        message.includes('For security purposes, you can only request')
      ) {
        friendly =
          'Too many sign-up attempts. For security, Supabase limits sign-ups to a few per hour. Please wait a few minutes and try again.';
      } else if (message.includes('Password should be at least')) {
        friendly = 'Password must be at least 6 characters.';
      }
      setError(friendly);
      setLoading(false);
    }
  };

  if (needsEmailConfirm) {
    return (
      <div className="rounded-2xl border border-fe-primary-container/30 bg-fe-primary-container/5 p-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-fe-primary-container/15 text-fe-primary">
          <AuthIcon name="mark_email_read" className="text-[24px]" />
        </div>
        <h2 className="text-[18px] font-semibold tracking-[-0.01em] text-fe-on-surface">
          Check your inbox
        </h2>
        <p className="mx-auto mt-2 max-w-md text-[13px] leading-[21px] text-fe-on-surface-variant">
          We sent a verification link to{' '}
          <span className="font-semibold text-fe-on-surface">{email}</span>.
          Click the link in the email to activate your account, then sign in.
        </p>
        <button
          type="button"
          onClick={() => router.push('/signin')}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-fe-primary-container px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-fe-on-primary-container transition-all hover:opacity-95"
        >
          Continue to sign in
          <AuthIcon name="arrow_forward" className="text-[16px]" />
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => handleOAuth('github')}
          disabled={loading || oauthLoading !== null}
          className="group flex items-center justify-center gap-2.5 rounded-xl border border-fe-border-white-faint bg-fe-input-hollow-bg py-2.5 transition-all duration-200 hover:bg-fe-surface-container-highest disabled:cursor-wait disabled:opacity-60 md:py-2.75"
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
          className="group flex items-center justify-center gap-2.5 rounded-xl border border-fe-border-white-faint bg-fe-input-hollow-bg py-2.5 transition-all duration-200 hover:bg-fe-surface-container-highest disabled:cursor-wait disabled:opacity-60 md:py-2.75"
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

      <div className="my-5 flex items-center gap-3 md:my-6">
        <div className="h-px flex-1 bg-fe-border-white-faint" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-fe-outline">
          Or continue with mail
        </span>
        <div className="h-px flex-1 bg-fe-border-white-faint" />
      </div>

      <form
        className="grid gap-3 md:grid-cols-2 md:gap-x-4 md:gap-y-3"
        onSubmit={handleEmailSignUp}
      >
        <FieldShell label="Full Name">
          <input
            type="text"
            required
            autoComplete="name"
            placeholder="Johnathan Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-lg border border-fe-border-white-faint bg-fe-input-hollow-bg px-4 py-2.5 text-[13px] text-fe-on-surface placeholder:text-fe-outline/40 transition-all duration-300 outline-none focus:border-fe-primary-container focus:shadow-[0_0_15px_rgba(0,102,255,0.2)] md:py-2.75"
          />
        </FieldShell>

        <FieldShell label="Work Email">
          <input
            type="email"
            required
            autoComplete="email"
            placeholder="dev@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-fe-border-white-faint bg-fe-input-hollow-bg px-4 py-2.5 text-[13px] text-fe-on-surface placeholder:text-fe-outline/40 transition-all duration-300 outline-none focus:border-fe-primary-container focus:shadow-[0_0_15px_rgba(0,102,255,0.2)] md:py-2.75"
          />
        </FieldShell>

        <FieldShell label="Organization Name">
          <input
            type="text"
            autoComplete="organization"
            placeholder="Acme Dev Corp"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            className="w-full rounded-lg border border-fe-border-white-faint bg-fe-input-hollow-bg px-4 py-2.5 text-[13px] text-fe-on-surface placeholder:text-fe-outline/40 transition-all duration-300 outline-none focus:border-fe-primary-container focus:shadow-[0_0_15px_rgba(0,102,255,0.2)] md:py-2.75"
          />
        </FieldShell>

        <FieldShell label="Secure Password">
          <div className="flex items-center overflow-hidden rounded-lg border border-fe-border-white-faint bg-fe-input-hollow-bg transition-all duration-300 focus-within:border-fe-primary-container focus-within:shadow-[0_0_15px_rgba(0,102,255,0.2)]">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              minLength={6}
              autoComplete="new-password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent px-4 py-2.5 text-[13px] text-fe-on-surface placeholder:text-fe-outline/40 outline-none md:py-2.75"
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

        {error && (
          <div
            role="alert"
            className="md:col-span-2 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-[12px] leading-[18px] text-red-300"
          >
            <AuthIcon name="error" className="mt-0.5 text-[16px] text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-fe-primary-container px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-fe-on-primary-container transition-all active:scale-[0.99] hover:opacity-95 disabled:cursor-wait disabled:opacity-70 md:col-span-2 md:mt-5"
        >
          {loading ? 'CREATING ACCOUNT…' : 'CREATE ACCOUNT'}
          <AuthIcon
            name={loading ? 'progress_activity' : 'rocket_launch'}
            className={`text-[17px] ${loading ? 'animate-pulse' : ''}`}
          />
        </button>
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
      <label className="ml-1 block text-[11px] font-semibold uppercase tracking-[0.18em] text-fe-on-surface-variant">
        {label}
      </label>
      {children}
    </div>
  );
}
