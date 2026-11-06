import { NextResponse } from 'next/server';
import { authenticateAdmin } from '@/lib/db';

// Rate limiting in-memory map: IP -> attempts
const rateLimitMap = new Map<string, { attempts: number; lastAttempt: number }>();

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const now = Date.now();
    const clientData = rateLimitMap.get(ip) || { attempts: 0, lastAttempt: now };

    // Reset counter if more than 15 minutes have passed
    if (now - clientData.lastAttempt > 15 * 60 * 1000) {
      clientData.attempts = 0;
    }

    if (clientData.attempts >= 8) {
      return NextResponse.json(
        { success: false, error: 'Too many failed login attempts. Please wait 15 minutes.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json({ success: false, error: 'Password is required' }, { status: 400 });
    }

    const authResult = await authenticateAdmin(password);

    if (!authResult.success) {
      clientData.attempts += 1;
      clientData.lastAttempt = now;
      rateLimitMap.set(ip, clientData);
      return NextResponse.json(
        { success: false, error: 'Invalid master administrator password' },
        { status: 401 }
      );
    }

    // Reset rate limit on success
    rateLimitMap.delete(ip);

    const response = NextResponse.json({
      success: true,
      username: authResult.username,
      token: authResult.token,
    });

    // Set secure HTTP-only cookie (allow localhost without HTTPS requirement)
    const isLocalhost = request.url.includes('localhost') || request.url.includes('127.0.0.1');
    response.cookies.set('avronce_admin_session', authResult.token || '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' && !isLocalhost,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
