'use client';

import { useState, Suspense, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

/**
 * SignInForm
 *
 * Client component for email/password login using the real database-backed
 * auth system (POST /api/auth/login). No Supabase dependency.
 */
export function SignInForm() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-8 text-[13px] text-fe-on-surface-variant">Loading…</div>}>
      <SignInFormInner />
    </Suspense>
  );
}

function SignInFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      setSuccess(true);
      navigateToDashboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <a
          href="/api/auth/oauth/github"
          className="group flex items-center justify-center gap-2.5 rounded-xl border border-fe-border-white-faint bg-fe-input-hollow-bg py-2.5 transition-all duration-200 hover:bg-fe-surface-container-highest no-underline"
        >
          <GitHubIcon className="h-[19px] w-[19px] text-fe-on-surface" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-fe-on-surface">
            GitHub
          </span>
        </a>
        <a
          href="/api/auth/oauth/google"
          className="group flex items-center justify-center gap-2.5 rounded-xl border border-fe-border-white-faint bg-fe-input-hollow-bg py-2.5 transition-all duration-200 hover:bg-fe-surface-container-highest no-underline"
        >
          <GoogleIcon className="h-[19px] w-[19px]" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-fe-on-surface">
            Google
          </span>
        </a>
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
            required
            className="w-full rounded-lg border border-fe-border-white-faint bg-fe-input-hollow-bg px-4 py-2.5 text-[13px] text-fe-on-surface placeholder:text-fe-on-surface-variant/40 transition-all duration-300 outline-none focus:border-fe-primary-container focus:shadow-[0_0_15px_rgba(0,102,255,0.2)]"
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
              required
              className="w-full bg-transparent px-4 py-2.5 text-[13px] text-fe-on-surface placeholder:text-fe-on-surface-variant/40 outline-none"
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

        {success && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5 text-[12px] leading-[18px] text-emerald-300"
          >
            <AuthIcon name="check_circle" className="mt-0.5 text-[16px] text-emerald-400" />
            <span>Login successful! Redirecting…</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-fe-primary-container px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-fe-on-primary-container transition-all active:scale-[0.99] hover:opacity-95 disabled:opacity-60 disabled:cursor-wait"
        >
          {loading ? (
            <>
              <AuthIcon name="progress_activity" className="text-[17px] animate-spin" />
              SIGNING IN…
            </>
          ) : (
            <>
              SIGN IN
              <AuthIcon name="login" className="text-[17px]" />
            </>
          )}
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
      <label className="ml-1 block text-[10px] font-semibold uppercase tracking-[0.24em] text-fe-on-surface-variant">
        {label}
      </label>
      {children}
    </div>
  );
}

// Re-export the OAuth icons for the disabled buttons
import { GitHubIcon, GoogleIcon } from '@/components/oauth-icons';
