import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Flame, Sparkles, Tag, ShieldCheck } from 'lucide-react';
import { getAllProducts, getCollections, getMoods, getBrand } from '@/lib/store';
import { HeroBanner } from '@/components/home/HeroBanner';
import { PerksStrip } from '@/components/home/PerksStrip';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { MoodSection } from '@/components/home/MoodSection';
import { ProductTabsSection } from '@/components/home/ProductTabsSection';
import { InstaFeed } from '@/components/home/InstaFeed';

export const metadata = {
  title: 'LITTLEBOX INDIA | Fast Fashion, Chunky Boots, Y2K Apparel & Party Dresses',
  description: 'Shop viral chunky boots, romantic party dresses, Mary Janes, corset tops and aesthetic street fashion made for Gen Z. Free shipping & COD available.',
};

export default function HomePage() {
  const brand = getBrand();
  const collections = getCollections();
  const moods = getMoods();
  const allProducts = getAllProducts();

  return (
    <div className="space-y-6 sm:space-y-12 pb-16">
      
      {/* 1. HERO BANNER CAROUSEL */}
      <HeroBanner />

      {/* 2. PERKS & REASSURANCES STRIP */}
      <PerksStrip />

      {/* 3. TRENDING CATEGORIES */}
      <CategoryGrid collections={collections} />

      {/* 4. SIGNATURE LITTLEBOX 'SHOP BY MOOD' */}
      <MoodSection moods={moods} allProducts={allProducts} />

      {/* 5. FLASH PROMO STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-sm bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 text-white p-6 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="inline-block px-3 py-1 bg-yellow-400 text-zinc-950 font-black text-xs uppercase tracking-widest rounded-full">
              LIMITED TIME DROP
            </span>
            <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tight">
              BUY 2 GET 1 FREE SITEWIDE 🔥
            </h3>
            <p className="text-xs sm:text-sm text-pink-100 max-w-lg">
              Mix and match boots, dresses, tops, and coords. Add 3 items to your bag and use coupon <strong className="text-yellow-300 font-mono">B2G1</strong>.
            </p>
          </div>

          <Link
            href="/shop?filter=sale"
            className="px-8 py-3.5 bg-zinc-950 text-white hover:bg-white hover:text-zinc-950 text-xs uppercase font-black tracking-[0.2em] rounded-xs transition-colors shrink-0 shadow-lg"
          >
            Claim Offer Now →
          </Link>
        </div>
      </section>

      {/* 6. BEST SELLERS & NEW DROPS WITH TABS */}
      <ProductTabsSection products={allProducts} />

      {/* 7. DUAL SHOWCASE EDITORIAL CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: Footwear Edit */}
          <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-sm overflow-hidden bg-zinc-950 text-white p-8 sm:p-10 flex flex-col justify-end border border-zinc-800 shadow-xl group">
            <Image
              src="/images/collections/cat_boots.webp"
              alt="Chunky Footwear Edit"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
            <div className="relative z-10 space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-yellow-400 font-bold">
                CULT CLASSICS
              </span>
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                Chunky Boots & Platforms
              </h3>
              <p className="text-xs text-zinc-300 max-w-md">
                Heavy-duty lug soles, knee-high motorcycle boots, and platform loafers made for everyday attitude.
              </p>
              <div className="pt-2">
                <Link
                  href="/category/boots"
                  className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-white hover:underline underline-offset-4"
                >
                  <span>Shop Footwear</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Card 2: Dresses & Y2K Edit */}
          <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-sm overflow-hidden bg-zinc-950 text-white p-8 sm:p-10 flex flex-col justify-end border border-zinc-800 shadow-xl group">
            <Image
              src="/images/collections/cat_dressup15.webp"
              alt="Party Dresses Edit"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
            <div className="relative z-10 space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-yellow-400 font-bold">
                TREND ALERT
              </span>
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                Romantic Dresses & Tops
              </h3>
              <p className="text-xs text-zinc-300 max-w-md">
                Lace trims, bodycons, ruched silhouettes, and effortless matching sets for every special occasion.
              </p>
              <div className="pt-2">
                <Link
                  href="/category/dressup15"
                  className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-white hover:underline underline-offset-4"
                >
                  <span>Shop Dresses</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 8. INSTAGRAM COMMUNITY FEED */}
      <InstaFeed />

    </div>
  );
}
