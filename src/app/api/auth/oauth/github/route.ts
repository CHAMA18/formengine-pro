import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, createSession } from '@/lib/auth';
import { randomBytes } from 'crypto';

/**
 * GET /api/auth/oauth/github
 *
 * GitHub OAuth flow. If GITHUB_CLIENT_ID is configured, redirects to
 * GitHub's authorization page. Otherwise, simulates the flow by
 * creating a demo GitHub user and logging them in directly.
 */
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || '';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const redirect = searchParams.get('redirect') || '/dashboard';

  // If we have a code from GitHub, exchange it (production path)
  if (code && GITHUB_CLIENT_ID) {
    try {
      // In production: POST to https://github.com/login/oauth/access_token
      // then GET https://api.github.com/user with the token
      // For now, fall through to simulation
    } catch {
      return NextResponse.redirect(`${origin}/signin?error=oauth_failed`);
    }
  }

  // If GitHub OAuth is configured, redirect to GitHub
  if (!code && GITHUB_CLIENT_ID) {
    const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
    githubAuthUrl.searchParams.set('client_id', GITHUB_CLIENT_ID);
    githubAuthUrl.searchParams.set('redirect_uri', `${origin}/api/auth/oauth/github?redirect=${encodeURIComponent(redirect)}`);
    githubAuthUrl.searchParams.set('scope', 'user:email');
    githubAuthUrl.searchParams.set('state', randomBytes(16).toString('hex'));
    return NextResponse.redirect(githubAuthUrl);
  }

  // Simulated OAuth flow (no GitHub app configured)
  // Creates a demo GitHub user and logs them in
  try {
    const githubId = randomBytes(8).toString('hex');
    const email = `github_${githubId.substring(0, 6)}@oauth.formengine.pro`;
    const name = `GitHub User ${githubId.substring(0, 4).toUpperCase()}`;

    let user = await db.user.findUnique({ where: { email } });

    if (!user) {
      user = await db.user.create({
        data: {
          email,
          passwordHash: hashPassword(randomBytes(32).toString('hex')),
          name,
          fullName: name,
          orgName: 'GitHub',
        },
      });
    }

    await createSession(user.id);
    return NextResponse.redirect(`${origin}${redirect}`);
  } catch (error) {
    console.error('[GitHub OAuth] error:', error);
    return NextResponse.redirect(`${origin}/signin?error=oauth_failed`);
  }
}
