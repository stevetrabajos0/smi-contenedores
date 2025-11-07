import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasAirtableApiKey: !!process.env.AIRTABLE_API_KEY,
    hasAirtableBaseId: !!process.env.AIRTABLE_BASE_ID,
    allAirtableVars: Object.keys(process.env)
      .filter(key => key.includes('AIRTABLE'))
      .map(key => ({
        name: key,
        hasValue: !!process.env[key],
        firstChars: process.env[key]?.substring(0, 10) + '...'
      })),
    nodeEnv: process.env.NODE_ENV,
  });
}
