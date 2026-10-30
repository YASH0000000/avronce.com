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
      
      {/* Editorial Header */}
      <div className="space-y-3 max-w-2xl border-b border-zinc-800 pb-8">
        <span className="text-xs uppercase tracking-[0.3em] text-zinc-400 font-mono">
          Atelier Roster
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-light text-white tracking-tight">
          Ready-to-Wear Catalog
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-light">
          An ongoing curation of architectural outerwear, heavyweight cotton staples, and relaxed Italian wool tailoring designed for permanent rotation.
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
