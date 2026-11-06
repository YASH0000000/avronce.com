import { NextResponse } from 'next/server';
import { createDbOrder, getDbOrders, getDbOrderByIdOrNumber } from '@/lib/db';

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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get('order_number') || searchParams.get('id');
    const customerVerify = searchParams.get('verify')?.trim().toLowerCase();

    if (orderNumber) {
      const match = await getDbOrderByIdOrNumber(orderNumber);
      if (!match) {
        return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
      }

      // Privacy check if verify query is provided
      if (customerVerify) {
        const emailMatch = match.customer?.email?.toLowerCase() === customerVerify;
        const phoneMatch = match.customer?.phone?.replace(/\D/g, '').includes(customerVerify.replace(/\D/g, ''));
        const shippingEmailMatch = match.shipping_address?.email?.toLowerCase() === customerVerify;
        const shippingPhoneMatch = match.shipping_address?.phone?.replace(/\D/g, '').includes(customerVerify.replace(/\D/g, ''));

        if (!emailMatch && !phoneMatch && !shippingEmailMatch && !shippingPhoneMatch) {
          return NextResponse.json(
            { success: false, error: 'Order verification failed: contact details do not match order records.' },
            { status: 403 }
          );
        }
      }

      return NextResponse.json({ success: true, order: match });
    }

    // Require admin token if attempting to enumerate all orders without an order number
    const authHeader = request.headers.get('Authorization') || request.headers.get('x-admin-token');
    const token = authHeader?.replace('Bearer ', '');
    if (!token || token !== 'admin-session-active') {
      return NextResponse.json({ success: false, error: 'Order number is required' }, { status: 400 });
    }

    const orders = await getDbOrders();
    return NextResponse.json({ success: true, count: orders.length, orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
