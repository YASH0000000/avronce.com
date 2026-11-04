import { NextResponse } from 'next/server';
import { getDbCms, saveDbCms } from '@/lib/db';

export async function GET() {
  try {
    const cms = await getDbCms();
    return NextResponse.json({ success: true, cms });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const updated = await saveDbCms(body);
    return NextResponse.json({ success: true, cms: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
