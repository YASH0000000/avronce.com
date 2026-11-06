import { NextResponse } from 'next/server';
import { verifyRazorpayWebhookSignature } from '@/lib/razorpay';
import { getDbOrders, updateDbOrderStatus, readDb, writeDb } from '@/lib/db';

// Cache of processed webhook event IDs to enforce idempotency
const processedWebhookEvents = new Set<string>();

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature') || '';

    // Verify webhook signature
    const isValid = verifyRazorpayWebhookSignature({
      rawBody,
      signature,
    });

    if (!isValid) {
      console.warn('Invalid Razorpay webhook signature received');
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);
    const eventId = payload.event_id || payload.id;
    if (eventId && processedWebhookEvents.has(eventId)) {
      return NextResponse.json({ success: true, duplicated: true, event: payload.event });
    }

    if (eventId) {
      processedWebhookEvents.add(eventId);
    }

    const event = payload.event;
    const payment = payload.payload?.payment?.entity;
    const order = payload.payload?.order?.entity;

    const orders = await getDbOrders();
    const razorpayOrderId = payment?.order_id || order?.id;
    const paymentId = payment?.id;

    // Find matching order in db by razorpay_payment_id, razorpay_order_id, receipt, or order_number
    const existing = orders.find(
      (o) =>
        (paymentId && o.razorpay_payment_id === paymentId) ||
        (razorpayOrderId && (o.razorpay_order_id === razorpayOrderId || o.order_number === razorpayOrderId)) ||
        (order?.receipt && o.order_number === order.receipt)
    );

    switch (event) {
      case 'payment.captured': {
        if (existing) {
          if (paymentId) existing.razorpay_payment_id = paymentId;
          if (razorpayOrderId) existing.razorpay_order_id = razorpayOrderId;
          existing.payment_status = 'paid';
          if (existing.status === 'pending_payment' || existing.status === 'pending') {
            await updateDbOrderStatus(existing.id, 'processing');
          } else {
            const db = await readDb();
            const idx = db.orders.findIndex((o) => o.id === existing.id || o.order_number === existing.order_number);
            if (idx >= 0) {
              db.orders[idx].payment_status = 'paid';
              await writeDb(db);
            }
          }
        }
        break;
      }

      case 'payment.failed': {
        if (existing) {
          existing.payment_status = 'failed';
          const db = await readDb();
          const idx = db.orders.findIndex((o) => o.id === existing.id || o.order_number === existing.order_number);
          if (idx >= 0) {
            db.orders[idx].payment_status = 'failed';
            await writeDb(db);
          }
        }
        break;
      }

      case 'refund.processed': {
        const refundPaymentId = payload.payload?.refund?.entity?.payment_id || paymentId;
        const refundOrder = orders.find((o) => o.razorpay_payment_id === refundPaymentId);
        if (refundOrder) {
          refundOrder.payment_status = 'refunded';
          await updateDbOrderStatus(refundOrder.id, 'cancelled');
        }
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ success: true, received: true, event });
  } catch (error: any) {
    console.error('Error handling Razorpay webhook:', error);
    return NextResponse.json(
      { error: 'Internal error processing webhook' },
      { status: 500 }
    );
  }
}
