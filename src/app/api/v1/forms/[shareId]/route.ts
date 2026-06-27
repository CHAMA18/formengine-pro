import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { authenticateApiKey, requirePermission } from '@/lib/api-auth';
import type { GeneratedSchema } from '@/lib/flowchart/types';

/**
 * GET /api/v1/forms/[shareId]
 *
 * Get a single form's schema. Requires `forms:read`.
 *
 * Response: {
 *   id, shareId, name, description, status, schema: GeneratedSchema, createdAt
 * }
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shareId: string }> }
) {
  const auth = await authenticateApiKey(request);
  const permCheck = requirePermission(auth, 'forms:read');
  if (permCheck) return permCheck;

  try {
    const { shareId } = await params;
    const form = await db.form.findUnique({ where: { shareId } });

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    let schema: GeneratedSchema;
    try {
      schema = JSON.parse(form.schema) as GeneratedSchema;
    } catch {
      return NextResponse.json({ error: 'Form schema is corrupted' }, { status: 500 });
    }

    return NextResponse.json({
      id: form.id,
      shareId: form.shareId,
      name: form.name,
      description: form.description,
      status: form.status,
      schema,
      createdAt: form.createdAt.toISOString(),
      updatedAt: form.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error('[GET /api/v1/forms/[shareId]] error:', error);
    return NextResponse.json({ error: 'Failed to get form' }, { status: 500 });
  }
}
