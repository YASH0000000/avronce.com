import { NextResponse } from 'next/server';
import { getDbOrders, createDbOrder, updateDbOrderStatus, getDbAdminSecurity, verifyAdminSessionToken } from '@/lib/db';

async function checkAdminAuth(request: Request): Promise<boolean> {
  try {
    const sec = await getDbAdminSecurity();
    if (!sec.passwordProtected) return true;

    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(/avronce_admin_session=([^;]+)/);
    const cookieToken = match ? match[1] : '';

    const authHeader = request.headers.get('authorization') || '';
    const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

    const token = cookieToken || bearerToken;
    const { valid } = verifyAdminSessionToken(token);
    return valid;
  } catch {
    return true;
  }
}

export async function GET(request: Request) {
  try {
    const isAuthed = await checkAdminAuth(request);
    if (!isAuthed) {
      return NextResponse.json({ success: false, error: 'Unauthorized admin access' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status')?.toLowerCase();
    const search = searchParams.get('search')?.toLowerCase();
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '50', 10));

    let orders = await getDbOrders();

    if (status && status !== 'all') {
      if (status === 'pending') {
        orders = orders.filter((o) => o.status.toLowerCase() === 'pending' || o.status.toLowerCase() === 'pending_payment');
      } else {
        orders = orders.filter((o) => o.status.toLowerCase() === status);
      }
    }

    if (search) {
      orders = orders.filter(
        (o) =>
          o.order_number.toLowerCase().includes(search) ||
          o.id.toLowerCase().includes(search) ||
          o.customer?.name.toLowerCase().includes(search) ||
          o.customer?.email.toLowerCase().includes(search) ||
          (o.customer?.phone && o.customer.phone.includes(search)) ||
          (o.razorpay_payment_id && o.razorpay_payment_id.toLowerCase().includes(search)) ||
          (o.tracking_id && o.tracking_id.toLowerCase().includes(search))
      );
    }

    const totalCount = orders.length;
    const startIndex = (page - 1) * limit;
    const paginatedOrders = orders.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      count: paginatedOrders.length,
      total: totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit),
      orders: paginatedOrders,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const isAuthed = await checkAdminAuth(request);
    if (!isAuthed) {
      return NextResponse.json({ success: false, error: 'Unauthorized admin access' }, { status: 401 });
    }

    const body = await request.json();
    if (!body.items || body.items.length === 0) {
      return NextResponse.json({ success: false, error: 'Order must contain items' }, { status: 400 });
    }

    const created = await createDbOrder(body);
    return NextResponse.json({ success: true, order: created });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const isAuthed = await checkAdminAuth(request);
    if (!isAuthed) {
      return NextResponse.json({ success: false, error: 'Unauthorized admin access' }, { status: 401 });
    }

    const body = await request.json();
    const { id, status, tracking_id, courier } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'Order ID and new status are required' },
        { status: 400 }
      );
    }

    const updated = await updateDbOrderStatus(id, status, tracking_id, courier);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
