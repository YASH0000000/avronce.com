'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { Logo } from '@/components/brand/Logo';
import { 
  ShieldCheck, 
  Lock, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  CreditCard,
  Sparkles,
  HelpCircle,
  Truck
} from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    subtotal,
    shippingFee,
    discountAmount,
    couponCode,
    taxAmount,
    totalAmount,
    clearCart,
  } = useCart();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: 'Maharashtra',
    postalCode: '',
    country: 'India',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [razorpayReady, setRazorpayReady] = useState(false);

  // Load Razorpay Checkout Script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayReady(true);
    script.onerror = () => console.warn('Razorpay SDK failed to load external script');
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) return 'Please enter your full name';
    if (!formData.email.trim() || !formData.email.includes('@')) return 'Please enter a valid email address';
    if (!formData.phone.trim() || formData.phone.length < 10) return 'Please enter a valid 10-digit mobile number';
    if (!formData.addressLine1.trim()) return 'Please enter your delivery street address';
    if (!formData.city.trim()) return 'Please enter your city';
    if (!formData.postalCode.trim() || formData.postalCode.length < 5) return 'Please enter a valid PIN code';
    return null;
  };

  const handlePayment = async (isSimulation = false) => {
    setErrorMsg('');
    const formErr = validateForm();
    if (formErr) {
      setErrorMsg(formErr);
      return;
    }

    if (items.length === 0) {
      setErrorMsg('Your shopping bag is empty.');
      return;
    }

    setLoading(true);

    try {
      // 1. Create order on backend API
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalAmount,
          receipt: `rcpt_${Date.now()}`,
          notes: {
            customer_name: formData.fullName,
            customer_email: formData.email,
          },
        }),
      });

      const orderData = await res.json();
      if (!res.ok || orderData.error) {
        throw new Error(orderData.error || 'Failed to initialize payment gateway');
      }

      // If user chose the Sandbox Fast-Track simulation button or window.Razorpay isn't available
      if (isSimulation || !window.Razorpay) {
        const simPaymentId = `pay_sim_${Date.now()}_test`;
        const simSignature = 'simulated_signature_avronce';

        const verifyRes = await fetch('/api/razorpay/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: orderData.id,
            razorpay_payment_id: simPaymentId,
            razorpay_signature: simSignature,
            customer: {
              name: formData.fullName,
              email: formData.email,
              phone: formData.phone,
            },
            shippingAddress: formData,
            items,
            subtotal,
            discountAmount,
            shippingFee,
            taxAmount,
            totalAmount,
          }),
        });

        const verifyData = await verifyRes.json();
        if (verifyRes.ok && verifyData.success) {
          clearCart();
          router.push(`/order-success/${verifyData.orderId}`);
          return;
        } else {
          throw new Error(verifyData.error || 'Failed to record simulated payment order');
        }
      }

      // Standard Razorpay Checkout Modal
      const options = {
        key: orderData.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_51AvronceDevKey',
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'AVRONCE ATELIER',
        description: 'Bespoke Ready-to-Wear Acquisition',
        order_id: orderData.id,
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#09090b',
        },
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                customer: {
                  name: formData.fullName,
                  email: formData.email,
                  phone: formData.phone,
                },
                shippingAddress: formData,
                items,
                subtotal,
                discountAmount,
                shippingFee,
                taxAmount,
                totalAmount,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              clearCart();
              router.push(`/order-success/${verifyData.orderId}`);
            } else {
              setErrorMsg(verifyData.error || 'Payment signature verification failed.');
              setLoading(false);
            }
          } catch (err: any) {
            setErrorMsg(err.message || 'Error communicating with verification server.');
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp: any) {
        setErrorMsg(`Payment Failed: ${resp.error.description || 'Transaction declined'}`);
        setLoading(false);
      });
      rzp.open();
    } catch (err: any) {
      setErrorMsg(err.message || 'Payment processing encountered an unexpected error.');
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <Logo variant="combined" size="lg" className="mb-8" />
        <h2 className="font-serif text-2xl tracking-wider mb-3">Your Cart Is Empty</h2>
        <p className="text-zinc-400 text-sm max-w-md mb-8">
          You don&apos;t have any items in your cart. Explore our collection to get started.
        </p>
        <Link
          href="/shop"
          className="px-8 py-3.5 bg-white text-zinc-950 font-semibold text-xs uppercase tracking-[0.2em] hover:bg-zinc-200 transition-colors rounded-sm"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-20">
      
      {/* Checkout Minimal Header */}
      <div className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/shop" className="text-xs uppercase tracking-wider text-zinc-400 hover:text-white flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Shopping</span>
          </Link>
          <Logo variant="combined" size="md" />
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">256-Bit Secure SSL</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Delivery & Customer Details */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Notification alert if any */}
            {errorMsg && (
              <div className="p-4 bg-red-950/50 border border-red-800 text-red-200 text-xs rounded flex items-center gap-3">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Test Mode Credentials Helper Box */}
            <div className="bg-zinc-900/80 border border-zinc-700 p-5 rounded-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
                  <Sparkles className="w-4 h-4" />
                  <span>Razorpay Test Gateway Mode Active</span>
                </div>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded font-mono">
                  Sandbox Active
                </span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Test orders are safely processed without real funds. You can complete checkout using the official Razorpay test credentials below, or click the instant sandbox button:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-zinc-300 bg-zinc-950 p-3 rounded border border-zinc-800">
                <div>Test Card: <strong className="text-white">4111 1111 1111 1111</strong></div>
                <div>Expiry: <strong className="text-white">12/28</strong> • CVV: <strong className="text-white">123</strong></div>
                <div>UPI Simulator: <strong className="text-white">success@razorpay</strong></div>
                <div>Test Key: <strong className="text-white">rzp_test_51AvronceDevKey</strong></div>
              </div>
            </div>

            {/* Customer Contact */}
            <div className="space-y-4">
              <h2 className="font-serif text-lg tracking-wider uppercase text-white flex items-center gap-2">
                <span>1. Contact Information</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="Aditya Sharma"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full bg-zinc-900 border border-zinc-800 text-xs text-white p-3 rounded-sm focus:outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1.5">Mobile Phone (for tracking) *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-zinc-900 border border-zinc-800 text-xs text-white p-3 rounded-sm focus:outline-none focus:border-white font-mono"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1.5">Email Address (for invoice) *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="aditya@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-zinc-900 border border-zinc-800 text-xs text-white p-3 rounded-sm focus:outline-none focus:border-white"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="space-y-4 pt-4 border-t border-zinc-800">
              <h2 className="font-serif text-lg tracking-wider uppercase text-white flex items-center gap-2">
                <span>2. Delivery Address (India)</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1.5">Address Line 1 *</label>
                  <input
                    type="text"
                    name="addressLine1"
                    required
                    placeholder="House / Flat / Suite / Street Name"
                    value={formData.addressLine1}
                    onChange={handleChange}
                    className="w-full bg-zinc-900 border border-zinc-800 text-xs text-white p-3 rounded-sm focus:outline-none focus:border-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1.5">Address Line 2 (Optional)</label>
                  <input
                    type="text"
                    name="addressLine2"
                    placeholder="Apartment, Landmark, Floor"
                    value={formData.addressLine2}
                    onChange={handleChange}
                    className="w-full bg-zinc-900 border border-zinc-800 text-xs text-white p-3 rounded-sm focus:outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1.5">City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    placeholder="Mumbai"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full bg-zinc-900 border border-zinc-800 text-xs text-white p-3 rounded-sm focus:outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1.5">State *</label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full bg-zinc-900 border border-zinc-800 text-xs text-white p-3 rounded-sm focus:outline-none focus:border-white"
                  >
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Delhi">Delhi NCR</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="West Bengal">West Bengal</option>
                    <option value="Other">Other States</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1.5">PIN Code *</label>
                  <input
                    type="text"
                    name="postalCode"
                    required
                    placeholder="400001"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="w-full bg-zinc-900 border border-zinc-800 text-xs text-white p-3 rounded-sm focus:outline-none focus:border-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1.5">Country</label>
                  <input
                    type="text"
                    name="country"
                    disabled
                    value="India"
                    className="w-full bg-zinc-900/50 border border-zinc-800 text-xs text-zinc-400 p-3 rounded-sm cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Payment Trigger Buttons */}
            <div className="pt-6 border-t border-zinc-800 space-y-3">
              <button
                type="button"
                disabled={loading}
                onClick={() => handlePayment(false)}
                className="w-full py-4 bg-white text-zinc-950 hover:bg-zinc-200 font-semibold text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-2 rounded-sm transition-all disabled:opacity-50 shadow-xl"
              >
                {loading ? (
                  <span>Initializing Razorpay Gateway...</span>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Pay ₹{totalAmount.toLocaleString('en-IN')} with Razorpay (UPI, Cards, NetBanking)</span>
                  </>
                )}
              </button>

              {/* Instant Sandbox Bypass Simulator for local verification */}
              <button
                type="button"
                disabled={loading}
                onClick={() => handlePayment(true)}
                className="w-full py-3 bg-zinc-900 border border-amber-500/40 hover:border-amber-400 text-amber-300 font-medium text-xs uppercase tracking-widest flex items-center justify-center gap-2 rounded-sm transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Instant Test Payment (Demo Simulation)</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-400 pt-2 text-center">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Safe & Secure Checkout • Supports Google Pay, PhonePe, Paytm, Visa, RuPay & NetBanking</span>
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-sm space-y-6 sticky top-28">
              
              <h3 className="font-serif text-lg tracking-wider uppercase text-white pb-4 border-b border-zinc-800">
                Order Summary ({items.reduce((s, i) => s + i.quantity, 0)})
              </h3>

              {/* Items List */}
              <div className="space-y-4 max-h-80 overflow-y-auto pr-1 divide-y divide-zinc-800/60">
                {items.map((item) => (
                  <div key={item.id} className="pt-3 first:pt-0 flex gap-4">
                    <div className="relative w-16 h-20 bg-zinc-900 shrink-0 border border-zinc-800 rounded-sm overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between text-xs">
                      <div>
                        <h4 className="font-medium text-white line-clamp-1">{item.name}</h4>
                        <div className="text-[11px] text-zinc-400 mt-1 flex items-center gap-2 font-mono">
                          <span>Size: {item.size}</span>
                          <span>•</span>
                          <span>Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <div className="font-semibold text-white">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing Details */}
              <div className="space-y-2 border-t border-zinc-800 pt-4 text-xs text-zinc-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount ({couponCode})</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Express Shipping</span>
                  <span>{shippingFee === 0 ? <strong className="text-emerald-400 font-normal">COMPLIMENTARY</strong> : `₹${shippingFee}`}</span>
                </div>
                <div className="flex justify-between text-zinc-500 text-[11px]">
                  <span>GST (12% Apparel Rate)</span>
                  <span>Inclusive</span>
                </div>
                <div className="flex justify-between items-baseline pt-3 border-t border-zinc-800 text-sm font-semibold text-white">
                  <span className="uppercase tracking-wider">Total Amount</span>
                  <span className="font-serif text-xl">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Assurance statement */}
              <div className="bg-zinc-950 p-4 border border-zinc-800 text-[11px] text-zinc-400 space-y-1 rounded-sm">
                <div className="flex items-center gap-2 text-zinc-200 font-medium">
                  <Truck className="w-3.5 h-3.5 text-zinc-300" />
                  <span>Dispatched in Recyclable Avronce Atelier Boxes</span>
                </div>
                <p>Includes certificate of authenticity and 7-day doorstep size exchange guarantee.</p>
              </div>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
