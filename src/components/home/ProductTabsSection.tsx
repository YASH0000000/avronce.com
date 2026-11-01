'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Flame } from 'lucide-react';
import { LittleboxProduct } from '@/lib/store';
import { ProductCard } from '@/components/product/ProductCard';

interface ProductTabsSectionProps {
  products: LittleboxProduct[];
}

export function ProductTabsSection({ products }: ProductTabsSectionProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'boots' | 'dresses' | 'clothing' | 'sale'>('all');

  const filteredProducts = products.filter((p) => {
    if (activeTab === 'boots') {
      return p.type === 'Footwear';
    } else if (activeTab === 'dresses') {
      return p.category === 'Dresses';
    } else if (activeTab === 'clothing') {
      return p.type === 'Clothing' && p.category !== 'Dresses';
    } else if (activeTab === 'sale') {
      return p.price <= 999 || p.discountPercent >= 30;
    }
    return true;
  }).slice(0, 8);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header and Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs uppercase font-mono font-bold tracking-widest text-red-500 mb-1">
            <Flame className="w-4 h-4 fill-red-500 text-red-500" />
            <span>COMMUNITY FAVORITES</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-zinc-950 dark:text-white">
            Best Sellers & New Drops 🔥
          </h2>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'boots', label: 'Boots & Heels 👢' },
            { id: 'dresses', label: 'Party Dresses 👗' },
            { id: 'clothing', label: 'Tops & Coords ✨' },
            { id: 'sale', label: 'Under ₹999 🏷️' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-sm'
                  : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {filteredProducts.map((p, idx) => (
          <ProductCard key={p.id} product={p} priority={idx < 4} />
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-12 text-center">
        <Link
          href="/shop"
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs uppercase font-black tracking-[0.2em] rounded-xs hover:opacity-90 transition-opacity shadow-lg"
        >
          <span>Explore All 10,000+ Styles</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
