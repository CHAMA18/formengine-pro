import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateSchema, validateFlowchart } from '@/lib/flowchart/schema-generator';
import type { Flowchart } from '@/lib/flowchart/types';

/**
 * POST /api/forms
 *
 * Publish a flowchart as a shareable form. Persists the flowchart + the
 * generated JSON schema to the database and returns the shareId.
 *
 * Body: { name: string, description?: string, flowchart: Flowchart }
 * Response: { id: string, shareId: string }
 */
export async function POST(request: NextRequest) {
  try {
    let body: { name?: string; description?: string; flowchart?: Flowchart };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Request body must be valid JSON' },
        { status: 400 }
      );
    }
    const { name, description, flowchart } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Form name is required' },
        { status: 400 }
      );
    }

    if (!flowchart || !flowchart.nodes || !Array.isArray(flowchart.nodes)) {
      return NextResponse.json(
        { error: 'Valid flowchart is required' },
        { status: 400 }
      );
    }

    // Validate the flowchart before publishing
    const errors = validateFlowchart(flowchart);
    if (errors.length > 0) {
      return NextResponse.json(
        { error: `Flowchart validation failed: ${errors.join('; ')}` },
        { status: 400 }
      );
    }

    // Generate the JSON schema from the flowchart
    const schema = generateSchema(flowchart, name);

    // Persist to the database
    const form = await db.form.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        flowchart: JSON.stringify(flowchart),
        schema: JSON.stringify(schema),
        status: 'published',
      },
    });

    return NextResponse.json({
      id: form.id,
      shareId: form.shareId,
    });
  } catch (error) {
    console.error('[POST /api/forms] error:', error);
    return NextResponse.json(
      { error: 'Failed to publish form' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/forms
 *
 * List all published forms (for the templates page).
 */
export async function GET() {
  try {
    const forms = await db.form.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        shareId: true,
        name: true,
        description: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { submissions: true } },
      },
    });

    return NextResponse.json({ forms });
  } catch (error) {
    console.error('[GET /api/forms] error:', error);
    return NextResponse.json(
      { error: 'Failed to list forms' },
      { status: 500 }
    );
  }
}
