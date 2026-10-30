'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Tag, Sparkles } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    subtotal,
    shippingFee,
    discountAmount,
    couponCode,
    applyCoupon,
    removeCoupon,
    totalAmount,
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const FREE_SHIPPING_GOAL = 2999;
  const progressPercent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_GOAL) * 100));
  const amountNeeded = Math.max(0, FREE_SHIPPING_GOAL - subtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    if (!inputCoupon.trim()) return;

    const ok = applyCoupon(inputCoupon);
    if (ok) {
      setCouponSuccess(`Coupon ${inputCoupon.toUpperCase()} applied!`);
      setInputCoupon('');
    } else {
      setCouponError('Invalid code. Try "AVRONCE10" or "FIRST15"');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md transform bg-zinc-950 text-zinc-100 shadow-2xl transition-all duration-300 flex flex-col border-l border-zinc-800">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg tracking-[0.2em] uppercase font-light">Shopping Bag</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-mono">
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition-colors"
              aria-label="Close Bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-6 py-3 bg-zinc-900/70 border-b border-zinc-800 text-xs">
            {amountNeeded > 0 ? (
              <p className="text-zinc-300 mb-1.5 flex items-center justify-between">
                <span>Add <strong className="text-white font-medium">₹{amountNeeded.toLocaleString('en-IN')}</strong> for free shipping</span>
                <span className="text-zinc-400">{progressPercent}%</span>
              </p>
            ) : (
              <p className="text-emerald-400 font-medium mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>You unlocked complimentary express shipping!</span>
              </p>
            )}
            <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${amountNeeded === 0 ? 'bg-emerald-400' : 'bg-white'}`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 divide-y divide-zinc-800/60">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="w-16 h-16 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-500 mb-4">
                  <Tag className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg tracking-wider mb-2">Your Bag Is Empty</h3>
                <p className="text-xs text-zinc-400 max-w-xs mb-6">
                  Discover our architectural tailoring, selvedge denim, and heavyweight essentials.
                </p>
                <button
                  onClick={closeCart}
                  className="px-6 py-3 bg-white text-zinc-950 text-xs tracking-widest uppercase font-medium hover:bg-zinc-200 transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="pt-4 first:pt-0 flex gap-4">
                  <div className="relative w-20 h-24 bg-zinc-900 shrink-0 overflow-hidden rounded-sm border border-zinc-800">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={closeCart}
                          className="text-sm font-medium hover:underline line-clamp-1 pr-2"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-zinc-500 hover:text-red-400 transition-colors p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400">
                        <span className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-[11px] font-mono">
                          Size: {item.size}
                        </span>
                        <span className="flex items-center gap-1">
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-zinc-700"
                            style={{ backgroundColor: item.colorHex }}
                          />
                          <span className="text-[11px]">{item.colorName}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-zinc-800 rounded-sm">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-xs font-mono">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-sm font-medium tracking-tight">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="border-t border-zinc-800 px-6 py-5 bg-zinc-900/50 space-y-4">
              
              {/* Promo Code Form */}
              <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                    placeholder="Promo code (e.g. AVRONCE10)"
                    className="flex-1 bg-zinc-950 border border-zinc-800 px-3 py-2 text-xs uppercase placeholder:normal-case placeholder:text-zinc-500 rounded-sm focus:outline-none focus:border-zinc-500 font-mono"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-medium uppercase tracking-wider rounded-sm transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-[11px] text-red-400">{couponError}</p>}
                {couponSuccess && <p className="text-[11px] text-emerald-400">{couponSuccess}</p>}
                {couponCode && !couponSuccess && (
                  <div className="flex items-center justify-between text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-900/60 px-2.5 py-1 rounded">
                    <span>Code <strong className="font-mono">{couponCode}</strong> applied (-₹{discountAmount.toLocaleString('en-IN')})</span>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-zinc-400 hover:text-white underline text-[11px]"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </form>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-zinc-400 border-t border-zinc-800/80 pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-zinc-200">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Standard Shipping</span>
                  <span>{shippingFee === 0 ? <strong className="text-emerald-400 font-normal">FREE</strong> : `₹${shippingFee}`}</span>
                </div>
                <div className="flex justify-between text-zinc-500 text-[11px]">
                  <span>Estimated GST (12%)</span>
                  <span>Included in prices</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-white pt-2 border-t border-zinc-800">
                  <span className="tracking-wide">Total</span>
                  <span className="font-serif text-base">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <div className="space-y-2">
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-white text-zinc-950 hover:bg-zinc-200 font-medium text-xs uppercase tracking-[0.2em] transition-colors rounded-sm shadow-md"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-500 text-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Secure 256-Bit SSL Encryption • Razorpay Protected</span>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
