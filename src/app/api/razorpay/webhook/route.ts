import { NextResponse } from 'next/server';
import { verifyRazorpayWebhookSignature } from '@/lib/razorpay';
import { getDbOrders, updateDbOrderStatus, createDbOrder } from '@/lib/db';

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
    const event = payload.event;
    const payment = payload.payload?.payment?.entity;
    const order = payload.payload?.order?.entity;

    const orders = await getDbOrders();

    // Reconcile according to event type
    switch (event) {
      case 'payment.captured': {
        const orderId = payment?.order_id;
        const paymentId = payment?.id;

        // Find matching order in db
        const existing = orders.find(
          (o) => o.razorpay_payment_id === paymentId || (orderId && o.order_number === orderId)
        );

        if (existing) {
          if (existing.payment_status !== 'paid') {
            await updateDbOrderStatus(existing.id, 'processing');
          }
        }
        break;
      }

      case 'payment.failed': {
        const paymentId = payment?.id;
        const existing = orders.find((o) => o.razorpay_payment_id === paymentId);
        if (existing) {
          existing.payment_status = 'failed';
        }
        break;
      }

      case 'refund.processed': {
        const paymentId = payload.payload?.refund?.entity?.payment_id;
        const existing = orders.find((o) => o.razorpay_payment_id === paymentId);
        if (existing) {
          existing.payment_status = 'refunded';
          await updateDbOrderStatus(existing.id, 'cancelled');
        }
        break;
      }

      default:
        // Ignore unhandled event types idempotently
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
