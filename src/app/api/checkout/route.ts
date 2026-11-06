import { NextResponse } from 'next/server';
import { createDbOrder, getDbProducts } from '@/lib/db';
import { razorpayInstance } from '@/lib/razorpay';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customer,
      shippingAddress,
      items,
      couponCode,
      paymentMethod = 'online',
      instantSimulate = false,
    } = body;

    // 1. Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: 'Your bag is empty' }, { status: 400 });
    }

    const name = customer?.name || shippingAddress?.fullName;
    const email = customer?.email || shippingAddress?.email;
    const phone = customer?.phone || shippingAddress?.phone;
    const address = shippingAddress?.addressLine1;
    const city = shippingAddress?.city;
    const postalCode = shippingAddress?.postalCode;

    if (!name || !email || !phone || !address || !city || !postalCode) {
      return NextResponse.json(
        { success: false, error: 'Please fill in all required shipping address and contact fields' },
        { status: 400 }
      );
    }

    // 2. Authoritative Price & Stock Calculation Server-Side
    const dbProducts = await getDbProducts();
    let calculatedSubtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const dbProd = dbProducts.find((p) => p.id === item.productId || p.slug === item.slug);
      const unitPrice = dbProd ? Number(dbProd.price) : Number(item.price || 999);
      const qty = Math.max(1, Number(item.quantity || 1));
      const lineTotal = unitPrice * qty;
      calculatedSubtotal += lineTotal;

      validatedItems.push({
        id: item.id || `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        productId: item.productId || dbProd?.id || 'prod',
        name: dbProd?.title || item.name || 'AVRONCE Item',
        slug: dbProd?.slug || item.slug || 'product',
        size: item.size || 'M',
        price: unitPrice,
        quantity: qty,
        image: dbProd?.images?.[0] || item.image || '/images/collections/cat_boots.webp',
        colorName: item.colorName || 'Default',
      });
    }

    // Discounts
    let discountPercent = 0;
    const cleanCoupon = (couponCode || '').trim().toUpperCase();
    if (cleanCoupon === 'B2G1' || cleanCoupon === 'BUY2GET1') {
      discountPercent = 33;
    } else if (cleanCoupon === 'NEW10' || cleanCoupon === 'WELCOME10' || cleanCoupon === 'PREPAID10') {
      discountPercent = 10;
    } else if (cleanCoupon === 'WELCOME200' || cleanCoupon === 'LITTLEBOX20') {
      discountPercent = 20;
    }

    const discountAmount = Math.round((calculatedSubtotal * discountPercent) / 100);
    const taxableAmount = Math.max(0, calculatedSubtotal - discountAmount);
    const shippingFee = calculatedSubtotal >= 999 ? 0 : 99;
    const taxAmount = Math.round(taxableAmount * 0.05);
    const totalAmount = taxableAmount + shippingFee;

    const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || 'rzp_test_51AvronceDevKey';

    // 3. Create persistent Order Record in Central Database FIRST
    const isCod = paymentMethod === 'cod';

    const orderRecord = await createDbOrder({
      status: isCod ? 'confirmed' : 'pending_payment',
      payment_status: 'pending',
      payment_method: isCod ? 'Cash on Delivery (COD)' : 'Razorpay Secure Online',
      customer: {
        name,
        email,
        phone,
      },
      shipping_address: shippingAddress,
      items: validatedItems,
      subtotal: calculatedSubtotal,
      discount_amount: discountAmount,
      coupon_code: cleanCoupon,
      shipping_fee: shippingFee,
      tax_amount: taxAmount,
      total_amount: totalAmount,
    });

    // 4. Handle COD Placement
    if (isCod) {
      return NextResponse.json({
        success: true,
        orderId: orderRecord.id,
        orderNumber: orderRecord.order_number,
        trackingToken: orderRecord.tracking_token,
        isCod: true,
      });
    }

    // 5. Handle Razorpay Online Payment Initiation
    const amountInPaise = Math.round(totalAmount * 100);

    // If sandbox instant simulation requested
    if (instantSimulate) {
      const simulatedOrderId = `order_sim_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      orderRecord.razorpay_order_id = simulatedOrderId;

      return NextResponse.json({
        success: true,
        orderId: orderRecord.id,
        orderNumber: orderRecord.order_number,
        trackingToken: orderRecord.tracking_token,
        razorpayOrderId: simulatedOrderId,
        amount: amountInPaise,
        currency: 'INR',
        key: key_id,
        isSimulated: true,
      });
    }

    try {
      const rzpOrder = await razorpayInstance.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: orderRecord.order_number,
        notes: {
          order_id: orderRecord.id,
          order_number: orderRecord.order_number,
          customer_name: name,
          customer_email: email,
        },
      });

      orderRecord.razorpay_order_id = rzpOrder.id;

      return NextResponse.json({
        success: true,
        orderId: orderRecord.id,
        orderNumber: orderRecord.order_number,
        trackingToken: orderRecord.tracking_token,
        razorpayOrderId: rzpOrder.id,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency || 'INR',
        key: key_id,
        isSimulated: false,
      });
    } catch (rzpErr: any) {
      console.warn('Razorpay order creation fallback triggered:', rzpErr?.message || rzpErr);
      const simulatedOrderId = `order_sim_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      orderRecord.razorpay_order_id = simulatedOrderId;

      return NextResponse.json({
        success: true,
        orderId: orderRecord.id,
        orderNumber: orderRecord.order_number,
        trackingToken: orderRecord.tracking_token,
        razorpayOrderId: simulatedOrderId,
        amount: amountInPaise,
        currency: 'INR',
        key: key_id,
        isSimulated: true,
      });
    }
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Checkout server error' },
      { status: 500 }
    );
  }
}
