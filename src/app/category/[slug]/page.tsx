import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getProducts, getCategories } from '@/lib/supabase/server';
import { ProductList } from '@/components/product/ProductList';

export const revalidate = 60;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  const [categories, allProducts] = await Promise.all([
    getCategories(),
    getProducts({ categorySlug: slug }),
  ]);

  const currentCategory = categories.find((c) => c.slug === slug);

  if (!currentCategory) {
    notFound();
  }

  return (
    <div className="space-y-12 pb-24">
      
      {/* Category Banner */}
      <div className="relative min-h-[40vh] sm:min-h-[45vh] flex items-end bg-zinc-950 overflow-hidden border-b border-zinc-800">
        {currentCategory.image_url && (
          <Image
            src={currentCategory.image_url}
            alt={currentCategory.name}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-40"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 w-full">
          <span className="text-xs uppercase tracking-[0.3em] text-zinc-400 font-mono">
            Category Focus
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl uppercase tracking-wider text-white mt-1">
            {currentCategory.name}
          </h1>
          {currentCategory.description && (
            <p className="text-xs sm:text-sm text-zinc-300 max-w-xl mt-3 leading-relaxed font-light">
              {currentCategory.description}
            </p>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProductList
          initialProducts={allProducts}
          categories={categories}
          selectedCategorySlug={slug}
        />
      </div>

    </div>
  );
}
