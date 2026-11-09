import { NextResponse } from 'next/server';
import { getRazorpayInstance, getRazorpayKeys } from '@/lib/razorpay';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, receipt, notes } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const { key_id } = getRazorpayKeys();

    // Amount in paise (1 INR = 100 paise)
    const amountInPaise = Math.round(Number(amount) * 100);

    try {
      const razorpay = getRazorpayInstance();
      const options = {
        amount: amountInPaise,
        currency: 'INR',
        receipt: receipt || `rcpt_${Date.now()}`,
        notes: notes || { store: 'AVRONCE ATELIER' },
      };

      const order = await razorpay.orders.create(options);

      return NextResponse.json({
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        key: key_id,
        isSimulated: false,
      });
    } catch (razorpayErr: any) {
      console.error('Razorpay API order creation failed:', razorpayErr);
      const errorMsg =
        razorpayErr?.error?.description ||
        razorpayErr?.message ||
        'Razorpay order creation failed';
      return NextResponse.json({ error: errorMsg }, { status: 502 });
    }
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { error: 'Internal server error creating payment order' },
      { status: 500 }
    );
  }
}
