import { NextResponse } from 'next/server';
import Airtable from 'airtable';

/**
 * List all field names from Airtable tables
 * GET /api/list-airtable-fields
 *
 * This endpoint inspects the actual Airtable schema
 * to get exact field names for mapping
 */
export async function GET() {
  try {
    const base = new Airtable({
      apiKey: process.env.AIRTABLE_API_KEY,
    }).base(process.env.AIRTABLE_BASE_ID || '');

    const result: any = {
      success: true,
      tables: {},
    };

    // Fetch one record from CONTACTOS to see its fields
    try {
      const contactosRecords = await base('CONTACTOS')
        .select({ maxRecords: 1 })
        .firstPage();

      if (contactosRecords.length > 0) {
        const fields = contactosRecords[0].fields;
        result.tables.CONTACTOS = {
          fieldNames: Object.keys(fields),
          sampleRecord: fields,
        };
      } else {
        result.tables.CONTACTOS = {
          error: 'No records found in CONTACTOS table',
          fieldNames: [],
        };
      }
    } catch (error) {
      result.tables.CONTACTOS = {
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }

    // Fetch one record from OPORTUNIDADES to see its fields
    try {
      const oportunidadesRecords = await base('OPORTUNIDADES')
        .select({ maxRecords: 1 })
        .firstPage();

      if (oportunidadesRecords.length > 0) {
        const fields = oportunidadesRecords[0].fields;
        result.tables.OPORTUNIDADES = {
          fieldNames: Object.keys(fields),
          sampleRecord: fields,
        };
      } else {
        result.tables.OPORTUNIDADES = {
          error: 'No records found in OPORTUNIDADES table',
          fieldNames: [],
        };
      }
    } catch (error) {
      result.tables.OPORTUNIDADES = {
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('[list-airtable-fields] Error:', error);

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
