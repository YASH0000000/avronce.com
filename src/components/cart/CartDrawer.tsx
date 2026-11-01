'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Tag, Truck, Check, Sparkles } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    subtotal,
    discountAmount,
    shippingFee,
    taxAmount,
    totalAmount,
    couponCode,
    applyCoupon,
    removeCoupon,
    freeShippingThreshold,
    freeShippingProgress,
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponError, setCouponError] = useState(false);

  if (!isOpen) return null;

  const handleApplyCoupon = (codeToApply?: string) => {
    const code = (codeToApply || inputCoupon).trim();
    if (!code) return;
    const success = applyCoupon(code);
    if (!success) {
      setCouponError(true);
      setTimeout(() => setCouponError(false), 2500);
    } else {
      setInputCoupon('');
      setCouponError(false);
    }
  };

  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white shadow-2xl flex flex-col justify-between border-l border-zinc-200 dark:border-zinc-800">
          
          {/* 1. Header */}
          <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-zinc-950 dark:text-white" />
              <h2 className="text-base font-black uppercase tracking-wider">
                Your Littlebox Bag ({items.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 text-zinc-400 hover:text-zinc-950 dark:hover:text-white rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              aria-label="Close Cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 2. Free Shipping Progress Bar */}
          <div className="bg-zinc-100 dark:bg-zinc-900 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className="flex items-center gap-1.5 text-zinc-800 dark:text-zinc-200">
                <Truck className="w-3.5 h-3.5 text-yellow-500" />
                {amountNeededForFreeShipping === 0 ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
                    🎉 You unlocked FREE Shipping across India!
                  </span>
                ) : (
                  <span>
                    Add <strong className="text-zinc-950 dark:text-white">₹{amountNeededForFreeShipping}</strong> more for FREE Shipping!
                  </span>
                )}
              </span>
              <span className="font-mono text-[11px] text-zinc-500">{freeShippingProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-zinc-950 dark:bg-white transition-all duration-500 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* 3. Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-zinc-100 dark:divide-zinc-900">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold uppercase tracking-wider">Your bag is empty</h3>
                  <p className="text-xs text-zinc-500 max-w-xs">
                    Discover trending boots, Y2K tops, and party dresses handpicked for you.
                  </p>
                </div>
                <button
                  onClick={closeCart}
                  className="px-6 py-2.5 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs uppercase font-bold tracking-wider rounded-xs"
                >
                  Start Shopping ⚡
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="py-4 flex gap-3.5 items-start">
                  {/* Item Image */}
                  <div className="relative w-20 aspect-[3/4] bg-zinc-100 dark:bg-zinc-900 rounded-xs overflow-hidden shrink-0 border border-zinc-200 dark:border-zinc-800">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={closeCart}
                          className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 hover:underline line-clamp-2 leading-snug"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 text-zinc-400 hover:text-red-500 transition-colors shrink-0"
                          aria-label="Remove Item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="mt-1 flex items-center gap-2 text-[11px] text-zinc-500">
                        <span className="font-mono bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded-xs font-bold text-zinc-800 dark:text-zinc-200">
                          Size: {item.size}
                        </span>
                        {item.colorName && <span>• {item.colorName}</span>}
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      {/* Quantity Controller */}
                      <div className="flex items-center border border-zinc-200 dark:border-zinc-800 rounded-xs">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold font-mono min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <span className="text-xs sm:text-sm font-black text-zinc-950 dark:text-white">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 4. Footer & Summary */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-3">
              {/* Coupon Code Section */}
              <div className="space-y-1.5">
                {couponCode ? (
                  <div className="flex items-center justify-between p-2 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 rounded-xs text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Code &quot;{couponCode}&quot; Applied!</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-zinc-500 hover:text-red-500 text-[11px] underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        placeholder="Discount code (e.g. B2G1)"
                        value={inputCoupon}
                        onChange={(e) => setInputCoupon(e.target.value.toUpperCase())}
                        className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs px-3 py-2 rounded-xs uppercase font-mono font-bold"
                      />
                      <button
                        onClick={() => handleApplyCoupon()}
                        className="px-4 py-2 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs uppercase font-bold rounded-xs shrink-0"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-[10px] text-red-500 mt-1 font-semibold">
                        Invalid code. Try B2G1, NEW10, or WELCOME200.
                      </p>
                    )}
                    {/* One-click coupon chips */}
                    <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1 scrollbar-none">
                      <span className="text-[10px] text-zinc-400 shrink-0">Tap to apply:</span>
                      {['B2G1', 'NEW10', 'WELCOME200'].map((code) => (
                        <button
                          key={code}
                          onClick={() => handleApplyCoupon(code)}
                          className="px-2 py-0.5 bg-zinc-200 dark:bg-zinc-800 text-[10px] font-mono font-bold rounded-xs hover:bg-yellow-400 hover:text-zinc-950 transition-colors shrink-0"
                        >
                          {code}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Price Calculation Breakdown */}
              <div className="space-y-1 text-xs pt-2 border-t border-zinc-200 dark:border-zinc-800">
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Subtotal</span>
                  <span className="font-mono">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                    <span>Discount</span>
                    <span className="font-mono">-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Standard Shipping</span>
                  <span className="font-mono">
                    {shippingFee === 0 ? <strong className="text-emerald-500">FREE</strong> : `₹${shippingFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-zinc-950 dark:text-white pt-2 border-t border-zinc-200 dark:border-zinc-800">
                  <span>Total Payable</span>
                  <span className="font-mono text-base">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full py-3.5 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs uppercase font-black tracking-[0.2em] rounded-xs flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-xl"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
