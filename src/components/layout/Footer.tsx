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
              <h4 className="text-xs uppercase tracking-[0.2em] font-medium text-white">Complimentary Delivery</h4>
              <p className="text-xs text-zinc-400 mt-0.5">Free express shipping on all domestic orders over ₹2,999</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4 p-4 rounded-sm bg-zinc-900/40 border border-zinc-800/40">
            <RefreshCw className="w-6 h-6 text-zinc-300 shrink-0" />
            <div>
              <h4 className="text-xs uppercase tracking-[0.2em] font-medium text-white">7-Day Atelier Exchange</h4>
              <p className="text-xs text-zinc-400 mt-0.5">Hassle-free size and silhouette exchanges</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4 p-4 rounded-sm bg-zinc-900/40 border border-zinc-800/40">
            <ShieldCheck className="w-6 h-6 text-zinc-300 shrink-0" />
            <div>
              <h4 className="text-xs uppercase tracking-[0.2em] font-medium text-white">Razorpay Secure Checkout</h4>
              <p className="text-xs text-zinc-400 mt-0.5">256-bit encryption for UPI, Cards & NetBanking</p>
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
              AVRONCE was founded on the rejection of seasonal obsolescence. We construct permanent garments that age gracefully through wear, pairing Japanese selvedge denim, Italian virgin wool, and 480 GSM combed cotton.
            </p>
            <div className="text-[11px] text-zinc-500 uppercase tracking-widest">
              <span>avronce.com</span> • <span>Bespoke Ready-to-Wear</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-2 space-y-4">
            <h5 className="text-xs font-semibold uppercase tracking-[0.2em] text-white">Collections</h5>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li><Link href="/shop" className="hover:text-white transition-colors">Full Catalog</Link></li>
              <li><Link href="/category/outerwear" className="hover:text-white transition-colors">Outerwear & Coats</Link></li>
              <li><Link href="/category/essentials" className="hover:text-white transition-colors">Everyday Essentials</Link></li>
              <li><Link href="/category/tailoring" className="hover:text-white transition-colors">Modern Tailoring</Link></li>
              <li><Link href="/category/knitwear" className="hover:text-white transition-colors">Merino Knitwear</Link></li>
              <li><Link href="/category/shirts" className="hover:text-white transition-colors">Resort & Overshirts</Link></li>
            </ul>
          </div>

          {/* Client Care Links */}
          <div className="md:col-span-2 space-y-4">
            <h5 className="text-xs font-semibold uppercase tracking-[0.2em] text-white">Client Concierge</h5>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li><Link href="/track" className="hover:text-white transition-colors">Track Order</Link></li>
              <li><Link href="/lookbook" className="hover:text-white transition-colors">Editorial Lookbook</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">Atelier Manifesto</Link></li>
              <li><span className="cursor-pointer hover:text-white transition-colors">Fabric & Care Guide</span></li>
              <li><span className="cursor-pointer hover:text-white transition-colors">Shipping & Returns</span></li>
              <li><span className="cursor-pointer hover:text-white transition-colors">concierge@avronce.com</span></li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div className="md:col-span-3 space-y-4">
            <h5 className="text-xs font-semibold uppercase tracking-[0.2em] text-white">Private Roster</h5>
            <p className="text-xs text-zinc-400">
              Receive private invitations to seasonal drops and receive 10% off your initial acquisition.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-900/60 p-3 rounded-sm">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Welcome to the Avronce Roster. Code <strong>AVRONCE10</strong> is active.</span>
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
                    className="w-full bg-zinc-900 border border-zinc-800 text-xs text-white px-3 py-2.5 pr-10 focus:outline-none focus:border-zinc-400 rounded-none placeholder:text-zinc-500"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 p-1.5 text-zinc-400 hover:text-white transition-colors"
                    aria-label="Subscribe"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-[10px] text-zinc-500 block">No spam. Only curated seasonal announcements.</span>
              </form>
            )}
          </div>

        </div>

        {/* 3. Bottom Sub-Footer with Razorpay & Security Badges */}
        <div className="mt-16 pt-8 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <div>
            © {new Date().getFullYear()} AVRONCE.COM • All Rights Reserved.
          </div>

          <div className="flex items-center gap-4 text-xs text-zinc-400">
            <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded font-mono text-[10px]">RAZORPAY</span>
            <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded font-mono text-[10px]">UPI</span>
            <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded font-mono text-[10px]">VISA</span>
            <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded font-mono text-[10px]">MASTERCARD</span>
            <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded font-mono text-[10px]">RUPAY</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
