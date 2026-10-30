'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { 
  Search, 
  Package, 
  Truck, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Calendar,
  ArrowRight
} from 'lucide-react';

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrderQuery = searchParams.get('order') || '';

  const [query, setQuery] = useState(initialOrderQuery);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);

  const performSearch = async (targetQuery: string) => {
    if (!targetQuery.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setOrder(null);
    setOrderItems([]);

    const clean = targetQuery.trim();

    try {
      let supabaseQuery = supabase.from('orders').select('*');

      if (clean.toUpperCase().startsWith('AVR-')) {
        supabaseQuery = supabaseQuery.ilike('order_number', `%${clean}%`);
      } else if (clean.includes('@')) {
        supabaseQuery = supabaseQuery.ilike('customer_email', clean);
      } else {
        supabaseQuery = supabaseQuery.or(`order_number.ilike.%${clean}%,customer_phone.ilike.%${clean}%`);
      }

      const { data, error } = await supabaseQuery
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error || !data) {
        setErrorMsg('No order found matching your search. Please check your Order ID (AVR-...) or 10-digit mobile number.');
        setLoading(false);
        return;
      }

      setOrder(data);

      const { data: items } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', data.id);

      if (items) {
        setOrderItems(items);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while tracking your order.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderQuery) {
      performSearch(initialOrderQuery);
    }
  }, [initialOrderQuery]);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  const getStatusStep = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 4;
      case 'shipped':
        return 3;
      case 'processing':
        return 2;
      case 'pending':
      default:
        return 1;
    }
  };

  const currentStep = getStatusStep(order?.status || 'processing');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs uppercase tracking-[0.25em] text-zinc-400 font-mono">
          Order Status
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-white">
          Track Your Order
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
          Enter your Avronce Order ID (e.g. <strong className="text-zinc-200 font-mono">AVR-...</strong>) or 10-digit mobile number to view live delivery status.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleTrack} className="max-w-xl mx-auto flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            required
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Order ID (e.g. AVR-261030-5713) or mobile number"
            className="w-full bg-zinc-900 border border-zinc-800 text-xs text-white pl-10 pr-4 py-3.5 rounded-sm focus:outline-none focus:border-white font-mono placeholder:font-sans placeholder:text-zinc-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3.5 bg-white text-zinc-950 font-semibold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-colors rounded-sm disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Track'}
        </button>
      </form>

      {errorMsg && (
        <div className="max-w-xl mx-auto p-4 bg-red-950/40 border border-red-900 text-red-200 text-xs rounded-sm flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Order Tracking Result View */}
      {order && (
        <div className="bg-zinc-900/40 border border-zinc-800 p-6 sm:p-8 rounded-sm space-y-8 animate-in fade-in duration-300">
          
          {/* Status Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-zinc-400">Order ID:</span>
                <span className="px-2.5 py-1 bg-zinc-800 text-white rounded text-xs font-mono font-bold">
                  {order.order_number}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Placed on {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400">
                {order.status === 'processing' ? 'Order Confirmed & Preparing Dispatch' : order.status}
              </span>
            </div>
          </div>

          {/* Stepper Progress */}
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className={currentStep >= 1 ? 'text-white font-medium' : 'text-zinc-600'}>
                <span className="font-mono text-[10px] block text-zinc-500">01</span>
                <span>Confirmed</span>
              </div>
              <div className={currentStep >= 2 ? 'text-white font-medium' : 'text-zinc-600'}>
                <span className="font-mono text-[10px] block text-zinc-500">02</span>
                <span>Packed</span>
              </div>
              <div className={currentStep >= 3 ? 'text-white font-medium' : 'text-zinc-600'}>
                <span className="font-mono text-[10px] block text-zinc-500">03</span>
                <span>Shipped</span>
              </div>
              <div className={currentStep >= 4 ? 'text-white font-medium' : 'text-zinc-600'}>
                <span className="font-mono text-[10px] block text-zinc-500">04</span>
                <span>Delivered</span>
              </div>
            </div>

            <div className="relative h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 transition-all duration-700"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              />
            </div>
          </div>

          {/* Items in this order */}
          <div className="space-y-4 pt-4 border-t border-zinc-800">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Items in Your Package
            </h4>
            <div className="divide-y divide-zinc-800/80">
              {orderItems.map((item) => (
                <div key={item.id} className="py-3 first:pt-0 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {item.product_image && (
                      <div className="relative w-12 h-14 bg-zinc-950 border border-zinc-800 rounded-sm overflow-hidden shrink-0">
                        <Image
                          src={item.product_image}
                          alt={item.product_name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-medium text-white">{item.product_name}</p>
                      <p className="text-[11px] text-zinc-400">
                        Size: {item.size} • Color: {item.color_name} • Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-white">
                    ₹{Number(item.total).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Details */}
          {order.shipping_address && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-zinc-800 text-xs text-zinc-400">
              <div className="space-y-1">
                <span className="uppercase tracking-wider font-semibold text-zinc-300 block mb-1">
                  Delivery To
                </span>
                <p className="text-white font-medium">{order.shipping_address.fullName}</p>
                <p>Phone: {order.shipping_address.phone}</p>
                <p>Email: {order.customer_email}</p>
              </div>

              <div className="space-y-1">
                <span className="uppercase tracking-wider font-semibold text-zinc-300 block mb-1">
                  Delivery Address
                </span>
                <p>{order.shipping_address.addressLine1}</p>
                {order.shipping_address.addressLine2 && <p>{order.shipping_address.addressLine2}</p>}
                <p>{order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.postalCode}</p>
                <p>{order.shipping_address.country}</p>
              </div>
            </div>
          )}

          {/* Payment info */}
          <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-zinc-500 uppercase tracking-wider block text-[10px]">Payment Summary</span>
              <p className="text-white font-medium mt-0.5">
                Paid ₹{Number(order.total_amount).toLocaleString('en-IN')} via Razorpay
              </p>
              {order.razorpay_payment_id && (
                <p className="text-[11px] font-mono text-zinc-400">Transaction ID: {order.razorpay_payment_id}</p>
              )}
            </div>
            <Link
              href={`/order-success/${order.id}`}
              className="text-xs text-white hover:underline uppercase tracking-wider inline-flex items-center gap-1 font-semibold"
            >
              <span>View Order Receipt</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      )}

    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[50vh] flex items-center justify-center text-zinc-400 text-xs uppercase tracking-widest">
        Loading Order Tracker...
      </div>
    }>
      <TrackOrderContent />
    </Suspense>
  );
}
