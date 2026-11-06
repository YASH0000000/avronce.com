import { NextResponse } from 'next/server';
import { getDbAdminSecurity, verifyAdminSessionToken } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const sec = await getDbAdminSecurity();

    // If password protection is disabled, always allow
    if (!sec.passwordProtected) {
      return NextResponse.json({
        authenticated: true,
        username: sec.username,
        customPath: sec.customPath,
        passwordProtected: false,
      });
    }

    // Check cookie or header
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(/avronce_admin_session=([^;]+)/);
    const cookieToken = match ? match[1] : '';

    const authHeader = request.headers.get('authorization') || '';
    const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

    const token = cookieToken || bearerToken;
    const { valid, username } = verifyAdminSessionToken(token);

    return NextResponse.json({
      authenticated: valid,
      username: username || sec.username,
      customPath: sec.customPath,
      passwordProtected: true,
    });
  } catch (error: any) {
    return NextResponse.json({ authenticated: false, error: error.message }, { status: 500 });
  }
}
