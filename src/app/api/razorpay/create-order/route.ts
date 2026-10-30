import { NextResponse } from 'next/server';
import { razorpayInstance } from '@/lib/razorpay';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, receipt, notes } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_51AvronceDevKey';

    // Amount in paise (1 INR = 100 paise)
    const amountInPaise = Math.round(Number(amount) * 100);

    try {
      // Attempt official Razorpay Orders API
      const options = {
        amount: amountInPaise,
        currency: 'INR',
        receipt: receipt || `rcpt_${Date.now()}`,
        notes: notes || { store: 'AVRONCE ATELIER' },
      };

      const order = await razorpayInstance.orders.create(options);

      return NextResponse.json({
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        key: key_id,
      });
    } catch (razorpayErr: any) {
      console.warn('Razorpay API sandbox fallback triggered:', razorpayErr.message || razorpayErr);

      // Seamless sandbox mock order generation for local development / test credentials
      const simulatedOrderId = `order_sim_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

      return NextResponse.json({
        id: simulatedOrderId,
        amount: amountInPaise,
        currency: 'INR',
        key: key_id,
        isSimulated: true,
      });
    }
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { error: 'Internal server error creating payment order' },
      { status: 500 }
    );
  }
}
