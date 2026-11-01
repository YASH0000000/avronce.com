import React from 'react';
import { getAllProducts, getCollections } from '@/lib/store';
import { ProductList } from '@/components/product/ProductList';

export const metadata = {
  title: 'Shop All Clothing & Footwear | LITTLEBOX INDIA',
  description: 'Explore viral chunky boots, platforms, party dresses, Y2K tops, and coords. Free shipping above ₹999 & COD available.',
};

interface ShopPageProps {
  searchParams: Promise<{ q?: string; category?: string; filter?: string; mood?: string }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { q = '', category = 'all', filter = 'all', mood = '' } = await searchParams;

  const products = getAllProducts();
  const collections = getCollections();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="space-y-2 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <span className="text-xs uppercase font-mono font-bold tracking-widest text-zinc-500">
          ALL CATALOG • 2026 DROPS
        </span>
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-zinc-950 dark:text-white">
          Explore Littlebox Styles
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-xl">
          Chunky lug-sole boots, statement platform heels, ballet flats, backless party dresses, corset tops, and relaxed coords.
        </p>
      </div>

      {/* Interactive Filterable Catalog */}
      <ProductList
        initialProducts={products}
        categories={collections}
        selectedCategorySlug={category}
        initialSearch={q}
        initialFilter={filter}
        initialMood={mood}
      />
    </div>
  );
}
