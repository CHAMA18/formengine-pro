import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, createSession } from '@/lib/auth';
import { getPublicOrigin } from '@/lib/url';
import { randomBytes } from 'crypto';

/**
 * GET /api/auth/guest
 *
 * Signs the user in as a guest — no email, no password, no friction.
 *
 * Design:
 *   - Uses a single, stable guest identity (`guest@formengine.pro`) so
 *     repeat visits reuse the same User row instead of spawning a new
 *     account every click. This keeps the demo experience consistent
 *     (the guest sees the forms they created on previous visits) and
 *     avoids polluting the user table.
 *   - The guest user has a random password hash that is never disclosed,
 *     so the email/password login path cannot accidentally authenticate
 *     a guest without setting a real password first.
 *   - After creating the session, redirects to the `redirect` query
 *     param (defaults to /dashboard).
 *
 * Why getPublicOrigin():
 *   On Render (and similar PaaS), the Node server binds to an internal
 *   address like `0.0.0.0:10000`. `new URL(request.url).origin` returns
 *   that internal address, which the browser cannot reach — so the
 *   redirect would land on a broken `https://0.0.0.0:10000/dashboard`
 *   URL. getPublicOrigin() reads the `x-forwarded-host` and
 *   `x-forwarded-proto` headers set by the reverse proxy to reconstruct
 *   the actual public URL the browser used.
 *
 * Usage:
 *   <a href="/api/auth/guest">Sign In As A Guest</a>
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const redirect = searchParams.get('redirect') || '/dashboard';
  const origin = getPublicOrigin(request);

  try {
    const guestEmail = 'guest@formengine.pro';
    const guestName = 'Guest User';

    // Upsert the shared guest account. Idempotent: if it already exists,
    // just reuse it; otherwise create it with a random password hash.
    const user = await db.user.upsert({
      where: { email: guestEmail },
      update: {
        // Refresh the display name in case it was changed elsewhere.
        name: guestName,
        fullName: guestName,
        orgName: 'Guest',
      },
      create: {
        email: guestEmail,
        passwordHash: hashPassword(randomBytes(32).toString('hex')),
        name: guestName,
        fullName: guestName,
        orgName: 'Guest',
      },
    });

    await createSession(user.id);
    return NextResponse.redirect(`${origin}${redirect}`);
  } catch (error) {
    console.error('[Guest Auth] error:', error);
    return NextResponse.redirect(`${origin}/signin?error=guest_failed`);
  }
}
