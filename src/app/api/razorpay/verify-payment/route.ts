import { NextResponse } from 'next/server';
import { verifyRazorpaySignature } from '@/lib/razorpay';
import { createDbOrder, getDbOrderByIdOrNumber, updateDbOrderStatus, readDb, writeDb } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderNumber,
      orderId,
      customer,
      shippingAddress,
      items,
      subtotal,
      discountAmount,
      shippingFee,
      taxAmount,
      totalAmount,
      isCod,
    } = body;

    // 1. Verify Razorpay Signature (skip signature verify for COD mock or simulated)
    const isSimulated =
      razorpay_signature === 'simulated_signature_avronce' ||
      razorpay_payment_id?.startsWith('pay_sim_');

    if (!isCod && !isSimulated) {
      const isValidSignature = verifyRazorpaySignature({
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
      });

      if (!isValidSignature) {
        return NextResponse.json(
          { error: 'Invalid payment signature. Verification failed.' },
          { status: 400 }
        );
      }
    }

    // 2. Find existing order record
    const lookupKey = orderNumber || orderId || razorpay_order_id;
    let existingOrder = lookupKey ? await getDbOrderByIdOrNumber(lookupKey) : null;

    if (existingOrder) {
      // Update existing order
      const targetStatus = isCod ? 'confirmed' : 'processing';
      const targetPaymentStatus = isCod ? 'pending' : 'paid';
      existingOrder.status = targetStatus;
      existingOrder.payment_status = targetPaymentStatus;
      existingOrder.razorpay_payment_id = razorpay_payment_id || existingOrder.razorpay_payment_id;
      existingOrder.razorpay_signature = razorpay_signature || existingOrder.razorpay_signature;
      if (razorpay_order_id && !existingOrder.razorpay_order_id) {
        existingOrder.razorpay_order_id = razorpay_order_id;
      }

      await updateDbOrderStatus(
        existingOrder.id,
        targetStatus,
        existingOrder.tracking_id,
        existingOrder.courier,
        targetPaymentStatus,
        razorpay_payment_id
      );

      return NextResponse.json({
        success: true,
        orderId: existingOrder.id,
        orderNumber: existingOrder.order_number,
      });
    }

    // 3. Fallback: If order wasn't pre-created, create it now
    const localOrder = await createDbOrder({
      status: isCod ? 'confirmed' : 'processing',
      payment_status: isCod ? 'pending' : 'paid',
      payment_method: isCod ? 'Cash on Delivery (COD)' : 'Razorpay Secure Online',
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      customer: {
        name: customer?.name || shippingAddress?.fullName || 'Valued Customer',
        email: customer?.email || shippingAddress?.email || 'customer@avronce.com',
        phone: customer?.phone || shippingAddress?.phone || '',
      },
      shipping_address: shippingAddress,
      items: items || [],
      subtotal: Number(subtotal || 0),
      discount_amount: Number(discountAmount || 0),
      shipping_fee: Number(shippingFee || 0),
      tax_amount: Number(taxAmount || 0),
      total_amount: Number(totalAmount || 0),
    });

    return NextResponse.json({
      success: true,
      orderId: localOrder.id,
      orderNumber: localOrder.order_number,
    });
  } catch (error: any) {
    console.error('Error in verify-payment handler:', error);
    return NextResponse.json(
      { error: 'Internal server error processing payment verification' },
      { status: 500 }
    );
  }
}
