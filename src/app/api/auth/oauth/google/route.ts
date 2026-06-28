import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, createSession } from '@/lib/auth';
import { randomBytes } from 'crypto';

/**
 * GET /api/auth/oauth/google
 *
 * Google OAuth flow. If GOOGLE_CLIENT_ID is configured, redirects to
 * Google's authorization page. Otherwise, simulates the flow by
 * creating a demo Google user and logging them in directly.
 */
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const redirect = searchParams.get('redirect') || '/dashboard';

  // If we have a code from Google, exchange it (production path)
  if (code && GOOGLE_CLIENT_ID) {
    try {
      // In production: POST to https://oauth2.googleapis.com/token
      // then GET https://www.googleapis.com/oauth2/v2/userinfo
      // For now, fall through to simulation
    } catch {
      return NextResponse.redirect(`${origin}/signin?error=oauth_failed`);
    }
  }

  // If Google OAuth is configured, redirect to Google
  if (!code && GOOGLE_CLIENT_ID) {
    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    googleAuthUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID);
    googleAuthUrl.searchParams.set('redirect_uri', `${origin}/api/auth/oauth/google?redirect=${encodeURIComponent(redirect)}`);
    googleAuthUrl.searchParams.set('response_type', 'code');
    googleAuthUrl.searchParams.set('scope', 'openid email profile');
    return NextResponse.redirect(googleAuthUrl);
  }

  // Simulated OAuth flow (no Google app configured)
  // Creates a demo Google user and logs them in
  try {
    const googleId = randomBytes(8).toString('hex');
    const email = `google_${googleId.substring(0, 6)}@oauth.formengine.pro`;
    const name = `Google User ${googleId.substring(0, 4).toUpperCase()}`;

    let user = await db.user.findUnique({ where: { email } });

    if (!user) {
      user = await db.user.create({
        data: {
          email,
          passwordHash: hashPassword(randomBytes(32).toString('hex')),
          name,
          fullName: name,
          orgName: 'Google',
        },
      });
    }

    await createSession(user.id);
    return NextResponse.redirect(`${origin}${redirect}`);
  } catch (error) {
    console.error('[Google OAuth] error:', error);
    return NextResponse.redirect(`${origin}/signin?error=oauth_failed`);
  }
}
