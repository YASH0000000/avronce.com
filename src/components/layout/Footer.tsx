'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { Mail, Phone, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';

function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-zinc-950 text-white border-t border-zinc-800">
      {/* 1. Newsletter Box */}
      <div className="border-b border-zinc-800 bg-zinc-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-2">
              <span className="text-yellow-400 font-mono text-xs font-bold uppercase tracking-widest">
                EXCLUSIVE OFFER
              </span>
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                Get Flat ₹200 Off On Your First Drop ✨
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400">
                Join 250,000+ members of the #LittleboxFam for early access to flash sales & secret coupon drops.
              </p>
            </div>

            <div className="lg:col-span-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('Thank you for subscribing! Use code WELCOME200 at checkout.');
                }}
                className="flex flex-col sm:flex-row gap-2 max-w-md lg:ml-auto"
              >
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  className="flex-1 bg-zinc-950 border border-zinc-700 text-sm text-white px-4 py-3 placeholder:text-zinc-500 focus:outline-none focus:border-white rounded-xs"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-white text-zinc-950 font-black text-xs uppercase tracking-wider hover:bg-zinc-200 transition-colors rounded-xs shrink-0 flex items-center justify-center gap-2"
                >
                  <span>Claim ₹200</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="combined" size="lg" inverted />
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              LITTLEBOX is India&apos;s leading fast-fashion & aesthetic lifestyle destination for Gen Z and trendsetters. Edgy boots, trendy partywear, and viral aesthetic collections delivered straight to your door.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com/littleboxindia"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-300 hover:text-white hover:border-white transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com/littleboxindia"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-300 hover:text-white hover:border-white transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href="mailto:support@littleboxindia.com"
                className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-300 hover:text-white hover:border-white transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              Trending Categories
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <Link href="/category/boots" className="hover:text-white transition-colors">
                  Chunky Boots & Oxfords
                </Link>
              </li>
              <li>
                <Link href="/category/flats" className="hover:text-white transition-colors">
                  Mary Jane Flats & Flatforms
                </Link>
              </li>
              <li>
                <Link href="/category/heels" className="hover:text-white transition-colors">
                  Heels & Platforms
                </Link>
              </li>
              <li>
                <Link href="/category/dressup15" className="hover:text-white transition-colors">
                  Party & Bodycon Dresses
                </Link>
              </li>
              <li>
                <Link href="/category/tops15" className="hover:text-white transition-colors">
                  Corset Tops & Y2K Fits
                </Link>
              </li>
              <li>
                <Link href="/category/matching-sets" className="hover:text-white transition-colors">
                  Matching Coords & Sets
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              Customer Support
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <Link href="/track" className="hover:text-white transition-colors font-semibold text-yellow-400">
                  Track Your Order 🚚
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Size & Fitting Guide
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  7-Day Return & Exchange
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Shipping & Delivery Info
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Contact Us / WhatsApp Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Payments */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              Secure Checkout
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              100% encrypted and safe checkout. We accept Google Pay, PhonePe, Paytm, Cards, NetBanking, and Cash on Delivery.
            </p>
            <div className="pt-2 flex flex-wrap gap-1.5 text-[10px] font-mono text-zinc-300">
              <span className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded-xs">UPI</span>
              <span className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded-xs">GPay</span>
              <span className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded-xs">PhonePe</span>
              <span className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded-xs">Visa</span>
              <span className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded-xs">Mastercard</span>
              <span className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded-xs">COD</span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Bottom Bar */}
      <div className="border-t border-zinc-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <p>© {new Date().getFullYear()} LITTLEBOX INDIA. All Rights Reserved. Crafted for Gen Z & Trendsetters.</p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-white">Privacy Policy</Link>
            <Link href="/about" className="hover:text-white">Terms of Service</Link>
            <Link href="/track" className="hover:text-white">Shipping Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
