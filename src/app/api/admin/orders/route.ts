import { NextResponse } from 'next/server';
import { getDbOrders, createDbOrder, updateDbOrderStatus } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status')?.toLowerCase();
    const search = searchParams.get('search')?.toLowerCase();

    let orders = await getDbOrders();

    if (status && status !== 'all') {
      orders = orders.filter((o) => o.status.toLowerCase() === status);
    }

    if (search) {
      orders = orders.filter(
        (o) =>
          o.order_number.toLowerCase().includes(search) ||
          o.customer?.name.toLowerCase().includes(search) ||
          o.customer?.email.toLowerCase().includes(search) ||
          o.customer?.phone.includes(search)
      );
    }

    return NextResponse.json({ success: true, count: orders.length, orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
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
