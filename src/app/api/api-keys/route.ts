import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  generateApiKey,
  hashApiKey,
  getKeyPrefix,
  serializePermissions,
  parsePermissions,
  PERMISSION_SCOPES,
  type PermissionScope,
} from '@/lib/api-key-crypto';

/**
 * POST /api/api-keys
 *
 * Create a new API key. The full key is returned in the response — it is
 * shown to the user ONCE and never stored in plaintext.
 *
 * Body: {
 *   name: string,
 *   permissions?: string[]  // defaults to all scopes
 * }
 *
 * Response: {
 *   id: string,
 *   key: string,           // FULL key — only returned here
 *   keyPrefix: string,
 *   name: string,
 *   permissions: string[],
 *   status: "active",
 *   createdAt: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, permissions } = body as {
      name?: string;
      permissions?: string[];
    };

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Key name is required' },
        { status: 400 }
      );
    }

    // Validate and default permissions
    const validScopes = PERMISSION_SCOPES.map((s) => s.value);
    const requestedPerms = permissions && Array.isArray(permissions)
      ? permissions.filter((p) => validScopes.includes(p as PermissionScope))
      : validScopes; // default: all scopes

    if (requestedPerms.length === 0) {
      return NextResponse.json(
        { error: 'At least one permission scope is required' },
        { status: 400 }
      );
    }

    // Generate the key
    const fullKey = generateApiKey();
    const keyHash = hashApiKey(fullKey);
    const keyPrefix = getKeyPrefix(fullKey);

    // Persist (only hash + prefix, never the full key)
    const apiKey = await db.apiKey.create({
      data: {
        name: name.trim(),
        keyHash,
        keyPrefix,
        status: 'active',
        permissions: serializePermissions(requestedPerms),
      },
    });

    return NextResponse.json({
      id: apiKey.id,
      key: fullKey, // ONLY returned at creation time
      keyPrefix: apiKey.keyPrefix,
      name: apiKey.name,
      permissions: requestedPerms,
      status: apiKey.status,
      createdAt: apiKey.createdAt.toISOString(),
    });
  } catch (error) {
    console.error('[POST /api/api-keys] error:', error);
    return NextResponse.json(
      { error: 'Failed to create API key' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/api-keys
 *
 * List all API keys. Returns metadata only — never the full key.
 */
export async function GET() {
  try {
    const keys = await db.apiKey.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        keyPrefix: true,
        status: true,
        permissions: true,
        lastRotatedAt: true,
        lastUsedAt: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      keys: keys.map((k) => ({
        ...k,
        permissions: parsePermissions(k.permissions),
        lastRotatedAt: k.lastRotatedAt?.toISOString() ?? null,
        lastUsedAt: k.lastUsedAt?.toISOString() ?? null,
        createdAt: k.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('[GET /api/api-keys] error:', error);
    return NextResponse.json(
      { error: 'Failed to list API keys' },
      { status: 500 }
    );
  }
}
