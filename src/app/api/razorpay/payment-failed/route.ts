import { NextResponse } from 'next/server';
import { getDbOrderByIdOrNumber, readDb, writeDb } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderNumber, orderId, errorDescription, errorCode } = body;

    const lookupKey = orderNumber || orderId;
    if (!lookupKey) {
      return NextResponse.json({ success: false, error: 'Missing order reference' }, { status: 400 });
    }

    const order = await getDbOrderByIdOrNumber(lookupKey);
    if (order) {
      order.payment_status = 'failed';
      order.notes = `Payment Failed: ${errorCode || 'DECLINED'} - ${errorDescription || 'Transaction declined'}`;
      order.updated_at = new Date().toISOString();

      const db = await readDb();
      const idx = db.orders.findIndex((o) => o.id === order.id || o.order_number === order.order_number);
      if (idx >= 0) {
        db.orders[idx] = order;
        await writeDb(db);
      }
    }

    return NextResponse.json({ success: true, message: 'Payment failure recorded' });
  } catch (error: any) {
    console.error('Error logging payment failure:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
