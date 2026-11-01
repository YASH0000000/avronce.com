import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { ArrowRight, CheckCircle, Shield, Award, Sparkles, Flame, Heart } from 'lucide-react';

export const metadata = {
  title: 'Our Story & Brand Vision | LITTLEBOX INDIA',
  description: 'Learn about Littlebox India: The fast-fashion & aesthetic lifestyle brand built for Gen Z trendsetters.',
};

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 space-y-16">
      
      {/* 1. Header & Brand Story */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-400 text-zinc-950 font-black text-xs uppercase tracking-widest rounded-full">
          <Sparkles className="w-3.5 h-3.5" />
          <span>ABOUT LITTLEBOX</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black uppercase text-zinc-950 dark:text-white tracking-tight leading-none">
          Fast Fashion for Trendsetters & Gen Z ✨
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
          <strong>LITTLEBOX</strong> (littleboxindia.com) was born out of a desire to bring Pinterest and Instagram-trending fashion to India at pocket-friendly prices. From statement chunky boots and Mary Janes to romantic backless dresses, aesthetic corset tops, and relaxed coords — we drop the freshest styles weekly.
        </p>
      </div>

      {/* 2. Visual Split Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 relative aspect-[16/10] bg-zinc-950 rounded-sm overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800">
          <Image
            src="/images/collections/cat_boots.webp"
            alt="Littlebox Boots and Aesthetic Drops"
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover"
          />
        </div>

        <div className="lg:col-span-5 space-y-5">
          <span className="text-xs font-bold uppercase tracking-widest text-red-500 font-mono">
            WHY WE STARTED
          </span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase text-zinc-950 dark:text-white">
            Trends Move Fast. We Move Faster.
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Why wait months for international brands to launch what&apos;s already trending on your TikTok and Instagram feed? At Littlebox, we design, manufacture, and ship viral fits directly to your doorstep in days.
          </p>
          <div className="space-y-2.5 pt-2 text-xs text-zinc-800 dark:text-zinc-200 font-semibold">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Chunky soles & footwear engineered for all-day comfort</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Inclusive sizing ranging from XS to Curve / Plus</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Loved by over 250,000+ creators and fashion lovers in India</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. The Three Principles */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 pt-12">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span className="text-xs uppercase tracking-widest text-zinc-500 font-mono font-bold">LITTLEBOX PILLARS</span>
          <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-zinc-950 dark:text-white">
            What We Stand For 🖤
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-sm space-y-3">
            <div className="w-10 h-10 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center font-bold">
              01
            </div>
            <h4 className="text-base font-black uppercase text-zinc-950 dark:text-white">Trend-First Curation</h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Every drop is inspired by street culture, Y2K aesthetics, K-pop trends, and viral Pinterest fits.
            </p>
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-sm space-y-3">
            <div className="w-10 h-10 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center font-bold">
              02
            </div>
            <h4 className="text-base font-black uppercase text-zinc-950 dark:text-white">Pocket-Friendly Pricing</h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Fast fashion should be accessible. We offer frequent BOGO promotions, drops under ₹999, and flat discounts.
            </p>
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-sm space-y-3">
            <div className="w-10 h-10 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center font-bold">
              03
            </div>
            <h4 className="text-base font-black uppercase text-zinc-950 dark:text-white">Hassle-Free India Delivery</h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Doorstep Cash on Delivery (COD), instant UPI refunds, and 7-day easy size exchange.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Action Banner */}
      <div className="bg-zinc-950 text-white p-8 sm:p-14 rounded-sm text-center space-y-5 shadow-2xl">
        <Logo variant="combined" size="lg" inverted className="mx-auto" />
        <h3 className="text-2xl sm:text-3xl font-black uppercase text-white">
          Ready to Elevate Your Everyday Vibe?
        </h3>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
          Shop trending chunky boots, dresses, and Y2K statement pieces with free shipping above ₹999.
        </p>
        <div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-zinc-950 font-black text-xs uppercase tracking-[0.2em] hover:bg-zinc-200 transition-colors shadow-lg rounded-xs"
          >
            <span>Explore All Drops</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

    </div>
  );
}
