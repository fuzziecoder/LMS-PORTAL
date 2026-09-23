import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    service: 'gclms-web',
    timestamp: new Date().toISOString(),
  });
}
