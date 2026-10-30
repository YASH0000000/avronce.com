import { NextResponse } from 'next/server';
import { verifyRazorpaySignature } from '@/lib/razorpay';
import { createServerSupabase } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      customer,
      shippingAddress,
      items,
      subtotal,
      discountAmount,
      shippingFee,
      taxAmount,
      totalAmount,
    } = body;

    // 1. Verify Razorpay Signature
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

    const supabase = createServerSupabase();

    // 2. Generate Unique Order Reference
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const randStr = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `AVR-${dateStr}-${randStr}`;

    // 3. Insert into Supabase `orders` table
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_name: customer.name || shippingAddress.fullName,
        customer_email: customer.email,
        customer_phone: customer.phone,
        shipping_address: shippingAddress,
        subtotal: Number(subtotal),
        discount_amount: Number(discountAmount || 0),
        shipping_fee: Number(shippingFee || 0),
        tax_amount: Number(taxAmount || 0),
        total_amount: Number(totalAmount),
        status: 'processing',
        payment_status: 'captured',
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        notes: `Placed on Avronce Atelier Storefront via Razorpay Test/Sandbox`,
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error('Error saving order to Supabase:', orderError);
      return NextResponse.json(
        { error: 'Payment verified, but failed to record order' },
        { status: 500 }
      );
    }

    // Helper to validate UUID
    const isValidUuid = (id: any): boolean =>
      typeof id === 'string' &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    // 4. Insert into `order_items` table
    if (items && items.length > 0) {
      const orderItems = items.map((item: any) => ({
        order_id: order.id,
        product_id: isValidUuid(item.productId) ? item.productId : null,
        variant_id: isValidUuid(item.variantId) ? item.variantId : null,
        product_name: item.name,
        product_slug: item.slug,
        product_image: item.image,
        size: item.size,
        color_name: item.colorName,
        price: Number(item.price),
        quantity: Number(item.quantity),
        total: Number(item.price * item.quantity),
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Error inserting order items:', itemsError);
      }

      // 5. Deduct inventory in `product_variants`
      for (const item of items) {
        if (item.variantId) {
          const { data: variant } = await supabase
            .from('product_variants')
            .select('stock_quantity')
            .eq('id', item.variantId)
            .single();

          if (variant) {
            const updatedStock = Math.max(0, variant.stock_quantity - item.quantity);
            await supabase
              .from('product_variants')
              .update({ stock_quantity: updatedStock })
              .eq('id', item.variantId);
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.order_number,
    });
  } catch (error: any) {
    console.error('Error in verify-payment handler:', error);
    return NextResponse.json(
      { error: 'Internal server error processing payment verification' },
      { status: 500 }
    );
  }
}
