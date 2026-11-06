import { NextResponse } from 'next/server';
import { updateDbAdminSecurity, getDbAdminSecurity, verifyAdminSessionToken } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const sec = await getDbAdminSecurity();

    // Verify admin is authenticated
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(/avronce_admin_session=([^;]+)/);
    const token = match ? match[1] : (request.headers.get('authorization')?.slice(7) || '');

    const { valid } = verifyAdminSessionToken(token);
    if (!valid && sec.passwordProtected) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const result = await updateDbAdminSecurity(body);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, customPath: result.customPath });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
