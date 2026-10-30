'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ShieldCheck, RefreshCw, Truck } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-zinc-950 text-zinc-300 border-t border-zinc-800/80">
      
      {/* 1. Value Props Bar */}
      <div className="border-b border-zinc-800/60 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          
          <div className="flex items-center justify-center md:justify-start gap-4 p-4 rounded-sm bg-zinc-900/40 border border-zinc-800/40">
            <Truck className="w-6 h-6 text-zinc-300 shrink-0" />
            <div>
              <h4 className="text-xs uppercase tracking-wider font-semibold text-white">Free Delivery Across India</h4>
              <p className="text-xs text-zinc-400 mt-0.5">Free delivery on all orders above ₹2,999</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4 p-4 rounded-sm bg-zinc-900/40 border border-zinc-800/40">
            <RefreshCw className="w-6 h-6 text-zinc-300 shrink-0" />
            <div>
              <h4 className="text-xs uppercase tracking-wider font-semibold text-white">7-Day Easy Returns</h4>
              <p className="text-xs text-zinc-400 mt-0.5">Doorstep pickup & hassle-free size exchanges</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4 p-4 rounded-sm bg-zinc-900/40 border border-zinc-800/40">
            <ShieldCheck className="w-6 h-6 text-zinc-300 shrink-0" />
            <div>
              <h4 className="text-xs uppercase tracking-wider font-semibold text-white">100% Secure Payments</h4>
              <p className="text-xs text-zinc-400 mt-0.5">UPI (GPay/PhonePe/Paytm), Cards & NetBanking</p>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Main Footer Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-6">
            <Logo variant="combined" size="lg" />
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              AVRONCE crafts contemporary everyday clothing built to last. Made in India with breathable long-staple cotton, Japanese selvedge denim, and pure wool at fair, honest prices.
            </p>
            <div className="text-[11px] text-zinc-500 uppercase tracking-wider">
              <span>avronce.com</span> • <span>Contemporary Ready-to-Wear India</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-2 space-y-4">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-white">Collections</h5>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li><Link href="/shop" className="hover:text-white transition-colors">Shop All</Link></li>
              <li><Link href="/category/outerwear" className="hover:text-white transition-colors">Jackets & Coats</Link></li>
              <li><Link href="/category/essentials" className="hover:text-white transition-colors">T-Shirts & Hoodies</Link></li>
              <li><Link href="/category/tailoring" className="hover:text-white transition-colors">Tailored Trousers</Link></li>
              <li><Link href="/category/knitwear" className="hover:text-white transition-colors">Merino Knitwear</Link></li>
              <li><Link href="/category/shirts" className="hover:text-white transition-colors">Shirts & Overshirts</Link></li>
            </ul>
          </div>

          {/* Client Care Links */}
          <div className="md:col-span-2 space-y-4">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-white">Help & Support</h5>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li><Link href="/track" className="hover:text-white transition-colors">Track Order</Link></li>
              <li><Link href="/lookbook" className="hover:text-white transition-colors">Style Guide</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">Our Story</Link></li>
              <li><span className="cursor-pointer hover:text-white transition-colors">Size & Fit Guide</span></li>
              <li><span className="cursor-pointer hover:text-white transition-colors">Shipping & Returns</span></li>
              <li><span className="cursor-pointer hover:text-white transition-colors">support@avronce.com</span></li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div className="md:col-span-3 space-y-4">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-white">Join Avronce</h5>
            <p className="text-xs text-zinc-400">
              Subscribe to get 10% off your first order plus early access to new seasonal drops.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-900/60 p-3 rounded-sm">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Welcome to Avronce! Use code <strong>AVRONCE10</strong> at checkout.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative flex items-center">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-zinc-900 border border-zinc-800 text-xs text-white px-3 py-2.5 pr-10 focus:outline-none focus:border-zinc-400 rounded-sm placeholder:text-zinc-500"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 p-1.5 text-zinc-400 hover:text-white transition-colors"
                    aria-label="Subscribe"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-[10px] text-zinc-500 block">No spam. Only updates on new drops & exclusive sales.</span>
              </form>
            )}
          </div>

        </div>

        {/* 3. Bottom Sub-Footer with Razorpay & Security Badges */}
        <div className="mt-16 pt-8 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <div>
            © {new Date().getFullYear()} AVRONCE.COM • All Rights Reserved. Crafted in India.
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
            <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded font-mono text-[10px]">RAZORPAY</span>
            <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded font-mono text-[10px]">UPI</span>
            <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded font-mono text-[10px]">GOOGLE PAY</span>
            <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded font-mono text-[10px]">PHONEPE</span>
            <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded font-mono text-[10px]">RUPAY</span>
            <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded font-mono text-[10px]">VISA / MASTERCARD</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
