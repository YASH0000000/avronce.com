import React from 'react';
import { getProducts, getCategories } from '@/lib/supabase/server';
import { ProductList } from '@/components/product/ProductList';

export const revalidate = 60;

interface ShopPageProps {
  searchParams: Promise<{ q?: string; category?: string }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { q = '', category = 'all' } = await searchParams;

  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-10">
      
      {/* Header */}
      <div className="space-y-3 max-w-2xl border-b border-zinc-800 pb-8">
        <span className="text-xs uppercase tracking-[0.25em] text-zinc-400 font-mono">
          Our Collection
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-light text-white tracking-tight">
          Shop All Clothing
        </h1>
        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
          Explore our complete collection of selvedge denim jackets, 100% combed cotton t-shirts, hoodies, resort shirts, and tailored trousers.
        </p>
      </div>

      {/* Interactive Filterable Catalog */}
      <ProductList
        initialProducts={products}
        categories={categories}
        selectedCategorySlug={category}
        initialSearch={q}
      />

    </div>
  );
}
