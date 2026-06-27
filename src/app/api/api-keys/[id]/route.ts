import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { parsePermissions } from '@/lib/api-key-crypto';

/**
 * GET /api/api-keys/[id]
 *
 * Get a single API key's metadata (never the full key).
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const apiKey = await db.apiKey.findUnique({ where: { id } });

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: apiKey.id,
      name: apiKey.name,
      keyPrefix: apiKey.keyPrefix,
      status: apiKey.status,
      permissions: parsePermissions(apiKey.permissions),
      lastRotatedAt: apiKey.lastRotatedAt?.toISOString() ?? null,
      lastUsedAt: apiKey.lastUsedAt?.toISOString() ?? null,
      createdAt: apiKey.createdAt.toISOString(),
      updatedAt: apiKey.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error('[GET /api/api-keys/[id]] error:', error);
    return NextResponse.json({ error: 'Failed to get API key' }, { status: 500 });
  }
}

/**
 * PATCH /api/api-keys/[id]
 *
 * Update an API key's name or permissions.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, permissions } = body as {
      name?: string;
      permissions?: string[];
    };

    const existing = await db.apiKey.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 });
    }

    const data: { name?: string; permissions?: string } = {};
    if (name && name.trim()) data.name = name.trim();
    if (permissions && Array.isArray(permissions)) {
      data.permissions = JSON.stringify(permissions);
    }

    const updated = await db.apiKey.update({
      where: { id },
      data,
    });

    return NextResponse.json({
      id: updated.id,
      name: updated.name,
      keyPrefix: updated.keyPrefix,
      status: updated.status,
      permissions: parsePermissions(updated.permissions),
      updatedAt: updated.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error('[PATCH /api/api-keys/[id]] error:', error);
    return NextResponse.json({ error: 'Failed to update API key' }, { status: 500 });
  }
}

/**
 * DELETE /api/api-keys/[id]
 *
 * Revoke (soft-delete) an API key. The key record is kept for audit but
 * its status is set to "revoked" so it immediately stops working.
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await db.apiKey.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 });
    }

    await db.apiKey.update({
      where: { id },
      data: { status: 'revoked' },
    });

    return NextResponse.json({ id, status: 'revoked' });
  } catch (error) {
    console.error('[DELETE /api/api-keys/[id]] error:', error);
    return NextResponse.json({ error: 'Failed to revoke API key' }, { status: 500 });
  }
}
