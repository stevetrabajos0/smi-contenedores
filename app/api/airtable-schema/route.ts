import { NextResponse } from 'next/server';

/**
 * Fetch Airtable schema using Metadata API
 * GET /api/airtable-schema
 *
 * Returns complete schema for CONTACTOS and OPORTUNIDADES tables
 * including field names, types, and options
 */
export async function GET() {
  try {
    const baseId = process.env.AIRTABLE_BASE_ID;
    const apiKey = process.env.AIRTABLE_API_KEY;

    if (!baseId || !apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing Airtable credentials',
        },
        { status: 500 }
      );
    }

    // Fetch base schema using Metadata API
    const response = await fetch(
      `https://api.airtable.com/v0/meta/bases/${baseId}/tables`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to fetch schema from Airtable',
          details: errorText,
          status: response.status,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Filter to only CONTACTOS and OPORTUNIDADES tables
    const tables = data.tables.filter(
      (table: any) =>
        table.name === 'CONTACTOS' || table.name === 'OPORTUNIDADES'
    );

    // Format the schema for easy reading
    const formattedSchema = tables.map((table: any) => ({
      tableName: table.name,
      tableId: table.id,
      fields: table.fields.map((field: any) => ({
        fieldName: field.name,
        fieldId: field.id,
        type: field.type,
        options: field.options || null,
        description: field.description || null,
      })),
    }));

    return NextResponse.json(
      {
        success: true,
        baseId,
        schema: formattedSchema,
        fullData: tables, // Include full data for debugging
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[airtable-schema] Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
