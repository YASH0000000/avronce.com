'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { supabase } from '@/lib/supabase/client';
import { Logo } from '@/components/brand/Logo';
import { 
  CheckCircle2, 
  Package, 
  Truck, 
  MapPin, 
  Printer, 
  ArrowRight, 
  ShieldCheck, 
  Calendar 
} from 'lucide-react';

export default function OrderSuccessPage() {
  const params = useParams();
  const orderId = params?.orderId as string;

  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fire celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ffffff', '#e4e4e7', '#a1a1aa', '#18181b'],
      });
    } catch (e) {}

    async function fetchOrder() {
      if (!orderId) return;

      try {
        const decodedId = decodeURIComponent(orderId);

        // 1. Try central API first
        try {
          const apiRes = await fetch(`/api/orders?order_number=${encodeURIComponent(decodedId)}`);
          const apiData = await apiRes.json();
          if (apiRes.ok && apiData.success && apiData.order) {
            setOrder(apiData.order);
            if (apiData.order.items) {
              setItems(
                apiData.order.items.map((it: any) => ({
                  id: it.id || `item-${Date.now()}`,
                  product_name: it.product_name || it.name,
                  product_image: it.product_image || it.image || '/images/collections/cat_boots.webp',
                  size: it.size || 'Standard',
                  color_name: it.color_name || (it as any).colorName || 'Standard',
                  quantity: it.quantity || 1,
                  total: it.total || (it.price * (it.quantity || 1)),
                }))
              );
            }
            setLoading(false);
            return;
          }
        } catch {}

        // 2. Direct Supabase Query by order_number or UUID
        let sbQuery = supabase.from('orders').select('*');
        if (decodedId.toUpperCase().startsWith('AVR-')) {
          sbQuery = sbQuery.eq('order_number', decodedId);
        } else {
          sbQuery = sbQuery.or(`id.eq.${decodedId},order_number.eq.${decodedId}`);
        }

        const { data: orderData } = await sbQuery.maybeSingle();

        if (orderData) {
          setOrder(orderData);

          const { data: itemsData } = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', orderData.id);

          if (itemsData && itemsData.length > 0) {
            setItems(itemsData);
          }
        }
      } catch (err) {
        console.error('Error fetching order receipt:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6">
        <Logo variant="combined" size="md" className="animate-pulse mb-4" />
        <p className="text-xs uppercase tracking-widest text-zinc-400 font-mono">Loading Your Order...</p>
      </div>
    );
  }

  const activeOrderNumber = order?.order_number || orderId;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex justify-between items-center pb-6 border-b border-zinc-800">
          <Logo variant="combined" size="md" />
          <button
            onClick={handlePrint}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-300 rounded-sm transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>
        </div>

        {/* Confirmation Hero Card */}
        <div className="bg-zinc-900/60 border border-zinc-800 p-8 rounded-sm text-center space-y-4">
          <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-xs font-mono uppercase tracking-[0.2em] text-emerald-400 font-semibold">
            {order?.payment_status === 'paid' ? 'Order Confirmed • Payment Successful' : 'Order Placed • Cash On Delivery'}
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-white">
            Thank You! Your Order is Confirmed.
          </h1>

          <p className="text-xs text-zinc-300 max-w-md mx-auto leading-relaxed">
            Your Order ID is <strong className="text-white font-mono">{activeOrderNumber}</strong>. We have sent the confirmation and receipt to <span className="text-white font-medium">{order?.customer_email || order?.customer?.email || 'your email'}</span>.
          </p>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-xs text-zinc-300 font-mono">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>Estimated Delivery: 3 to 5 Business Days across India</span>
          </div>
        </div>

        {/* Tracking Timeline */}
        <div className="bg-zinc-900/30 border border-zinc-800/80 p-6 rounded-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
              Fulfillment Journey
            </h3>
            <span className="text-xs font-mono text-zinc-400">
              Courier: <strong className="text-white">{order?.courier || 'BlueDart Express'}</strong>
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center sm:text-left">
            <div className="p-3 bg-zinc-950 border border-zinc-800 rounded">
              <span className="text-[10px] text-emerald-400 font-mono block mb-1">01. COMPLETED</span>
              <p className="text-xs font-medium text-white">Order Confirmed</p>
            </div>
            <div className="p-3 bg-zinc-950 border border-zinc-800 rounded">
              <span className="text-[10px] text-amber-400 font-mono block mb-1">02. CURRENT</span>
              <p className="text-xs font-medium text-white">Atelier Prep & QC</p>
            </div>
            <div className="p-3 bg-zinc-950 border border-zinc-800/40 rounded opacity-60">
              <span className="text-[10px] text-zinc-500 font-mono block mb-1">03. UPCOMING</span>
              <p className="text-xs font-medium text-zinc-300">Express Air Courier</p>
            </div>
            <div className="p-3 bg-zinc-950 border border-zinc-800/40 rounded opacity-60">
              <span className="text-[10px] text-zinc-500 font-mono block mb-1">04. UPCOMING</span>
              <p className="text-xs font-medium text-zinc-300">Doorstep Delivery</p>
            </div>
          </div>
        </div>

        {/* Order Items & Breakdown */}
        <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-sm space-y-6">
          <h3 className="font-serif text-lg tracking-wider uppercase text-white pb-3 border-b border-zinc-800">
            Purchased Garments
          </h3>

          <div className="space-y-4 divide-y divide-zinc-800/60">
            {items.map((item) => (
              <div key={item.id} className="pt-4 first:pt-0 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {item.product_image && (
                    <div className="relative w-14 h-16 bg-zinc-950 border border-zinc-800 rounded-sm overflow-hidden shrink-0">
                      <Image
                        src={item.product_image}
                        alt={item.product_name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <h4 className="text-xs font-medium text-white">{item.product_name}</h4>
                    <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
                      <span>Size: {item.size}</span> • <span>Qty: {item.quantity}</span>
                    </div>
                  </div>
                </div>

                <div className="text-xs font-semibold text-white font-mono">
                  ₹{Number(item.total).toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-zinc-800 pt-4 space-y-1.5 text-xs text-zinc-400">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-white font-mono">₹{Number(order?.subtotal || 0).toLocaleString('en-IN')}</span>
            </div>
            {order?.discount_amount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Promotional Discount</span>
                <span className="font-mono">-₹{Number(order.discount_amount).toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Express Delivery</span>
              <span className="font-mono">{order?.shipping_fee === 0 ? 'FREE' : `₹${order?.shipping_fee}`}</span>
            </div>
            <div className="flex justify-between items-baseline pt-3 border-t border-zinc-800 text-sm font-semibold text-white">
              <span>Total Payable</span>
              <span className="font-serif text-xl font-mono">₹{Number(order?.total_amount || 0).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Shipping Destination */}
        {order?.shipping_address && (
          <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-sm text-xs text-zinc-400 space-y-2">
            <div className="flex items-center gap-2 text-white font-medium uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-zinc-400" />
              <span>Delivery Address</span>
            </div>
            <p className="text-white font-medium">{order.shipping_address.fullName}</p>
            <p>{order.shipping_address.addressLine1}</p>
            {order.shipping_address.addressLine2 && <p>{order.shipping_address.addressLine2}</p>}
            <p>{order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.postalCode}</p>
            <p>{order.shipping_address.country} • Phone: {order.shipping_address.phone}</p>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <Link
            href="/shop"
            className="w-full sm:w-auto px-8 py-3.5 bg-white text-zinc-950 hover:bg-zinc-200 font-medium text-xs uppercase tracking-[0.2em] rounded-sm transition-colors text-center"
          >
            Continue Browsing
          </Link>
          <Link
            href={`/track?order=${encodeURIComponent(activeOrderNumber)}`}
            className="w-full sm:w-auto px-6 py-3.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-600 text-zinc-300 font-medium text-xs uppercase tracking-[0.2em] rounded-sm transition-colors text-center"
          >
            Track Real-time Status →
          </Link>
        </div>

      </div>
    </div>
  );
}
