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
  Truck,
  Zap,
  Tag
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

  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online');
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
    if (!formData.addressLine1.trim()) return 'Please enter your street address';
    if (!formData.city.trim()) return 'Please enter your city';
    if (!formData.postalCode.trim() || formData.postalCode.length < 6) return 'Please enter a valid 6-digit postal code';
    return null;
  };

  const handlePayment = async (instantSimulate = false) => {
    const err = validateForm();
    if (err) {
      setErrorMsg(err);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      // 1. COD Direct Order placement
      if (paymentMethod === 'cod' && !instantSimulate) {
        const codOrderId = `LB-COD-${Date.now().toString().slice(-6)}`;
        const verifyRes = await fetch('/api/razorpay/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: codOrderId,
            razorpay_payment_id: `cod_pending_${Date.now()}`,
            razorpay_signature: 'simulated_signature_avronce',
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
            isCod: true,
          }),
        });

        const verifyData = await verifyRes.json();
        if (verifyRes.ok && verifyData.success) {
          clearCart();
          router.push(`/order-success/${verifyData.orderId}`);
          return;
        } else {
          throw new Error(verifyData.error || 'Failed to record COD order');
        }
      }

      // 2. Create Razorpay Order
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalAmount,
          currency: 'INR',
          notes: {
            customer_name: formData.fullName,
            customer_email: formData.email,
            customer_phone: formData.phone,
            coupon_applied: couponCode || 'NONE',
          },
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to initiate secure checkout gateway session.');
      }

      const orderData = await res.json();

      // If Instant Simulation or fallback
      if (instantSimulate || !window.Razorpay) {
        const simPaymentId = `pay_sim_littlebox_${Date.now()}`;
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

      // Standard Razorpay Modal
      const options = {
        key: orderData.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_51AvronceDevKey',
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'LITTLEBOX INDIA',
        description: 'Trendy Footwear & Apparel Order',
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
        <Logo variant="combined" size="lg" inverted className="mb-6" />
        <h2 className="text-2xl font-black uppercase tracking-wider mb-2">Your Bag Is Empty</h2>
        <p className="text-zinc-400 text-xs sm:text-sm max-w-md mb-6">
          Add chunky boots, party dresses, or Y2K coords to your bag to proceed with checkout.
        </p>
        <Link
          href="/shop"
          className="px-8 py-3.5 bg-white text-zinc-950 font-black text-xs uppercase tracking-[0.2em] hover:bg-zinc-200 transition-colors rounded-xs shadow-lg"
        >
          Explore Catalog ⚡
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-20">
      
      {/* Checkout Minimal Header */}
      <div className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
          <Link href="/shop" className="text-xs uppercase tracking-wider text-zinc-400 hover:text-white flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Shopping</span>
          </Link>
          <Logo variant="combined" size="md" inverted />
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-Bit SSL</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Delivery & Customer Details */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            
            {errorMsg && (
              <div className="p-4 bg-red-950/50 border border-red-800 text-red-200 text-xs rounded-xs flex items-center gap-3">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Test Gateway Helper */}
            <div className="bg-zinc-900 border border-zinc-800 p-4 sm:p-5 rounded-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-yellow-400">
                  <Sparkles className="w-4 h-4" />
                  <span>Razorpay Test Gateway Mode Active</span>
                </div>
                <span className="text-[10px] bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 px-2 py-0.5 rounded font-mono">
                  Test Sandbox
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                You can complete orders using test UPI (<strong className="text-white">success@razorpay</strong>), test cards, or the 1-click test simulation button below.
              </p>
            </div>

            {/* Customer Contact */}
            <div className="space-y-4">
              <h2 className="text-sm font-black tracking-wider uppercase text-white flex items-center gap-2">
                <span>1. Contact Details</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="Ananya Sharma"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full bg-zinc-900 border border-zinc-800 text-xs text-white p-3 rounded-xs focus:outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="ananya@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-zinc-900 border border-zinc-800 text-xs text-white p-3 rounded-xs focus:outline-none focus:border-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1.5">Phone (for Delivery SMS) *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    maxLength={10}
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-zinc-900 border border-zinc-800 text-xs text-white p-3 rounded-xs focus:outline-none focus:border-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="space-y-4 pt-4 border-t border-zinc-800">
              <h2 className="text-sm font-black tracking-wider uppercase text-white">
                <span>2. Delivery Address</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1.5">Street Address *</label>
                  <input
                    type="text"
                    name="addressLine1"
                    required
                    placeholder="Flat 402, Lotus Residency, 12th Main"
                    value={formData.addressLine1}
                    onChange={handleChange}
                    className="w-full bg-zinc-900 border border-zinc-800 text-xs text-white p-3 rounded-xs focus:outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1.5">City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    placeholder="Bengaluru"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full bg-zinc-900 border border-zinc-800 text-xs text-white p-3 rounded-xs focus:outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1.5">Pincode *</label>
                  <input
                    type="text"
                    name="postalCode"
                    maxLength={6}
                    required
                    placeholder="560038"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="w-full bg-zinc-900 border border-zinc-800 text-xs text-white p-3 rounded-xs focus:outline-none focus:border-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3 pt-4 border-t border-zinc-800">
              <h2 className="text-sm font-black tracking-wider uppercase text-white">
                <span>3. Payment Method</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  onClick={() => setPaymentMethod('online')}
                  className={`p-4 border rounded-xs cursor-pointer transition-all flex items-start gap-3 ${
                    paymentMethod === 'online'
                      ? 'border-white bg-zinc-900 ring-1 ring-white'
                      : 'border-zinc-800 bg-zinc-950/60 text-zinc-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'online'}
                    onChange={() => setPaymentMethod('online')}
                    className="mt-1"
                  />
                  <div>
                    <h4 className="text-xs font-black uppercase text-white">Online Payment (UPI / Cards)</h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Google Pay, PhonePe, Paytm, Visa, Mastercard & NetBanking. Extra 10% off with PREPAID10.
                    </p>
                  </div>
                </label>

                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 border rounded-xs cursor-pointer transition-all flex items-start gap-3 ${
                    paymentMethod === 'cod'
                      ? 'border-white bg-zinc-900 ring-1 ring-white'
                      : 'border-zinc-800 bg-zinc-950/60 text-zinc-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-1"
                  />
                  <div>
                    <h4 className="text-xs font-black uppercase text-white">Cash on Delivery (COD)</h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Pay cash or UPI at your doorstep upon delivery across India.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-4 space-y-3">
              <button
                type="button"
                disabled={loading}
                onClick={() => handlePayment(false)}
                className="w-full py-4 bg-white text-zinc-950 hover:bg-zinc-200 font-black text-xs sm:text-sm uppercase tracking-[0.2em] rounded-xs flex items-center justify-center gap-2 shadow-xl transition-all"
              >
                {loading ? (
                  <span>Processing Checkout...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>
                      {paymentMethod === 'cod' ? 'Confirm Cash on Delivery Order' : `Pay ₹${totalAmount.toLocaleString('en-IN')} with Razorpay`}
                    </span>
                  </>
                )}
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => handlePayment(true)}
                className="w-full py-3 bg-zinc-900 border border-yellow-400/40 hover:border-yellow-400 text-yellow-300 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 rounded-xs transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Instant Sandbox Demo Order (1-Click Test)</span>
              </button>
            </div>

          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-zinc-900/50 border border-zinc-800 p-5 sm:p-6 rounded-xs space-y-5 sticky top-28">
              
              <h3 className="text-sm font-black uppercase tracking-wider text-white pb-3 border-b border-zinc-800">
                Order Summary ({items.reduce((s, i) => s + i.quantity, 0)})
              </h3>

              {/* Items List */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1 divide-y divide-zinc-800">
                {items.map((item) => (
                  <div key={item.id} className="pt-3 first:pt-0 flex gap-3">
                    <div className="relative w-14 aspect-[3/4] bg-zinc-900 shrink-0 border border-zinc-800 rounded-xs overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between text-xs">
                      <div>
                        <h4 className="font-semibold text-white line-clamp-1">{item.name}</h4>
                        <div className="text-[11px] text-zinc-400 mt-0.5 font-mono">
                          <span>Size: {item.size}</span>
                          <span> • Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <div className="font-bold text-white font-mono">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-2 border-t border-zinc-800 pt-3 text-xs text-zinc-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-mono">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Discount ({couponCode})</span>
                    <span className="font-mono">-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span className="font-mono">
                    {shippingFee === 0 ? <strong className="text-emerald-400">FREE</strong> : `₹${shippingFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-zinc-500">
                  <span>GST (Included)</span>
                  <span>100% Tax Inclusive</span>
                </div>
                <div className="flex justify-between items-baseline pt-3 border-t border-zinc-800 text-sm font-black text-white">
                  <span className="uppercase tracking-wider">Total Payable</span>
                  <span className="text-xl font-mono">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Assurance Box */}
              <div className="bg-zinc-950 p-3.5 border border-zinc-800 text-[11px] text-zinc-400 space-y-1 rounded-xs">
                <div className="flex items-center gap-1.5 text-zinc-200 font-bold">
                  <Truck className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Littlebox Express Delivery Guarantee</span>
                </div>
                <p>Includes 7-day easy size exchange and doorstep replacement.</p>
              </div>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
